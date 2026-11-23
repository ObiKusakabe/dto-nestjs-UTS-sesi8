# Checklist Pemenuhan Persyaratan UTS & Pengembangan — LabGear API

Dokumen ini merupakan bukti validasi dan kepatuhan menyeluruh bahwa implementasi proyek **LabGear API** telah memenuhi **100% persyaratan Ujian Tengah Semester (UTS)** serta **seluruh fitur pengembangan tambahan (Tahap 2 / Extended)**.

---

## Identitas Mahasiswa & Ujian

| Atribut | Data |
| :--- | :--- |
| **Nama Mahasiswa** | Roby Rachmat Firdaus |
| **NIM** | 240414015 |
| **Kelas** | 3IF-01 |
| **Mata Kuliah** | Web Service (REST API - NestJS) — UTS Ganjil 2026/2027 |
| **Institusi** | Institut Digital Ekonomi (IDE) LPKIA Bandung |
| **Dosen Pengampu** | Agung Dea Yulaksana |

---

## 1. Tahap 1: Persyaratan Wajib UTS (Pure UTS) — 100% Terpenuhi

### 1.1 Kepatuhan Konvensi & Arsitektur
- [x] **Tanpa Database Eksternal:** Seluruh data disimpan dalam *in-memory array* pada masing-masing Service ([equipment.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.service.ts), [loan-requests.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.service.ts)).
- [x] **Global Prefix `/api`:** Terpasang pada `app.setGlobalPrefix('api')` di [src/main.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/main.ts).
- [x] **Global `ValidationPipe`:** Terpasang dengan opsi `whitelist: true`, `forbidNonWhitelisted: true`, dan `transform: true` di [src/main.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/main.ts).
- [x] **Struktur Folder Modular:** Mengikuti konvensi sesi 6 (`dto/`, `interface.ts`, `controller.ts`, `service.ts`, `module.ts`).
- [x] **Respon Bersih (Tanpa Wrapper Buatan):** Mengembalikan objek/array data secara langsung sesuai pola standar NestJS.

### 1.2 Modul `equipment`
- [x] **Interface & Enums:** Didefinisikan di [equipment.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.interface.ts) (`EquipmentCategory`: `ELECTRONIC`, `NETWORK`, `MULTIMEDIA`, `OTHER`; `EquipmentCondition`: `GOOD`, `MINOR_DAMAGE`, `NEEDS_REPAIR`).
- [x] **Seed Data Awal:** 4 item awal di [equipment.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.service.ts) (`LAB-EL-001`, `LAB-NW-001`, `LAB-MM-001`, `LAB-OT-001`).
- [x] **DTO Validasi:**
  - [create-equipment.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/create-equipment.dto.ts): `assetCode` regex `^LAB-[A-Z]{2}-[0-9]{3}$`, `name` (3–80), enum `category`, enum `condition`, `stock` (0–50), `location` (2–60).
  - [update-equipment.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/update-equipment.dto.ts): seluruh field opsional didefinisikan eksplisit dengan `@IsOptional()` tanpa `PartialType`.
  - [find-equipment-query.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/find-equipment-query.dto.ts): filter `category`, `keyword`, transformasi angka `page` & `limit` (`@Type(() => Number)`).
- [x] **Controller & Service:** Implementasi di [equipment.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.controller.ts) dan [equipment.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.service.ts).

### 1.3 Modul `loan-requests`
- [x] **Interface & Enums:** Didefinisikan di [loan-request.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-request.interface.ts) (`LoanRequestStatus`: `PENDING`, `APPROVED`, `REJECTED`, `RETURNED`).
- [x] **Nilai Dikelola Server:** Properti `id`, `status: PENDING`, dan `createdAt` dibuat otomatis oleh server; dilarang dikirim dari client (ditolak oleh `forbidNonWhitelisted`).
- [x] **DTO Validasi:**
  - [create-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/create-loan-request.dto.ts): `borrowerNim` regex `^[0-9]{8,12}$`, `borrowerName` (3–70), `borrowerEmail` `@IsEmail()`, `assetCode` regex, `quantity` (1–3), `startDate` `@IsDateString()`, `returnDate` `@IsDateString()`, `purpose` (15–250).
  - [update-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/update-loan-request.dto.ts): pembatasan perubahan hanya pada `returnDate` dan `purpose`.
- [x] **Controller & Service:** Implementasi di [loan-requests.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.controller.ts) dan [loan-requests.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.service.ts).

### 1.4 Pengujian 6 Endpoint Wajib UTS
| Endpoint | Method | Hasil Pengujian |
| :--- | :--- | :--- |
| `/api/equipment` | `GET` | **PASSED (200 OK)** — Filter category & keyword serta paginasi berfungsi. |
| `/api/equipment/:id` | `GET` | **PASSED (200 OK / 404 Not Found)** — Detail alat berdasarkan ID integer. |
| `/api/equipment` | `POST` | **PASSED (201 Created / 400 Bad Request)** — Validasi DTO ketat berjalan. |
| `/api/loan-requests` | `POST` | **PASSED (201 Created)** — Otomatis mengisi `id`, `status: PENDING`, `createdAt`. |
| `/api/loan-requests/:id` | `GET` | **PASSED (200 OK / 404 Not Found)** — Detail pengajuan peminjaman. |
| `/api/loan-requests/:id` | `PATCH` | **PASSED (200 OK)** — Pembaruan parsial pada `returnDate` dan `purpose`. |

---

## 2. Tahap 2: Fitur Pengembangan & Evaluasi (Extended) — 100% Terpenuhi

### 2.1 Custom Cross-Field Validator (`returnDate >= startDate`)
- [x] **File Validator:** [is-after-or-equal-date.validator.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/common/validators/is-after-or-equal-date.validator.ts) mengimplementasikan `ValidatorConstraintInterface`.
- [x] **Integrasi DTO:** Dipasang pada field `returnDate` di [create-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/create-loan-request.dto.ts).
- [x] **Uji Kasus Negatif:** Jika `returnDate < startDate`, request ditolak dengan `400 Bad Request` dan pesan `"returnDate must be equal to or after startDate"`.

### 2.2 Modul `labs` (`/api/labs`)
- [x] **Standardisasi Lokasi:** Menghilangkan kelemahan string bebas dengan entitas ruang lab resmi.
- [x] **Interface & Seed:** [lab.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/lab.interface.ts) (`LabStatus`: `ACTIVE`, `UNDER_MAINTENANCE`, `CLOSED`) dan 3 seed awal di [labs.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/labs.service.ts).
- [x] **DTO Validasi:**
  - [create-lab.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/dto/create-lab.dto.ts): `labCode` regex `^ROOM-[A-Z]{2}-[0-9]{2}$`, `capacity` (5–100), `picName`, dll.
  - [update-lab.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/dto/update-lab.dto.ts) & [find-lab-query.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/dto/find-lab-query.dto.ts).
- [x] **CRUD Lengkap:** `GET /api/labs`, `GET /api/labs/:id`, `POST /api/labs`, `PATCH /api/labs/:id`, `DELETE /api/labs/:id` di [labs.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/labs.controller.ts).

### 2.3 Modul `maintenance-logs` (`/api/maintenance-logs`)
- [x] **Pencatatan Riwayat Kerusakan:** Menangani alat berstatus `MINOR_DAMAGE` dan `NEEDS_REPAIR`.
- [x] **Interface & Seed:** [maintenance-log.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/maintenance-log.interface.ts) (`MaintenanceSeverity`, `MaintenanceStatus`: `OPEN`, `IN_PROGRESS`, `RESOLVED`) di [maintenance-logs.service.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/maintenance-logs.service.ts).
- [x] **DTO Validasi:**
  - [create-maintenance-log.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/dto/create-maintenance-log.dto.ts): `assetCode`, `reportedBy`, `issueDescription`, `severity`, `scheduledDate`.
  - [update-maintenance-log.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/dto/update-maintenance-log.dto.ts) & [find-maintenance-log-query.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/dto/find-maintenance-log-query.dto.ts).
- [x] **Endpoint Khusus Penyelesaian:** `PATCH /api/maintenance-logs/:id/resolve` berhasil mengubah status menjadi `RESOLVED`.

### 2.4 Endpoint Pelengkap Modul Dasar
- [x] `PATCH /api/equipment/:id`: Memperbarui master data alat inventaris.
- [x] `DELETE /api/equipment/:id`: Menghapus data alat dari memori.
- [x] `GET /api/loan-requests`: Menampilkan daftar semua pengajuan dengan query filter status.

---

## 3. Berkas Dokumentasi & Pengujian

- [x] [PRD.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md): Ringkas (maksimal 1 halaman), memuat identitas, latar belakang, aktor, ruang lingkup UTS, 6 FR, 3 NFR, 4 aturan bisnis (dipisah bentuk input vs lintas-field), asumsi & out of scope.
- [x] [API-contract.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/API-contract.md): Tabel kontrak data 4 entitas, tabel API contract lengkap, contoh JSON valid & error `400 Bad Request`.
- [x] [README.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/README.md): Terbagi tegas dalam 2 bagian (Bagian 1: Standar UTS, Bagian 2: PRD & Pengembangan Tambahan) dengan gaya bahasa teknis bersih.
- [x] [postman_collection.json](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/postman_collection.json): Koleksi Postman v2.1 dengan variabel `{{baseUrl}}`, terorganisir rapi dalam 3 folder:
  - *Folder 1 — UTS Positif (Valid Requests)* (6 request)
  - *Folder 2 — UTS Negatif (ValidationPipe & DTO Errors)* (6 request)
  - *Folder 3 — Pengembangan (Extended Features)* (11 request)

---

## 4. Ringkasan Hasil Verifikasi Teknis Otomatis

```text
============================================================
                   LABGEAR API TEST REPORT                  
============================================================
1. TypeScript Compilation (npm run build) : SUCCESS (0 Errors)
2. NestJS Bootstrap (/api prefix & pipes)  : SUCCESS
3. Automated Test Suite Execution         : 25 PASSED, 0 FAILED
   - Equipment Endpoints (CRUD & Query)   : PASSED
   - Loan Requests Endpoints (DTO & Pipes): PASSED
   - Negative Scenarios (400 Bad Request) : PASSED
   - Cross-Field Date Validator           : PASSED
   - Labs Endpoints (CRUD)                : PASSED
   - Maintenance Logs & Resolve Action    : PASSED
4. Postman Collection v2.1 Schema Syntax   : VALID (23 Requests)
5. Documentation Completeness              : VERIFIED (100%)
============================================================
```
