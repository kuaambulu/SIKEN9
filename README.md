# SIKEN9
Sistem Infomasi pengumuman Kehendak Nikah (N9) 
# 📋 Papan Pengumuman Kehendak Nikah - KUA Ambulu

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://kuaambulu.github.io/SIKEN9/index.html)
[![Version](https://img.shields.io/badge/Version-2.1-blue)](https://github.com/kuaambulu/SIKEN9)
[![License](https://img.shields.io/badge/License-KUA%20Ambulu-green)](https://github.com/kuaambulu/SIKEN9)

Website digital untuk pengumuman kehendak nikah sesuai PMA No. 30 Tahun 2024

## 🌐 Live Demo

**URL**: [https://kuaambulu.github.io/SIKEN9/index.html](https://kuaambulu.github.io/SIKEN9/index.html)

---

## ✨ Fitur Utama

### 🔍 Pencarian Canggih
- Real-time search tanpa reload
- 5 parameter: Nama Laki-Laki, Nama Perempuan, Nomor Pemeriksaan, Tanggal, Hari
- Case-insensitive dan partial match support

### 📄 Pagination Cerdas
- **Desktop**: 4×4 grid (16 kartu per halaman)
- **Mobile**: 1×4 grid (4 kartu per halaman)
- Auto-adjust responsive

### 📅 Sorting Otomatis
- Urutkan berdasarkan tanggal akad terdekat
- Zona waktu WIB (UTC+7)
- Parser tanggal Bahasa Indonesia

### ⏰ Countdown Badge
- 6 kategori waktu dengan warna berbeda:
  - 🔴 Hari Ini
  - 🟠 Besok
  - 🟠 2-7 Hari Lagi
  - 🟢 8-30 Hari Lagi
  - 🔵 31+ Hari Lagi
  - ⚪ Sudah Dilaksanakan

### 🎨 Desain Modern
- Tema hijau dengan gradasi
- Perpaduan batik dan teknologi
- Fully responsive (desktop, tablet, mobile)
- Smooth animations

### 📊 Statistik Live
- Total pengumuman aktif
- Jumlah hasil pencarian
- Update real-time

---

## 📂 Struktur File

```
SIKEN9/
├── index.html               # File HTML utama
├── style.css                # Stylesheet untuk tampilan
├── script.js                # JavaScript untuk logic
└── README.md                # Dokumentasi ini
```

---

## 🚀 Teknologi yang Digunakan

- **HTML5** - Struktur website
- **CSS3** - Styling dan animasi
- **JavaScript (ES6)** - Logic dan interaksi
- **Google Apps Script** - Backend API
- **Google Spreadsheet** - Database
- **GitHub Pages** - Hosting

---

## 📦 Instalasi & Setup

### Prasyarat
- Akun Google (untuk Spreadsheet & Apps Script)
- Akun GitHub (untuk hosting)
- Browser modern (Chrome, Firefox, Safari, Edge)

### Langkah Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/kuaambulu/SIKEN9.git
   cd SIKEN9
   ```

2. **Setup Google Spreadsheet**
   - Buat Spreadsheet baru
   - Buat sheet bernama "Data Pengumuman"
   - Setup 29 kolom (A-AC) sesuai dokumentasi

3. **Deploy Apps Script**
   - Extensions → Apps Script
   - Copy kode dari dokumentasi
   - Deploy sebagai Web App
   - Set "Who has access" = Anyone
   - Copy URL Web App

4. **Konfigurasi JavaScript**
   - Edit `script.js`
   - Ganti `WEBAPP_URL` dengan URL dari langkah 3
   ```javascript
   const WEBAPP_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
   ```

5. **Deploy ke GitHub Pages**
   - Push file ke repository
   - Settings → Pages
   - Source: main branch
   - Simpan

6. **Akses Website**
   - https://kuaambulu.github.io/SIKEN9/index.html

---

## 🔧 Konfigurasi

### Update URL Web App

Edit file `script.js` baris 2:
```javascript
const WEBAPP_URL = 'YOUR_WEBAPP_URL_HERE';
```

### Ganti Nomor WhatsApp

Edit file `index.html` baris 62:
```html
<a href="https://wa.me/6282146035081" ...>
```

### Update Media Sosial

Edit file `index.html` baris 75-95:
```html
<a href="https://www.instagram.com/kuaambulu/" ...>
<a href="https://www.facebook.com/share/1MjeCrXmgN/" ...>
<a href="https://www.tiktok.com/@kua.ambulu123" ...>
```

### Ubah Tema Warna

Edit file `style.css` baris 9-10:
```css
body {
    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%);
}
```

---

## 📊 Struktur Data Spreadsheet

### Kolom Wajib (29 kolom A-AC):

| Kolom | Field | Contoh |
|-------|-------|--------|
| A | Status | TRUE/FALSE |
| B | Nomor Pemeriksaan | 001/N/2024 |
| C-I | Data Calon Laki-Laki | Nama, Bin, TTL, dll |
| J-P | Data Calon Perempuan | Nama, Binti, TTL, dll |
| Q-Z | Data Wali Nikah | Jenis, Nama, dll |
| AA-AC | Jadwal Nikah | Hari, Tanggal, Tempat |

Detail lengkap: Lihat dokumentasi di folder `docs/`

---

## 🎯 Cara Penggunaan

### Untuk Petugas KUA

1. **Input Data Baru**
   - Buka Google Spreadsheet
   - Tambah baris baru
   - Isi semua kolom
   - Set Status = TRUE

2. **Sembunyikan Data**
   - Ubah Status = FALSE
   - Data tidak tampil di website tapi tetap tersimpan

3. **Update Data**
   - Edit langsung di Spreadsheet
   - Perubahan otomatis muncul dalam 5 menit

### Untuk Masyarakat

1. **Cari Pengumuman**
   - Ketik nama/nomor di kolom search
   - Hasil muncul real-time

2. **Lihat Detail**
   - Klik card untuk lihat info lengkap
   - Perhatikan countdown badge untuk jadwal

3. **Lapor Keberatan**
   - Klik tombol WhatsApp di bawah
   - Hubungi petugas KUA

---

## 📱 Responsive Breakpoints

| Device | Width | Grid | Items/Page |
|--------|-------|------|------------|
| Desktop Large | >1200px | 4 columns | 16 |
| Desktop | 900-1200px | 3 columns | 12 |
| Tablet | 768-900px | 2 columns | 8 |
| Mobile | <768px | 1 column | 4 |

---

## 🐛 Troubleshooting

### Website Tidak Muncul Data

**Solusi**:
1. Cek URL Web App di `script.js`
2. Test URL di browser (harus return JSON)
3. Pastikan ada data dengan Status = TRUE
4. Clear browser cache (Ctrl+Shift+Delete)

### CSS Tidak Ter-load

**Solusi**:
1. Pastikan `style.css` di folder yang sama dengan HTML
2. Cek link di HTML: `<link rel="stylesheet" href="style.css">`
3. Hard refresh: Ctrl+F5

### Search Tidak Berfungsi

**Solusi**:
1. Pastikan `script.js` ter-load
2. Buka Console (F12) untuk cek error
3. Pastikan JavaScript enabled di browser

---

## 🔐 Keamanan & Privasi

- ✅ Data dengan Status = FALSE tidak akan terexpose
- ✅ Spreadsheet tetap private (hanya petugas yang bisa edit)
- ✅ Public hanya bisa READ, tidak bisa WRITE
- ✅ HTTPS secure connection via GitHub Pages

---

## 📝 Changelog

### Version 2.1 (2025-10-29)
- ✅ File dipisah menjadi HTML, CSS, JS
- ✅ Footer lengkap dengan info KUA Ambulu
- ✅ Social media links (Instagram, Facebook, TikTok)
- ✅ Developer credit

### Version 2.0 (2025-10-28)
- ✅ Fitur pencarian real-time
- ✅ Pagination 4×4 desktop, 1×4 mobile
- ✅ Sorting berdasarkan tanggal terdekat
- ✅ Countdown badge dinamis
- ✅ Tema hijau modern
- ✅ Stats bar

### Version 1.0 (2025-10-27)
- ✅ Basic display pengumuman
- ✅ Tema biru
- ✅ Tanpa pagination

---

## 🤝 Contributing

Kontribusi untuk pengembangan sistem ini sangat diterima!

### Cara Berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Guidelines:
- Ikuti coding style yang ada
- Test di berbagai browser dan device
- Update dokumentasi jika perlu
- Tambahkan comments untuk kode complex

---

## 📞 Kontak & Support

### Kantor Urusan Agama Kecamatan Ambulu
- **Alamat**: Jl. Watu Ulo No. 113 Tegalsari, Ambulu, Kab. Jember. 68172
- **WhatsApp**: [082146035081](https://wa.me/6282146035081)
- **Email**: kua.ambulu@kemenag.go.id

### Social Media
- **Instagram**: [@kuaambulu](https://www.instagram.com/kuaambulu/)
- **Facebook**: [KUA Ambulu](https://www.facebook.com/share/1MjeCrXmgN/)
- **TikTok**: [@kua.ambulu123](https://www.tiktok.com/@kua.ambulu123)

### Developer
- **Developed by**: ZR48
- **GitHub Issues**: [Report Bug](https://github.com/kuaambulu/SIKEN9/issues)

---

## 📄 License

Copyright © 2025 Kantor Urusan Agama Kecamatan Ambulu, Kabupaten Jember

Website ini dibuat untuk keperluan pelayanan publik KUA Kecamatan Ambulu sesuai dengan PMA No. 30 Tahun 2024 tentang Pengumuman Kehendak Nikah.

---

## 🙏 Acknowledgments

- Kementerian Agama RI
- Google (Sheets, Apps Script)
- GitHub (Hosting)
- Tim IT KUA Ambulu
- Masyarakat Kecamatan Ambulu

---

## 📚 Dokumentasi Tambahan

- [Panduan Setup Lengkap](Docs/SETUP_GUIDE.md)
- [FAQ](Docs/FAQ.md)
- [API Documentation](Docs/API_DOCS.md)
- [Troubleshooting Guide](Docs/TROUBLESHOOTING.md)

---

## ⭐ Star History

Jika project ini bermanfaat, berikan ⭐ untuk support pengembangan!

---

**Dibuat dengan ❤️ oleh ZR48 untuk KUA Kecamatan Ambulu**

*Mempermudah Pelayanan, Meningkatkan Kepuasan*
