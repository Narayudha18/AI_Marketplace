## v7.8 — 2026-07-31

### Ubah
- **AuthContext** — seed dummy sellers (3 aktif + 2 pending) biar tab Sellers admin punya data, plus seed 6 produk seller [file: src/AuthContext.jsx]
- **AdminDashboard** — tombol dark mode toggle di header (mobile & desktop) + tombol View di tab Users buat liat profil user lewat modal [file: src/pages/AdminDashboard.jsx]
- **UserProfileModal** — jadi generic, title & icon menyesuaikan (Seller/User Profile) [file: src/components/UserProfileModal.jsx]

### Fitur
- [Feat] Seed seller — Rina Wijaya, Budi Santoso, Dewi Lestari (aktif) + Andi Pratama, Siti Rahma (pending), password `seller123`
- [Feat] Seed produk — 6 produk dummy dengan `sellerId` biar jumlah produk di profil seller muncul
- [Feat] Admin light mode — admin dashboard pakai semantic theme variables, ngikut toggle dark/light

## v7.7 — 2026-07-30

### Komponen
- **Profile** — Redesain total: standalone page (no Navbar/Footer), modern UI dengan glassmorphism + gradients, sidebar profile card, 5 tabs (Overview, Profile, Orders, Addresses, Settings), activity timeline, notification preferences, smooth animations [file: src/pages/Profile.jsx]

### Ubah
- **AuthContext** — tambah `trackActivity(action, detail)`, `getUserActivities()`, `updateNotifPrefs(prefs)` methods [file: src/AuthContext.jsx]
- **index.css** — tambah `animate-fade-in-up` keyframes + `animate-spin` keyframes [file: src/index.css]

### Fitur
- [Feat] Overview tab — stats cards (gradient icons), recent activity timeline with time-ago
- [Feat] Activity tracking — otomatis track profile update, password change, address add/remove, picture change
- [Feat] Notification Preferences — toggle order updates, promotions, product updates
- [Style] Modern UI — glassmorphism cards (backdrop-blur), gradient accents, smooth transitions, rounded-2xl everywhere, animated toast

## v7.6 — 2026-07-30

### Komponen
- **Profile** — Redesain jadi Dashboard Profile: sidebar tabs (My Profile, Orders, Addresses, Settings), edit profile inline, address management, change password, dark mode toggle, toast notifications [file: src/pages/Profile.jsx]

### Ubah
- **AuthContext** — tambah `updateProfile({ name, email, bio })`, `addAddress(address)`, `removeAddress(id)` methods [file: src/AuthContext.jsx]

### Fitur
- [Feat] Dashboard Profile — sidebar navigasi 4 tab, layout responsive
- [Feat] Edit Profile — edit name, email, bio secara inline dengan save/cancel
- [Feat] Address Management — tambah/hapus alamat (label, street, city, phone)
- [Feat] Account Settings — change password dengan validasi, dark mode toggle, sign out
- [Feat] Toast notifications — feedback visual untuk semua aksi (save, update, add, remove)

### Mock JSON
- `docs/mock/profile/get-profile.json` — GET /api/user/profile
- `docs/mock/profile/put-profile.json` — PUT /api/user/profile
- `docs/mock/profile/get-addresses.json` — GET /api/user/addresses
- `docs/mock/profile/post-address.json` — POST /api/user/addresses
- `docs/mock/profile/delete-address.json` — DELETE /api/user/addresses/:id

## v7.5 — 2026-07-30

### Mock JSON
- `docs/mock/admin/put-order-id.json` — PUT /api/admin/orders/:id (update status order)
- `docs/mock/admin/delete-review-id.json` — DELETE /api/admin/reviews/:id (hapus review)
- `docs/mock/admin/put-seller-id-approve.json` — PUT /api/admin/sellers/:id/approve
- `docs/mock/admin/put-seller-id-reject.json` — PUT /api/admin/sellers/:id/reject
- `docs/mock/orders/get-order-id.json` — GET /api/orders/:id (detail order)

## v7.4 — 2026-07-28

### Ubah
- **SellerDashboard** — Rewrite total jadi standalone: sidebar navigation (Overview, Products, Orders), forced dark mode, account dropdown, hapus Navbar/Footer [file: src/pages/SellerDashboard.jsx]
- **AdminDashboard** — Data loading pake useState initializers langsung baca localStorage (bukan useEffect), tambah auto-refresh on focus + manual Refresh button [file: src/pages/AdminDashboard.jsx]
- **StartSelling** — Kirim `onSuccess` ke SellerForm yang panggil `requestSeller()` dari AuthContext. Redirect otomatis ke `/seller/dashboard` jika sudah seller/pending. Tampilkan Sign In prompt jika belum login. [file: src/pages/StartSelling.jsx]
- **AuthContext** — Cross-reference currentUser dengan users array di init + sync saat users berubah via useEffect [file: src/AuthContext.jsx]

### Fix
- [Fix] Seller request gak sampai ke admin — SellerForm panggil `onSuccess` yang undefined, sekarang panggil `requestSeller()` dari AuthContext [file: src/pages/StartSelling.jsx]
- [Fix] SellerDashboard useEffect pake `[]` deps — sekarang `[currentUser, requestSeller]` biar gak race condition [file: src/pages/SellerDashboard.jsx]
- [Fix] AdminDashboard baca data cuma sekali di useEffect — sekarang state initializer langsung baca localStorage + refresh on focus [file: src/pages/AdminDashboard.jsx]

### Fitur
- [Feat] Seller Dashboard standalone — sidebar 3 tabs, dark mode, account dropdown, orders tab
- [Feat] Admin Dashboard Refresh — data auto-refresh saat window focus + manual Refresh button

### Routing
- Seller Dashboard route tetap `/seller/dashboard` (tidak berubah)

## v7.3 — 2026-07-28

### Ubah
- **AdminDashboard** — Expand dari 3 tab jadi 6 tab: Overview, Users, Sellers, Products, Orders, Reviews. Sidebar navigation. Seller approval queue, order status management, review moderation. [file: src/pages/AdminDashboard.jsx]

### Fitur
- [Feat] Seller approval queue — request → admin approve/reject
- [Feat] Order status management — dropdown (Completed/Processing/Shipped/Cancelled)
- [Feat] Review moderation — lihat & hapus review dari localStorage

## v7.2 — 2026-07-28

### Komponen (Baru)
- **AdminDashboard** — Halaman admin panel: stats (users/products/orders/revenue), 3 tab (users table, orders table, products by category) [file: src/pages/AdminDashboard.jsx]

### Ubah
- **AuthContext** — tambah `isAdmin` field + `becomeAdmin()` function, persist auth ke localStorage [file: src/AuthContext.jsx]
- **AuthButton** — dropdown Admin Dashboard link (cuma untuk admin), icon admin_panel_settings, symmetrical layout [file: src/components/AuthButton.jsx]
- **App.jsx** — tambah route /admin/dashboard [file: src/App.jsx]

### Fitur
- [Feat] Admin Dashboard — lihat statistik platform, daftar user, order history, produk per kategori
- [Feat] Role system — user bisa jadi admin (lewat /admin/dashboard) atau seller (request → admin approve)

### Mock JSON
- `docs/mock/admin/get-dashboard.json` — endpoint baru GET /api/admin/dashboard
- `docs/mock/admin/get-users.json` — endpoint baru GET /api/admin/users

### Routing
- Tambah route /admin/dashboard → AdminDashboard

## v7.1 — 2026-07-28

### Ubah
- **Profile** — Redesign ala Shopee: avatar clickable (upload foto), stats cards (orders/items/spent), order history list expandable [file: src/pages/Profile.jsx]
- **CartPage** — Simpan order ke `orders` array di localStorage (history semua order) [file: src/pages/CartPage.jsx]

### Fitur
- [Feat] Order history — semua order tersimpan dan bisa dilihat di halaman Profile
- [Feat] Avatar upload — user bisa ganti foto profil dari halaman Profile

### Mock JSON
- `docs/mock/profile/get-orders.json` — endpoint baru GET /api/user/orders

## v7.0 — 2026-07-28

### Komponen (Baru)
- **CartPage** — Halaman cart penuh: list item dengan qty +/- , order summary, proceed to checkout [file: src/pages/CartPage.jsx]
- **OrderConfirmation** — Halaman konfirmasi order setelah bayar sukses: order ID, items, total [file: src/pages/OrderConfirmation.jsx]
- **Favorites** — Halaman wishlist dedicated: grid produk favorit, unfavorite button, empty state [file: src/pages/Favorites.jsx]
- **SellerDashboard** — Dashboard penjual: stats cards, form add product, product table dengan delete [file: src/pages/SellerDashboard.jsx]

### Ubah
- **CartContext** — add `updateQty` (qty +/- di cart), `totalItems` sekarang akumulasi qty [file: src/CartContext.jsx]
- **Navbar** — tambah icon hati link ke /favorites [file: src/components/Navbar.jsx]
- **CartDrawer** — tambah tombol "View Cart" link ke /cart [file: src/components/CartDrawer.jsx]
- **AuthButton** — dropdown tambah "Seller Dashboard" link [file: src/components/AuthButton.jsx]

### Fitur
- [Feat] Checkout flow — CartPage → PaymentModal → OrderConfirmation
- [Feat] Seller Dashboard — CRUD produk sendiri (localStorage)
- [Feat] Wishlist page — /favorites menampilkan semua produk favorit dari seluruh kategori

### Routing
- Tambah route /cart → CartPage
- Tambah route /order-confirmation → OrderConfirmation
- Tambah route /favorites → Favorites
- Tambah route /seller/dashboard → SellerDashboard

### Mock JSON
- `docs/mock/cart/post-checkout.json` — endpoint baru POST /api/cart/checkout
- `docs/mock/favorites/get-favorites.json` — endpoint baru GET /api/favorites
- `docs/mock/seller/get-dashboard.json` — endpoint baru GET /api/seller/dashboard

### Catatan
- Reviews & Rating sudah ada di ProductDetail sejak v6.0 (tab "Review & Rating")
- Semua data pakai localStorage, belum ada integrasi backend

## v6.1 — 2026-07-24

### Fix
- [Fix] StartSelling — icon `guide` tidak valid di Material Symbols, ganti `menu_book` [file: src/pages/StartSelling.jsx]

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
