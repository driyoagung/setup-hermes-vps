# Checklist dan FAQ

## Checklist utama (wajib)

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

## Checklist tambahan (opsional)

- [ ] Bot kembali online setelah reboot VPS.
- [ ] Integrasi MCP yang dibutuhkan terpasang dan terautentikasi.
- [ ] MCP sudah diuji read-only melalui CLI dan Telegram.
- [ ] Monitoring log dan penggunaan RAM/disk sudah dipahami.
- [ ] Backup privat dan prosedur rotasi credential tersedia.

## FAQ

### Apakah harus menggunakan Todoist?

Tidak. Todoist hanya contoh MCP. Setup Hermes + Gemini + Telegram sudah selesai tanpa MCP apa pun.

### Apakah perlu domain dan Nginx?

Tidak untuk mode polling Telegram yang digunakan dalam panduan ini.

### Apakah VPS harus memiliki GPU?

Tidak untuk Gemini API, karena inference berjalan di server Google.

### Apakah bisa menggunakan model selain Gemini?

Bisa jika didukung oleh versi Hermes/provider API yang digunakan. Pastikan model dapat dipanggil dan mendukung tools jika memerlukan MCP.

### Apakah model gratis di aplikasi coding otomatis bisa digunakan lewat API Hermes?

Tidak selalu. Akses model dalam suatu aplikasi bisa dibatasi hanya untuk aplikasi itu. Periksa kebijakan dan endpoint API provider.

### Apakah bot tetap online saat laptop dimatikan?

Ya, jika gateway aktif di VPS dan service/linger berjalan normal. Laptop hanya dipakai untuk SSH/konfigurasi.

### Apakah RAM 2 GB cukup?

Cukup untuk setup teks yang diuji, tetapi performa bergantung beban, tool, dan jumlah sesi. Pantau penggunaan RAM.

### Apa yang dilakukan jika Telegram lambat tetapi task sudah dibuat?

Cek aplikasi tujuan lebih dulu; jangan langsung mengulang operasi `create` karena berpotensi membuat duplikat.

## Status keseluruhan

Setelah semua checklist wajib tercentang, sistemmu berada pada kondisi:

| Komponen | Kondisi |
|---|---|
| Hermes Agent | Terpasang, CLI berfungsi |
| Model | Gemini API, diuji lewat `hermes chat` |
| Telegram | Bot pribadi, polling mode |
| Gateway | systemd user service + linger |
| MCP | Opsional, diuji read-only jika dipasang |

Selanjutnya: [Referensi](/guide/references).
