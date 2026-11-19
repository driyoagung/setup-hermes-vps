# Instalasi Hermes Agent

Hermes Agent dipasang melalui installer resmi yang menyediakan CLI `hermes`. Setelah terpasang, verifikasi bahwa CLI dan subcommand utamanya berfungsi.

## 1. Jalankan installer resmi

Sumber instalasi resmi:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

::: warning Catatan keamanan
Perintah ini menjalankan skrip dari internet. Jika ingin mengaudit terlebih dahulu:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o hermes-install.sh
less hermes-install.sh
bash hermes-install.sh
```

Gunakan salah satu metode, tidak perlu keduanya. Pastikan URL resmi dan periksa perubahan instruksi di dokumentasi proyek jika installer berubah.
:::

## 2. Refresh sesi shell

Setelah installer selesai, ikuti instruksi yang tampil. Jika PATH baru belum terbaca, keluar lalu SSH kembali:

```bash
exit
```

Kemudian login SSH lagi dan verifikasi:

```bash
hermes --help
```

Jika help muncul, CLI Hermes dapat dijalankan.

## 3. Verifikasi subcommand

```bash
hermes gateway --help
hermes mcp --help
```

| Subcommand | Kegunaan |
|---|---|
| `hermes gateway` | Koneksi ke Telegram (di wizard nanti) |
| `hermes mcp` | Integrasi MCP opsional |
| `hermes setup` | Wizard konfigurasi provider/model |
| `hermes chat` | Uji percakapan langsung dengan model |

::: tip Utamakan output `--help` versi terpasang
Nama opsi dan wizard bisa berubah antarversi. Selalu cek bantuan versi Hermes yang benar-benar terpasang di VPS, bukan versi yang disebut artikel internet.
:::

## 4. Jika `hermes: command not found`

Cek lokasi CLI dan PATH:

```bash
command -v hermes
printf '%s\n' "$PATH"
ls -lah ~/.local/bin 2>/dev/null
```

Jika installer memberi instruksi untuk menambah PATH, ikuti instruksi tersebut lalu buka shell baru. Jangan asal membuat symlink ke path yang belum diverifikasi. Pada salah satu setup, symlink executable memang perlu diperbaiki, tetapi lokasi instalasi dapat berbeda antarversi.

## Checklist sebelum lanjut

- [ ] `hermes --help` menampilkan bantuan CLI.
- [ ] `hermes gateway --help` dan `hermes mcp --help` berfungsi.
- [ ] Kamu tahu lokasi binary Hermes di VPS.

Selanjutnya: [Konfigurasi Gemini API](/guide/gemini-api).
