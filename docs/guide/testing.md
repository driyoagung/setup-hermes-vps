# Pengujian End-to-End

Lakukan tes bertahap, jangan langsung menggabungkan semua komponen. Setiap tahap memverifikasi satu lapisan agar kesalahan mudah dilokalisasi.

## Urutan pengujian

| Urutan | Pengujian | Tanda berhasil |
|---|---|---|
| 1 | `hermes --help` | CLI terpasang |
| 2 | `hermes chat` | Gemini menjawab |
| 3 | `hermes gateway setup` | Telegram dikonfigurasi |
| 4 | Pesan Telegram | Bot membalas |
| 5 | `systemctl --user status ...` | `active (running)` |
| 6 | Tutup SSH lalu chat | Bot tetap aktif |
| 7 | Reboot VPS (opsional) | Bot kembali aktif |
| 8 | MCP (opsional) | Tools dapat dipanggil melalui agent |

## Contoh prompt pengujian

**Tes dasar:**

```text
Halo Hermes. Jawab dengan satu kalimat pendek.
```

**Tes konteks:**

```text
Jelaskan perbedaan HTTP dan HTTPS dalam 3 poin.
```

**Tes setelah logout:**

```text
Apakah kamu masih aktif setelah sesi SSH saya ditutup?
```

::: danger Prompt pengujian yang aman
Jangan menggunakan prompt yang meminta agent menghapus file, menjalankan perintah shell berbahaya, atau mengubah data eksternal sebagai tes awal. Gunakan prompt baca-tulis sederhana atau murni percakapan.
:::

## Interpretasi hasil

Jika tahap tertentu gagal:

- **Tahap 1–2 gagal** → masalah instalasi/provider. Kembali ke [Instalasi Hermes](/guide/installation) atau [Konfigurasi Gemini](/guide/gemini-api).
- **Tahap 3–4 gagal** → masalah Telegram. Periksa [Menghubungkan Telegram](/guide/connect-telegram) dan [Troubleshooting](/guide/troubleshooting).
- **Tahap 5–7 gagal** → masalah systemd/linger. Periksa [Menjalankan 24/7](/guide/systemd).
- **Tahap 8 gagal** → masalah MCP. Lihat [Integrasi MCP](/guide/mcp) dan bagian [MCP di Troubleshooting](/guide/troubleshooting).

## Checklist akhir pengujian

- [ ] Semua tahap 1–7 lolos (tahap 8 opsional).
- [ ] Bot membalas dari Telegram di HP **dan** desktop.
- [ ] Waktu respons masuk akal untuk prompt sederhana.
- [ ] Tidak ada error berulang di log `journalctl`.

Selanjutnya: [Pengoperasian dan Pemeliharaan](/guide/operations).
