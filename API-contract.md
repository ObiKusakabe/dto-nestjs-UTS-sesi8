# API Contract & Data Schema — LabGear API

Dokumen ini mendefinisikan kontrak data, spesifikasi antarmuka REST API, serta contoh payload request dan response untuk proyek **LabGear API**.

---

## 1. Data Contract (Entitas Data)

### 1.1 Entitas `Equipment` (Inventaris Alat)

| Atribut | Tipe Data | Aturan Validasi / Format | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Integer positif, auto-increment | Dikelola sistem (tidak diterima pada body) |
| `assetCode` | `string` | Regex `^LAB-[A-Z]{2}-[0-9]{3}$` | Wajib (contoh: `LAB-EL-001`) |
| `name` | `string` | Panjang 3–80 karakter | Wajib |
| `category` | `enum` | `ELECTRONIC`, `NETWORK`, `MULTIMEDIA`, `OTHER` | Wajib |
| `condition` | `enum` | `GOOD`, `MINOR_DAMAGE`, `NEEDS_REPAIR` | Wajib |
| `stock` | `number` | Integer, rentang 0 s.d. 50 | Wajib |
| `location` | `string` | Panjang 2–60 karakter | Wajib |

---

### 1.2 Entitas `LoanRequest` (Pengajuan Peminjaman)

| Atribut | Tipe Data | Aturan Validasi / Format | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Integer positif, auto-increment | Dikelola sistem (tidak diterima pada body) |
| `borrowerNim` | `string` | Regex numerik `^[0-9]{8,12}$` | Wajib (contoh: `240414015`) |
| `borrowerName`| `string` | Panjang 3–70 karakter | Wajib |
| `borrowerEmail`| `string` | Valid format email (`@IsEmail()`) | Wajib |
| `assetCode` | `string` | Regex `^LAB-[A-Z]{2}-[0-9]{3}$` | Wajib |
| `quantity` | `number` | Integer, rentang 1 s.d. 3 | Wajib |
| `startDate` | `string` | Format tanggal ISO 8601 (`YYYY-MM-DD`) | Wajib |
| `returnDate` | `string` | ISO 8601, wajib `>= startDate` | Wajib (divalidasi lintas-field) |
| `purpose` | `string` | Panjang 15–250 karakter | Wajib |
| `status` | `enum` | `PENDING`, `APPROVED`, `REJECTED`, `RETURNED` | Dikelola sistem (default: `PENDING`) |
| `createdAt` | `string` | Format ISO 8601 timestamp | Dikelola sistem (waktu request dibuat) |

---

### 1.3 Entitas `Lab` (Ruang Laboratorium — Extended)

| Atribut | Tipe Data | Aturan Validasi / Format | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Integer positif, auto-increment | Dikelola sistem |
| `labCode` | `string` | Regex `^ROOM-[A-Z]{2}-[0-9]{2}$` | Wajib (contoh: `ROOM-EL-01`) |
| `name` | `string` | Panjang 3–80 karakter | Wajib |
| `building` | `string` | Panjang 2–50 karakter | Wajib |
| `capacity` | `number` | Integer, rentang 5 s.d. 100 | Wajib |
| `picName` | `string` | Panjang 3–70 karakter | Wajib |
| `status` | `enum` | `ACTIVE`, `UNDER_MAINTENANCE`, `CLOSED` | Opsional pada DTO (default: `ACTIVE`) |

---

### 1.4 Entitas `MaintenanceLog` (Catatan Pemeliharaan — Extended)

| Atribut | Tipe Data | Aturan Validasi / Format | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Integer positif, auto-increment | Dikelola sistem |
| `assetCode` | `string` | Regex `^LAB-[A-Z]{2}-[0-9]{3}$` | Wajib merujuk pada kode alat |
| `reportedBy` | `string` | Panjang 3–70 karakter | Wajib |
| `issueDescription` | `string` | Panjang 10–300 karakter | Wajib |
| `severity` | `enum` | `LOW`, `MEDIUM`, `HIGH` | Wajib |
| `status` | `enum` | `OPEN`, `IN_PROGRESS`, `RESOLVED` | Dikelola sistem (default: `OPEN`) |
| `scheduledDate` | `string` | Format tanggal ISO 8601 (`YYYY-MM-DD`) | Wajib |
| `createdAt` | `string` | Format ISO 8601 timestamp | Dikelola sistem (waktu laporan masuk) |

> **Catatan Integritas Data (Server-Authoritative Fields):**  
> Properti `id`, `status` (pada `LoanRequest` dan `MaintenanceLog`), serta `createdAt` tidak diperkenankan ada di dalam `Create*Dto` maupun `Update*Dto`. Karena aplikasi mengaktifkan `ValidationPipe({ forbidNonWhitelisted: true })`, apabila client mencoba mengirim properti tersebut pada request body, sistem secara otomatis menolak request dengan status HTTP `400 Bad Request` (`property ... should not exist`). Aturan ini melindungi integritas alur status agar tidak dapat diubah sepihak oleh pengguna tanpa melalui endpoint otoritatif.

---

## 2. API Contract (Daftar Endpoint)

### 2.1 Modul Standar UTS (`equipment` & `loan-requests`)

| Method | Endpoint | Tujuan | Query / Body DTO | Status HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/equipment` | Mendapatkan daftar peralatan (filter & paginasi) | Query: `category`, `keyword`, `page`, `limit` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/equipment/:id` | Mendapatkan rincian satu alat berdasarkan ID | Param: `id` (integer) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/api/equipment` | Menambahkan unit inventaris alat baru | Body: `CreateEquipmentDto` | `201 Created`, `400 Bad Request` |
| `POST` | `/api/loan-requests` | Membuat pengajuan peminjaman baru | Body: `CreateLoanRequestDto` | `201 Created`, `400 Bad Request` |
| `GET` | `/api/loan-requests/:id` | Mendapatkan detail status pengajuan pinjam | Param: `id` (integer) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/api/loan-requests/:id` | Memperbarui `returnDate` atau `purpose` | Param: `id` (integer), Body: `UpdateLoanRequestDto` | `200 OK`, `400 Bad Request`, `404 Not Found` |

### 2.2 Modul Extended (`labs`, `maintenance-logs`, & Pelengkap)

| Method | Endpoint | Tujuan | Query / Body DTO | Status HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `PATCH` | `/api/equipment/:id` | Memperbarui spesifikasi inventaris alat | Param: `id`, Body: `UpdateEquipmentDto` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/equipment/:id` | Menghapus alat dari inventaris | Param: `id` (integer) | `200 OK`, `404 Not Found` |
| `GET` | `/api/loan-requests` | Menampilkan seluruh riwayat pengajuan | Query: `status`, `borrowerNim`, `page`, `limit` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/labs` | Menampilkan daftar ruang laboratorium | Query: `status`, `keyword`, `page`, `limit` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/labs/:id` | Menampilkan detail ruang lab tertentu | Param: `id` (integer) | `200 OK`, `404 Not Found` |
| `POST` | `/api/labs` | Menambahkan ruang lab baru | Body: `CreateLabDto` | `201 Created`, `400 Bad Request` |
| `PATCH` | `/api/labs/:id` | Memperbarui kapasitas atau data lab | Param: `id`, Body: `UpdateLabDto` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/labs/:id` | Menghapus ruang lab | Param: `id` (integer) | `200 OK`, `404 Not Found` |
| `GET` | `/api/maintenance-logs` | Menampilkan catatan laporan kerusakan | Query: `status`, `severity`, `assetCode`, `page`, `limit` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/maintenance-logs/:id` | Menampilkan detail laporan perawatan | Param: `id` (integer) | `200 OK`, `404 Not Found` |
| `POST` | `/api/maintenance-logs` | Mendaftarkan laporan kerusakan baru | Body: `CreateMaintenanceLogDto` | `201 Created`, `400 Bad Request` |
| `PATCH` | `/api/maintenance-logs/:id` | Memperbarui data/jadwal perbaikan | Param: `id`, Body: `UpdateMaintenanceLogDto` | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/api/maintenance-logs/:id/resolve` | Menyelesaikan servis (status -> `RESOLVED`) | Param: `id` (integer) | `200 OK`, `404 Not Found` |

---

## 3. Contoh Payload JSON & Response

### 3.1 `POST /api/equipment` (Tambah Alat Baru)
**Request Body (Valid):**
```json
{
  "assetCode": "LAB-NW-002",
  "name": "Cisco Catalyst Switch 2960",
  "category": "NETWORK",
  "condition": "GOOD",
  "stock": 10,
  "location": "Lab Jaringan Komputer"
}
```
**Response (`201 Created`):**
```json
{
  "id": 5,
  "assetCode": "LAB-NW-002",
  "name": "Cisco Catalyst Switch 2960",
  "category": "NETWORK",
  "condition": "GOOD",
  "stock": 10,
  "location": "Lab Jaringan Komputer"
}
```

---

### 3.2 `POST /api/loan-requests` (Pengajuan Peminjaman Valid)
**Request Body (Valid):**
```json
{
  "borrowerNim": "240414015",
  "borrowerName": "Roby Rachmat Firdaus",
  "borrowerEmail": "roby.firdaus@student.lpkia.ac.id",
  "assetCode": "LAB-EL-001",
  "quantity": 2,
  "startDate": "2026-11-25",
  "returnDate": "2026-11-27",
  "purpose": "Praktikum mandiri pengukuran sinyal osiloskop sinyal AC"
}
```
**Response (`201 Created`):**
```json
{
  "id": 3,
  "borrowerNim": "240414015",
  "borrowerName": "Roby Rachmat Firdaus",
  "borrowerEmail": "roby.firdaus@student.lpkia.ac.id",
  "assetCode": "LAB-EL-001",
  "quantity": 2,
  "startDate": "2026-11-25",
  "returnDate": "2026-11-27",
  "purpose": "Praktikum mandiri pengukuran sinyal osiloskop sinyal AC",
  "status": "PENDING",
  "createdAt": "2026-11-23T06:50:00.000Z"
}
```

---

### 3.3 `POST /api/labs` (Tambah Ruang Lab)
**Request Body (Valid):**
```json
{
  "labCode": "ROOM-NW-02",
  "name": "Laboratorium Riset Jaringan & Cloud",
  "building": "Gedung B Lt. 3",
  "capacity": 30,
  "picName": "Agung Dea Yulaksana",
  "status": "ACTIVE"
}
```
**Response (`201 Created`):**
```json
{
  "id": 4,
  "labCode": "ROOM-NW-02",
  "name": "Laboratorium Riset Jaringan & Cloud",
  "building": "Gedung B Lt. 3",
  "capacity": 30,
  "picName": "Agung Dea Yulaksana",
  "status": "ACTIVE"
}
```

---

### 3.4 `POST /api/maintenance-logs` (Laporan Kerusakan)
**Request Body (Valid):**
```json
{
  "assetCode": "LAB-MM-001",
  "reportedBy": "Roby Rachmat Firdaus",
  "issueDescription": "Lampu proyektor berkedip dan warna memudar",
  "severity": "MEDIUM",
  "scheduledDate": "2026-11-30"
}
```
**Response (`201 Created`):**
```json
{
  "id": 3,
  "assetCode": "LAB-MM-001",
  "reportedBy": "Roby Rachmat Firdaus",
  "issueDescription": "Lampu proyektor berkedip dan warna memudar",
  "severity": "MEDIUM",
  "status": "OPEN",
  "scheduledDate": "2026-11-30",
  "createdAt": "2026-11-23T06:51:00.000Z"
}
```

---

### 3.5 `PATCH /api/maintenance-logs/:id/resolve` (Selesai Perbaikan)
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

---

## 4. Contoh Response Validasi Error (`400 Bad Request`)

### 4.1 Error Regex & Tipe Data Input
**Request Body (`POST /api/equipment`):**
```json
{
  "assetCode": "INVALID-CODE",
  "name": "PC",
  "category": "HARDWARE",
  "condition": "BROKEN",
  "stock": 100,
  "location": "A"
}
```
**Response (`400 Bad Request`):**
```json
{
  "message": [
    "assetCode must match /^LAB-[A-Z]{2}-[0-9]{3}$/ regular expression",
    "name must be longer than or equal to 3 characters",
    "category must be one of the following values: ELECTRONIC, NETWORK, MULTIMEDIA, OTHER",
    "condition must be one of the following values: GOOD, MINOR_DAMAGE, NEEDS_REPAIR",
    "stock must not be greater than 50",
    "location must be longer than or equal to 2 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 4.2 Error Properti Asing / Field Sistem (`forbidNonWhitelisted: true`)
**Request Body (`POST /api/loan-requests`):**
```json
{
  "borrowerNim": "240414015",
  "borrowerName": "Roby Rachmat Firdaus",
  "borrowerEmail": "roby.firdaus@student.lpkia.ac.id",
  "assetCode": "LAB-EL-001",
  "quantity": 1,
  "startDate": "2026-11-25",
  "returnDate": "2026-11-27",
  "purpose": "Praktikum mandiri pengukuran sinyal osiloskop",
  "status": "APPROVED",
  "role": "admin"
}
```
**Response (`400 Bad Request`):**
```json
{
  "message": [
    "property status should not exist",
    "property role should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 4.3 Error Validasi Lintas-Field (`returnDate < startDate`)
**Request Body (`POST /api/loan-requests`):**
```json
{
  "borrowerNim": "240414015",
  "borrowerName": "Roby Rachmat Firdaus",
  "borrowerEmail": "roby.firdaus@student.lpkia.ac.id",
  "assetCode": "LAB-EL-001",
  "quantity": 1,
  "startDate": "2026-11-28",
  "returnDate": "2026-11-25",
  "purpose": "Praktikum mandiri pengukuran sinyal osiloskop"
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

---

### 4.4 Error Data Tidak Ditemukan (`404 Not Found`)
**Request:** `GET /api/equipment/999`  
**Response (`404 Not Found`):**
```json
{
  "message": "Equipment with ID 999 not found",
  "error": "Not Found",
  "statusCode": 404
}
```
