# Proposal Refactoring & Desain Ulang Project Charter

Berikut adalah usulan untuk memecah file dan meningkatkan intuitivitas aplikasi:

## 1. Modularisasi File (Code Structure)
Saat ini semua kode ada di satu file `index.html`. Kita akan pecah menjadi 3 file agar lebih rapi dan mudah di-manage:
- **index.html**: Hanya struktur HTML.
- **style.css**: Semua kode styling/tampilan.
- **script.js**: Logika update data dan fungsi lainnya.

## 2. Struktur Aplikasi (Form vs Dokumen)
User meminta "file untuk form" dan "file untuk dokumen". Ada dua pendekatan:

### Opsi A: Single Split View (Recommended)
Tetap satu halaman dengan layar terbagi (kiri form, kanan preview dokumen real-time).
- **Kelebihan**: User langsung melihat hasil ketikan.
- **Modularisasi**: Form dan Preview dipisah secara *component* dalam kode HTML, tapi tetap dalam satu view browser.

### Opsi B: Multi-Page (Form Page -> Result Page)
Memisahkan secara fisik menjadi dua halaman berbeda.
- `form.html`: Halaman khusus input data. Ada tombol "Generate Document".
- **Mekanisme**: Data dari form disimpan di browser (LocalStorage) lalu dibuka di halaman dokumen.
- **Kelebihan**: Fokus input lebih tinggi, layar tidak sempit.
- **Kekurangan**: Tidak bisa lihat preview real-time saat mengetik.

## 3. Peningkatan Intuitivitas (UX)
Untuk membuat input lebih intuitif dan tidak membingungkan:

### A. Wizard / Stepper Mode
Daripada menampilkan semua input sekaligus yang panjang, kita bagi menjadi langkah-langkah:
1. **Identitas Proyek** (Nama, ID, Klien, Tim)
2. **Detail & Scope** (Latar Belakang, Tujuan, Scope)
3. **Analisis** (Risiko, Asumsi, Kriteria Sukses)
4. **Finalisasi** (Budget, Signatures)

### B. Input Enhancements
- Memberikan **contoh (placeholder)** yang lebih jelas di dalam kotak input.
- Menambahkan **tooltip (?)** atau keterangan kecil di dekat label untuk menjelaskan apa yang haurs diisi.

## Action Plan
1. [ ] Pecah file menjadi HTML/CSS/JS.
2. [ ] Implementasi **Opsi B (Multi-page)** atau **Opsi A (Split View)** update?
3. [ ] Implementasi **Wizard Steps** agar form tidak terlihat menumpuk.
