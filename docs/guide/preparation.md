# Spesifikasi dan Persiapan

Sebelum mulai mengetik perintah apa pun di VPS, pastikan semua prasyarat di bawah ini sudah tersedia. Persiapan yang rapi akan mencegah banyak masalah di tengah proses.

## Checklist prasyarat

Siapkan sebelum mulai:

- IP publik VPS dan kredensial SSH.
- User Linux non-root dengan akses `sudo`.
- Akun Telegram untuk berkomunikasi dengan bot.
- Akses ke [@BotFather](https://t.me/BotFather).
- Akun Google dan API key dari [Google AI Studio](https://aistudio.google.com/apikey).
- Terminal SSH (PowerShell/Windows Terminal, macOS Terminal, atau Linux terminal).

## Konvensi placeholder

::: danger Perhatikan placeholder
Setiap `USER`, `IP_VPS`, `BOT_TOKEN`, atau `API_KEY` dalam panduan ini adalah **contoh**. Ganti hanya pada tempat yang memang meminta nilai tersebut.
:::

Jangan menempelkan token ke chat publik, screenshot, GitHub, atau issue tracker.

## Prinsip keamanan

Prinsip-prinsip berikut berlaku selama seluruh proses setup:

1. Jangan menjalankan Hermes sebagai root untuk pemakaian normal.
2. Gunakan bot Telegram pribadi dengan pembatasan user/chat yang diizinkan.
3. Hindari membuka akses terminal berisiko kepada pengguna bot lain.
4. Jangan mengunggah `~/.hermes/auth.json`, `.env`, atau token MCP.
5. Jika token bocor, **rotasi/revoke** di penyedia terkait, bukan sekadar menghapus pesan.

## Ringkasan apa yang akan kamu bangun

Setelah semua persiapan selesai, kamu akan menjalankan serangkaian langkah:

| Tahap | Hasil | Halaman panduan |
|---|---|---|
| 1 | VPS Ubuntu siap (update, utilitas, koneksi terverifikasi) | [Persiapan VPS Ubuntu](/guide/vps-setup) |
| 2 | Hermes Agent terpasang dan CLI berfungsi | [Instalasi Hermes Agent](/guide/installation) |
| 3 | Gemini API key terkonfigurasi, `hermes chat` menjawab | [Konfigurasi Gemini API](/guide/gemini-api) |
| 4 | Telegram bot dibuat lewat BotFather | [Membuat Telegram Bot](/guide/telegram-bot) |
| 5 | Gateway terhubung ke Telegram (polling) | [Menghubungkan Telegram](/guide/connect-telegram) |
| 6 | Bot berjalan 24/7 sebagai systemd service | [Menjalankan 24/7](/guide/systemd) |
| 7 | Semua jalur teruji end-to-end | [Pengujian End-to-End](/guide/testing) |

::: tip Tips
Simpan catatan pribadi berisi: versi Hermes yang terpasang, nama model Gemini yang dipakai, dan tanggal setup. Catatan ini sangat membantu saat troubleshooting atau update di kemudian hari.
:::
