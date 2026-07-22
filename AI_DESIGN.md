# AI Agents Marketplace — Design Doc

## Tech Stack
- React 19 + Vite
- React Router v6 (client-side routing)
- Tailwind CSS v4 (CSS-based config in `src/index.css`)
- LocalStorage via React Context (cart, purchased items, favorites)
- No backend — all data from static JSON files

## Routes (App.jsx)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Navbar, Hero, Categories, ProductGrid, Featured, FavoriteRecommendations, Footer |
| `/templates` | Templates | Template listing with search, filters, sidebar |
| `/templates/c/:filter` | CategoryListing | Filtered template listing |
| `/templates/:slug` | ProductDetail | Product detail page |
| `/integrations` | Integrations | Integrations listing |
| `/integrations/c/:filter` | CategoryListing | Filtered integrations listing |
| `/integrations/:slug` | ProductDetail | Product detail page |
| `/chatbots` | Chatbots | Chatbot listing |
| `/chatbots/c/:filter` | CategoryListing | Filtered chatbot listing |
| `/chatbots/:slug` | ProductDetail | Product detail page |
| `/automation` | Automation | Automation listing |
| `/automation/c/:filter` | CategoryListing | Filtered automation listing |
| `/automation/:slug` | ProductDetail | Product detail page |
| `/ai-tools` | AiTools | AI tools listing |
| `/ai-tools/c/:filter` | CategoryListing | Filtered tools listing |
| `/ai-tools/:slug` | ProductDetail | Product detail page |
| `/start-selling` | StartSelling | Seller registration form |
| `/terms` | Terms | Terms of Service |
| `/licenses` | Licenses | License options |
| `/api` | ApiDocs | API documentation |
| `/privacy` | Privacy | Privacy Policy |
| `/help` | HelpCenter | FAQ & support |
| `/authors` | Authors | Author benefits & guide |
| `/sitemap` | Sitemap | Complete site index |
| `/voice-ai` | VoiceAI | Voice AI listing |
| `/voice-ai/c/:filter` | CategoryListing | Filtered voice AI listing |
| `/voice-ai/:slug` | ProductDetail | Product detail page |
| `/image-gen` | ImageGen | Image Gen listing |
| `/image-gen/c/:filter` | CategoryListing | Filtered image gen listing |
| `/image-gen/:slug` | ProductDetail | Product detail page |
| `/analytics` | Analytics | Analytics listing |
| `/analytics/c/:filter` | CategoryListing | Filtered analytics listing |
| `/analytics/:slug` | ProductDetail | Product detail page |
| `/fine-tuning` | FineTuning | Fine-tuning listing |
| `/fine-tuning/c/:filter` | CategoryListing | Filtered fine-tuning listing |
| `/fine-tuning/:slug` | ProductDetail | Product detail page |
| `/monitoring` | Monitoring | Monitoring listing |
| `/monitoring/c/:filter` | CategoryListing | Filtered monitoring listing |
| `/monitoring/:slug` | ProductDetail | Product detail page |
| `/security` | Security | Security listing |
| `/security/c/:filter` | CategoryListing | Filtered security listing |
| `/security/:slug` | ProductDetail | Product detail page |

## Component Architecture

### App-level
- **App.jsx** — Route definitions, Home wrapper
- **CartContext.jsx** — Global state: cart items, purchased items, favorites. Persisted to localStorage.

### Shared Components (`src/components/`)
- **Navbar.jsx** — Main nav (AI Agents, Templates, Integrations, Chatbots, Automation, AI Tools & APIs) + sub-navbar (All Items, GPT Agents, Voice AI→`/voice-ai`, Image Gen→`/image-gen`, RAG Pipelines→`/integrations`, Workflow→`/automation`, Analytics→`/analytics`, Fine-tuning→`/fine-tuning`, Deployment→`/templates`, Monitoring→`/monitoring`, Security→`/security`) with active-state underlines (`useLocation`)
- **Hero.jsx** — Homepage hero with search bar (navigates to `/templates?search=QUERY`), Ctrl+Enter or button click
- **Categories.jsx** — Expandable category grid (3 visible → 10 expanded, toggle with "View more categories" / "Show less")
- **ProductGrid.jsx** — Featured products grid (from templates data)
- **Featured.jsx** — Featured section with CTA
- **FavoriteRecommendations.jsx** — Product recommendations based on favorited items
- **CartDrawer.jsx** — Slide-in cart panel
- **PaymentModal.jsx** — Payment flow: QRIS, E-Wallet (DANA, GoPay, ShopeePay, OVO, LinkAja), Bank Transfer, Convenience Store
- **Footer.jsx** — Site footer
- **SellerForm.jsx** — Multi-step seller registration form (Akun → Toko → Verifikasi → Selesai)

### Page Components (`src/pages/`)
- **Templates.jsx** — Template listing: search, sidebar filters, 3→8 expandable categories, product grid with favorites
- **Integrations.jsx** — Integration listing: search, sidebar filters, category cards, product grid
- **Chatbots.jsx** — Chatbot listing: search, sidebar filters, category cards, product grid
- **Automation.jsx** — Automation listing: search, sidebar filters, category cards, product grid
- **AiTools.jsx** — AI Tools listing: search, sidebar filters, category cards, product grid
- **CategoryListing.jsx** — Generic filtered listing for all categories (reads URL param `:filter`)
- **ProductDetail.jsx** — Product detail: tabs (Produk, Review & Rating, Komentar, Support), favorites heart, cart, payment
- **StartSelling.jsx** — Seller onboarding page: hero, stats, 2/3 form + 1/3 sidebar info
- **Terms.jsx** — Terms of Service content page
- **Licenses.jsx** — License options with 3 pricing cards
- **ApiDocs.jsx** — REST API endpoint documentation
- **Privacy.jsx** — Privacy Policy content page
- **HelpCenter.jsx** — FAQ accordion + support contact
- **Authors.jsx** — Author guide + benefits list
- **Sitemap.jsx** — Site index with link grid
- **VoiceAI.jsx** — Voice AI listing: search, sidebar filters, category cards, product grid
- **ImageGen.jsx** — Image Gen listing: search, sidebar filters, category cards, product grid
- **Analytics.jsx** — Analytics listing: search, sidebar filters, category cards, product grid
- **FineTuning.jsx** — Fine-tuning listing: search, sidebar filters, category cards, product grid
- **Monitoring.jsx** — Monitoring listing: search, sidebar filters, category cards, product grid
- **Security.jsx** — Security listing: search, sidebar filters, category cards, product grid

Each listing page has:
- A top banner with a CTA button that scrolls to the product grid (`scrollIntoView`)
- A full navbar (duplicated from Navbar.jsx) with `useLocation`-driven active underlines
- A sub-navbar of category filter links
- A categories section with page-specific category cards
- A sidebar + product card grid

## Key Features

### Cart & Checkout
- Add/remove items, persisted in localStorage
- CartDrawer slides in from right with item list, total, checkout button
- PaymentModal with multiple payment methods (QRIS, E-Wallet, Bank Transfer, Alfamart/Indomaret)

### Reviews
- Review form gated by `hasPurchased()` — only users who bought the item can review
- Star rating + text review

### Favorites
- Heart toggle on product detail (next to "Tambah ke Keranjang") and all listing cards
- `isFavorite()` / `toggleFavorite()` from CartContext
- FavoriteRecommendations on homepage shows products from same data source as favorited items

### Search
- Homepage search bar navigates to `/templates?search=QUERY`
- Templates page reads `?search=` param on mount and auto-applies filter

### Categories
- Homepage: 10 categories (ChatGPT Agents, Voice AI, Image Gen, RAG Pipelines, Workflow Automation, Analytics, Fine-tuning, Deployment, Monitoring, Security)
- Initial display: 3, expandable to all 10
- Each listing page has its own 3-4 category cards, with Templates having expandable 8

## Styling
- Tailwind CSS v4 with `@theme` custom colors in `index.css`
- Dark header (`bg-text-main`) with light page background (`bg-background`)
- Material Symbols for icons
- Product cards: shadow + border + hover effects

## Data
Static JSON in `src/data/`:
- `templates.json`
- `integrations.json`
- `chatbots.json`
- `automation.json`
- `aitools.json`
- `voice-ai.json`
- `image-gen.json`
- `analytics.json`
- `fine-tuning.json`
- `monitoring.json`
- `security.json`

Each item has: name/title, description, price, sales, rating, category, image, author, etc.
