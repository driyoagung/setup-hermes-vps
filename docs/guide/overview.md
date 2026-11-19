# Gambaran Hasil Akhir

> **Tujuan utama:** menjalankan Hermes Agent sebagai asisten AI pribadi di VPS yang selalu aktif, menerima pesan melalui Telegram, dan membalas menggunakan model Gemini. Integrasi MCP (Todoist, GitHub, dan layanan lain) **opsional**.
>
> **Sasaran pembaca:** pemula yang sudah memiliki VPS dan dapat SSH. Panduan ini berdasarkan setup yang berhasil diuji pada November 2026, dengan catatan bahwa perintah dan wizard Hermes dapat berubah mengikuti versi.

## Alur lengkap hasil akhir

Setelah seluruh panduan selesai, alurnya seperti ini:

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

## Yang wajib dan tidak wajib

**Yang wajib:** VPS, Hermes, Gemini API key, Telegram bot token, gateway aktif.

**Yang tidak wajib:** domain, Nginx, SSL publik, database, Docker, webhook, MCP, Todoist, atau aplikasi frontend.

Dalam setup acuan, Telegram menggunakan **polling mode**, sehingga tidak perlu membuka port HTTP/HTTPS untuk menerima webhook. VPS tetap memerlukan akses internet keluar ke layanan Telegram dan Gemini.

## Spesifikasi VPS acuan

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

::: warning Batasan spesifikasi
Spesifikasi ini **teruji untuk bot teks dan integrasi sederhana**, bukan jaminan untuk workload berat, model lokal, atau banyak pengguna bersamaan. Gemini diproses di API eksternal; VPS menjalankan agent/gateway, bukan inference model Gemini secara lokal.
:::

## Biaya

- VPS dikenai biaya sesuai penyedia cloud.
- Gemini Free Tier dapat memiliki kuota, pembatasan, dan ketersediaan yang berubah.
- Telegram Bot API umumnya tidak memerlukan biaya untuk skenario dasar ini.
- MCP pihak ketiga dapat memerlukan akun atau langganan tersendiri.

## Langkah berikutnya

Halaman ini hanya memberi gambaran besar. Urutan pengerjaan yang disarankan:

1. Siapkan semua [prasyarat](/guide/preparation) (akun, token, akses SSH).
2. [Persiapkan VPS Ubuntu](/guide/vps-setup) dari nol.
3. [Instal Hermes Agent](/guide/installation).
4. [Konfigurasi Gemini API](/guide/gemini-api) dan uji lewat CLI.
5. [Buat Telegram Bot](/guide/telegram-bot) lewat BotFather.
6. [Hubungkan Telegram ke Hermes](/guide/connect-telegram).
7. [Jalankan gateway 24/7](/guide/systemd) dengan systemd + linger.
8. Lakukan [pengujian end-to-end](/guide/testing).
