# Menjalankan Hermes 24/7 dengan systemd

Tujuannya agar bot tetap online saat terminal SSH ditutup, serta bisa dimulai ulang setelah reboot. Kuncinya ada dua: **systemd user service** dan **linger**.

## 1. Cek apakah unit service tersedia

```bash
systemctl --user status hermes-gateway.service
```

Jika service belum ditemukan, lihat:

```bash
hermes gateway --help
```

::: danger Gunakan mekanisme resmi Hermes
Gunakan mekanisme instalasi service resmi yang disediakan versi Hermes. **Jangan membuat unit service manual kedua** jika installer/wizard sudah membuatnya — dua unit untuk gateway yang sama akan memicu konflik.
:::

## 2. Aktifkan service

Setelah unit terpasang:

```bash
systemctl --user enable --now hermes-gateway.service
```

Lalu aktifkan *linger* untuk user saat ini:

```bash
sudo loginctl enable-linger "$USER"
```

::: tip Apa itu linger?
`linger` memungkinkan systemd user manager tetap hidup setelah user logout dan dapat aktif saat boot. Tanpa linger, semua user service akan dimatikan begitu sesi SSH terputus — bot akan ikut mati. Ini penting pada VPS yang menjalankan gateway di bawah user biasa.
:::

## 3. Verifikasi status

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

## 4. Tes setelah SSH ditutup

1. Pastikan bot membalas pesan Telegram.
2. Keluar dari SSH dengan `exit`.
3. Kirim pesan Telegram lagi.
4. Jika bot tetap membalas, gateway tidak bergantung pada terminal SSH.

## 5. Tes setelah reboot (opsional, disarankan)

Pastikan tidak ada pekerjaan penting yang sedang berjalan, lalu:

```bash
sudo reboot
```

Setelah VPS kembali hidup, login SSH dan cek:

```bash
systemctl --user status hermes-gateway.service
```

Tes Telegram lagi.

::: warning Jangan reboot tanpa jalur pemulihan
Jangan lakukan reboot jika kamu belum memiliki akses pemulihan VPS (konsol panel cloud) dari penyedia layanan.
:::

## Ringkasan perintah penting

```bash
# Status service
systemctl --user status hermes-gateway.service

# Restart service
systemctl --user restart hermes-gateway.service

# Cek status linger
loginctl show-user "$USER" -p Linger
```

## Checklist sebelum lanjut

- [ ] `hermes-gateway.service` berstatus `active (running)`.
- [ ] `loginctl enable-linger` sudah diterapkan.
- [ ] Bot tetap membalas setelah SSH ditutup.
- [ ] (Opsional tapi disarankan) Bot kembali aktif setelah reboot.

Selanjutnya: [Pengujian End-to-End](/guide/testing).
