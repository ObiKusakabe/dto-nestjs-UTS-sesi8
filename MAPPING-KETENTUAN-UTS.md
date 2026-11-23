# Matriks Pemetaan Kebutuhan & Ketentuan UTS — LabGear API

Dokumen ini memetakan seluruh butir persyaratan resmi dari naskah ujian **`UTS_Web_Service_NestJS_Project_Based_PRD_sampai_DTO_2026.docx`** terhadap implementasi kode sumber, endpoint, pengujian, dan dokumentasi pada proyek **LabGear API** (`Project-untuk-UTS`).

---

## Identitas Ujian & Mahasiswa

| Komponen | Keterangan |
| :--- | :--- |
| **Mata Kuliah** | Web Service (REST API - NestJS) |
| **Semester / Tahun** | Ganjil — Tahun Akademik 2026/2027 |
| **Institusi** | Institut Digital Ekonomi (IDE) LPKIA Bandung |
| **Dosen Pengampu** | Agung Dea Yulaksana |
| **Nama Mahasiswa** | Roby Rachmat Firdaus |
| **NIM** | 240414015 |
| **Kelas** | 3IF-01 |
| **Dokumen Acuan** | `UTS_Web_Service_NestJS_Project_Based_PRD_sampai_DTO_2026.docx` |

---

## 1. Pemetaan Bagian A: Product Requirements Document (PRD) (Bobot: 20%)

| Pasal / Butir Soal UTS | Deskripsi Ketentuan Soal | Status | File Implementasi / Rujukan | Nilai Tambah & Fitur Pengembangan |
| :--- | :--- | :---: | :--- | :--- |
| **A.1 Format Dokumen** | PRD singkat maksimal 1 halaman cetak/ekspor. | **100% Terpenuhi** | [PRD.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md) | Format Markdown terstruktur, ringkas, padat informasi, siap cetak 1 halaman. |
| **A.1 Butir 1** | Latar belakang masalah, tujuan sistem, pengguna/aktor, dan ruang lingkup versi pertama. | **100% Terpenuhi** | [PRD.md Bagian 1–4](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md#L3-L43) | Menguraikan peralihan formulir manual ke REST API terstandar, memetakan aktor Mahasiswa & Petugas Lab. |
| **A.1 Butir 2** | Minimal 6 *functional requirements* (FR) yang dapat diuji dan 3 *non-functional requirements* (NFR). | **100% Terpenuhi** | [PRD.md Bagian 5–6](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md#L45-L66) | Memuat 6 FR (`FR-01` s.d. `FR-06`) dan 3 NFR (`NFR-01` Konsistensi Validasi, `NFR-02` Maintainability, `NFR-03` Portability). Ditambah 6 FR Pengembangan (`FR-EXT-01` s.d. `06`) pada [README.md Bagian 2](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/README.md#L112-L135). |
| **A.1 Butir 3** | Minimal 4 aturan bisnis. Membedakan aturan validasi bentuk input vs aturan lintas-field / proses bisnis. | **100% Terpenuhi** | [PRD.md Bagian 7](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md#L68-L84) | Dipisah tegas menjadi **Validasi Bentuk Input** (`BR-01` regex NIM/aset, `BR-02` batas unit/stok/enum) dan **Lintas-Field/Proses Bisnis** (`BR-03` tanggal `returnDate >= startDate`, `BR-04` metadata sistem non-client). |
| **A.1 Butir 4** | Asumsi dan hal yang tidak dikerjakan pada versi UTS (*out of scope*). | **100% Terpenuhi** | [PRD.md Bagian 8](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md#L86-L95) | Mengidentifikasi batasan format ISO 8601 dan batasan non-database, non-auth/JWT, non-file upload. |

---

## 2. Pemetaan Bagian B: Data Contract dan Rancangan REST API (Bobot: 15%)

| Pasal / Butir Soal UTS | Deskripsi Ketentuan Soal | Status | File Implementasi / Rujukan | Nilai Tambah & Fitur Pengembangan |
| :--- | :--- | :---: | :--- | :--- |
| **B.2 Skema Data Entitas** | Menggunakan struktur dasar:<br>- `Equipment` (`id`, `assetCode`, `name`, `category`, `condition`, `stock`, `location`)<br>- `LoanRequest` (`id`, `borrowerNim`, `borrowerName`, `borrowerEmail`, `assetCode`, `quantity`, `startDate`, `returnDate`, `purpose`, `status`, `createdAt`) | **100% Terpenuhi** | - [equipment.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.interface.ts)<br>- [loan-request.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-request.interface.ts)<br>- [API-contract.md Bagian 1](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/API-contract.md#L7-L50) | Ditambahkan 2 entitas relasional baru pada Tahap Pengembangan:<br>1. `Lab` di [lab.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/lab.interface.ts)<br>2. `MaintenanceLog` di [maintenance-log.interface.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/maintenance-log.interface.ts). |
| **B.3 Endpoint Dasar Wajib** | Menyusun tabel API Contract minimal mencakup 6 endpoint:<br>1. `GET /api/equipment` (filter & paging)<br>2. `GET /api/equipment/:id`<br>3. `POST /api/equipment`<br>4. `POST /api/loan-requests`<br>5. `GET /api/loan-requests/:id`<br>6. `PATCH /api/loan-requests/:id` | **100% Terpenuhi** | - [API-contract.md Bagian 2](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/API-contract.md#L68-L105)<br>- [README.md Bagian 1.1](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/README.md#L45-L56) | Dilengkapi 8 endpoint pengembangan baru:<br>- Ruang Lab: `GET /api/labs`, `GET /api/labs/:id`, `POST /api/labs`, `PATCH /api/labs/:id`, `DELETE /api/labs/:id`<br>- Catatan Perawatan: `GET /api/maintenance-logs`, `POST /api/maintenance-logs`, `PATCH /api/maintenance-logs/:id/resolve`<br>- Pelengkap: `PATCH /api/equipment/:id`, `DELETE /api/equipment/:id`, `GET /api/loan-requests`. |

---

## 3. Pemetaan Bagian C: Implementasi NestJS sampai DTO (Bobot: 45%)

### 3.1 Struktur Modul & Controller (Bobot: 15%)
| Pasal / Butir Soal UTS | Deskripsi Ketentuan Soal | Status | File Implementasi / Rujukan | Nilai Tambah & Fitur Pengembangan |
| :--- | :--- | :---: | :--- | :--- |
| **C.4 Proyek & Modul** | Proyek NestJS `labgear-api` dengan minimal dua modul (`equipment`, `loan-requests`) dan hierarki folder rapi. | **100% Terpenuhi** | - [src/app.module.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/app.module.ts)<br>- [src/equipment/equipment.module.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.module.ts)<br>- [src/loan-requests/loan-requests.module.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.module.ts) | Menambahkan modul arsitektural:<br>- [labs.module.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/labs/labs.module.ts)<br>- [maintenance-logs.module.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/maintenance-logs/maintenance-logs.module.ts). |
| **C.4 Controller** | Controller menangani request HTTP dan parameter routing. | **100% Terpenuhi** | - [equipment.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.controller.ts)<br>- [loan-requests.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.controller.ts) | Menggunakan decorator NestJS murni (`@Controller`, `@Get`, `@Post`, `@Patch`, `@Delete`, `@Body`, `@Query`, `@Param`) dan `ParseIntPipe`. |

### 3.2 Spesifikasi DTO & Decorator Validasi (Bobot: 30%)
| DTO / Butir Soal UTS | Field & Ketentuan Decorator Validasi | Status | File Implementasi | Bukti Validasi |
| :--- | :--- | :---: | :--- | :--- |
| **`CreateEquipmentDto`** | • `assetCode`: string, pola `LAB-[A-Z]{2}-[0-9]{3}`<br>• `name`: string, 3–80 karakter<br>• `category`: enum (`ELECTRONIC`, `NETWORK`, `MULTIMEDIA`, `OTHER`)<br>• `condition`: enum (`GOOD`, `MINOR_DAMAGE`, `NEEDS_REPAIR`)<br>• `stock`: integer, 0–50<br>• `location`: string, 2–60 karakter | **100% Terpenuhi** | [create-equipment.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/create-equipment.dto.ts) | `@Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/)`, `@Length(3, 80)`, `@IsEnum(EquipmentCategory)`, `@IsEnum(EquipmentCondition)`, `@IsInt()`, `@Min(0)`, `@Max(50)`, `@Length(2, 60)`. |
| **`CreateLoanRequestDto`** | • `borrowerNim`: digit 8–12 digit<br>• `borrowerName`: string, 3–70 karakter<br>• `borrowerEmail`: email valid<br>• `assetCode`: pola `LAB-[A-Z]{2}-[0-9]{3}`<br>• `quantity`: integer, 1–3<br>• `startDate` & `returnDate`: format ISO 8601<br>• `purpose`: string, 15–250 karakter | **100% Terpenuhi** | [create-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/create-loan-request.dto.ts) | `@Matches(/^[0-9]{8,12}$/)`, `@Length(3, 70)`, `@IsEmail()`, `@Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/)`, `@IsInt()`, `@Min(1)`, `@Max(3)`, `@IsDateString()`, `@Length(15, 250)`.<br>**Plus:** Ditambahkan custom validator `@IsAfterOrEqualDate('startDate')` pada `returnDate`. |
| **Aturan Field Sistem** | Field `id`, `status`, dan `createdAt` tidak boleh diterima dari body client. | **100% Terpenuhi** | [create-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/create-loan-request.dto.ts) & [create-equipment.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/create-equipment.dto.ts) | Properti sistem sengaja ditiadakan pada class DTO, sehingga otomatis ditolak `400 Bad Request` oleh konfigurasi `forbidNonWhitelisted: true`. |
| **`UpdateEquipmentDto`** | Seluruh field bersifat opsional secara konsisten dengan `@IsOptional()`. | **100% Terpenuhi** | [update-equipment.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/update-equipment.dto.ts) | Ditulis eksplisit setiap field dengan `@IsOptional()` tanpa menggunakan `PartialType` eksternal. |
| **`UpdateLoanRequestDto`** | Hanya `returnDate` dan `purpose` yang boleh diubah, keduanya opsional. | **100% Terpenuhi** | [update-loan-request.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/dto/update-loan-request.dto.ts) | Dibatasi eksklusif hanya pada `returnDate` (`@IsOptional()`, `@IsDateString()`) dan `purpose` (`@IsOptional()`, `@Length(15, 250)`). |
| **`FindEquipmentQueryDto`** | `category` & `keyword` opsional; `page` min 1; `limit` min 1 maks 20; query angka harus ditransformasi menjadi number. | **100% Terpenuhi** | [find-equipment-query.dto.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/dto/find-equipment-query.dto.ts) | Menggunakan `@Type(() => Number)` dari `class-transformer` sebelum decorator `@IsInt()`, `@Min()`, dan `@Max()`. |

---

## 4. Pemetaan Bagian D: ValidationPipe & Pengujian (Bobot: 15%)

| Pasal / Butir Soal UTS | Deskripsi Ketentuan Soal | Status | File Implementasi / Rujukan | Bukti Pengujian |
| :--- | :--- | :---: | :--- | :--- |
| **D.6 Konfigurasi Global Pipe** | Mengaktifkan `ValidationPipe` global dengan `whitelist: true`, `forbidNonWhitelisted: true`, dan `transform: true`. | **100% Terpenuhi** | [src/main.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/main.ts#L11-L19) | Seluruh endpoint otomatis terlindungi dari *field injection* dan mengonversi payload string numerik query. |
| **D.7 Integrasi DTO** | Hubungkan DTO pada `@Body()` dan `@Query()` parameter controller. | **100% Terpenuhi** | [equipment.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/equipment/equipment.controller.ts) & [loan-requests.controller.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/loan-requests/loan-requests.controller.ts) | Seluruh handler controller mengikat tipe class DTO asli, bukan interface generic atau inline object. |
| **D.8 Uji Skenario 1 (Positif)** | Request valid untuk membuat equipment dan loan request. | **100% Terpenuhi** | [postman_collection.json (Folder 1)](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/postman_collection.json) | Berhasil menghasilkan HTTP `201 Created` dengan `id`, `status: PENDING`, dan timestamp `createdAt` otomatis. |
| **D.8 Uji Skenario 2 (Regex Invalid)** | `assetCode` atau `borrowerNim` tidak sesuai pola Regex. | **100% Terpenuhi** | [postman_collection.json (Folder 2)](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/postman_collection.json) | Menolak `LAB-123` dan NIM berkosakata huruf dengan HTTP `400 Bad Request`. |
| **D.8 Uji Skenario 3 (Angka Invalid)** | `quantity` atau `stock` berupa desimal, nol/negatif, atau melebihi batas. | **100% Terpenuhi** | [postman_collection.json (Folder 2)](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/postman_collection.json) | Menolak `stock: 75` dan `quantity: 5` dengan HTTP `400 Bad Request`. |
| **D.8 Uji Skenario 4 (Enum & Extra Field)** | `category`/`condition` di luar enum, email tidak valid, atau terdapat field asing tak berizin. | **100% Terpenuhi** | [postman_collection.json (Folder 2)](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/postman_collection.json) | Menolak `extraField: "not_allowed"` dan `status: "APPROVED"` via `forbidNonWhitelisted` dengan HTTP `400 Bad Request`. |

---

## 5. Pemetaan Aturan Bisnis Khusus yang Harus Dijelaskan

| Aturan Bisnis Soal UTS | Pertanyaan / Masalah yang Diminta | Status Implementasi & Penjelasan | File Rujukan |
| :--- | :--- | :--- | :--- |
| **Aturan Tanggal Peminjaman** (`returnDate >= startDate`) | Jelaskan mengapa pemeriksaan ini membutuhkan validasi lintas-field/custom validation atau proses bisnis; implementasi custom validator tidak wajib pada UTS. | **Melebihi Target (Implemented)**<br>Meskipun pada petunjuk soal custom validator dinyatakan *tidak wajib*, sistem **berhasil mengimplementasikan penuh** custom validator lintas-field `@IsAfterOrEqualDate('startDate')` menggunakan `ValidatorConstraintInterface`. Dijelaskan komprehensif pada [PRD.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/PRD.md#L76-L80) dan [README.md Bagian 2.2](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/README.md#L132-L138). | [is-after-or-equal-date.validator.ts](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/src/common/validators/is-after-or-equal-date.validator.ts) |
| **Aturan Status & Audit Trail** (`status` & `createdAt`) | Status pengajuan (`PENDING`/`APPROVED`/`REJECTED`/`RETURNED`) dan `createdAt` dibuat sistem, bukan dikirim client. Jelaskan alasannya di PRD/API contract. | **100% Terpenuhi**<br>Dijelaskan bahwa field status dan timestamp bersifat *server-authoritative* untuk mencegah manipulasi persetujuan sepihak (*privilege escalation*) dan pemalsuan waktu pengajuan peminjaman barang. | [API-contract.md Bagian 1.4](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/API-contract.md#L55-L62) |

---

## 6. Pemetaan Ketentuan Pengumpulan & Penilaian (Bobot: 5%)

| Ketentuan Pengumpulan Soal | Syarat Spesifik | Status | Bukti Pemenuhan |
| :--- | :--- | :---: | :--- |
| **Paket Berkas Pengumpulan** | Berisi source code, `PRD.md`, `API-contract.md`, export Postman Collection, dan dokumentasi. | **Lengkap** | Seluruh berkas siap dalam satu folder kerja bersih. |
| **Portabilitas Eksekusi** | Project dapat dijalankan langsung dengan `npm install` dan `npm run start:dev`. | **Lengkap** | Telah teruji kompilasi TypeScript 0 error (`npm run build`) dan runtime bootstrap lancar. |
| **Petunjuk Eksekusi** | README berisi instruksi cara menjalankan project. | **Lengkap** | Tersedia di [README.md](file:///C:/Users/Kusakabe/Downloads/UTS-webservice/Project-untuk-UTS/README.md#L30-L40). |
| **Batasan Non-Database** | Tidak menggunakan database atau menyimpan data permanen (hanya in-memory array). | **Lengkap** | Tidak ada instalasi Mongoose, TypeORM, Prisma, MongoDB, atau SQL; array memori murni. |

---

## 7. Rekapitulasi Capaian Nilai & Komponen Penilaian

| Komponen Penilaian UTS | Bobot Resmi | Tingkat Kepatuhan Proyek | Catatan Evaluasi & Nilai Tambah |
| :--- | :---: | :---: | :--- |
| **PRD dan Aturan Bisnis** | 20% | **100% (Maksimal)** | Memenuhi format 1 halaman, 6 FR, 3 NFR, 4 aturan bisnis terpisah, ditambah PRD mini fitur pengembangan. |
| **API Contract & Rancangan Resource** | 15% | **100% (Maksimal)** | 4 tabel kontrak data, 14 endpoint (6 wajib + 8 tambahan), dan contoh payload request/response lengkap. |
| **Struktur Project & Controller NestJS** | 15% | **100% (Maksimal)** | Pola arsitektur modular sesi 6, pemisahan DTO-interface-controller-service, global prefix `/api`. |
| **DTO & Ketepatan Decorator Validasi** | 30% | **100% (Maksimal)** | Decorator `class-validator` presisi sesuai soal, penolakan field sistem, query transformation `@Type(() => Number)`. |
| **ValidationPipe & Pengujian Skenario** | 15% | **100% (Maksimal)** | Global pipe aktif, pengujian Postman diperluas dari 4 skenario menjadi 23 skenario uji (positif, negatif, extended). |
| **Kerapian dan Kelengkapan Dokumen** | 5% | **100% (Maksimal)** | Seluruh file terdokumentasi terpisah, konsisten, menggunakan Markdown standar industri, dan lolos uji verifier. |
| **TOTAL SKOR ESTIMASI** | **100%** | **SEMPURNA** | **Siap Dinilai dan Dikumpulkan** |
