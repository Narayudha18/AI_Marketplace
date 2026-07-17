# AI Agents Marketplace — Design Document

## Tech Stack
- React 19 + Vite
- React Router v6
- Tailwind CSS v3
- Material Symbols (icon font)

## Architecture

### Data Layer
- No backend — all data from static JSON files in `src/data/`
- Data files per category: `templates.json`, `integrations.json`, `chatbots.json`, `automation.json`, `aitools.json`
- Each file: array of objects, fields vary by type (`title`/`name`, `price`, `rating`, `category`, `seed`, etc.)

### Routing (`src/App.jsx`)
| Route | Component | Description |
|---|---|---|
| `/` | Home | Landing page (Hero, Categories, ProductGrid, Featured, FavoriteRecommendations) |
| `/:category` | Templates/Integrations/... | Listing pages per category |
| `/:category/c/:filter` | CategoryListing | Filtered listing by subcategory |
| `/:category/:slug` | ProductDetail | Product detail with tabs |

### State Management (`src/CartContext.jsx`)
React Context providing:
- `cart[]` — items in cart (localStorage key: `cart`)
- `purchased[]` — items ever paid for (localStorage key: `purchased`)
- `favorites[]` — items liked by user (localStorage key: `favorites`)

### Payment Gateway (`src/components/PaymentModal.jsx`)
- QRIS (downloadable dummy QR as PNG)
- E-Wallet: DANA, GoPay, ShopeePay, OVO, LinkAja (link to app/website)
- Bank Transfer: BCA, Mandiri, BNI, BRI
- Convenience Store: Alfamart, Indomaret (downloadable barcode)
- On success: all cart items marked as purchased, cart cleared

### Features

#### Shopping Cart
- `CartContext` with `addToCart`, `removeFromCart`, `clearCart`, `inCart`
- `CartDrawer` component: slide-in panel from right, item thumbnails, remove button
- Cart badge with item count in all page headers
- Floating "Tambah ke Keranjang" button on product detail

#### Reviews & Comments
- Tabbed interface: Produk (default), Review & Rating, Komentar, Support
- Reviews: star rating (1-5), name, text — stored in localStorage per product
- Comments: name, text — stored in localStorage per product
- Review form locked behind `hasPurchased()` check

#### Support Tab
- Three static cards: Email Support, Forum Diskusi, Dokumentasi

#### Favorites
- Heart button on product detail and all listing cards
- Toggle between `favorite` (red filled) and `favorite_border` (gray outlined)
- `FavoriteRecommendations` component on home page shows products from same category as favorited items

### Data Flow
```
User Click → Context Function → State Update → localStorage Sync → Re-render
```
