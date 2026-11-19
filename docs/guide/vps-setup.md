# Persiapan VPS Ubuntu

Halaman ini memandu verifikasi dasar VPS: login SSH, cek OS/resource, update paket, cek konektivitas, dan catatan soal firewall.

## 1. Login SSH

Di komputer lokal:

```bash
ssh USER@IP_VPS
```

Contoh bentuk perintah (bukan IP nyata):

```bash
ssh ubuntu@203.0.113.10
```

Jika menggunakan SSH key khusus:

```bash
ssh -i /path/to/private_key USER@IP_VPS
```

::: warning Windows
Pada Windows, `ssh` dapat dijalankan dari PowerShell atau Windows Terminal. Jangan pernah membagikan file private key.
:::

## 2. Verifikasi OS, user, resource

```bash
cat /etc/os-release
whoami
id
free -h
df -h /
```

Pastikan:

- OS Ubuntu (dalam setup acuan: Ubuntu Server 24.04 LTS).
- RAM sekitar 2 GB.
- Disk masih memiliki ruang kosong yang cukup.
- `whoami` menampilkan user biasa, **bukan** `root`.

## 3. Update dan instal utilitas dasar

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git ca-certificates unzip
```

Jika update kernel meminta reboot, lakukan setelah memastikan kamu dapat login SSH kembali:

```bash
sudo reboot
```

Tunggu VPS hidup, lalu SSH kembali. Reboot tidak selalu diperlukan.

## 4. Cek konektivitas internet

```bash
curl -I https://www.google.com
```

::: tip Interpretasi hasil
Respons HTTP (termasuk redirect) menunjukkan DNS/TLS/koneksi keluar berfungsi. Jika gagal, periksa DNS, firewall outbound, dan jaringan VPS **sebelum lanjut** ke instalasi Hermes.
:::

## 5. Firewall (opsional, hati-hati)

Untuk bot berbasis polling, **tidak perlu membuka port 80/443 inbound**. Jika ingin memakai UFW, pastikan SSH diizinkan **sebelum** mengaktifkannya:

```bash
sudo ufw allow OpenSSH
sudo ufw status
```

::: danger Jangan buru-buru mengaktifkan UFW
Jangan menjalankan `sudo ufw enable` sampai kamu yakin aturan SSH dan kebijakan firewall provider sudah benar; salah konfigurasi dapat **mengunci akses ke VPS**. Gunakan konsol dari panel cloud sebagai jalur pemulihan.
:::

## Checklist sebelum lanjut

- [ ] Bisa login SSH dengan user non-root.
- [ ] `cat /etc/os-release` menunjukkan Ubuntu.
- [ ] `free -h` dan `df -h /` menunjukkan resource cukup.
- [ ] Paket dasar (`curl`, `git`, `ca-certificates`, `unzip`) terpasang.
- [ ] `curl -I https://www.google.com` berhasil.

Setelah semua tercentang, lanjut ke [Instalasi Hermes Agent](/guide/installation).
