---
name: component mapping
description: Memetakan UI components ke backend (API routes) dan database (tables/queries) dalam format tabel, lalu menghasilkan perubahan kode yang sesuai.
---

## Trigger
Dipanggil secara eksplisit oleh user saat ada perubahan UI atau kebutuhan sinkronisasi.

## Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js (Express/Fastify) + Go (Gin/Echo) + Python (FastAPI/Flask)
- **Database**: Sesuai kebutuhan (PostgreSQL, MySQL, MongoDB, dll)

## Workflow

### Step 1 — Baca UI
Baca struktur komponen React di folder `src/components/` atau halaman di `src/pages/`. Catat:
- Nama komponen
- **Section / Web Page** tempat komponen berada (misal: Home Page, Product Page, Cart Page, User Profile)
- Nama file komponen dan path lengkapnya
- Props yang diterima
- State yang digunakan
- Event handler / side effects

### Step 2 — Buat / Update `component.md`
Buat atau update file `component.md` di root proyek (atau folder `docs/`) dengan format tabel:

```markdown
| Web Page / Section | Komponen      | File Path                        | DB Table / Query          | API Endpoint              |
|--------------------|---------------|----------------------------------|---------------------------|---------------------------|
| Halaman Produk     | ProductList   | src/pages/Produk/ProductList.jsx | products (SELECT)         | GET    /api/products      |
| Halaman Produk     | ProductDetail | src/pages/Produk/ProductDetail.jsx| products + reviews (JOIN) | GET    /api/products/:id  |
| Halaman Keranjang  | AddToCartBtn  | src/components/Cart/AddToCartBtn.jsx| carts (INSERT)          | POST   /api/cart          |
| Halaman Profil     | UserProfile   | src/pages/Profil/UserProfile.jsx  | users (SELECT + UPDATE)   | GET    /api/users/:id     |
|                    |               |                                  |                           | PUT    /api/users/:id     |
```

### Step 3 — Mapping Database
Identifikasi tabel, kolom, dan query yang relevan untuk setiap komponen. Catat relasi dan constraint.

### Step 4 — Mapping API
Cocokkan setiap komponen dengan endpoint API yang sesuai (method, path, request/response shape).

## Output
Setelah mapping selesai, AI agent harus menghasilkan:
1. **File `component.md`** yang selalu sinkron
2. **Perubahan kode** yang diperlukan di frontend, backend, dan/atau database

## Catatan
- Jika ada komponen baru, tambahkan baris baru di tabel
- Jika ada perubahan pada DB schema atau API, perbarui tabel dan kode terkait
- Format tabel bisa diperluas dengan kolom tambahan (misal: `Method`, `Auth Required`, `Status`)
- **Konfirmasi wajib**: AI agent WAJIB konfirmasi ke user terlebih dahulu sebelum mengubah area mana pun (frontend, backend, DB, atau file mapping). Jangan langsung mengubah tanpa persetujuan.
