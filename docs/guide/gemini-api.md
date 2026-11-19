# Konfigurasi Gemini API

Hermes Agent memerlukan provider model agar bisa membalas pesan. Panduan ini memakai **Google Gemini API** — inference berjalan di server Google, sehingga VPS tidak perlu GPU.

## 1. Buat API key

1. Buka <https://aistudio.google.com/apikey>.
2. Login dengan akun Google.
3. Buat atau pilih API key sesuai alur Google AI Studio.
4. Simpan key secara privat.
5. Perhatikan ketentuan Free Tier, kuota, region, dan model yang tersedia.

::: danger Jaga API key
Jangan menulis key ke file README atau menyertakannya dalam screenshot terminal. Jika key bocor, rotasi/hapus di Google AI Studio dan buat key baru.
:::

## 2. Jalankan setup Hermes

```bash
hermes setup
```

Pada wizard:

- Pilih provider **Gemini / Google Gemini API** jika tersedia.
- Masukkan API key ketika diminta.
- Gunakan model yang tersedia pada akun dan mendukung **tool/function calling**, terutama jika nantinya ingin memakai MCP.

Model yang dipakai dalam pengujian acuan:

```text
gemini-3.5-flash-lite
```

::: warning Nama model hanyalah contoh
Nama model ini adalah **contoh dari pengujian**, bukan jaminan bahwa model selalu tersedia atau menjadi pilihan terbaik. Ikuti daftar model aktual yang disediakan provider dan Hermes.
:::

## 3. Uji model melalui CLI

```bash
hermes chat
```

Kirim pesan sederhana:

```text
Halo, balas satu kalimat dalam Bahasa Indonesia.
```

**Berhasil:** agent membalas dengan jawaban dari model.

**Belum berhasil:** muncul error autentikasi, nama model tidak ditemukan, kuota habis, atau gangguan provider.

Keluar dari mode chat sesuai petunjuk antarmuka Hermes.

::: danger Gerbang wajib
Jangan lanjut ke Telegram sebelum tes CLI ini berhasil. Kalau CLI gagal, kesalahan akan bercampur dengan masalah Telegram dan sulit dianalisis.
:::

## 4. Jika API gagal

| Gejala | Kemungkinan | Tindakan |
|---|---|---|
| `401` / `403` | API key, izin, atau akses model | Periksa key dan akses provider |
| Model tidak ditemukan | Nama model/versi tidak cocok | Pilih model yang benar-benar tersedia |
| `429` | Rate limit atau kuota | Tunggu/reset kuota, periksa dashboard provider |
| `503 service_unavailable` | Layanan model sedang sibuk | Coba kembali kemudian atau pilih model lain |
| Respons lambat | Latensi model, antrean, atau banyak tool call | Ukur waktu dan periksa log sebelum menyimpulkan |

::: tip Jangan menyalahkan VPS terlalu cepat
Jangan otomatis menyalahkan VPS untuk setiap error API: inference Gemini dilakukan di sisi provider. VPS hanya mengirim request dan menerima respons.
:::

## Checklist sebelum lanjut

- [ ] API key tersimpan privat, tidak dibagikan.
- [ ] `hermes setup` selesai dengan provider Gemini.
- [ ] `hermes chat` berhasil menjawab prompt sederhana.

Selanjutnya: [Membuat Telegram Bot](/guide/telegram-bot).
