# LabGear API — Sistem Peminjaman Peralatan Laboratorium

Proyek REST API backend berbasis NestJS untuk manajemen dan pengajuan peminjaman peralatan laboratorium kampus. Proyek ini dibangun sebagai lembar kerja Ujian Tengah Semester (UTS) Ganjil Tahun Akademik 2026/2027.

## Identitas Pengembang
- **Nama Mahasiswa:** Roby Rachmat Firdaus
- **NIM:** 240414015
- **Kelas:** 3IF-01
- **Program Studi / Institusi:** Institut Digital Ekonomi (IDE) LPKIA Bandung
- **Mata Kuliah:** Web Service (REST API - NestJS)
- **Dosen Pengampu:** Agung Dea Yulaksana

> **Catatan Penyimpanan Data:**  
> Sesuai instruksi dan batasan teknis UTS, sistem ini **tidak menggunakan database eksternal/permanen**. Seluruh entitas disimpan dalam *in-memory array* pada masing-masing layer Service. Data awal (*seed data*) dimuat otomatis saat runtime dan akan kembali ke kondisi semula apabila server dimulai ulang (*restart*).

---

## Teknologi & Dependensi
- **Framework:** NestJS 10 (TypeScript)
- **Runtime:** Node.js (LTS) & npm
- **Validasi:** `class-validator` & `class-transformer`
- **Konfigurasi Global:**
  - Global Prefix: `/api` (`http://localhost:3000/api`)
  - Global Pipe: `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`

---

## Menjalankan Proyek

1. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

2. **Menjalankan Server (Mode Development):**
   ```bash
   npm run start:dev
   ```

3. **Akses Base URL API:**
   ```text
   http://localhost:3000/api
   ```

---

# BAGIAN 1: Dokumentasi Dasar (Standar UTS)

Bagian ini mendokumentasikan spesifikasi implementasi murni sesuai rubrik penilaian wajib UTS.

### 1.1 Daftar Endpoint Dasar UTS

| Method | Endpoint | Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/equipment` | Menampilkan seluruh inventaris alat dengan filter `category`, pencarian `keyword`, serta paginasi `page` dan `limit`. |
| `GET` | `/api/equipment/:id` | Menampilkan detail data spesifik alat berdasarkan ID numerik. |
| `POST` | `/api/equipment` | Menambahkan unit inventaris alat baru ke dalam sistem. |
| `POST` | `/api/loan-requests` | Mengajukan permohonan pinjam baru (`status: "PENDING"` & timestamp `createdAt` otomatis dari server). |
| `GET` | `/api/loan-requests/:id` | Menampilkan rincian status pengajuan peminjaman berdasarkan ID. |
| `PATCH` | `/api/loan-requests/:id` | Memperbarui pengajuan secara terbatas pada atribut `returnDate` dan/atau `purpose`. |

### 1.2 Ringkasan Aturan Validasi & Seed Data
- **Format Regex:**
  - `assetCode`: Wajib berformat `^LAB-[A-Z]{2}-[0-9]{3}$` (contoh: `LAB-EL-001`, `LAB-NW-001`).
  - `borrowerNim`: Wajib berupa 8–12 digit angka murni (`^[0-9]{8,12}$`).
- **Batasan Nilai:**
  - `stock`: Integer antara `0` hingga `50`.
  - `quantity`: Integer antara `1` hingga `3`.
- **Field Server-Authoritative:**
  - Properti `id`, `status`, dan `createdAt` dikelola seutuhnya oleh sistem dan dilarang dikirim melalui request body.
- **Data Awal (Seed):**
  - Modul `equipment`: 4 item (`LAB-EL-001` Digital Oscilloscope, `LAB-NW-001` MikroTik RouterBoard, `LAB-MM-001` Proyektor Epson, `LAB-OT-001` Toolkit Obeng).
  - Modul `loan-requests`: 2 pengajuan pinjam berstatus `PENDING`.
- Spesifikasi lengkap dapat dibaca pada [PRD.md](file:///c:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md) dan [API-contract.md](file:///c:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/API-contract.md).

### 1.3 Struktur Proyek Dasar UTS

```text
src/
├── equipment/
│   ├── dto/
│   │   ├── create-equipment.dto.ts
│   │   ├── update-equipment.dto.ts
│   │   └── find-equipment-query.dto.ts
│   ├── equipment.interface.ts
│   ├── equipment.controller.ts
│   ├── equipment.service.ts
│   └── equipment.module.ts
├── loan-requests/
│   ├── dto/
│   │   ├── create-loan-request.dto.ts
│   │   ├── update-loan-request.dto.ts
│   │   └── find-loan-request-query.dto.ts
│   ├── loan-request.interface.ts
│   ├── loan-requests.controller.ts
│   ├── loan-requests.service.ts
│   └── loan-requests.module.ts
├── app.module.ts
└── main.ts
```

---

# BAGIAN 2: PRD & Dokumentasi Pengembangan (Fitur Tambahan / Evaluasi)

Bagian ini memaparkan evaluasi teknis terhadap celah pada implementasi dasar UTS beserta rancangan pengembangan fitur tambahan (*extended features*).

### 2.1 Latar Belakang & Evaluasi Celah
Berdasarkan tinjauan arsitektur sistem dasar UTS, ditemukan beberapa celah operasional yang perlu disempurnakan:
1. **Inkonsistensi Lokasi:** Atribut `location` pada `Equipment` masih berupa string bebas tanpa standardisasi kode ruangan laboratorium.
2. **Ketiadaan Riwayat Pemeliharaan:** Peralatan dengan kondisi `MINOR_DAMAGE` atau `NEEDS_REPAIR` belum memiliki modul khusus untuk mencatat jadwal servis, tingkat keparahan (*severity*), dan status perbaikan.
3. **Validasi Relasional Tanggal:** Decorator standar `@IsDateString()` tidak mampu membandingkan tanggal pinjam dan tanggal kembali, sehingga berpotensi menerima tanggal pengembalian yang lebih lampau dibanding tanggal peminjaman.
4. **Kelengkapan Operasi CRUD:** Versi dasar belum menyediakan aksi pengeditan/penghapusan master alat dan pencarian seluruh daftar pengajuan.

### 2.2 PRD Mini Fitur Tambahan
- **Tujuan & Manfaat:** Menyediakan ekosistem manajemen laboratorium yang terpadu, mencegah inkonsistensi lokasi fisik alat, memperjelas audit perawatan perangkat, dan mencegah kesalahan input kronologi tanggal pinjam.
- **Aktor yang Diuntungkan:**
  - *Petugas Lab / Teknisi:* Memiliki visibilitas penuh terhadap status ruangan dan jadwal perawatan unit alat rusak.
  - *Peminjam:* Memperoleh kepastian ketersediaan alat dan perlindungan dari kesalahan input tanggal peminjaman.
- **Functional Requirements Tambahan:**
  - `FR-EXT-01`: Sistem dapat mengelola data ruang laboratorium (`/api/labs`) beserta kapasitas dan penanggung jawab (PIC).
  - `FR-EXT-02`: Sistem memvalidasi kode ruang lab terstandar (`ROOM-[A-Z]{2}-[0-9]{2}`) dan kapasitas bernilai 5–100.
  - `FR-EXT-03`: Sistem dapat mencatat laporan kerusakan / perawatan alat (`/api/maintenance-logs`) yang tertaut pada `assetCode`.
  - `FR-EXT-04`: Sistem menyediakan endpoint khusus pembaruan status pemeliharaan menjadi selesai (`PATCH /api/maintenance-logs/:id/resolve`).
  - `FR-EXT-05`: Sistem secara otomatis menolak pengajuan pinjam jika `returnDate < startDate` melalui *custom cross-field validator* `@IsAfterOrEqualDate`.
  - `FR-EXT-06`: Sistem menyediakan endpoint `PATCH /api/equipment/:id`, `DELETE /api/equipment/:id`, dan `GET /api/loan-requests` dengan query filter status.
- **Aturan Bisnis Tambahan:**
  - Format kode ruangan laboratorium wajib regex `^ROOM-[A-Z]{2}-[0-9]{2}$` (contoh: `ROOM-EL-01`).
  - Status laporan perawatan (`OPEN`, `IN_PROGRESS`, `RESOLVED`) dikelola sistem; pembaruan menjadi `RESOLVED` hanya dapat dipicu via endpoint `/resolve`.
  - Aturan `returnDate >= startDate` diuji dengan membandingkan nilai *epoch millisecond* kedua atribut tanggal pada validator level class.

### 2.3 Daftar Endpoint Tambahan

#### A. Ruang Laboratorium (`/api/labs`)
| Method | Endpoint | Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/labs` | Menampilkan daftar ruang lab dengan filter `status`, pencarian `keyword`, dan paginasi. |
| `GET` | `/api/labs/:id` | Menampilkan informasi detail satu ruang laboratorium. |
| `POST` | `/api/labs` | Mendaftarkan ruang laboratorium baru ke sistem. |
| `PATCH` | `/api/labs/:id` | Memperbarui data ruangan (kapasitas, nama, gedung, PIC, status). |
| `DELETE` | `/api/labs/:id` | Menghapus ruang laboratorium dari sistem. |

#### B. Catatan Perawatan (`/api/maintenance-logs`)
| Method | Endpoint | Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/maintenance-logs` | Menampilkan catatan perawatan (filter `status`, `severity`, `assetCode`, dan paginasi). |
| `GET` | `/api/maintenance-logs/:id` | Menampilkan rincian laporan perawatan spesifik. |
| `POST` | `/api/maintenance-logs` | Membuat laporan kerusakan baru (`status: "OPEN"` otomatis dari server). |
| `PATCH` | `/api/maintenance-logs/:id` | Memperbarui deskripsi masalah, tingkat keparahan, atau tanggal jadwal servis. |
| `PATCH` | `/api/maintenance-logs/:id/resolve` | Menyelesaikan proses perawatan (`status` otomatis diubah menjadi `RESOLVED`). |

#### C. Endpoint Pelengkap Modul Dasar
| Method | Endpoint | Fungsi |
| :--- | :--- | :--- |
| `PATCH` | `/api/equipment/:id` | Memperbarui data inventaris alat yang sudah ada. |
| `DELETE` | `/api/equipment/:id` | Menghapus data alat dari inventaris memori. |
| `GET` | `/api/loan-requests` | Menampilkan seluruh daftar pengajuan pinjam (filter `status`, `borrowerNim`, dan paginasi). |

### 2.4 Status Data

| Entitas | Nilai Status yang Berlaku |
| :--- | :--- |
| `Equipment` (Kondisi) | `GOOD`, `MINOR_DAMAGE`, `NEEDS_REPAIR` |
| `LoanRequest` | `PENDING`, `APPROVED`, `REJECTED`, `RETURNED` |
| `Lab` | `ACTIVE`, `UNDER_MAINTENANCE`, `CLOSED` |
| `MaintenanceLog` | `OPEN`, `IN_PROGRESS`, `RESOLVED` |

### 2.5 Contoh Request dan Response (Fitur Tambahan)

#### 1. Tambah Ruang Laboratorium (`POST /api/labs`)
**Request:**
```http
POST /api/labs HTTP/1.1
Content-Type: application/json

{
  "labCode": "ROOM-NW-02",
  "name": "Laboratorium Cloud & Cybersecurity",
  "building": "Gedung C Lt. 2",
  "capacity": 35,
  "picName": "Agung Dea Yulaksana",
  "status": "ACTIVE"
}
```
**Response (`201 Created`):**
```json
{
  "id": 4,
  "labCode": "ROOM-NW-02",
  "name": "Laboratorium Cloud & Cybersecurity",
  "building": "Gedung C Lt. 2",
  "capacity": 35,
  "picName": "Agung Dea Yulaksana",
  "status": "ACTIVE"
}
```

#### 2. Buat Laporan Kerusakan Alat (`POST /api/maintenance-logs`)
**Request:**
```http
POST /api/maintenance-logs HTTP/1.1
Content-Type: application/json

{
  "assetCode": "LAB-MM-001",
  "reportedBy": "Roby Rachmat Firdaus",
  "issueDescription": "Kipas pendingin mati saat proyektor menyala 10 menit",
  "severity": "HIGH",
  "scheduledDate": "2026-11-28"
}
```
**Response (`201 Created`):**
```json
{
  "id": 3,
  "assetCode": "LAB-MM-001",
  "reportedBy": "Roby Rachmat Firdaus",
  "issueDescription": "Kipas pendingin mati saat proyektor menyala 10 menit",
  "severity": "HIGH",
  "status": "OPEN",
  "scheduledDate": "2026-11-28",
  "createdAt": "2026-11-23T06:51:20.000Z"
}
```

#### 3. Tandai Perawatan Selesai (`PATCH /api/maintenance-logs/:id/resolve`)
**Request:**
```http
PATCH /api/maintenance-logs/1/resolve HTTP/1.1
```
**Response (`200 OK`):**
```json
{
  "id": 1,
  "assetCode": "LAB-MM-001",
  "reportedBy": "Petugas Lab",
  "issueDescription": "Lampu indikator berkedip merah terus menerus",
  "severity": "MEDIUM",
  "status": "RESOLVED",
  "scheduledDate": "2026-11-28",
  "createdAt": "2026-11-20T08:00:00.000Z"
}
```

#### 4. Penolakan Tanggal Lintas-Field (`POST /api/loan-requests` dengan `returnDate < startDate`)
**Request:**
```json
{
  "borrowerNim": "240414015",
  "borrowerName": "Roby Rachmat Firdaus",
  "borrowerEmail": "roby.firdaus@student.lpkia.ac.id",
  "assetCode": "LAB-EL-001",
  "quantity": 1,
  "startDate": "2026-11-28",
  "returnDate": "2026-11-25",
  "purpose": "Praktikum mandiri pengukuran sinyal osiloskop sinyal AC"
}
```
**Response (`400 Bad Request`):**
```json
{
  "message": [
    "returnDate must be equal to or after startDate"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 2.6 Tabel Status Code HTTP

| Status Code | Kondisi Penggunaan |
| :--- | :--- |
| `200 OK` | Request `GET`, `PATCH`, atau `DELETE` berhasil diproses. |
| `201 Created` | Request `POST` berhasil memvalidasi data dan membuat entitas baru. |
| `400 Bad Request` | Validasi DTO gagal, regex tidak cocok, properti terlarang disisipkan, atau validasi tanggal lintas-field gagal. |
| `404 Not Found` | Resource dengan `id` yang diminta tidak ditemukan pada *in-memory array*. |

### 2.7 Struktur Proyek Lengkap

```text
Project-untuk-UTS/
├── src/
│   ├── common/
│   │   └── validators/
│   │       └── is-after-or-equal-date.validator.ts
│   ├── equipment/
│   │   ├── dto/
│   │   │   ├── create-equipment.dto.ts
│   │   │   ├── update-equipment.dto.ts
│   │   │   └── find-equipment-query.dto.ts
│   │   ├── equipment.interface.ts
│   │   ├── equipment.controller.ts
│   │   ├── equipment.service.ts
│   │   └── equipment.module.ts
│   ├── loan-requests/
│   │   ├── dto/
│   │   │   ├── create-loan-request.dto.ts
│   │   │   ├── update-loan-request.dto.ts
│   │   │   └── find-loan-request-query.dto.ts
│   │   ├── loan-request.interface.ts
│   │   ├── loan-requests.controller.ts
│   │   ├── loan-requests.service.ts
│   │   └── loan-requests.module.ts
│   ├── labs/
│   │   ├── dto/
│   │   │   ├── create-lab.dto.ts
│   │   │   ├── update-lab.dto.ts
│   │   │   └── find-lab-query.dto.ts
│   │   ├── lab.interface.ts
│   │   ├── labs.controller.ts
│   │   ├── labs.service.ts
│   │   └── labs.module.ts
│   ├── maintenance-logs/
│   │   ├── dto/
│   │   │   ├── create-maintenance-log.dto.ts
│   │   │   ├── update-maintenance-log.dto.ts
│   │   │   └── find-maintenance-log-query.dto.ts
│   │   ├── maintenance-log.interface.ts
│   │   ├── maintenance-logs.controller.ts
│   │   ├── maintenance-logs.service.ts
│   │   └── maintenance-logs.module.ts
│   ├── app.module.ts
│   └── main.ts
├── PRD.md
├── API-contract.md
├── postman_collection.json
├── README.md
├── nest-cli.json
├── tsconfig.json
└── package.json
```
