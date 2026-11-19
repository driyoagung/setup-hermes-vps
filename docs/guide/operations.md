# Pengoperasian dan Pemeliharaan

Setelah bot berjalan, halaman ini menjadi panduan operasi harian: cheat sheet perintah, cara mengubah konfigurasi, membaca log, dan melakukan update.

## 1. Cheat sheet perintah

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

## 2. Saat mengubah konfigurasi

Setelah mengubah konfigurasi model, Telegram, atau MCP, ikuti instruksi Hermes. Jika perubahan tidak termuat, restart gateway **sekali**:

```bash
systemctl --user restart hermes-gateway.service
```

Lalu verifikasi status dan kirim pesan tes.

::: warning Jangan restart berulang
Jangan restart berkali-kali tanpa membaca log. Setiap restart memulai ulang koneksi Telegram dan memotong sesi; error berulang justru mungkin disebabkan perilaku restart itu sendiri.
:::

## 3. Memeriksa waktu dan log

```bash
# Log terbaru
journalctl --user -u hermes-gateway --since "15 minutes ago" --no-pager

# Log boot saat ini
journalctl --user -u hermes-gateway -b --no-pager
```

::: tip Perhatikan timezone
Timestamp log dapat memakai timezone VPS (sering UTC), berbeda dari jam lokal di Telegram. Cocokkan zona waktu ketika menginvestigasi insiden.
:::

## 4. Update

Sebelum update Hermes:

1. Baca release notes/dokumentasi versi terbaru.
2. Catat versi dan konfigurasi yang sedang berfungsi.
3. Backup konfigurasi secara aman (jangan upload credential ke repo).
4. Jalankan prosedur update resmi sesuai versi terpasang.
5. Restart gateway jika diminta, kemudian ulangi pengujian end-to-end.

::: info Panduan tidak mengunci perintah update
Mekanisme instalasi/upgrade Hermes dapat berubah antarversi. Panduan ini sengaja tidak mengunci perintah update tertentu; selalu ikuti dokumentasi resmi versi yang terpasang.
:::

## 5. Pemantauan rutin yang disarankan

| Frekuensi | Yang dicek | Perintah |
|---|---|---|
| Saat ragu | Status service | `systemctl --user status hermes-gateway.service` |
| Mingguan | RAM & disk | `free -h` dan `df -h /` |
| Mingguan | Error di log | `journalctl --user -u hermes-gateway --since "7 days ago" --no-pager` |
| Saat update | Versi Hermes & model | Catat di catatan pribadi |
| Insiden | Waktu & timestamp | Cocokkan timezone VPS vs jam lokal |

Selanjutnya: [Integrasi MCP Opsional](/guide/mcp) atau langsung ke [Troubleshooting](/guide/troubleshooting).
