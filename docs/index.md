---
layout: home

hero:
  name: "Hermes Agent Docs"
  text: "Asisten AI Pribadi di VPS + Telegram"
  tagline: Panduan lengkap menjalankan Hermes Agent di VPS Ubuntu yang selalu aktif, menerima pesan melalui Telegram, dan membalas menggunakan model Gemini. Integrasi MCP (Todoist, GitHub, dan lainnya) bersifat opsional.
  image:
    src: /images/hero-hermes-telegram.png
    alt: Maskot Hermes Agent terhubung dengan bot Telegram
  actions:
    - theme: brand
      text: Mulai Panduan Setup
      link: /guide/overview
    - theme: alt
      text: Lihat Spesifikasi VPS
      link: /guide/preparation
    - theme: alt
      text: Ke Troubleshooting
      link: /guide/troubleshooting

features:
  - icon:
      light: /images/icons/rocket-light.svg
      dark: /images/icons/rocket-dark.svg
      alt: Ikon roket
      width: 44px
      height: 44px
    title: Setup dari Nol
    details: Dari VPS kosong hingga bot Telegram yang membalas pesan — langkah demi langkah, ditulis untuk pemula yang sudah bisa SSH.
    link: /guide/overview
    linkText: Pelajari alurnya
  - icon:
      light: /images/icons/bot-light.svg
      dark: /images/icons/bot-dark.svg
      alt: Ikon robot
      width: 44px
      height: 44px
    title: Gemini sebagai Otak
    details: Konfigurasi Google Gemini API sebagai model agen, termasuk pengujian CLI sebelum lanjut ke Telegram.
    link: /guide/gemini-api
    linkText: Konfigurasi Gemini
  - icon:
      light: /images/icons/message-light.svg
      dark: /images/icons/message-dark.svg
      alt: Ikon gelembung pesan
      width: 44px
      height: 44px
    title: Telegram Polling Mode
    details: Tidak perlu domain, Nginx, SSL publik, atau webhook. Gateway memakai koneksi keluar (long polling) ke Telegram Bot API.
    link: /guide/connect-telegram
    linkText: Hubungkan Telegram
  - icon:
      light: /images/icons/infinity-light.svg
      dark: /images/icons/infinity-dark.svg
      alt: Ikon simbol tak hingga
      width: 44px
      height: 44px
    title: Selalu Online 24/7
    details: Jalankan gateway sebagai systemd user service dengan linger, sehingga bot tetap hidup setelah SSH ditutup atau VPS reboot.
    link: /guide/systemd
    linkText: Setup systemd
  - icon:
      light: /images/icons/puzzle-light.svg
      dark: /images/icons/puzzle-dark.svg
      alt: Ikon kepingan puzzle
      width: 44px
      height: 44px
    title: MCP Opsional
    details: Tambahkan tools seperti Todoist atau GitHub melalui Model Context Protocol — bukan syarat agar bot utama berjalan.
    link: /guide/mcp
    linkText: Integrasi MCP
  - icon:
      light: /images/icons/wrench-light.svg
      dark: /images/icons/wrench-dark.svg
      alt: Ikon kunci pas
      width: 44px
      height: 44px
    title: Troubleshooting Lengkap
    details: 13 kasus masalah umum dengan langkah diagnosis — dari `command not found` hingga OAuth MCP yang gagal.
    link: /guide/troubleshooting
    linkText: Baca solusi
---
