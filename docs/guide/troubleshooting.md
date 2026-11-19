# Troubleshooting

Halaman ini berisi 13 kasus masalah umum, masing-masing dengan penyebab kemungkinan dan langkah diagnosis. Bacalah sesuai gejala yang kamu alami.

## Indeks masalah

| Kode | Gejala |
|---|---|
| [A](#a-hermes-command-not-found) | `hermes: command not found` |
| [B](#b-telegram-tidak-membalas) | Telegram tidak membalas |
| [C](#c-service-restart-terus-konflik-dua-gateway) | Service restart terus / konflik dua gateway |
| [D](#d-service-mati-setelah-ssh-logout) | Service mati setelah SSH logout |
| [E](#e-gemini-http-503) | Gemini HTTP 503 |
| [F](#f-respons-bot-1-2-menit) | Respons bot 1–2 menit |
| [G](#g-mcp-berfungsi-di-cli-tetapi-tidak-di-telegram) | MCP berfungsi di CLI tetapi tidak di Telegram |
| [H](#h-mcp-oauth-no-cached-tokens-found) | MCP OAuth: `no cached tokens found` |
| [I](#i-agent-mencoba-command-shell-untuk-nama-mcp) | Agent mencoba command shell untuk nama MCP |
| [J](#j-voice-note-telegram-tidak-ditranskripsi) | Voice note Telegram tidak ditranskripsi |
| [K](#k-disk-penuh-ram-terbatas) | Disk penuh / RAM terbatas |
| [L](#l-log-menampilkan-error-lama) | Log menampilkan error lama |
| [M](#m-systemctl-user-gagal-saat-ssh-sudo) | `systemctl --user` gagal saat SSH/sudo |

## A. `hermes: command not found`

Penyebab umum: PATH belum termuat, installer belum selesai, atau symlink CLI salah.

```bash
command -v hermes
printf '%s\n' "$PATH"
ls -lah ~/.local/bin 2>/dev/null
```

Buka sesi SSH baru. Ikuti instruksi PATH dari installer; jangan menebak lokasi binary.

## B. Telegram tidak membalas

Periksa berurutan:

```bash
systemctl --user status hermes-gateway.service
journalctl --user -u hermes-gateway -n 50 --no-pager
```

Kemungkinan: service mati, bot token salah/dicabut, user belum diizinkan, jaringan Telegram terganggu, atau API model gagal. Jika ada log `Connected to Telegram (polling mode)` tetapi bot tidak menjawab, periksa error model setelah pesan dikirim.

## C. Service restart terus / konflik dua gateway

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

::: danger Jangan pakai killall
Jangan memakai `killall` atau menghentikan proses tanpa memverifikasi identitas PID.
:::

## D. Service mati setelah SSH logout

Periksa status linger:

```bash
loginctl show-user "$USER" -p Linger
```

Jika `Linger=no`, jalankan:

```bash
sudo loginctl enable-linger "$USER"
```

Pastikan service sudah `enabled` dan `active`.

## E. Gemini HTTP 503

Contoh log yang pernah muncul:

```text
Gemini HTTP 503 (service_unavailable):
... currently experiencing high demand
```

Artinya request ke Gemini gagal karena layanan sibuk. **Tidak otomatis berarti Telegram, Hermes, atau MCP salah konfigurasi.** Coba kembali nanti, periksa kuota/status provider, atau pilih model API lain yang kompatibel dan mendukung tool calling.

## F. Respons bot 1–2 menit

Untuk prompt sederhana, ini tergolong lambat. Kemungkinan termasuk latensi model, banyak tahap pencarian/pemanggilan tool, respons server MCP, atau tekanan resource VPS. **Jangan menyimpulkan penyebab hanya dari satu log error.**

```bash
free -h
journalctl --user -u hermes-gateway --since "15 minutes ago" --no-pager
```

Bandingkan prompt teks sederhana dengan prompt yang memanggil tool:

- Jika hanya operasi tool yang lambat → selidiki proses tool discovery dan layanan MCP.
- Jika semua prompt lambat → selidiki model/provider dan resource VPS.

## G. MCP berfungsi di CLI tetapi tidak di Telegram

Periksa:

```bash
hermes mcp list
journalctl --user -u hermes-gateway --since "30 minutes ago" --no-pager | grep -Ei 'mcp|oauth|auth|token'
```

Cek apakah gateway berjalan dengan user/profil Hermes yang sama. Jika OAuth baru selesai, gateway yang lebih dulu berjalan mungkin belum memuat credential baru; restart sekali lalu tes sesi Telegram baru. Dalam setup acuan, `/new` membantu memperbaiki pemilihan tool.

## H. MCP OAuth: `no cached tokens found`

Ini dapat terjadi ketika gateway berjalan sebelum OAuth selesai atau credential tidak tersedia untuk proses gateway. Bandingkan waktu error dan waktu login. Cek **nama file dan permission saja**, bukan isi:

```bash
ls -lah ~/.hermes/mcp-tokens/ 2>/dev/null
```

Jika token baru tersedia setelah gateway mulai, restart service dan tes ulang.

::: danger Jangan bagikan isi token
Jangan membagikan `auth.json`, token JSON, atau callback URL OAuth ke siapa pun, termasuk ke chat AI atau issue tracker.
:::

## I. Agent mencoba command shell untuk nama MCP

MCP tidak otomatis menyediakan executable Linux. Misalnya, MCP `todoist` tidak berarti perintah terminal `todoist` tersedia. Minta agent menggunakan **tool MCP**, bukan shell command dengan nama layanan tersebut.

## J. Voice note Telegram tidak ditranskripsi

Fitur teks dan fitur voice memiliki dependensi berbeda. Dalam setup acuan, voice note belum dituntaskan karena komponen transkripsi belum tersedia.

::: info Cakupan panduan
Panduan ini **hanya menjamin alur teks yang sudah diuji**. Untuk voice, ikuti dokumentasi fitur audio/transkripsi Hermes sesuai versi.
:::

## K. Disk penuh / RAM terbatas

```bash
free -h
df -h /
du -sh ~/.hermes 2>/dev/null
```

::: warning Jangan hapus ~/.hermes sembarangan
Jangan menghapus folder `~/.hermes` untuk mengosongkan disk tanpa backup: folder tersebut dapat berisi konfigurasi, sesi, dan credential. Jika RAM mendekati batas, cek proses dan penggunaan aktual sebelum menambah swap atau upgrade VM.
:::

## L. Log menampilkan error lama

`journalctl -n 50` bisa memuat error dari proses sebelumnya. Periksa timestamp, PID, dan apakah error muncul lagi setelah restart. Gunakan filter waktu:

```bash
journalctl --user -u hermes-gateway --since "10 minutes ago" --no-pager
```

## M. `systemctl --user` gagal saat SSH/sudo

Jalankan sebagai user yang menginstal Hermes, **bukan** `sudo systemctl --user ...`. User service menggunakan session/user manager milik user tersebut. Jika sedang login sebagai root, kembali ke user Hermes yang benar.

## Prinsip umum debugging

1. **Satu variabel per tes** — ubah satu hal, uji, catat hasilnya.
2. **Cocokkan timestamp & PID** sebelum menyimpulkan error masih aktif.
3. **Kunci akses terkecil** — matikan dulu penyebab paling sederhana (service mati, token salah) sebelum menyalahkan infrastruktur.
4. **Jangan restart berulang** tanpa membaca log.

Jika semua langkah gagal, buka [Keamanan dan Praktik Produksi](/guide/security) untuk memastikan tidak ada masalah akses, atau bertanya di [GitHub Hermes Agent](https://github.com/NousResearch/hermes-agent) dengan log yang **sudah disensor**.
