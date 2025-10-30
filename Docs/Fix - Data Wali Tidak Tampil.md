# 🔧 Fix - Data Wali Tidak Tampil

## ❌ Masalah
Data Wali Nikah tidak muncul di website, hanya tampil:
- Data Calon Laki-Laki ✅
- Data Calon Perempuan ✅
- Data Wali Nikah ❌ (tidak tampil)
- Jadwal Nikah ✅

---

## ✅ Solusi

### File Yang Sudah Diperbaiki:

#### 1. **script.js**
Sudah ditambahkan section data wali di bagian rendering card:

```javascript
// Sekarang ada section wali lengkap dengan:
<div class="section gender-wali">
    <div class="section-title">Wali Nikah</div>
    // Jenis Wali (Nasab/Hakim)
    // Hubungan Wali (jika Nasab) ATAU Sebab (jika Hakim)
    // Nama Wali
    // Bin Wali
    // TTL Wali
    // Alamat Wali
</div>
```

#### 2. **style.css**
Sudah ditambahkan CSS untuk icon wali:

```css
.gender-wali .section-title::before {
    content: '👤';  /* Icon untuk Wali Nikah */
}
```

---

## 📋 Preview Tampilan Setelah Fix

### Card Pengumuman Sekarang:

```
┌─────────────────────────────────────────┐
│ 📋 No. 001/N/2025                       │
│ ⏱️ 5 Hari Lagi                          │
├─────────────────────────────────────────┤
│ 👨 Calon Pengantin Laki-Laki            │
│   Nama, Bin, TTL, Alamat                │
├─────────────────────────────────────────┤
│ 👩 Calon Pengantin Perempuan            │
│   Nama, Binti, TTL, Alamat              │
├─────────────────────────────────────────┤
│ 👤 Wali Nikah                    ← BARU!│
│   Jenis: Nasab                          │
│   Hubungan: Ayah Kandung                │
│   Nama: Muhammad                        │
│   Bin: Ahmad                            │
│   TTL: Jember, 10 Juni 1970            │
│   Alamat: Jl. Pahlawan No. 45...       │
├─────────────────────────────────────────┤
│ [Schedule Highlight Box]                │
│   Sabtu, 15 Desember 2025               │
└─────────────────────────────────────────┘
```

---

## 🔍 Verifikasi

### Checklist Testing:

1. **Upload file yang sudah diperbaiki:**
   ```
   ✓ script.js (updated)
   ✓ style.css (updated)
   ```

2. **Clear cache browser:**
   ```
   Ctrl + F5 (Windows)
   Cmd + Shift + R (Mac)
   ```

3. **Cek tampilan website:**
   - [ ] Section "👤 Wali Nikah" muncul
   - [ ] Jenis Wali tampil (Nasab/Hakim)
   - [ ] Hubungan/Sebab tampil sesuai jenis
   - [ ] Nama wali tampil
   - [ ] Bin wali tampil
   - [ ] TTL wali tampil
   - [ ] Alamat wali tampil

4. **Test untuk kedua jenis wali:**

   **Test Case 1: Wali Nasab**
   ```
   Di Spreadsheet:
   - Kolom Q (Jenis Wali): Nasab
   - Kolom R (Hubungan Wali): Ayah Kandung
   - Kolom S (Sebab Wali): (kosong)
   
   Di Website harus tampil:
   ✓ Jenis Wali: Nasab
   ✓ Hubungan: Ayah Kandung
   ✗ Sebab: (tidak tampil)
   ```

   **Test Case 2: Wali Hakim**
   ```
   Di Spreadsheet:
   - Kolom Q (Jenis Wali): Hakim
   - Kolom R (Hubungan Wali): (kosong)
   - Kolom S (Sebab Wali): Wali Adhal karena tidak setuju
   
   Di Website harus tampil:
   ✓ Jenis Wali: Hakim
   ✗ Hubungan: (tidak tampil)
   ✓ Sebab: Wali Adhal karena tidak setuju
   ```

---

## 🐛 Debugging

### Jika masih tidak muncul:

#### 1. Cek Data di Spreadsheet

```
Pastikan kolom Q-Z terisi:
Q = Jenis Wali (Nasab/Hakim)
R = Hubungan Wali (jika Nasab)
S = Sebab Wali (jika Hakim)
T = Nama Wali
U = Bin Wali
V = TTL Wali
W = Kewarganegaraan Wali
X = Agama Wali
Y = Pekerjaan Wali
Z = Alamat Wali
```

#### 2. Cek Console Browser

```
F12 → Console
Lihat apakah ada error
```

**Common Errors:**

```javascript
// Error: Cannot read property 'jenisWali' of undefined
// Solusi: Cek Apps Script mapping kolom Q-Z

// Error: item.namaWali is undefined
// Solusi: Cek kolom T di Spreadsheet tidak kosong
```

#### 3. Cek Apps Script Mapping

Pastikan di Apps Script (file dari SETUP_GUIDE.md):

```javascript
// Data Wali - Kolom Q sampai Z (index 16-25)
jenisWali: row[16] || '',        // Kolom Q
hubunganWali: row[17] || '',     // Kolom R
sebabWali: row[18] || '',        // Kolom S
namaWali: row[19] || '',         // Kolom T
binWali: row[20] || '',          // Kolom U
ttlWali: row[21] || '',          // Kolom V
kewarganegaraanWali: row[22] || '', // Kolom W
agamaWali: row[23] || '',        // Kolom X
pekerjaanWali: row[24] || '',    // Kolom Y
alamatWali: row[25] || '',       // Kolom Z
```

#### 4. Test API Response

```bash
# Buka URL Web App di browser
https://script.google.com/macros/s/YOUR_ID/exec

# Cek JSON response, harus ada field wali:
{
  "jenisWali": "Nasab",
  "hubunganWali": "Ayah Kandung",
  "namaWali": "Muhammad",
  "binWali": "Ahmad",
  ...
}
```

---

## 📊 Perbandingan Before vs After

### ❌ Before (Tanpa Data Wali):

```
┌─────────────────────┐
│ 👨 Laki-Laki        │
├─────────────────────┤
│ 👩 Perempuan        │
├─────────────────────┤
│ 📅 Jadwal           │ ← Langsung ke jadwal
└─────────────────────┘
```

### ✅ After (Dengan Data Wali):

```
┌─────────────────────┐
│ 👨 Laki-Laki        │
├─────────────────────┤
│ 👩 Perempuan        │
├─────────────────────┤
│ 👤 Wali Nikah       │ ← Section wali muncul
├─────────────────────┤
│ 📅 Jadwal           │
└─────────────────────┘
```

---

## 📦 File Yang Perlu Diupdate

Upload file berikut ke GitHub (replace yang lama):

```
✓ script.js   (updated - added wali section)
✓ style.css   (updated - added wali icon)
```

**Commit message:**
```
Fix: Add missing Wali Nikah data display
```

---

## 🎯 Expected Result

Setelah fix ini, setiap card pengumuman akan menampilkan:

1. ✅ Header (Nomor Pemeriksaan + Countdown Badge)
2. ✅ Data Calon Pengantin Laki-Laki (4 fields)
3. ✅ Data Calon Pengantin Perempuan (4 fields)
4. ✅ **Data Wali Nikah (6-7 fields)** ← FIXED!
5. ✅ Jadwal Pernikahan (Hari, Tanggal, Tempat)

---

## 📞 Support

Jika masih ada masalah setelah mengikuti panduan ini:

**Contact:**
- WhatsApp: 082146035081
- Email: kua.ambulu@kemenag.go.id

**Include:**
- Screenshot card pengumuman
- Screenshot console browser (F12)
- Screenshot data di Spreadsheet (blur data sensitif)

---

**Fix Version**: 2.1.1  
**Date**: 2025-01-XX  
**Status**: ✅ RESOLVED

---

*Terima kasih telah melaporkan bug ini! Data wali sekarang sudah tampil dengan lengkap.* 🎉
