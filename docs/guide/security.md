# Keamanan dan Praktik Produksi

Setup bot pribadi tetap mengekspos credential dan akses tools AI. Halaman ini merangkum praktik yang menjaga VPS, bot, dan konfigurasi Hermes tetap aman.

## 1. Lindungi akses VPS

- Gunakan SSH key dan batasi login root sesuai kebijakan server.
- Aktifkan pembaruan keamanan OS secara terencana.
- Pastikan firewall provider dan UFW tidak membuka port yang tidak diperlukan.
- Gunakan akses konsol dari panel cloud sebagai jalur pemulihan bila SSH bermasalah.

## 2. Lindungi Telegram Bot

- Jangan publikasikan bot token.
- Batasi Telegram user/chat yang diizinkan di konfigurasi Hermes.
- Jangan masukkan bot ke grup publik tanpa memahami risiko.
- Jika token bocor, revoke melalui BotFather dan perbarui konfigurasi Hermes.

## 3. Lindungi konfigurasi Hermes

Lokasi yang perlu diperlakukan sensitif dapat mencakup:

```text
~/.hermes/
~/.hermes/auth.json
~/.hermes/mcp-tokens/
```

::: danger Jangan `cat` file credential
Jangan menjalankan `cat` pada file credential lalu menempelkan output ke chat. Untuk troubleshooting, bagikan status service, error yang sudah disensor, dan metadata permission seperlunya.
:::

## 4. Batasi kemampuan agent

AI agent dapat memiliki akses tools. Semakin luas aksesnya, semakin besar dampak kesalahan perintah atau prompt injection.

Gunakan prinsip **least privilege**:

- Hanya aktifkan tool yang diperlukan.
- Batasi akses filesystem/shell.
- Wajibkan konfirmasi untuk tindakan destruktif atau berdampak eksternal.

## 5. Backup dan recovery

- Simpan catatan tentang versi Hermes, provider/model, nama service, dan langkah setup.
- Backup konfigurasi secara **terenkripsi dan privat**, bukan ke repo publik.
- Setelah restore, verifikasi permission file dan ulangi tes CLI, Telegram, dan service.

## Ringkasan incident response

| Situasi | Tindakan segera |
|---|---|
| Bot token bocor | Revoke via BotFather → update config Hermes → restart gateway |
| Gemini API key bocor | Hapus/rotasi key di Google AI Studio → update config → restart |
| Token MCP bocor | Logout/revoke di layanan terkait → `hermes mcp login` ulang |
| VPS terkompromi | Matikan service → rotasi semua credential → investigasi via panel cloud |

Selanjutnya: [Checklist dan FAQ](/guide/checklist-faq).
