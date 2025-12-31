# Panduan Pemeliharaan (Maintenance Guide) - Project Charter Generator

Dokumen ini menjelaskan arsitektur, struktur kode, dan cara memelihara aplikasi Project Charter Generator.

## 1. Arsitektur Proyek
Aplikasi ini dibangun menggunakan **Vanilla JavaScript (ES6+)** dengan pendekatan modular. Tidak ada framework berat (seperti React/Vue) untuk menjaga performa tetap ringan dan portabel.

### Struktur Folder:
- `/` : Berisi halaman input utama (`index.html`, `style.css`, `script.js`).
- `/js/` : Berisi modul-modul logika fitur.
- `/document/` : Berisi halaman output/preview yang siap cetak.

## 2. Struktur Modul JavaScript (`/js/`)
Setiap fitur besar dipisahkan ke dalam modul tersendiri untuk memudahkan debugging:

| Modul            | Deskripsi                                                       |
| ---------------- | --------------------------------------------------------------- |
| `storage.js`     | Mengelola sinkronisasi data dengan `localStorage`.              |
| `ui.js`          | Menangani interaksi antarmuka (auto-resize, progress tracking). |
| `budget.js`      | Logika perhitungan anggaran (mode simpel vs rincian tabel).     |
| `navigation.js`  | Mengatur navigasi tab/wizard dan status penyelesaian.           |
| `signature.js`   | Fungsionalitas canvas untuk tanda tangan digital.               |
| `dates.js`       | Utilitas tanggal dan perhitungan durasi.                        |
| `dynamicList.js` | (Opsional) Mengelola input list dinamis.                        |

## 3. Cara Menambah Field Baru
Jika ingin menambah input baru di formulir:
1. **HTML**: Tambahkan elemen `<input>` atau `<textarea>` di `index.html`. Pastikan memiliki `id` yang unik (misal: `projectManager`).
2. **Logic**: Secara otomatis, `ui.js` akan menangkap input tersebut dan menyimpannya ke `localStorage` berkat listener global di `UI.init()`.
3. **Output**: Di `document/index.html`, tambahkan elemen penampung dengan `id` seperti `view-projectManager`.
4. **Script Output**: Di `document/script.js`, tambahkan nama field tersebut ke dalam array `fields` di bagian atas script.

## 4. Sistem Tema (Theming)
Dokumen output mendukung beberapa tema (Mesin Ketik, Folio, Modern). 
- Tema didefinisikan di `document/style.css` menggunakan variabel CSS di dalam atribut `body[data-theme="nama-tema"]`.
- Logika pergantian tema ada di bagian bawah `document/script.js`.

## 5. Penyimpanan Data
Data disimpan secara lokal di browser user (`localStorage`). 
- **Keuntungan**: Data tetap ada meski halaman di-refresh.
- **Batasan**: Data tidak berpindah antar perangkat atau browser yang berbeda.
- **Reset**: Tombol "Reset" akan memanggil `Storage.clear()` untuk menghapus semua data.

## 6. Tips Pengembangan
- **Penulisan CSS**: Gunakan variabel CSS (`--primary`, `--ink-color`, dll) yang didefinisikan di `:root` untuk menjaga konsistensi warna.
- **Debug LocalStorage**: Gunakan *Developer Tools* (F12) -> *Application* -> *Local Storage* untuk melihat data mentah yang tersimpan.
