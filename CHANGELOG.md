## v6.0 — 2026-07-23

### Komponen
- **ThemeContext** — Dark mode provider baru: toggle, localStorage persistence, fallback prefers-color-scheme [file: src/ThemeContext.jsx]
- **ProductGallery** — Halaman gallery baru: 30 screenshots + 4 demo videos [file: src/pages/ProductGallery.jsx]

### Ubah
- **Navbar (16 files)** — Premium style sync di semua halaman: gradient announcement bar (`from-primary-container to-blue-600` + "New" badge), sticky header `z-40`, pill tabs dengan bottom indicator, dark mode toggle (light_mode/dark_mode icons), AuthButton. Right-side order: [Start Selling] [Cart] [Dark Toggle] [AuthButton]. Hover effects removed from main nav links.
- **ProductDetail** — 3 rich sections (About This Product, How to Use, Screenshots & Demo). English UI. "Live Preview" button navigates ke `/preview`. [file: src/pages/ProductDetail.jsx]
- **StartSelling** — UI translated to English [file: src/pages/StartSelling.jsx]
- **SellerForm** — Multi-step form translated to English (Account → Store → Verification → Done) [file: src/components/SellerForm.jsx]
- **FavoriteRecommendations** — UI translated to English [file: src/components/FavoriteRecommendations.jsx]
- **CartDrawer** — Price format changed from `Rp` to `$` [file: src/components/CartDrawer.jsx]
- **ProductGrid** — Filter buttons changed from `<Link>` to on-page `<button>` with state filtering + scroll to grid. Imports all 11 JSON data files (104+ items tagged with `_cat` + `_name`). [file: src/components/ProductGrid.jsx]
- **CategoryListing** — Fixed empty `filterMap` bug for sub-category filters. Added auto-scroll on filter apply. [file: src/pages/CategoryListing.jsx]

### Fitur
- [Feat] Dark mode — ThemeContext + CSS variables + flash-prevention inline script
- [Feat] Pagination — "Load more" buttons on all 12 listing pages (initial 6, increments by 6)
- [Feat] Product Gallery — `/:category/:slug/preview` route with 30 screenshots + 4 auto-play videos
- [Feat] Auto-scroll — Sub-nav pills & sidebar filter → scroll to product grid (`productRef`). Navbar links → skip scroll (`state={{ skipScroll: true }}`). Global scroll-to-top on route change.
- [Style] All 11 JSON data files expanded from 8-17 items to 30 items each (total 330 items)
- [Style] Premium navbar uniform style across all 16 files

### Routing
- Tambah route `/:category/:slug/preview` → ProductGallery

### Data
- templates.json: 17→30 items
- integrations.json: 13→30 items
- chatbots.json: 8→30 items
- automation.json: 8→30 items
- aitools.json: 13→30 items
- voice-ai.json: 8→30 items
- image-gen.json: 8→30 items
- analytics.json: 8→30 items
- fine-tuning.json: 8→30 items
- monitoring.json: 8→30 items
- security.json: 8→30 items

### Catatan
- Google OAuth code removed completely (package uninstalled, buttons removed)
- Profile page crashes on navigation (root cause unknown, minimal version deployed)

## v5.0 — 2026-07-22

### Auth
- **AuthContext** — Global auth state in-memory: users array, currentUser, register/login/logout, updatePassword, updatePicture [file: src/AuthContext.jsx]
- **AuthButton** — Conditional UI: logged out→"Sign In" link, logged in→avatar+name link ke /profile + dropdown Sign Out [file: src/components/AuthButton.jsx]

### Halaman
- **Login** — Standalone (tanpa navbar/footer), Google OAuth button, email/password form, redirect ke / [file: src/pages/Login.jsx]
- **Register** — Standalone (tanpa navbar/footer), Google OAuth button, email/password form, redirect ke / [file: src/pages/Register.jsx]
- **Profile** — Dashboard user: avatar (upload via FileReader/base64), stat cards (cart/purchased/favorites), account details, change password form [file: src/pages/Profile.jsx]

### Navbar
- **Navbar** — Semua tombol Sign In diganti AuthButton (termasuk 14 halaman listing inline navbar) [file: src/components/Navbar.jsx]
- **Premium style** — Gradient announcement bar ("New" badge), sticky header, pill tabs, no icons, sync di semua halaman

### Fix
- Hapus duplicate security routes di App.jsx

## v4.0 — 2026-07-22

### Komponen
- **VoiceAI** — Halaman listing Voice AI baru dengan sidebar filter [file: src/pages/VoiceAI.jsx]
- **ImageGen** — Halaman listing Image Gen baru dengan sidebar filter [file: src/pages/ImageGen.jsx]
- **Analytics** — Halaman listing Analytics baru dengan sidebar filter [file: src/pages/Analytics.jsx]
- **FineTuning** — Halaman listing Fine-tuning baru dengan sidebar filter [file: src/pages/FineTuning.jsx]
- **Monitoring** — Halaman listing Monitoring baru dengan sidebar filter [file: src/pages/Monitoring.jsx]
- **Security** — Halaman listing Security baru dengan sidebar filter [file: src/pages/Security.jsx]

### Data
- voice-ai.json — 8 item Voice AI baru [file: src/data/voice-ai.json]
- image-gen.json — 8 item Image Gen baru [file: src/data/image-gen.json]
- analytics.json — 8 item Analytics baru [file: src/data/analytics.json]
- fine-tuning.json — 8 item Fine-tuning baru [file: src/data/fine-tuning.json]
- monitoring.json — 8 item Monitoring baru [file: src/data/monitoring.json]
- security.json — 8 item Security baru [file: src/data/security.json]

### Routing
- Tambah 6 route listing baru: /voice-ai, /image-gen, /analytics, /fine-tuning, /monitoring, /security
- Tambah 6 route kategori (/:filter) untuk masing-masing
- Tambah 6 route detail (/:slug) untuk masing-masing
- Navbar navSubLinks diarahkan ke halaman masing-masing (tidak lagi redirect ke /ai-tools atau /integrations)

### CategoryListing
- Tambah 6 config entry baru: voice-ai, image-gen, analytics, fine-tuning, monitoring, security

### ProductDetail
- Tambah 6 config entry baru: voice-ai, image-gen, analytics, fine-tuning, monitoring, security

## v3.0 — 2026-07-22

### Komponen
- **Terms** — Halaman Terms of Service baru [file: src/pages/Terms.jsx]
- **Licenses** — Halaman license options dengan 3 pricing cards [file: src/pages/Licenses.jsx]
- **ApiDocs** — Halaman dokumentasi REST API [file: src/pages/ApiDocs.jsx]
- **Privacy** — Halaman Privacy Policy baru [file: src/pages/Privacy.jsx]
- **HelpCenter** — Halaman FAQ accordion + support contact [file: src/pages/HelpCenter.jsx]
- **Authors** — Halaman panduan author + benefits [file: src/pages/Authors.jsx]
- **Sitemap** — Halaman site index dengan link grid [file: src/pages/Sitemap.jsx]
- **Footer** — Semua link placeholder (`href="#"`) diganti ke route sebenarnya [file: src/components/Footer.jsx]

### Routing
- Tambah 7 route baru: /terms, /licenses, /api, /privacy, /help, /authors, /sitemap

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
