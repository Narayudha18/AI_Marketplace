# Component Mapping — AI Agents Marketplace

> **Status:** Pure Frontend SPA (no backend, no database)
> **Data:** Static JSON files + localStorage
> **State:** React Context (CartContext) + localStorage
> **Stack:** React 19 + React Router 7 + Tailwind CSS 4 + Vite 8

---

## 1. Tabel Mapping Komponen → API → Database

### 1.1. Komponen Global (Selalu Tampil)

| Web Page / Section | Komponen | File Path | Props | State (Local) | Event Handlers | DB Table / Query (Future) | API Endpoint (Future) |
|---|---|---|---|---|---|---|---|
| Semua Halaman | **App** | `src/App.jsx` | — | — | Route rendering | — | — |
| Semua Halaman | **CartProvider** | `src/CartContext.jsx` | `children` | `cart`, `purchased`, `favorites` (all localStorage) | `addToCart`, `removeFromCart`, `clearCart`, `markAsPurchased`, `inCart`, `hasPurchased`, `toggleFavorite`, `isFavorite`, `getFavoriteCategories` | `carts`, `purchases`, `favorites` | `GET/POST /api/cart`, `POST /api/orders`, `GET/POST /api/favorites` |
| Semua Halaman | **AuthProvider** | `src/AuthContext.jsx` | `children` | `users[]`, `currentUser` (in-memory only) | `register`, `login`, `logout`, `updatePassword`, `updatePicture` | `users` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Semua Halaman | **ThemeProvider** | `src/ThemeContext.jsx` | `children` | `dark` (localStorage + prefers-color-scheme) | `toggle` → toggle dark mode | — | — |
| Semua Halaman | **Navbar** | `src/components/Navbar.jsx` | — | `cartOpen` | `setCartOpen(true)` → buka CartDrawer | `categories` (static) | `GET /api/categories` |
| Semua Halaman | **AuthButton** | `src/components/AuthButton.jsx` | — | `open` (dropdown) | Logged out→Link to /login, logged in→Link to /profile + dropdown Sign Out | — | — |
| Semua Halaman | **CartDrawer** | `src/components/CartDrawer.jsx` | `open`, `onClose` | `paymentOpen` | `removeFromCart`, `clearCart`, `markAsPurchased`; body scroll lock | `carts (SELECT, DELETE)`, `orders (INSERT)` | `GET/POST /api/cart`, `POST /api/orders` |
| Semua Halaman | **PaymentModal** | `src/components/PaymentModal.jsx` | `open`, `onClose`, `total`, `cart`, `onSuccess` | `step`, `selected` | `onSuccess` → `markAsPurchased` + `clearCart`; QR/barcode canvas render | `orders (INSERT)`, `payments (INSERT)` | `POST /api/orders`, `POST /api/payments` |
| Semua Halaman | **Footer** | `src/components/Footer.jsx` | — | — | — | — | — |

### 1.2. Halaman Beranda (`/`)

| Web Page / Section | Komponen | File Path | Props | State (Local) | Event Handlers | DB Table / Query (Future) | API Endpoint (Future) |
|---|---|---|---|---|---|---|---|
| Home Page | **Hero** | `src/components/Hero.jsx` | — | `query` | `handleSearch` → navigate `/templates?search=` | — | `GET /api/search` |
| Home Page | **Categories** | `src/components/Categories.jsx` | — | `expanded` | `setExpanded` toggle | `categories (SELECT)` | `GET /api/categories` |
| Home Page | **ProductGrid** | `src/components/ProductGrid.jsx` | — | — | — | `products (SELECT)` | `GET /api/products/featured` |
| Home Page | **Featured** | `src/components/Featured.jsx` | — | — | — | — | — |
| Home Page | **FavoriteRecommendations** | `src/components/FavoriteRecommendations.jsx` | — | — | Cross-category recommendation logic (12 items max) | `favorites (JOIN products)` | `GET /api/products/recommendations` |

### 1.3. Halaman Listing (`/templates`, `/integrations`, `/chatbots`, `/automation`, `/ai-tools`)

| Web Page / Section | Komponen | File Path | Props | State (Local) | Event Handlers | DB Table / Query (Future) | API Endpoint (Future) |
|---|---|---|---|---|---|---|---|
| Halaman Listing | **Templates** | `src/pages/Templates.jsx` | — | `searchQuery`, `sidebarSearch`, `selectedCategories[]`, `priceRange`, `sortBy`, `applied*`, `cartOpen`, `categoriesExpanded` | `applyFilters`, `resetFilters`, `toggleCategory`, `toggleFavorite` | `products (SELECT, FILTER, SORT)` | `GET /api/products/templates?search=&category=&price=&sort=` |
| Halaman Listing | **Integrations** | `src/pages/Integrations.jsx` | — | `searchQuery`, `sidebarSearch`, `selectedCategories[]`, `selectedType`, `selectedRating`, `applied*`, `cartOpen` | `applyFilters`, `resetFilters`, `toggleFavorite` | `products (SELECT, FILTER)` | `GET /api/products/integrations?...` |
| Halaman Listing | **Chatbots** | `src/pages/Chatbots.jsx` | — | `searchQuery`, `sidebarSearch`, `selectedPlatform`, `selectedRating`, `applied*`, `cartOpen` | `applyFilters`, `resetFilters`, `toggleFavorite` | `products (SELECT, FILTER)` | `GET /api/products/chatbots?...` |
| Halaman Listing | **Automation** | `src/pages/Automation.jsx` | — | `searchQuery`, `sidebarSearch`, `selectedCategory`, `selectedPrice`, `applied*`, `cartOpen` | `applyFilters`, `resetFilters`, `toggleFavorite` | `products (SELECT, FILTER)` | `GET /api/products/automation?...` |
| Halaman Listing | **AiTools** | `src/pages/AiTools.jsx` | — | `searchQuery`, `sidebarSearch`, `selectedCategory`, `selectedPricing`, `applied*`, `cartOpen` | `applyFilters`, `resetFilters`, `toggleFavorite` | `products (SELECT, FILTER)` | `GET /api/products/aitools?...` |

### 1.4. Halaman Seller Registration

| Web Page / Section | Komponen | File Path | Props | State (Local) | Event Handlers | DB Table / Query (Future) | API Endpoint (Future) |
|---|---|---|---|---|---|---|---|
| Seller Registration | **StartSelling** | `src/pages/StartSelling.jsx` | — | `cartOpen` | `setCartOpen` → cart drawer | `sellers (INSERT)` | `POST /api/seller/register` |
| Seller Registration | **SellerForm** | `src/components/SellerForm.jsx` | `onSuccess` | `step`, `form{}`, `errors{}`, `submitting` | `next`, `prev`, `validateStep`, `handleSubmit` | `sellers (INSERT)` | `POST /api/seller/register` |
| Seller Registration (Sidebar) | Benefit Card | inline di StartSelling | — | — | — | — | — |
| Seller Registration (Sidebar) | Step Guide | inline di StartSelling | — | — | — | — | — |
| Footer Page | **Terms** | `src/pages/Terms.jsx` | — | — | — | — | — |
| Footer Page | **Licenses** | `src/pages/Licenses.jsx` | — | — | — | — | — |
| Footer Page | **ApiDocs** | `src/pages/ApiDocs.jsx` | — | — | — | — | `GET/POST /api/*` |
| Footer Page | **Privacy** | `src/pages/Privacy.jsx` | — | — | — | — | — |
| Footer Page | **HelpCenter** | `src/pages/HelpCenter.jsx` | — | — | — | — | — |
| Footer Page | **Authors** | `src/pages/Authors.jsx` | — | — | — | — | — |
| Footer Page | **Sitemap** | `src/pages/Sitemap.jsx` | — | — | — | — | — |
| Listing Page | **VoiceAI** | `src/pages/VoiceAI.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='voice-ai')` | `GET /api/products/voice-ai` |
| Listing Page | **ImageGen** | `src/pages/ImageGen.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='image-gen')` | `GET /api/products/image-gen` |
| Listing Page | **Analytics** | `src/pages/Analytics.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='analytics')` | `GET /api/products/analytics` |
| Listing Page | **FineTuning** | `src/pages/FineTuning.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='fine-tuning')` | `GET /api/products/fine-tuning` |
| Listing Page | **Monitoring** | `src/pages/Monitoring.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='monitoring')` | `GET /api/products/monitoring` |
| Listing Page | **Security** | `src/pages/Security.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite` | `products (type='security')` | `GET /api/products/security` |
| Auth Page | **Login** | `src/pages/Login.jsx` | — | `email`, `password`, `error` | `handleSubmit` → `login()` from AuthContext, redirect `/` | `users` | `POST /api/auth/login` |
| Auth Page | **Register** | `src/pages/Register.jsx` | — | `name`, `email`, `password`, `confirm`, `error` | `handleSubmit` → `register()` from AuthContext, redirect `/` | `users` | `POST /api/auth/register` |
| Auth Page | **Profile** | `src/pages/Profile.jsx` | — | `currentPw`, `newPw`, `confirmPw`, `pwMsg` | `updatePassword`, `updatePicture`, stats from CartContext | `users` | `GET /api/auth/me`, `PUT /api/auth/password`, `PUT /api/auth/picture` |

### 1.5. Halaman Detail & Kategori

| Web Page / Section | Komponen | File Path | Props | State (Local) | Event Handlers | DB Table / Query (Future) | API Endpoint (Future) |
|---|---|---|---|---|---|---|---|
| Detail Produk | **ProductDetail** | `src/pages/ProductDetail.jsx` | — | `cartOpen`, `activeTab`, `reviews[]`, `comments[]` (both localStorage), `reviewName`, `reviewText`, `reviewRating`, `hoverRating`, `commentName`, `commentText` | `addToCart`, `toggleFavorite`, `submitReview`, `submitComment`; tab switching; "Live Preview" → navigate to `/preview` | `products (SELECT)`, `reviews (SELECT, INSERT)`, `comments (SELECT, INSERT)` | `GET /api/products/:category/:slug`, `GET/POST /api/reviews`, `GET/POST /api/comments` |
| Listing per Kategori | **CategoryListing** | `src/pages/CategoryListing.jsx` | — | `sidebarSearch`, `appliedSidebar`, `cartOpen` | `applyFilters`, `toggleFavorite`; URL-driven filter from `:filter` param; auto-scroll to productRef | `products (SELECT, FILTER BY CATEGORY)` | `GET /api/products/:category?filter=` |
| Gallery Produk | **ProductGallery** | `src/pages/ProductGallery.jsx` | — | — | None (static display) | `products (SELECT)` (for images/videos metadata) | `GET /api/products/:category/:slug/media` |

---

## 2. State Management — CartContext (`src/CartContext.jsx`)

### 2.1. State

| State | Key | Tipe | Persistence | Fungsi |
|---|---|---|---|---|
| `cart` | `cart` | `Array<{slug, category, title?, name?, price?, seed?, qty}>` | localStorage | Items in cart |
| `purchased` | `purchased` | `Array<{slug, category}>` | localStorage | Purchased items |
| `favorites` | `favorites` | `Array<{slug, category}>` | localStorage | Favorited items |

### 2.2. Methods

| Method | Parameters | Return | Description |
|---|---|---|---|
| `addToCart(item)` | `{ slug, category, title?, name?, price?, seed? }` | `void` | Add item (prevents duplicate by slug+category) |
| `removeFromCart(slug, category)` | `string, string` | `void` | Remove item from cart |
| `clearCart()` | — | `void` | Empty cart |
| `markAsPurchased(slug, category)` | `string, string` | `void` | Mark item as purchased |
| `inCart(slug, category)` | `string, string` | `boolean` | Check if item is in cart |
| `hasPurchased(slug, category)` | `string, string` | `boolean` | Check if item was purchased |
| `toggleFavorite(slug, category)` | `string, string` | `void` | Toggle favorite status |
| `isFavorite(slug, category)` | `string, string` | `boolean` | Check if item is favorited |
| `getFavoriteCategories()` | — | `string[]` | Get unique categories of favorites |
| `totalItems` | — | `number` (computed) | Total cart count |

---

## 3. Data Files (Static JSON → Future Database)

### 3.1. File → Tabel Mapping

| File | Records | Key Fields | Future DB Table | Used By |
|---|---|---|---|---|
| `src/data/templates.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='template') | Templates, ProductDetail, CategoryListing, FavoriteRecommendations |
| `src/data/integrations.json` | 30 | `name`, `desc`, `icon`, `category`, `type`, `rating`, `users` | `products` (type='integration') | Integrations, ProductDetail, CategoryListing, FavoriteRecommendations |
| `src/data/chatbots.json` | 30 | `name`, `desc`, `price`, `sales`, `rating`, `platform`, `seed` | `products` (type='chatbot') | Chatbots, ProductDetail, CategoryListing, FavoriteRecommendations |
| `src/data/automation.json` | 30 | `name`, `desc`, `price`, `sales`, `rating`, `category`, `seed` | `products` (type='automation') | Automation, ProductDetail, CategoryListing, FavoriteRecommendations |
| `src/data/aitools.json` | 30 | `name`, `desc`, `price`, `badge`, `category`, `seed` | `products` (type='aitool') | AiTools, ProductDetail, CategoryListing, FavoriteRecommendations |
| `src/data/voice-ai.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='voice-ai') | VoiceAI, ProductDetail, CategoryListing |
| `src/data/image-gen.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='image-gen') | ImageGen, ProductDetail, CategoryListing |
| `src/data/analytics.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='analytics') | Analytics, ProductDetail, CategoryListing |
| `src/data/fine-tuning.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='fine-tuning') | FineTuning, ProductDetail, CategoryListing |
| `src/data/monitoring.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='monitoring') | Monitoring, ProductDetail, CategoryListing |
| `src/data/security.json` | 30 | `title`, `author`, `category`, `price`, `sales`, `seed` | `products` (type='security') | Security, ProductDetail, CategoryListing |

### 3.2. Future Database Schema (PostgreSQL)

```sql
-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  parent_id INTEGER REFERENCES categories(id)
);

-- Products (unified table with type discriminator)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('template','integration','chatbot','automation','aitool')),
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200),
  name VARCHAR(200),
  description TEXT,
  price DECIMAL(10,2),
  sales INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  author VARCHAR(100),
  category_id INTEGER REFERENCES categories(id),
  platform VARCHAR(100),
  badge VARCHAR(50),
  users_count INTEGER DEFAULT 0,
  seed VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Carts
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  qty INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  price DECIMAL(10,2)
);

-- Purchases
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  purchased_at TIMESTAMP DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Component Tree & Data Flow

```
App.jsx (Routes)
├── Home (/)
│   ├── Navbar
│   │   ├── useCart (totalItems)
│   │   ├── CartDrawer (open, onClose) ← cartOpen state
│   │   │   ├── useCart (cart, removeFromCart, clearCart, markAsPurchased)
│   │   │   └── PaymentModal (open, onClose, total, cart, onSuccess)
│   │   │       └── QRISView / EwalletView / BankView / StoreView (sub-components)
│   ├── Hero ← query → navigate /templates?search=
│   ├── Categories ← expanded toggle
│   ├── ProductGrid ← static data
│   ├── Featured ← static content
│   ├── FavoriteRecommendations ← useCart (favorites) + all 5 JSONs
│   └── Footer
│
├── Templates (/templates)
│   ├── [Inline Navbar + CartDrawer + Footer]
│   ├── Filter sidebar (category, price, sort) + search
│   ├── Product cards ← toggleFavorite
│   └── Featured section
│
├── Integrations (/integrations)
├── Chatbots (/chatbots)
├── Automation (/automation)
├── AiTools (/ai-tools)
│   └── (Same pattern as Templates, different JSON/dimensions)
│
├── StartSelling (/start-selling)
│   ├── Banner + Dark header (navbar) + CartDrawer + Footer
│   ├── Hero section + stats grid
│   ├── SellerForm (2/3 width)
│   └── Sidebar info (1/3): benefit card, step guide, FAQ note
│
├── Terms (/terms)
│   └── Static content: Terms of Service + Navbar + Footer
│
├── Licenses (/licenses)
│   ├── 3 license cards (Regular, Extended, Enterprise)
│   └── Navbar + Footer
│
├── ApiDocs (/api)
│   ├── REST API endpoint list with method badges
│   └── Navbar + Footer
│
├── Privacy (/privacy)
│   └── Static content: Privacy Policy + Navbar + Footer
│
├── HelpCenter (/help)
│   ├── FAQ accordion
│   ├── Support contact card
│   └── Navbar + Footer
│
├── Authors (/authors)
│   ├── 4-step selling guide grid
│   ├── Author benefits list
│   └── Navbar + Footer
│
├── Sitemap (/sitemap)
│   ├── Link grid (Marketplace, Legal, Support)
│   └── Navbar + Footer
│
├── ProductDetail (/:category/:slug)
│   ├── About This Product (category-specific + 6 feature cards)
│   ├── How to Use (5 step cards)
│   ├── Screenshots & Demo (6 image grid)
│   ├── "Live Preview" → navigate to /:category/:slug/preview
│   ├── Tabs: About | Reviews | Comments | Support
│   ├── Review form (hanya jika sudah purchase)
│   ├── Comment form (semua user)
│   └── Related products
│
├── ProductGallery (/:category/:slug/preview)
│   ├── Hero screenshot (full width)
│   ├── 29 screenshots (3-column grid)
│   └── 4 auto-playing demo videos
│
├── CategoryListing (/:category/c/:filter)
│   ├── Premium navbar (inline)
│   ├── Sub-nav pills (auto-scroll)
│   ├── Sidebar search + checkboxes
│   ├── Product grid with "Load more"
│   └── Auto-scroll on filter apply (productRef)
│
└── ThemeProvider (wraps entire app in main.jsx)
    └── Toggle button in all navbars
```

---

## 5. Future API Endpoints (REST)

### 5.0. Seller

| Method | Path | Description | Body |
|---|---|---|---|
| `POST` | `/api/seller/register` | Register as seller | `{ fullName, email, phone, storeName, category, identityType, identityNumber, bankName, bankAccount }` |

### 5.1. Products

### 5.1. Products

| Method | Path | Description | Query Params |
|---|---|---|---|
| `GET` | `/api/products` | List all products | `type`, `category`, `search`, `price_min`, `price_max`, `sort`, `page`, `limit` |
| `GET` | `/api/products/featured` | Featured products | — |
| `GET` | `/api/products/recommendations` | Recommendations based on favorites | `user_id` |
| `GET` | `/api/products/:category` | Products by category | `filter`, `search`, `sort` |
| `GET` | `/api/products/:category/:slug` | Product detail | — |

### 5.2. Categories

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/categories` | List all categories |

### 5.3. Cart

| Method | Path | Description | Body |
|---|---|---|---|
| `GET` | `/api/cart` | Get user cart | — |
| `POST` | `/api/cart` | Add to cart | `{ product_id }` |
| `DELETE` | `/api/cart/:id` | Remove from cart | — |
| `DELETE` | `/api/cart` | Clear cart | — |

### 5.4. Orders & Payments

| Method | Path | Description | Body |
|---|---|---|---|
| `POST` | `/api/orders` | Create order | `{ items[], payment_method }` |
| `GET` | `/api/orders/:id` | Order detail | — |
| `POST` | `/api/payments` | Process payment | `{ order_id, method }` |

### 5.5. Reviews & Comments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/products/:category/:slug/reviews` | Get reviews |
| `POST` | `/api/products/:category/:slug/reviews` | Submit review |
| `GET` | `/api/products/:category/:slug/comments` | Get comments |
| `POST` | `/api/products/:category/:slug/comments` | Submit comment |

### 5.6. Favorites

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/favorites` | Get user favorites |
| `POST` | `/api/favorites` | Add favorite |
| `DELETE` | `/api/favorites/:id` | Remove favorite |

### 5.7. Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register |
| `POST` | `/api/auth/login` | Login (JWT) |
| `GET` | `/api/auth/me` | Current user |

### 5.8. Search

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/search` | Full-text search | `q` |

---

## 6. Routes

| Path | Page Component | Description |
|---|---|---|
| `/` | Home (kumpulan komponen) | Beranda |
| `/templates` | Templates | Listing template |
| `/templates/c/:filter` | CategoryListing | Filter template per kategori |
| `/templates/:slug` | ProductDetail | Detail template |
| `/integrations` | Integrations | Listing integrasi |
| `/integrations/c/:filter` | CategoryListing | Filter integrasi per kategori |
| `/integrations/:slug` | ProductDetail | Detail integrasi |
| `/chatbots` | Chatbots | Listing chatbot |
| `/chatbots/c/:filter` | CategoryListing | Filter chatbot per platform |
| `/chatbots/:slug` | ProductDetail | Detail chatbot |
| `/automation` | Automation | Listing automation |
| `/automation/c/:filter` | CategoryListing | Filter automation per kategori |
| `/automation/:slug` | ProductDetail | Detail automation |
| `/ai-tools` | AiTools | Listing AI tools |
| `/ai-tools/c/:filter` | CategoryListing | Filter AI tools per kategori |
| `/ai-tools/:slug` | ProductDetail | Detail AI tool |
| `/start-selling` | StartSelling | Pendaftaran penjual dengan form multi-step |
| `/terms` | Terms | Terms of Service |
| `/licenses` | Licenses | Opsi lisensi produk |
| `/api` | ApiDocs | Dokumentasi REST API |
| `/privacy` | Privacy | Kebijakan privasi |
| `/help` | HelpCenter | Pusat bantuan & FAQ |
| `/authors` | Authors | Panduan penulis |
| `/sitemap` | Sitemap | Indeks seluruh halaman |
| `/:category/:slug/preview` | ProductGallery | Gallery: 30 screenshots + 4 demo videos |
| `/login` | Login | Login (standalone, tanpa navbar/footer) |
| `/register` | Register | Register (standalone, tanpa navbar/footer) |
| `/profile` | Profile | Dashboard user (harus login) |

---

## 7. Catatan untuk Pengembangan Backend

### Prioritas API yang Paling Dibutuhkan

1. **Auth** (register/login + JWT) — menggantikan in-memory AuthContext
2. **Products API** — menggantikan 11 file JSON (330 items)
3. **Cart API** — menggantikan localStorage cart
4. **Orders/Payments API** — menggantikan simulasi QRIS + barcode canvas
5. **Favorites API** — menggantikan localStorage favorites
6. **Reviews & Comments API** — menggantikan localStorage review/comment
7. **Search API** — full-text search
8. **Media API** — screenshots + demo videos untuk ProductGallery

### Urutan Migrasi Data

1. Tambah backend + database
2. Migrasi 11 JSON ke tabel `products` + `categories`
3. Ganti `CartContext` dengan panggilan API (state React → server state)
4. Ganti localStorage reviews/comments dengan API
5. Integrasi payment gateway riil (Midtrans/Xendit)
6. Migrasi gambar dari picsum.photos ke self-hosted/CDN

---

## 8. Tabel Ringkasan

| Area | Saat Ini | Target (Future) |
|---|---|---|
| **Data Produk** | 5 file JSON statis | PostgreSQL `products` |
| **State Cart** | localStorage via CartContext | Server-side cart via API |
| **Favorites** | localStorage via CartContext | DB `favorites` via API |
| **Reviews/Comments** | localStorage per produk | DB `reviews` + `comments` via API |
| **Payment** | Canvas QR/barcode simulasi | Payment gateway (Midtrans/Xendit) |
| **Auth** | Dummy in-memory state (AuthContext) | JWT + register/login flow |
| **Search** | Client-side filter array | Full-text search (tsvector / Elasticsearch) |
| **Gambar** | picsum.photos (external) | Self-hosted / CDN |
