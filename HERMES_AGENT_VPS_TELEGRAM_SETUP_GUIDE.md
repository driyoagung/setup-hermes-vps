# Panduan Lengkap Setup Hermes Agent di VPS Ubuntu + Telegram Bot

> **Tujuan utama:** menjalankan Hermes Agent sebagai asisten AI pribadi di VPS yang selalu aktif, menerima pesan melalui Telegram, dan membalas menggunakan model Gemini. Integrasi MCP (Todoist, GitHub, dan layanan lain) **opsional**.
>
> **Sasaran pembaca:** pemula yang sudah memiliki VPS dan dapat SSH. Panduan ini berdasarkan setup yang berhasil diuji pada November 2026, dengan catatan bahwa perintah dan wizard Hermes dapat berubah mengikuti versi.

## Daftar isi

1. [Gambaran hasil akhir](#1-gambaran-hasil-akhir)
2. [Spesifikasi dan persiapan](#2-spesifikasi-dan-persiapan)
3. [Persiapan VPS Ubuntu](#3-persiapan-vps-ubuntu)
4. [Instalasi Hermes Agent](#4-instalasi-hermes-agent)
5. [Konfigurasi Gemini API](#5-konfigurasi-gemini-api)
6. [Membuat Telegram Bot](#6-membuat-telegram-bot)
7. [Menghubungkan Telegram ke Hermes](#7-menghubungkan-telegram-ke-hermes)
8. [Menjalankan Hermes 24/7 dengan systemd](#8-menjalankan-hermes-247-dengan-systemd)
9. [Pengujian end-to-end](#9-pengujian-end-to-end)
10. [Pengoperasian dan pemeliharaan](#10-pengoperasian-dan-pemeliharaan)
11. [Integrasi MCP opsional](#11-integrasi-mcp-opsional)
12. [Troubleshooting](#12-troubleshooting)
13. [Keamanan dan praktik produksi](#13-keamanan-dan-praktik-produksi)
14. [Checklist dan FAQ](#14-checklist-dan-faq)
15. [Referensi](#15-referensi)

---

## 1. Gambaran hasil akhir

Setelah panduan selesai, alurnya seperti ini:

```text
  Kamu (Telegram di HP / Desktop)
                |
                | mengirim pesan
                v
         Telegram Bot API
                |
                | long polling (outbound dari VPS)
                v
       Hermes Gateway di VPS
         (systemd user service)
                |
                v
          Hermes Agent
                |
                | request API
                v
          Google Gemini
                |
                v
     Balasan kembali ke Telegram

     [Opsional] Hermes Agent
                |
                +--> MCP server / tools lain
                     (mis. task, repo, dokumen)
```

**Yang wajib:** VPS, Hermes, Gemini API key, Telegram bot token, gateway aktif.

**Yang tidak wajib:** domain, Nginx, SSL publik, database, Docker, webhook, MCP, Todoist, atau aplikasi frontend.

Dalam setup acuan, Telegram menggunakan **polling mode**, sehingga tidak perlu membuka port HTTP/HTTPS untuk menerima webhook. VPS tetap memerlukan akses internet keluar ke layanan Telegram dan Gemini.

### Spesifikasi VPS acuan

| Komponen | Spesifikasi |
|---|---|
| OS | Ubuntu Server 24.04 LTS |
| CPU | 2 vCPU |
| RAM | 2 GB |
| Disk | 20 GB (sekitar 19 GB usable pada VM acuan) |
| Akses | SSH dengan user non-root yang memiliki `sudo` |
| Model | Gemini API; contoh pengujian `gemini-3.5-flash-lite` |
| Bot | Telegram, polling mode |
| Service | systemd user service `hermes-gateway.service` |

Spesifikasi ini **teruji untuk bot teks dan integrasi sederhana**, bukan jaminan untuk workload berat, model lokal, atau banyak pengguna bersamaan. Gemini diproses di API eksternal; VPS menjalankan agent/gateway, bukan inference model Gemini secara lokal.

### Biaya

- VPS dikenai biaya sesuai penyedia cloud.
- Gemini Free Tier dapat memiliki kuota, pembatasan, dan ketersediaan yang berubah.
- Telegram Bot API umumnya tidak memerlukan biaya untuk skenario dasar ini.
- MCP pihak ketiga dapat memerlukan akun atau langganan tersendiri.

---

## 2. Spesifikasi dan persiapan

Siapkan sebelum mulai:

- IP publik VPS dan kredensial SSH.
- User Linux non-root dengan akses `sudo`.
- Akun Telegram untuk berkomunikasi dengan bot.
- Akses ke [@BotFather](https://t.me/BotFather).
- Akun Google dan API key dari [Google AI Studio](https://aistudio.google.com/apikey).
- Terminal SSH (PowerShell/Windows Terminal, macOS Terminal, atau Linux terminal).

**Konvensi placeholder:** setiap `USER`, `IP_VPS`, `BOT_TOKEN`, atau `API_KEY` adalah contoh. Ganti hanya pada tempat yang memang meminta nilai tersebut. Jangan menempelkan token ke chat publik, screenshot, GitHub, atau issue tracker.

### Prinsip keamanan

1. Jangan menjalankan Hermes sebagai root untuk pemakaian normal.
2. Gunakan bot Telegram pribadi dengan pembatasan user/chat yang diizinkan.
3. Hindari membuka akses terminal berisiko kepada pengguna bot lain.
4. Jangan mengunggah `~/.hermes/auth.json`, `.env`, atau token MCP.
5. Jika token bocor, **rotasi/revoke** di penyedia terkait, bukan sekadar menghapus pesan.

---

## 3. Persiapan VPS Ubuntu

### 3.1 Login SSH

Di komputer lokal:

```bash
ssh USER@IP_VPS
```

Contoh bentuk perintah (bukan IP nyata):

```bash
ssh ubuntu@203.0.113.10
```

Jika menggunakan SSH key khusus:

```bash
ssh -i /path/to/private_key USER@IP_VPS
```

> Pada Windows, `ssh` dapat dijalankan dari PowerShell atau Windows Terminal. Jangan pernah membagikan file private key.

### 3.2 Verifikasi OS, user, resource

```bash
cat /etc/os-release
whoami
id
free -h
df -h /
```

Pastikan OS Ubuntu, RAM sekitar 2 GB, dan disk masih memiliki ruang kosong yang cukup. `whoami` seharusnya menampilkan user biasa, bukan `root`.

### 3.3 Update dan instal utilitas dasar

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git ca-certificates unzip
```

Jika update kernel meminta reboot, lakukan setelah memastikan kamu dapat login SSH kembali:

```bash
sudo reboot
```

Tunggu VPS hidup, lalu SSH kembali. Reboot tidak selalu diperlukan.

### 3.4 Cek konektivitas internet

```bash
curl -I https://www.google.com
```

Respons HTTP (termasuk redirect) menunjukkan DNS/TLS/koneksi keluar berfungsi. Jika gagal, periksa DNS, firewall outbound, dan jaringan VPS sebelum lanjut.

### 3.5 Firewall (opsional, hati-hati)

Untuk bot berbasis polling, **tidak perlu membuka port 80/443 inbound**. Jika ingin memakai UFW, pastikan SSH diizinkan **sebelum** mengaktifkannya:

```bash
sudo ufw allow OpenSSH
sudo ufw status
```

Jangan menjalankan `sudo ufw enable` sampai kamu yakin aturan SSH dan kebijakan firewall provider sudah benar; salah konfigurasi dapat mengunci akses ke VPS.

---

## 4. Instalasi Hermes Agent

### 4.1 Jalankan installer resmi

Sumber instalasi resmi:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Catatan keamanan:** perintah ini menjalankan skrip dari internet. Jika ingin mengaudit terlebih dahulu:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o hermes-install.sh
less hermes-install.sh
bash hermes-install.sh
```

Gunakan salah satu metode, tidak perlu keduanya. Pastikan URL resmi dan periksa perubahan instruksi di dokumentasi proyek jika installer berubah.

### 4.2 Refresh sesi shell

Setelah installer selesai, ikuti instruksi yang tampil. Jika PATH baru belum terbaca, keluar lalu SSH kembali:

```bash
exit
```

Kemudian login SSH lagi dan verifikasi:

```bash
hermes --help
```

Jika help muncul, CLI Hermes dapat dijalankan.

### 4.3 Verifikasi subcommand

```bash
hermes gateway --help
hermes mcp --help
```

Perintah `gateway` digunakan untuk koneksi Telegram, sedangkan `mcp` untuk integrasi opsional. **Utamakan output `--help` versi terpasang**, karena nama opsi dan wizard bisa berubah.

### 4.4 Jika `hermes: command not found`

Cek lokasi CLI dan PATH:

```bash
command -v hermes
printf '%s\n' "$PATH"
ls -lah ~/.local/bin 2>/dev/null
```

Jika installer memberi instruksi untuk menambah PATH, ikuti instruksi tersebut lalu buka shell baru. Jangan asal membuat symlink ke path yang belum diverifikasi. Pada salah satu setup, symlink executable memang perlu diperbaiki, tetapi lokasi instalasi dapat berbeda antarversi.

---

## 5. Konfigurasi Gemini API

### 5.1 Buat API key

1. Buka <https://aistudio.google.com/apikey>.
2. Login dengan akun Google.
3. Buat atau pilih API key sesuai alur Google AI Studio.
4. Simpan key secara privat.
5. Perhatikan ketentuan Free Tier, kuota, region, dan model yang tersedia.

Jangan menulis key ke file README atau menyertakannya dalam screenshot terminal.

### 5.2 Jalankan setup Hermes

```bash
hermes setup
```

Pada wizard, pilih provider **Gemini / Google Gemini API** jika tersedia. Masukkan API key ketika diminta. Gunakan model yang tersedia pada akun dan mendukung **tool/function calling**, terutama jika nantinya ingin memakai MCP.

Model yang dipakai dalam pengujian acuan:

```text
gemini-3.5-flash-lite
```

> Nama model ini adalah **contoh dari pengujian**, bukan jaminan bahwa model selalu tersedia atau menjadi pilihan terbaik. Ikuti daftar model aktual yang disediakan provider dan Hermes.

### 5.3 Uji model melalui CLI

```bash
hermes chat
```

Kirim pesan sederhana:

```text
Halo, balas satu kalimat dalam Bahasa Indonesia.
```

**Berhasil:** agent membalas dengan jawaban dari model. **Belum berhasil:** muncul error autentikasi, nama model tidak ditemukan, kuota habis, atau gangguan provider.

Keluar dari mode chat sesuai petunjuk antarmuka Hermes. Jangan lanjut ke Telegram sebelum tes CLI ini berhasil.

### 5.4 Jika API gagal

| Gejala | Kemungkinan | Tindakan |
|---|---|---|
| `401` / `403` | API key, izin, atau akses model | Periksa key dan akses provider |
| Model tidak ditemukan | Nama model/versi tidak cocok | Pilih model yang benar-benar tersedia |
| `429` | Rate limit atau kuota | Tunggu/reset kuota, periksa dashboard provider |
| `503 service_unavailable` | Layanan model sedang sibuk | Coba kembali kemudian atau pilih model lain |
| Respons lambat | Latensi model, antrean, atau banyak tool call | Ukur waktu dan periksa log sebelum menyimpulkan |

Jangan otomatis menyalahkan VPS untuk setiap error API: inference Gemini dilakukan di sisi provider.

---

## 6. Membuat Telegram Bot

### 6.1 Buat bot lewat BotFather

1. Buka Telegram dan cari **@BotFather** (akun resmi Telegram).
2. Kirim `/newbot`.
3. Masukkan nama tampilan, misalnya `Hermes Personal Assistant`.
4. Masukkan username unik berakhiran `bot`, misalnya `my_private_hermes_bot` jika tersedia.
5. BotFather akan mengirim **HTTP API bot token**.
6. Simpan token secara privat. Jangan screenshot atau bagikan token.

Token Telegram memberikan kendali atas bot. Jika bocor, lakukan revoke/generate ulang melalui BotFather.

### 6.2 Mulai chat dengan bot

Buka link bot yang diberikan BotFather, kemudian tekan **Start** atau kirim `/start`. Ini membuka percakapan Telegram, tetapi bot **belum** otomatis menjawab sebelum Hermes Gateway aktif.

### 6.3 Batasi akses bot

Konfigurasikan allowlist/otorisasi Telegram melalui wizard Hermes bila tersedia. Pastikan hanya user/chat yang dipercaya dapat memerintah agent. Jika bot masuk grup, pahami izin, privasi grup, dan risiko perintah dari anggota lain. Untuk pemakaian pribadi, **mulai dari private chat**.

---

## 7. Menghubungkan Telegram ke Hermes

### 7.1 Jalankan wizard gateway

Di VPS:

```bash
hermes gateway setup
```

Pilih platform **Telegram** dan masukkan bot token secara interaktif. Ikuti pengaturan akses/otorisasi yang disediakan versi Hermes yang terpasang.

> Hindari menempelkan bot token sebagai argumen CLI jika wizard sudah mendukung input aman; token di argumen dapat tercatat di history/proses.

### 7.2 Periksa perintah gateway

```bash
hermes gateway --help
```

Jika versi terpasang mendukung:

```bash
hermes gateway start
```

Beberapa versi mengelola gateway melalui service systemd; ikuti informasi yang diberikan CLI. Jangan menjalankan dua gateway sekaligus untuk bot yang sama.

### 7.3 Uji Telegram

Kirim ke bot:

```text
Halo Hermes, tolong balas "Telegram terhubung".
```

Tunggu respons. Pada setup acuan, gateway berhasil tersambung dengan log:

```text
[Telegram] Connected to Telegram (polling mode)
```

**Makna log:** gateway berhasil tersambung ke Telegram, tetapi keberhasilan menyelesaikan setiap request AI tetap bergantung pada provider model.

### 7.4 Kenapa tidak perlu domain atau webhook?

Polling membuat gateway meminta update ke Telegram dari VPS (koneksi keluar). Untuk skenario ini tidak diperlukan domain, reverse proxy, sertifikat HTTPS publik, atau membuka port 443 inbound. Jika suatu saat berpindah ke webhook, arsitektur dan konfigurasi jaringan akan berbeda.

---

## 8. Menjalankan Hermes 24/7 dengan systemd

Tujuannya agar bot tetap online saat terminal SSH ditutup, serta bisa dimulai ulang setelah reboot.

### 8.1 Cek apakah unit service tersedia

```bash
systemctl --user status hermes-gateway.service
```

Jika service belum ditemukan, lihat:

```bash
hermes gateway --help
```

Gunakan mekanisme instalasi service resmi yang disediakan versi Hermes. **Jangan membuat unit service manual kedua** jika installer/wizard sudah membuatnya.

### 8.2 Aktifkan service

Setelah unit terpasang:

```bash
systemctl --user enable --now hermes-gateway.service
```

Lalu aktifkan *linger* untuk user saat ini:

```bash
sudo loginctl enable-linger "$USER"
```

`linger` memungkinkan systemd user manager tetap hidup setelah user logout dan dapat aktif saat boot. Ini penting pada VPS yang menjalankan gateway di bawah user biasa.

### 8.3 Verifikasi status

```bash
systemctl --user status hermes-gateway.service
```

Cari status:

```text
Active: active (running)
```

Lihat log:

```bash
journalctl --user -u hermes-gateway -n 50 --no-pager
```

Cari indikasi Telegram tersambung. Log yang menunjukkan error lama tidak selalu berarti masalah masih berlangsung; cocokkan **timestamp** dan **PID proses**.

### 8.4 Tes setelah SSH ditutup

1. Pastikan bot membalas pesan Telegram.
2. Keluar dari SSH dengan `exit`.
3. Kirim pesan Telegram lagi.
4. Jika bot tetap membalas, gateway tidak bergantung pada terminal SSH.

### 8.5 Tes setelah reboot (opsional, disarankan)

Pastikan tidak ada pekerjaan penting yang sedang berjalan, lalu:

```bash
sudo reboot
```

Setelah VPS kembali hidup, login SSH dan cek:

```bash
systemctl --user status hermes-gateway.service
```

Tes Telegram lagi. Jangan lakukan reboot jika kamu belum memiliki akses pemulihan VPS dari panel cloud.

---

## 9. Pengujian end-to-end

Lakukan tes bertahap, jangan langsung menggabungkan semua komponen.

| Urutan | Pengujian | Tanda berhasil |
|---|---|---|
| 1 | `hermes --help` | CLI terpasang |
| 2 | `hermes chat` | Gemini menjawab |
| 3 | `hermes gateway setup` | Telegram dikonfigurasi |
| 4 | Pesan Telegram | Bot membalas |
| 5 | `systemctl --user status ...` | `active (running)` |
| 6 | Tutup SSH lalu chat | Bot tetap aktif |
| 7 | Reboot VPS (opsional) | Bot kembali aktif |
| 8 | MCP (opsional) | Tools dapat dipanggil melalui agent |

### Contoh prompt pengujian

**Tes dasar:**

```text
Halo Hermes. Jawab dengan satu kalimat pendek.
```

**Tes konteks:**

```text
Jelaskan perbedaan HTTP dan HTTPS dalam 3 poin.
```

**Tes setelah logout:**

```text
Apakah kamu masih aktif setelah sesi SSH saya ditutup?
```

Jangan menggunakan prompt yang meminta agent menghapus file, menjalankan perintah shell berbahaya, atau mengubah data eksternal sebagai tes awal.

---

## 10. Pengoperasian dan pemeliharaan

### 10.1 Cheat sheet perintah

```bash
# Cek CLI
hermes --help

# Cek bantuan gateway
hermes gateway --help

# Status service
systemctl --user status hermes-gateway.service

# Restart service
systemctl --user restart hermes-gateway.service

# Hentikan sementara
systemctl --user stop hermes-gateway.service

# Mulai kembali
systemctl --user start hermes-gateway.service

# Log 50 baris terakhir
journalctl --user -u hermes-gateway -n 50 --no-pager

# Ikuti log live (Ctrl+C untuk keluar)
journalctl --user -u hermes-gateway -f

# Penggunaan RAM dan disk
free -h
df -h /

# Proses Hermes yang berjalan
pgrep -af 'hermes.*gateway'
```

### 10.2 Saat mengubah konfigurasi

Setelah mengubah konfigurasi model, Telegram, atau MCP, ikuti instruksi Hermes. Jika perubahan tidak termuat, restart gateway **sekali**:

```bash
systemctl --user restart hermes-gateway.service
```

Lalu verifikasi status dan kirim pesan tes. Jangan restart berkali-kali tanpa membaca log.

### 10.3 Memeriksa waktu dan log

```bash
# Log terbaru
journalctl --user -u hermes-gateway --since "15 minutes ago" --no-pager

# Log boot saat ini
journalctl --user -u hermes-gateway -b --no-pager
```

Timestamp log dapat memakai timezone VPS (sering UTC), berbeda dari jam lokal di Telegram. Cocokkan zona waktu ketika menginvestigasi insiden.

### 10.4 Update

Sebelum update Hermes:

1. Baca release notes/dokumentasi versi terbaru.
2. Catat versi dan konfigurasi yang sedang berfungsi.
3. Backup konfigurasi secara aman (jangan upload credential ke repo).
4. Jalankan prosedur update resmi sesuai versi terpasang.
5. Restart gateway jika diminta, kemudian ulangi pengujian end-to-end.

Panduan ini tidak mengunci perintah update tertentu karena mekanisme instalasi/upgrade dapat berubah.

---

## 11. Integrasi MCP opsional

**MCP (Model Context Protocol)** memungkinkan agent memakai tools atau mengakses layanan lain. Ini bukan syarat agar Hermes dan Telegram bekerja.

Contoh kebutuhan: mengelola task, membaca repository, mengakses dokumentasi, atau integrasi aplikasi lain. Ketersediaan server dan kemampuan setiap tool tergantung katalog/konfigurasi yang terpasang.

### 11.1 Lihat katalog

```bash
hermes mcp catalog
```

Lihat opsi perintah:

```bash
hermes mcp --help
```

**Jangan menganggap semua layanan yang disebut dalam artikel internet otomatis tersedia di katalog.** Periksa nama server dan instruksi otentikasinya pada versi Hermes yang dipakai.

### 11.2 Instal server dari katalog

Pola umum (gunakan `NAMA_SERVER` yang benar-benar muncul di katalog):

```bash
hermes mcp install NAMA_SERVER
hermes mcp list
```

Status `enabled` menunjukkan server diaktifkan pada konfigurasi, tetapi **belum membuktikan token valid atau semua tool berhasil dipanggil**.

### 11.3 Autentikasi (jika diperlukan)

Untuk MCP yang menggunakan OAuth dan didukung oleh CLI:

```bash
hermes mcp login NAMA_SERVER
```

Ikuti petunjuk interaktif. Pada VPS headless, browser login biasanya dilakukan di komputer lokal. Jika callback menggunakan `localhost`, ingat bahwa `localhost` pada browser lokal **bukan** VPS; ikuti mekanisme callback atau SSH forwarding yang dijelaskan CLI. Jangan mengirim URL callback dengan `code`/`state` ke chat publik.

Sebagian MCP mungkin memakai API key atau metode lain. Gunakan instruksi spesifik dari server tersebut.

### 11.4 Uji lewat CLI sebelum Telegram

```bash
hermes chat
```

Contoh prompt aman:

```text
Gunakan MCP NAMA_SERVER yang sudah dikonfigurasi. Lakukan operasi baca saja untuk memastikan koneksi berfungsi. Jangan membuat, mengubah, atau menghapus data.
```

Setelah berhasil di CLI, restart gateway jika perlu, lalu tes melalui Telegram. Untuk sesi Telegram yang masih mengingat kegagalan lama, perintah `/new` **pernah membantu** pada setup acuan; perilakunya dapat berbeda menurut versi.

### 11.5 Contoh: Todoist (opsional, bukan bagian utama)

Pada setup acuan, Todoist dipakai hanya sebagai contoh MCP yang berhasil membaca dan membuat task:

```bash
hermes mcp install todoist
hermes mcp login todoist
hermes mcp list
```

Server contoh: `https://ai.todoist.net/mcp`. Nama tool dan jumlah tool bisa berubah. Jika agent menawarkan **hosted connector** yang berbeda dari server MCP yang sudah dikonfigurasi, pastikan ia menggunakan integrasi yang benar. Dalam satu kasus, nama MCP `todoist` berbeda dari hosted connector `todoist_mcp`.

> Tidak perlu memasang Todoist jika hanya ingin chatbot Telegram berbasis Hermes.

### 11.6 Praktik aman untuk MCP

- Mulai dengan operasi **read-only**.
- Berikan izin sekecil mungkin.
- Konfirmasi sebelum operasi yang mengubah/menghapus data.
- Periksa hasil di aplikasi tujuan, terutama bila respons agent lambat.
- Jangan langsung mengulang perintah `create` jika agent timeout: bisa menimbulkan data ganda.
- Simpan credential MCP secara privat; jangan tampilkan isi `~/.hermes/mcp-tokens/*.json`.

---

## 12. Troubleshooting

### A. `hermes: command not found`

Penyebab umum: PATH belum termuat, installer belum selesai, atau symlink CLI salah.

```bash
command -v hermes
printf '%s\n' "$PATH"
ls -lah ~/.local/bin 2>/dev/null
```

Buka sesi SSH baru. Ikuti instruksi PATH dari installer; jangan menebak lokasi binary.

### B. Telegram tidak membalas

Periksa berurutan:

```bash
systemctl --user status hermes-gateway.service
journalctl --user -u hermes-gateway -n 50 --no-pager
```

Kemungkinan: service mati, bot token salah/dicabut, user belum diizinkan, jaringan Telegram terganggu, atau API model gagal. Jika ada log `Connected to Telegram (polling mode)` tetapi bot tidak menjawab, periksa error model setelah pesan dikirim.

### C. Service restart terus / konflik dua gateway

Dalam setup acuan pernah ada gateway manual yang berjalan bersamaan dengan service systemd. Cari proses:

```bash
pgrep -af 'hermes.*gateway'
```

Periksa PID dan command. Jika **terbukti** ada proses manual duplikat, hentikan **hanya PID manual yang benar**:

```bash
kill -TERM PID_MANUAL
```

Kemudian:

```bash
systemctl --user restart hermes-gateway.service
```

Jangan memakai `killall` atau menghentikan proses tanpa memverifikasi identitas PID.

### D. Service mati setelah SSH logout

Periksa status linger:

```bash
loginctl show-user "$USER" -p Linger
```

Jika `Linger=no`, jalankan:

```bash
sudo loginctl enable-linger "$USER"
```

Pastikan service sudah `enabled` dan `active`.

### E. Gemini HTTP 503

Contoh log yang pernah muncul:

```text
Gemini HTTP 503 (service_unavailable):
... currently experiencing high demand
```

Artinya request ke Gemini gagal karena layanan sibuk. Tidak otomatis berarti Telegram, Hermes, atau MCP salah konfigurasi. Coba kembali nanti, periksa kuota/status provider, atau pilih model API lain yang kompatibel dan mendukung tool calling.

### F. Respons bot 1–2 menit

Untuk prompt sederhana, ini tergolong lambat. Kemungkinan termasuk latensi model, banyak tahap pencarian/pemanggilan tool, respons server MCP, atau tekanan resource VPS. **Jangan menyimpulkan penyebab hanya dari satu log error.**

```bash
free -h
journalctl --user -u hermes-gateway --since "15 minutes ago" --no-pager
```

Bandingkan prompt teks sederhana dengan prompt yang memanggil tool. Jika hanya operasi tool yang lambat, selidiki proses tool discovery dan layanan MCP. Jika semua prompt lambat, selidiki model/provider dan resource VPS.

### G. MCP berfungsi di CLI tetapi tidak di Telegram

Periksa:

```bash
hermes mcp list
journalctl --user -u hermes-gateway --since "30 minutes ago" --no-pager | grep -Ei 'mcp|oauth|auth|token'
```

Cek apakah gateway berjalan dengan user/profil Hermes yang sama. Jika OAuth baru selesai, gateway yang lebih dulu berjalan mungkin belum memuat credential baru; restart sekali lalu tes sesi Telegram baru. Dalam setup acuan, `/new` membantu memperbaiki pemilihan tool.

### H. MCP OAuth: `no cached tokens found`

Ini dapat terjadi ketika gateway berjalan sebelum OAuth selesai atau credential tidak tersedia untuk proses gateway. Bandingkan waktu error dan waktu login. Cek **nama file dan permission saja**, bukan isi:

```bash
ls -lah ~/.hermes/mcp-tokens/ 2>/dev/null
```

Jika token baru tersedia setelah gateway mulai, restart service dan tes ulang. Jangan membagikan `auth.json`, token JSON, atau callback URL OAuth.

### I. Agent mencoba command shell untuk nama MCP

MCP tidak otomatis menyediakan executable Linux. Misalnya, MCP `todoist` tidak berarti perintah terminal `todoist` tersedia. Minta agent menggunakan **tool MCP**, bukan shell command dengan nama layanan tersebut.

### J. Voice note Telegram tidak ditranskripsi

Fitur teks dan fitur voice memiliki dependensi berbeda. Dalam setup acuan, voice note belum dituntaskan karena komponen transkripsi belum tersedia. Panduan ini **hanya menjamin alur teks yang sudah diuji**. Untuk voice, ikuti dokumentasi fitur audio/transkripsi Hermes sesuai versi.

### K. Disk penuh / RAM terbatas

```bash
free -h
df -h /
du -sh ~/.hermes 2>/dev/null
```

Jangan menghapus folder `~/.hermes` untuk mengosongkan disk tanpa backup: folder tersebut dapat berisi konfigurasi, sesi, dan credential. Jika RAM mendekati batas, cek proses dan penggunaan aktual sebelum menambah swap atau upgrade VM.

### L. Log menampilkan error lama

`journalctl -n 50` bisa memuat error dari proses sebelumnya. Periksa timestamp, PID, dan apakah error muncul lagi setelah restart. Gunakan filter waktu:

```bash
journalctl --user -u hermes-gateway --since "10 minutes ago" --no-pager
```

### M. `systemctl --user` gagal saat SSH/sudo

Jalankan sebagai user yang menginstal Hermes, **bukan** `sudo systemctl --user ...`. User service menggunakan session/user manager milik user tersebut. Jika sedang login sebagai root, kembali ke user Hermes yang benar.

---

## 13. Keamanan dan praktik produksi

### 13.1 Lindungi akses VPS

- Gunakan SSH key dan batasi login root sesuai kebijakan server.
- Aktifkan pembaruan keamanan OS secara terencana.
- Pastikan firewall provider dan UFW tidak membuka port yang tidak diperlukan.
- Gunakan akses konsol dari panel cloud sebagai jalur pemulihan bila SSH bermasalah.

### 13.2 Lindungi Telegram Bot

- Jangan publikasikan bot token.
- Batasi Telegram user/chat yang diizinkan di konfigurasi Hermes.
- Jangan masukkan bot ke grup publik tanpa memahami risiko.
- Jika token bocor, revoke melalui BotFather dan perbarui konfigurasi Hermes.

### 13.3 Lindungi konfigurasi Hermes

Lokasi yang perlu diperlakukan sensitif dapat mencakup:

```text
~/.hermes/
~/.hermes/auth.json
~/.hermes/mcp-tokens/
```

**Jangan menjalankan `cat` pada file credential lalu menempelkan output ke chat.** Untuk troubleshooting, bagikan status service, error yang sudah disensor, dan metadata permission seperlunya.

### 13.4 Batasi kemampuan agent

AI agent dapat memiliki akses tools. Semakin luas aksesnya, semakin besar dampak kesalahan perintah atau prompt injection. Gunakan prinsip *least privilege*: hanya aktifkan tool yang diperlukan, batasi akses filesystem/shell, dan wajibkan konfirmasi untuk tindakan destruktif atau berdampak eksternal.

### 13.5 Backup dan recovery

Simpan catatan tentang versi Hermes, provider/model, nama service, dan langkah setup. Backup konfigurasi secara **terenkripsi dan privat**, bukan ke repo publik. Setelah restore, verifikasi permission file dan ulangi tes CLI, Telegram, dan service.

---

## 14. Checklist dan FAQ

### Checklist utama (wajib)

- [ ] VPS Ubuntu 24.04 tersedia dan dapat diakses SSH.
- [ ] User non-root dengan `sudo` sudah digunakan.
- [ ] Paket dasar terpasang dan koneksi internet keluar berfungsi.
- [ ] `hermes --help` berhasil.
- [ ] Gemini API key telah dikonfigurasi secara aman.
- [ ] `hermes chat` dapat menjawab prompt.
- [ ] Telegram bot dibuat melalui BotFather.
- [ ] `hermes gateway setup` selesai.
- [ ] Bot Telegram dapat membalas pesan teks.
- [ ] `hermes-gateway.service` berstatus `active (running)`.
- [ ] `loginctl enable-linger` sudah diterapkan.
- [ ] Bot tetap berfungsi setelah SSH ditutup.
- [ ] Token dan credential tidak dipublikasikan.

### Checklist tambahan (opsional)

- [ ] Bot kembali online setelah reboot VPS.
- [ ] Integrasi MCP yang dibutuhkan terpasang dan terautentikasi.
- [ ] MCP sudah diuji read-only melalui CLI dan Telegram.
- [ ] Monitoring log dan penggunaan RAM/disk sudah dipahami.
- [ ] Backup privat dan prosedur rotasi credential tersedia.

### FAQ

**Apakah harus menggunakan Todoist?** Tidak. Todoist hanya contoh MCP. Setup Hermes + Gemini + Telegram sudah selesai tanpa MCP apa pun.

**Apakah perlu domain dan Nginx?** Tidak untuk mode polling Telegram yang digunakan dalam panduan ini.

**Apakah VPS harus memiliki GPU?** Tidak untuk Gemini API, karena inference berjalan di server Google.

**Apakah bisa menggunakan model selain Gemini?** Bisa jika didukung oleh versi Hermes/provider API yang digunakan. Pastikan model dapat dipanggil dan mendukung tools jika memerlukan MCP.

**Apakah model gratis di aplikasi coding otomatis bisa digunakan lewat API Hermes?** Tidak selalu. Akses model dalam suatu aplikasi bisa dibatasi hanya untuk aplikasi itu. Periksa kebijakan dan endpoint API provider.

**Apakah bot tetap online saat laptop dimatikan?** Ya, jika gateway aktif di VPS dan service/linger berjalan normal. Laptop hanya dipakai untuk SSH/konfigurasi.

**Apakah RAM 2 GB cukup?** Cukup untuk setup teks yang diuji, tetapi performa bergantung beban, tool, dan jumlah sesi. Pantau penggunaan RAM.

**Apa yang dilakukan jika Telegram lambat tetapi task sudah dibuat?** Cek aplikasi tujuan lebih dulu; jangan langsung mengulang operasi `create` karena berpotensi membuat duplikat.

---

## 15. Referensi

- [Hermes Agent — situs dan dokumentasi resmi](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [Google AI Studio — API key](https://aistudio.google.com/apikey)
- [Telegram BotFather](https://t.me/BotFather)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Ubuntu Server Documentation](https://documentation.ubuntu.com/server/)
- [systemd loginctl manual](https://www.freedesktop.org/software/systemd/man/latest/loginctl.html)

---

## Penutup

Jika **Hermes CLI membalas**, **Telegram Bot membalas**, dan **gateway tetap berjalan setelah SSH ditutup**, maka tujuan utama panduan sudah tercapai: **asisten AI berbasis Hermes berjalan di VPS dan bisa digunakan dari Telegram kapan saja**.

Integrasi MCP adalah tahap pengembangan berikutnya, bukan prasyarat. Mulailah dari bot teks yang stabil, baru tambahkan tools sesuai kebutuhan.

**Status verifikasi panduan:** instalasi Hermes, Gemini API, Telegram polling, user systemd gateway, dan operasi MCP contoh pernah berhasil dalam setup acuan. Fitur voice/transkripsi dan optimasi latensi belum dinyatakan selesai. Selalu cocokkan wizard/perintah dengan versi Hermes yang terpasang.
