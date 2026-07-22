## v2.3 — 2026-07-22

### Komponen
- **Hero** — Balikin search bar, split layout, headline & deskripsi tetap [file: src/components/Hero.jsx]
- **Navbar** — Top Announcement Bar: warna final `bg-primary-container`, tombol Explore Now `bg-text-main` [file: src/components/Navbar.jsx]

### Fitur
- [Style] Top Announcement Bar — hapus glassmorphism purple, ganti ke flat blue `bg-primary-container` + dark button

## v2.2 — 2026-07-22

### Komponen
- **Hero** — Split layout, headline "All-in-one AI agent marketplace", CTA "Explore Now" [file: src/components/Hero.jsx]

### Fitur
- [Style] Hero — search bar dihapus, ganti tombol Explore Now

## v2.1 — 2026-07-22

### Komponen
- **Hero** — Centered layout: pill badge, headline, description, dua CTA rounded-full, image full-width [file: src/components/Hero.jsx]

### Fitur
- [Style] Hero — centered layout purple glassmorphism

## v2.0 — 2026-07-22

### Komponen
- **StartSelling** — Halaman baru pendaftaran penjual: hero, stats, form multi-step + sidebar info [file: src/pages/StartSelling.jsx]
- **SellerForm** — Komponen baru form multi-step 4 langkah (Akun → Toko → Verifikasi → Selesai) [file: src/components/SellerForm.jsx]

### Fitur
- [Feat] Halaman /start-selling — seller registration flow dengan validasi form tiap step
- [Feat] Progress stepper visual — menampilkan progress 4 langkah pendaftaran

### Mock JSON
- `docs/mock/seller/post-register.json` — endpoint baru POST /api/seller/register

### Routing
- Tambah route `/start-selling` → StartSelling

### Design
- AI_DESIGN.md — tambah entri StartSelling, SellerForm, dan route /start-selling

## v1.2 — 2026-07-20

### Skill
- [Feat] Rollback — skill auto-backup file sebelum diedit, user bisa minta "kembalikan" kapan saja, file direstore dari `docs/rollback/`

## v1.1 — 2026-07-20

### Komponen
- **Navbar** — Announcement badge diubah ke pill-shaped glassmorphism (ungu, backdrop-blur, rounded-full) sesuai NEW_DESIGN.md [file: src/components/Navbar.jsx]

### DESIGN.md
- `.temp/DESIGN.md` — Notification Bar description diupdate ke style Chips & Badges dari NEW_DESIGN.md

## v1.0 — 2026-07-20

### Fix
- [Fix] PaymentModal — setelah konfirmasi bayar, modal nutup bersih tanpa balik ke layar pilih payment [file: src/components/PaymentModal.jsx]
- [Fix] CartDrawer — paymentOpen di-set false setelah sukses bayar biar modal tertutup [file: src/components/CartDrawer.jsx]

### Skill
- [Update] ui_skill.md — Penanganan DESIGN.md baru dari user: tanya selektif fitur mana yang mau diimplementasi, lengkap dengan format contoh percakapan
