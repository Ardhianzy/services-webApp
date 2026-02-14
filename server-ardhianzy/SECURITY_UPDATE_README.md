# Laporan Update Keamanan & Fitur (Server Ardhianzy)

Dokumen ini merangkum serangkaian perbaikan keamanan dan peningkatan fitur yang telah diterapkan pada backend `server-ardhianzy` untuk memenuhi standar keamanan dan integritas data.

## 1. Peningkatan Keamanan (Security Hardening)

Perbaikan difokuskan pada mitigasi risiko berdasarkan **OWASP Top 10**, khususnya pada kontrol akses dan perlindungan terhadap serangan otomatis.

### A. Broken Access Control (A01) - Validasi Kepemilikan (Ownership Checks)

**Masalah Sebelumnya:**
Admin yang terautentikasi memiliki akses global untuk mengubah (`UPDATE`) atau menghapus (`DELETE`) data apa pun, termasuk data yang dibuat oleh admin lain.

**Perbaikan:**
Implementasi pengecekan kepemilikan (`Ownership Verification`) di level Handler. Sebelum operasi tulis dilakukan, sistem memvalidasi apakah `ID` admin yang login cocok dengan `admin_id` pada data target.

- **Fitur yang Diamankan:**

  - ✅ `Article`
  - ✅ `Megazine`
  - ✅ `Monologues`
  - ✅ `Research`
  - ✅ `Shop`
  - ✅ `ToT (Tree of Time)` & `ToT_Meta`
  - ✅ `Youtube` (Akses dibatasi hanya untuk admin terautentikasi)

- **Respon Sistem:** Jika admin mencoba mengotak-atik data orang lain, server merespon dengan `403 Forbidden`.

### B. Perlindungan Anti-DDoS & Anti-Scraping

**Masalah Sebelumnya:**
Endpoint publik (seperti `GET` articles) tidak memiliki batasan request, membuatnya rentan terhadap serangan DDoS atau pengambilan data massal (scraping) oleh bot.

**Perbaikan:**
Pemasangan **Global Rate Limiter** pada `app.ts`.

- **Konfigurasi:** Setiap IP Address dibatasi maksimal **100 request** per **15 menit**.
- **Efek:** Request ke-101 dalam jendela waktu tersebut akan otomatis ditolak.

### C. Pembaruan Dependensi (A06)

**Masalah Sebelumnya:**
Terdapat 9 kerentanan keamanan (vulnerabilities) pada library pihak ketiga.

**Perbaikan:**
Audit dan perbaikan otomatis dijalankan (`npm audit fix`).

- **Status Saat Ini:** **0 Vulnerabilities** (Aman).

---

## 2. Peningkatan Integritas Data (Fitur ToT)

### Validasi Unik Nama Philosopher

**Masalah Sebelumnya:**
Sistem mengizinkan pembuatan data `ToT` dengan nama Philosopher yang sama, menyebabkan duplikasi konten.

**Perbaikan:**
Penambahan logika validasi unik pada `ToTService`:

1.  **Saat Membuat (Create):** Sistem mengecek apakah nama philosopher sudah ada di database.
2.  **Saat Mengubah (Update):** Sistem mengecek apakah nama baru yang dimasukkan konflik dengan data philosopher lain.

- **Pesan Error:** `Philosopher '[Nama]' already exists`.

---

_Dokumen ini dibuat secara otomatis untuk referensi pengembangan dan audit._
