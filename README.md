# Proyek Portal Layanan Publik Digital (Prototipe)

Isi paket:
- `laporan/Laporan_Review_Jurnal.docx` - review 4 jurnal, analisis, rancangan arsitektur
- `website/` - prototipe website (HTML, CSS, JavaScript tanpa framework)
- `docs/` - dokumen arsitektur dan checklist aksesibilitas

## Menjalankan
Buka `website/index.html` di browser. Untuk uji PWA/offline jalankan server lokal:
`cd website && python3 -m http.server 8000` lalu buka http://localhost:8000

## Struktur website
index, layanan, pengaduan, lacak, faq, arsitektur, aksesibilitas (.html); css/style.css; js/services.js (service layer), js/app.js; sw.js; manifest.json.

## Catatan
Data bersifat contoh. Pengaduan disimpan di localStorage browser. Isi kolom nama/kelompok pada sampul laporan sebelum dikumpulkan, dan cek ulang detail jurnal berbayar ke teks lengkapnya.
