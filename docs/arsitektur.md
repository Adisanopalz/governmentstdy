# Dokumen Arsitektur (ringkas, ala TOGAF-ADM)

## 1. Visi Arsitektur
Portal layanan publik yang mudah diakses seluruh warga, dengan antarmuka aksesibel dan lapisan layanan yang dapat dihubungkan ke sistem pemerintah lain.

## 2. Domain
| Domain | Deskripsi | Komponen |
|---|---|---|
| Bisnis | Pencarian layanan, pengaduan, pelacakan | Katalog layanan, alur tiket 4 tahap |
| Data | Skema layanan, pengaduan, berita | Objek seragam di `js/services.js` |
| Aplikasi | Logika antarmuka | `js/app.js` |
| Teknologi | Hosting statis, PWA | `sw.js`, `manifest.json` |

## 3. Service Layer (SOA)
| Fungsi | Tujuan | Produksi |
|---|---|---|
| `getLayanan({q,kat})` | Daftar layanan | GET /api/layanan |
| `getBerita()` | Berita | GET /api/berita |
| `kirimPengaduan(d)` | Buat tiket | POST /api/pengaduan |
| `lacak(kode)` | Status tiket | GET /api/pengaduan/{kode} |

## 4. Rencana Migrasi ke Produksi
1. Ganti isi `Svc.*` dengan `fetch()` ke API.
2. Tambah autentikasi, validasi sisi server, dan perlindungan data pribadi.
3. Hubungkan ke sistem kependudukan/perizinan melalui gateway interoperabilitas.
4. Audit aksesibilitas independen dan uji pengguna.
