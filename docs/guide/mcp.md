# Integrasi MCP Opsional

**MCP (Model Context Protocol)** memungkinkan agent memakai tools atau mengakses layanan lain. Ini **bukan syarat** agar Hermes dan Telegram bekerja.

Contoh kebutuhan: mengelola task, membaca repository, mengakses dokumentasi, atau integrasi aplikasi lain. Ketersediaan server dan kemampuan setiap tool tergantung katalog/konfigurasi yang terpasang.

## 1. Lihat katalog

```bash
hermes mcp catalog
```

Lihat opsi perintah:

```bash
hermes mcp --help
```

::: warning Jangan percaya artikel internet begitu saja
Jangan menganggap semua layanan yang disebut dalam artikel internet otomatis tersedia di katalog. Periksa nama server dan instruksi otentikasinya pada versi Hermes yang dipakai.
:::

## 2. Instal server dari katalog

Pola umum (gunakan `NAMA_SERVER` yang benar-benar muncul di katalog):

```bash
hermes mcp install NAMA_SERVER
hermes mcp list
```

::: tip Status enabled ≠ token valid
Status `enabled` menunjukkan server diaktifkan pada konfigurasi, tetapi **belum membuktikan token valid atau semua tool berhasil dipanggil**. Uji selalu lewat CLI.
:::

## 3. Autentikasi (jika diperlukan)

Untuk MCP yang menggunakan OAuth dan didukung oleh CLI:

```bash
hermes mcp login NAMA_SERVER
```

Ikuti petunjuk interaktif.

::: warning OAuth di VPS headless
Pada VPS headless, browser login biasanya dilakukan di komputer lokal. Jika callback menggunakan `localhost`, ingat bahwa `localhost` pada browser lokal **bukan** VPS; ikuti mekanisme callback atau SSH forwarding yang dijelaskan CLI. Jangan mengirim URL callback dengan `code`/`state` ke chat publik.
:::

Sebagian MCP mungkin memakai API key atau metode lain. Gunakan instruksi spesifik dari server tersebut.

## 4. Uji lewat CLI sebelum Telegram

```bash
hermes chat
```

Contoh prompt aman:

```text
Gunakan MCP NAMA_SERVER yang sudah dikonfigurasi. Lakukan operasi baca saja untuk memastikan koneksi berfungsi. Jangan membuat, mengubah, atau menghapus data.
```

Setelah berhasil di CLI, restart gateway jika perlu, lalu tes melalui Telegram. Untuk sesi Telegram yang masih mengingat kegagalan lama, perintah `/new` **pernah membantu** pada setup acuan; perilakunya dapat berbeda menurut versi.

## 5. Contoh: Todoist (opsional, bukan bagian utama)

Pada setup acuan, Todoist dipakai hanya sebagai contoh MCP yang berhasil membaca dan membuat task:

```bash
hermes mcp install todoist
hermes mcp login todoist
hermes mcp list
```

Server contoh: `https://ai.todoist.net/mcp`. Nama tool dan jumlah tool bisa berubah.

::: details Detail: nama MCP vs hosted connector
Jika agent menawarkan **hosted connector** yang berbeda dari server MCP yang sudah dikonfigurasi, pastikan ia menggunakan integrasi yang benar. Dalam satu kasus, nama MCP `todoist` berbeda dari hosted connector `todoist_mcp`.
:::

> Tidak perlu memasang Todoist jika hanya ingin chatbot Telegram berbasis Hermes.

## 6. Praktik aman untuk MCP

- Mulai dengan operasi **read-only**.
- Berikan izin sekecil mungkin.
- Konfirmasi sebelum operasi yang mengubah/menghapus data.
- Periksa hasil di aplikasi tujuan, terutama bila respons agent lambat.
- Jangan langsung mengulang perintah `create` jika agent timeout: bisa menimbulkan data ganda.
- Simpan credential MCP secara privat; jangan tampilkan isi `~/.hermes/mcp-tokens/*.json`.

## Checklist MCP

- [ ] Server MCP benar-benar tersedia di katalog versi Hermes-mu.
- [ ] Instalasi selesai dan `hermes mcp list` menunjukkan server.
- [ ] OAuth/API key berhasil (token tersimpan aman).
- [ ] Uji read-only via `hermes chat` berhasil.
- [ ] Uji via Telegram berhasil.
- [ ] Credential tidak pernah dibagikan/di-screenshot.

Selanjutnya: [Troubleshooting](/guide/troubleshooting).
