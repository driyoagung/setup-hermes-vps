# Menghubungkan Telegram ke Hermes

Di tahap ini, gateway Hermes dikonfigurasi untuk menerima pesan Telegram dan meneruskannya ke agent (Gemini).

## 1. Jalankan wizard gateway

Di VPS:

```bash
hermes gateway setup
```

Pilih platform **Telegram** dan masukkan bot token secara interaktif. Ikuti pengaturan akses/otorisasi yang disediakan versi Hermes yang terpasang.

::: warning Jangan tempel token sebagai argumen CLI
Hindari menempelkan bot token sebagai argumen CLI (misalnya `hermes gateway --token ...`) jika wizard sudah mendukung input aman; token di argumen dapat tercatat di history shell dan daftar proses.
:::

## 2. Periksa perintah gateway

```bash
hermes gateway --help
```

Jika versi terpasang mendukung:

```bash
hermes gateway start
```

::: tip Tergantung versi Hermes
Beberapa versi mengelola gateway melalui service systemd; ikuti informasi yang diberikan CLI. Detail systemd dibahas di [Menjalankan Hermes 24/7](/guide/systemd).
:::

**Penting:** Jangan menjalankan dua gateway sekaligus untuk bot yang sama. Konflik dua gateway memicu restart berulang dan pesan hilang (lihat [Troubleshooting](/guide/troubleshooting#tipe-c-service-restart-terus-konflik-dua-gateway)).

## 3. Uji Telegram

Kirim ke bot:

```text
Halo Hermes, tolong balas "Telegram terhubung".
```

Tunggu respons. Pada setup acuan, gateway berhasil tersambung dengan log:

```text
[Telegram] Connected to Telegram (polling mode)
```

**Makna log:** gateway berhasil tersambung ke Telegram, tetapi keberhasilan menyelesaikan setiap request AI tetap bergantung pada provider model (Gemini).

## 4. Kenapa tidak perlu domain atau webhook?

Polling membuat gateway meminta update ke Telegram dari VPS (**koneksi keluar**). Untuk skenario ini tidak diperlukan:

- ❌ Domain
- ❌ Reverse proxy (Nginx)
- ❌ Sertifikat HTTPS publik (SSL/Let's Encrypt)
- ❌ Membuka port 443 inbound

Jika suatu saat berpindah ke webhook, arsitektur dan konfigurasi jaringan akan berbeda (webhook butuh endpoint HTTPS publik yang dapat diakses Telegram).

## Checklist sebelum lanjut

- [ ] `hermes gateway setup` selesai dengan platform Telegram.
- [ ] Bot membalas pesan tes di Telegram.
- [ ] Log menunjukkan `Connected to Telegram (polling mode)`.
- [ ] Gateway hanya berjalan sebagai satu instance.

Selanjutnya: [Menjalankan Hermes 24/7 dengan systemd](/guide/systemd).
