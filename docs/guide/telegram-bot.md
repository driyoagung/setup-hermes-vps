# Membuat Telegram Bot

Bot Telegram dibuat melalui **@BotFather**, akun resmi Telegram. Prosesnya cepat dan tidak memerlukan biaya.

![Telegram](/images/telegram.png)

## 1. Buat bot lewat BotFather

1. Buka Telegram dan cari **@BotFather** (akun resmi Telegram).
2. Kirim `/newbot`.
3. Masukkan nama tampilan, misalnya `Hermes Personal Assistant`.
4. Masukkan username unik berakhiran `bot`, misalnya `my_private_hermes_bot` jika tersedia.
5. BotFather akan mengirim **HTTP API bot token**.
6. Simpan token secara privat. Jangan screenshot atau bagikan token.

::: danger Token = kendali penuh atas bot
Token Telegram memberikan kendali atas bot. Jika bocor, siapa pun dapat mengendalikan bot-mu. Lakukan revoke/generate ulang melalui BotFather jika token terekspos, lalu perbarui konfigurasi Hermes.
:::

## 2. Mulai chat dengan bot

Buka link bot yang diberikan BotFather, kemudian tekan **Start** atau kirim `/start`.

Ini membuka percakapan Telegram, tetapi bot **belum** otomatis menjawab sebelum Hermes Gateway aktif.

::: tip Perilaku normal
Tidak ada respons dari bot pada tahap ini adalah hal yang wajar — gateway belum berjalan. Jangan coba-coba mengirim banyak pesan untuk "mengecek" bot.
:::

## 3. Batasi akses bot

Konfigurasikan allowlist/otorisasi Telegram melalui wizard Hermes bila tersedia. Pastikan hanya user/chat yang dipercaya dapat memerintah agent.

Jika bot masuk grup, pahami izin, privasi grup, dan risiko perintah dari anggota lain. Untuk pemakaian pribadi, **mulai dari private chat**.

## Checklist sebelum lanjut

- [ ] Bot dibuat lewat @BotFather (bukan akun tiruan).
- [ ] Token tersimpan privat dan aman.
- [ ] Percakapan dengan bot sudah dibuka (tekan Start).
- [ ] Kamu sudah tahu cara melakukan revoke token di BotFather.

Selanjutnya: [Menghubungkan Telegram ke Hermes](/guide/connect-telegram).
