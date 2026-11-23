# Product Requirements Document (PRD) — LabGear API

## 1. Identitas Dokumen
- **Nama Proyek:** LabGear API (`labgear-api` — Sistem Peminjaman Peralatan Laboratorium)
- **Mata Kuliah:** Web Service (REST API - NestJS) — UTS Ganjil 2026/2027
- **Institusi:** Institut Digital Ekonomi (IDE) LPKIA Bandung
- **Dosen Pengampu:** Agung Dea Yulaksana
- **Nama Mahasiswa:** Roby Rachmat Firdaus
- **NIM:** 240414015
- **Kelas:** 3IF-01

---

## 2. Latar Belakang & Tujuan
- **Latar Belakang:** Pencatatan peminjaman alat laboratorium kampus saat ini masih menggunakan formulir manual/kertas. Pendekatan ini sering menimbulkan ketidakkonsistenan data peminjam, kesalahan penulisan kode identifikasi alat, unit pinjam yang tidak terkontrol, serta ketidakjelasan status dan jadwal pengembalian.
- **Tujuan:** Membangun fondasi REST API berbasis NestJS yang menerapkan kontrak Data Transfer Object (DTO) ketat dan validasi request otomatis (`ValidationPipe`) untuk menjamin konsistensi, validitas, dan integritas data peminjaman inventaris laboratorium kampus.

---

## 3. Pengguna / Aktor Sistem
1. **Mahasiswa / Peminjam:** Menjelajahi katalog alat lab, mengajukan permohonan peminjaman unit, dan memperbarui keperluan atau jadwal pengembalian barang.
2. **Petugas / Admin Laboratorium:** Mengelola master data inventaris peralatan baru, meninjau permohonan pinjam yang masuk, serta memantau ketersediaan unit alat.

---

## 4. Ruang Lingkup Versi Pertama (UTS)
- Kontrak API terstandar untuk dua modul utama: `equipment` (inventaris alat) dan `loan-requests` (pengajuan peminjaman).
- Validasi input otomatis menggunakan `class-validator` dan transformasi tipe data dengan `class-transformer`.
- Penegakan `ValidationPipe` global dengan konfigurasi `whitelist: true`, `forbidNonWhitelisted: true`, dan `transform: true`.
- Penyimpanan data berbasis *in-memory array* dengan seed data awal tanpa database persisten eksternal.

---

## 5. Functional Requirements (FR)
- **`FR-01`**: Sistem dapat menampilkan daftar peralatan dengan filter `category`, pencarian `keyword`, serta paginasi `page` dan `limit`.
- **`FR-02`**: Sistem dapat menampilkan detail spesifik peralatan berdasarkan parameter `id`.
- **`FR-03`**: Sistem dapat menerima dan memvalidasi penambahan data peralatan baru dengan format `assetCode` terstandar.
- **`FR-04`**: Sistem dapat menerima pengajuan peminjaman alat baru dan otomatis menetapkan `id`, `status = PENDING`, serta `createdAt` (ISO 8601).
- **`FR-05`**: Sistem dapat menampilkan detail pengajuan peminjaman berdasarkan parameter `id`.
- **`FR-06`**: Sistem dapat memperbarui data pengajuan peminjaman secara parsial dan terbatas hanya pada field `returnDate` dan `purpose`.

---

## 6. Non-Functional Requirements (NFR)
- **`NFR-01` (Konsistensi Validasi):** Seluruh request HTTP yang masuk divalidasi otomatis oleh NestJS `ValidationPipe` sehingga data tidak sah atau properti di luar whitelist langsung ditolak dengan status `400 Bad Request`.
- **`NFR-02` (Maintainability):** Arsitektur modular terpisah per domain (`dto`, `interface`, `controller`, `service`, `module`) dengan pengetikan TypeScript yang ketat (*type safety*).
- **`NFR-03` (Portability):** Sistem dapat dijalankan langsung di lingkungan Node.js lokal tanpa konfigurasi database pihak ketiga (`npm install` dan `npm run start:dev`).

---

## 7. Aturan Bisnis (Business Rules)
### A. Validasi Bentuk Input (DTO Layer)
- **`BR-01` (Format Identitas & Aset):** Format kode aset (`assetCode`) wajib memenuhi regex `^LAB-[A-Z]{2}-[0-9]{3}$` (contoh: `LAB-EL-001`), dan NIM peminjam (`borrowerNim`) wajib berupa 8–12 digit angka murni (`^[0-9]{8,12}$`).
- **`BR-02` (Batasan Kuantitas & Kamus Data):** Jumlah unit yang dipinjam (`quantity`) dibatasi bulat 1–3 unit; stok alat (`stock`) dibatasi bulat 0–50 unit; nilai `category` dan `condition` wajib berasal dari kamus enum resmi sistem.

### B. Validasi Lintas-Field & Proses Bisnis
- **`BR-03` (Kronologi Tanggal Pinjam):** Tanggal pengembalian (`returnDate`) wajib sama dengan atau setelah tanggal mulai pinjam (`startDate`). Aturan ini tidak dapat dipenuhi hanya dengan decorator tunggal `@IsDateString()` karena membutuhkan komparasi relasional antar dua atribut tanggal, sehingga membutuhkan *custom cross-field validator* atau validasi layer proses bisnis.
- **`BR-04` (Integritas Metadata Sistem):** Atribut `id`, `status` (`PENDING`, `APPROVED`, `REJECTED`, `RETURNED`), dan `createdAt` dikelola penuh oleh sistem dan dilarang dikirim oleh client pada request body untuk mencegah eskalasi status sepihak dan manipulasi audit waktu.

---

## 8. Asumsi & Out of Scope (Versi UTS)
- **Asumsi:** Format tanggal string mengikuti standar ISO 8601 (`YYYY-MM-DD`); data in-memory akan ter-reset kembali ke seed data awal setiap kali server di-restart.
- **Out of Scope:** Integrasi database persisten/ORM, sistem otentikasi/otorisasi (JWT/RBAC), upload bukti fisik formulir, serta workflow notifikasi email/WhatsApp.
