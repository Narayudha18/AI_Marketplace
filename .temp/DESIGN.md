# AI Agents Marketplace — Design Doc v6.0

## Tech Stack
- React 19 + Vite 8
- React Router v7 (client-side routing)
- Tailwind CSS v4 (CSS-based config in `src/index.css`)
- LocalStorage via React Context (cart, purchased items, favorites, theme)
- In-memory auth via React Context (users array, no persistence)
- Dark mode via CSS variables + localStorage
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
| `/:category/:slug/preview` | ProductGallery | 30 screenshots + 4 demo videos gallery |
| `/login` | Login | Standalone login page (email/password) |
| `/register` | Register | Standalone register page (email/password) |
| `/profile` | Profile | User dashboard: avatar, account details, change password |

## Component Architecture

### App-level
- **App.jsx** — Route definitions, Home wrapper, global scroll-to-top on pathname change
- **CartContext.jsx** — Global state: cart items, purchased items, favorites. Persisted to localStorage.
- **AuthContext.jsx** — Global auth state: users array, currentUser, register/login/logout, updatePassword, updatePicture. In-memory only.
- **ThemeContext.jsx** — Dark mode toggle, persisted to localStorage, falls back to `prefers-color-scheme`

### Shared Components (`src/components/`)
- **Navbar.jsx** — Premium style: gradient announcement bar ("New" badge), sticky header (`sticky top-0 z-40`), pill-tab main nav with bottom active indicator, sub-nav pills, dark mode toggle (Material Symbols: `light_mode`/`dark_mode`), cart button, AuthButton. No hover effects on main nav links. Right-side order: [Start Selling] [Cart] [Dark Toggle] [AuthButton]
- **Hero.jsx** — Homepage hero with search bar (navigates to `/templates?search=QUERY`), Ctrl+Enter or button click
- **Categories.jsx** — Expandable category grid (3 visible → 10 expanded)
- **ProductGrid.jsx** — Featured products grid (from all 11 JSON data files), on-page filter buttons with state filtering + scroll to grid
- **Featured.jsx** — Featured section with CTA
- **FavoriteRecommendations.jsx** — Product recommendations based on favorited items (English UI)
- **CartDrawer.jsx** — Slide-in cart panel, dollar (`$`) price formatting
- **PaymentModal.jsx** — Payment flow: QRIS, E-Wallet, Bank Transfer, Convenience Store
- **Footer.jsx** — Site footer
- **SellerForm.jsx** — Multi-step seller registration form (Account → Store → Verification → Done), English UI
- **AuthButton.jsx** — Conditional auth UI: logged out→"Sign In" link, logged in→avatar+name link to /profile + dropdown arrow for Sign Out

### Page Components (`src/pages/`)
- **Templates.jsx** — Template listing with premium navbar, banner, sub-nav pills, sidebar filters, product grid with pagination ("Load more"), auto-scroll on sub-nav click
- **Integrations.jsx** — Same pattern as Templates
- **Chatbots.jsx** — Same pattern as Templates
- **Automation.jsx** — Same pattern as Templates
- **AiTools.jsx** — Same pattern as Templates
- **VoiceAI.jsx** — Same pattern as Templates
- **ImageGen.jsx** — Same pattern as Templates
- **Analytics.jsx** — Same pattern as Templates
- **FineTuning.jsx** — Same pattern as Templates
- **Monitoring.jsx** — Same pattern as Templates
- **Security.jsx** — Same pattern as Templates
- **CategoryListing.jsx** — Generic filtered listing (reads URL param `:filter`), premium navbar, sidebar search, auto-scroll on sub-nav click
- **ProductDetail.jsx** — Premium navbar, 3 rich sections: About This Product (category-specific + 6 feature cards), How to Use (5 step cards), Screenshots & Demo (6-image grid). English UI. "Live Preview" button navigates to `/preview` gallery. Reviews & Comments tabs.
- **ProductGallery.jsx** — 30 screenshots (3-column grid, hero spans full width on top) + 4 auto-playing demo videos with controls fallback. Route: `/:category/:slug/preview`
- **StartSelling.jsx** — Seller onboarding with premium navbar, hero, stats, form + sidebar. English UI.
- **Terms.jsx** — Terms of Service content page
- **Licenses.jsx** — License options with 3 pricing cards
- **ApiDocs.jsx** — REST API endpoint documentation
- **Privacy.jsx** — Privacy Policy content page
- **HelpCenter.jsx** — FAQ accordion + support contact
- **Authors.jsx** — Author guide + benefits list
- **Sitemap.jsx** — Site index with link grid
- **Login.jsx** — Standalone login (no navbar/footer). Email/password form. Redirects to `/` on success.
- **Register.jsx** — Standalone register (no navbar/footer). Email/password form. Redirects to `/` on success.
- **Profile.jsx** — User dashboard with avatar, name, email, change password form.

## Key Features

### Dark Mode
- ThemeContext toggle persisted to localStorage
- Falls back to `prefers-color-scheme` media query
- Flash-prevention inline script in `<head>` of `index.html`
- `.dark` CSS variable overrides in `index.css`
- Toggle button in all navbars (`light_mode`/`dark_mode` icons)

### Cart & Checkout
- Add/remove items, persisted in localStorage
- CartDrawer slides in from right with item list, total, checkout button
- PaymentModal with multiple payment methods (QRIS, E-Wallet, Bank Transfer, Alfamart/Indomaret)
- Dollar (`$`) price formatting

### Reviews & Comments
- Review form gated by `hasPurchased()`
- Star rating + text review
- Comment section available to all users

### Favorites
- Heart toggle on product detail and all listing cards
- `isFavorite()` / `toggleFavorite()` from CartContext
- FavoriteRecommendations on homepage

### Search & Filter
- Homepage search bar navigates to `/templates?search=QUERY`
- Each listing page: sidebar search + category checkboxes + price range + sort
- Category search input in sidebar for quick filtering
- Auto-scroll to product grid on sub-nav pill click and filter apply

### Pagination
- "Load more" button on all 12 listing pages
- Initial 6 items visible, increments by 6 on click
- Button hidden when all items shown

### Auto-scroll
- Sub-nav pill clicks → auto-scroll to product grid
- Sidebar checkbox toggle → auto-scroll to product grid (productRef)
- Main navbar links → NO auto-scroll (via `state={{ skipScroll: true }}`)
- Global scroll-to-top on route change in App.jsx
- Hero "Get Started" button → scroll to grid
- Sidebar search application → scroll to products

## Styling
- Tailwind CSS v4 with `@theme` custom colors in `index.css`
- Dark header (`bg-text-main`) with light page background (`bg-background`)
- Premium navbar: gradient announcement bar (`from-primary-container to-blue-600` + "New" badge)
- Material Symbols for icons (`material-symbols-outlined`)
- Product cards: shadow + border + hover effects
- Sub-nav pills: `hover:bg-surface-container-low hover:text-primary`
- Main nav links: `text-surface-variant hover:text-surface`

## Data
Static JSON in `src/data/` — each file expanded to 30 items:

- `templates.json` (30 items)
- `integrations.json` (30 items)
- `chatbots.json` (30 items)
- `automation.json` (30 items)
- `aitools.json` (30 items)
- `voice-ai.json` (30 items)
- `image-gen.json` (30 items)
- `analytics.json` (30 items)
- `fine-tuning.json` (30 items)
- `monitoring.json` (30 items)
- `security.json` (30 items)

Each item has: name/title, description, price, sales, rating, category, image (seed-based picsum.photos), author, etc.

## Data Flow
- Products: Static JSON → imported directly in listing pages → filtered/sorted client-side
- Cart/Favorites: React Context → localStorage
- Auth: React Context (in-memory, no persistence)
- Theme: React Context → localStorage
- Reviews/Comments: localStorage per product (keyed by slug)
- Images: picsum.photos with seed parameter
