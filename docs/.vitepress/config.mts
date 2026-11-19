import { defineConfig } from 'vitepress'

// Konfigurasi situs dokumentasi Hermes Agent
export default defineConfig({
  lang: 'id-ID',
  title: 'Hermes Agent Docs',
  description: 'Panduan lengkap menjalankan Hermes Agent sebagai asisten AI pribadi di VPS Ubuntu dan menghubungkannya dengan Telegram Bot.',
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#f97316' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/images/hermes-agent.png' }],
  ],

  themeConfig: {
    logo: '/images/hermes-agent.png',

    nav: [
      { text: 'Beranda', link: '/' },
      {
        text: 'Panduan Setup',
        items: [
          { text: 'Gambaran Hasil Akhir', link: '/guide/overview' },
          { text: 'Persiapan VPS Ubuntu', link: '/guide/vps-setup' },
          { text: 'Instalasi Hermes Agent', link: '/guide/installation' },
          { text: 'Konfigurasi Gemini API', link: '/guide/gemini-api' },
          { text: 'Membuat Telegram Bot', link: '/guide/telegram-bot' },
          { text: 'Menghubungkan Telegram', link: '/guide/connect-telegram' },
        ],
      },
      {
        text: 'Operasional',
        items: [
          { text: 'Menjalankan 24/7 (systemd)', link: '/guide/systemd' },
          { text: 'Pengujian End-to-End', link: '/guide/testing' },
          { text: 'Pemeliharaan', link: '/guide/operations' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ],
      },
      {
        text: 'Lanjutan',
        items: [
          { text: 'Integrasi MCP (Opsional)', link: '/guide/mcp' },
          { text: 'Keamanan & Produksi', link: '/guide/security' },
          { text: 'Checklist & FAQ', link: '/guide/checklist-faq' },
          { text: 'Referensi', link: '/guide/references' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Memulai',
        collapsed: false,
        items: [
          { text: 'Gambaran Hasil Akhir', link: '/guide/overview' },
          { text: 'Spesifikasi dan Persiapan', link: '/guide/preparation' },
          { text: 'Persiapan VPS Ubuntu', link: '/guide/vps-setup' },
        ],
      },
      {
        text: 'Instalasi dan Setup',
        collapsed: false,
        items: [
          { text: 'Instalasi Hermes Agent', link: '/guide/installation' },
          { text: 'Konfigurasi Gemini API', link: '/guide/gemini-api' },
          { text: 'Membuat Telegram Bot', link: '/guide/telegram-bot' },
          { text: 'Menghubungkan Telegram', link: '/guide/connect-telegram' },
        ],
      },
      {
        text: 'Operasional',
        collapsed: false,
        items: [
          { text: 'Menjalankan 24/7 (systemd)', link: '/guide/systemd' },
          { text: 'Pengujian End-to-End', link: '/guide/testing' },
          { text: 'Pengoperasian & Pemeliharaan', link: '/guide/operations' },
        ],
      },
      {
        text: 'Lanjutan',
        collapsed: false,
        items: [
          { text: 'Integrasi MCP (Opsional)', link: '/guide/mcp' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          { text: 'Keamanan & Praktik Produksi', link: '/guide/security' },
          { text: 'Checklist & FAQ', link: '/guide/checklist-faq' },
          { text: 'Referensi', link: '/guide/references' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Cari dokumentasi',
            buttonAriaLabel: 'Cari dokumentasi',
          },
          modal: {
            noResultsText: 'Tidak ada hasil',
            resetButtonTitle: 'Hapus kata kunci',
            footer: {
              selectText: 'Pilih',
              navigateText: 'Navigasi',
              closeText: 'Tutup',
            },
          },
        },
      },
    },

    outline: {
      level: [2, 3],
      label: 'Di halaman ini',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NousResearch/hermes-agent' },
    ],

    docFooter: {
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
    },

    lastUpdated: {
      text: 'Terakhir diperbarui',
    },

    darkModeSwitchLabel: 'Tampilan',
    lightModeSwitchTitle: 'Ganti ke mode terang',
    darkModeSwitchTitle: 'Ganti ke mode gelap',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Kembali ke atas',

    footer: {
      message: 'Panduan diuji pada November 2026 • Bukan dokumentasi resmi Nous Research',
      copyright: 'Dibuat untuk membantu pemula menjalankan Hermes Agent di VPS',
    },
  },

  markdown: {
    lineNumbers: false,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
})
