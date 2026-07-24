---
name: ui/ux
description: >
  Mengelola UI/UX project React + Tailwind. Otomatis scan komponen,
  update DESIGN.md, generate React components, dan catat setiap
  perubahan komponen/fitur ke changelog.
---

## Diagram Skill — Struktur Dokumen

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │                         UI/UX SKILL                                   │
  │  Mengelola UI/UX React + Tailwind. Auto scan, generate, mock JSON.   │
  └──────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────────┐
            │                         │                             │
            ▼                         ▼                             ▼
    ┌──────────────┐        ┌──────────────────┐        ┌────────────────────┐
    │   TRIGGER    │        │   STACK TARGET   │        │  WORKFLOW (6 step) │
    │              │        │                  │        │                    │
    │ • auto: file │        │ React 19         │        │ Step 1: SCAN UI    │
    │   komponen   │        │ Vite 8           │        │ Step 2: UPDATE     │
    │ • manual:    │        │ Tailwind v4      │        │   DESIGN.md        │
    │   prompt     │        │ react-router v7  │        │ Step 3: MOCK JSON  │
    └──────┬───────┘        └──────────────────┘        │ Step 4: GENERATE   │
           │                                            │   KOMPONEN         │
           ▼                                            │ Step 5: CHANGELOG  │
    ┌──────────────────┐                                │ Step 6: UPDATE     │
    │  KONFIRMASI?     │                                │   component.md     │
    │  (DESIGN.md baru)│                                └────────┬───────────┘
    │  Ya ──► Tanya    │                                         │
    │        selektif  │                                         ▼
    │  Tidak──► Lanjut │                                ┌────────────────────┐
    └──────────────────┘                                │      OUTPUT        │
                                                         │ • File komponen   │
            ┌──────────────────┐                         │ • Mock JSON (docs/)│
            │   ATURAN (6)     │                         │ • DESIGN.md baru  │
            │                  │                         │ • CHANGELOG.md    │
            │ 1. Konfirmasi    │                         │ • component.md    │
            │ 2. Minor auto    │                         │ • Ringkasan user  │
            │ 3. Changelog     │                         └────────────────────┘
            │ 4. DESIGN sinkron│
            │ 5. Mock JSON     │        ┌────────────────────────────────────┐
            │ 6. Konsistensi   │        │      BACKEND COORDINATION          │
            └──────┬───────────┘        │                                    │
                   │                    │ • Alur FE→BE (mock JSON contract)  │
                   ▼                    │ • Branch strategy (sub-branch)     │
    ┌──────────────────────────┐        │ • Backlog & GitHub Issues          │
    │   SOURCE PRIORITY        │        │ • 6 perubahan wajib komunikasi    │
    │   1. User command        │        │ • Sinkronisasi component.md       │
    │   2. DESIGN.md           │        └────────────────────────────────────┘
    │   3. Kode aktual         │
    │   4. Jangan tebak        │
    └──────────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │   PENANGANAN DESIGN.md      │
    │   BARU DARI USER            │
    │                             │
    │ • Wajib tanya dulu         │
    │ • Gabung selektif          │
    │ • DESIGN.md tetap 1 file   │
    │ • Versi increment          │
    │ • Catat changelog          │
    │ • Kode hanya setelah       │
    │   user setuju              │
    └─────────────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │   TAILWIND CSS v4           │
    │   SPESIFIK PROJECT          │
    │                             │
    │ • @theme tokens             │
    │ • Perbedaan v4 vs v3        │
    │ • Aturan generate           │
    └─────────────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │   CODE REVIEW CHECKLIST     │
    │                             │
    │ • Struktur & Impor          │
    │ • Routing                   │
    │ • Styling                   │
    │ • State & Data Flow         │
    │ • Mock JSON                 │
    │ • component.md/DESIGN.md    │
    │ • CHANGELOG.md              │
    └─────────────────────────────┘
```

## Trigger

Berjalan otomatis saat ada perubahan pada file UI:
- `src/components/*.jsx` — komponen dibuat/diedit/dihapus
- `src/pages/*.jsx` — halaman baru/berubah
- `src/App.jsx` — routing berubah
- `src/CartContext.jsx` — state management berubah
- `.temp/DESIGN.md` — design spec utama (wajib diupdate)
- `AI_DESIGN.md` — copy design spec di dalam project (wajib diupdate)
- `NEW_DESIGN.md` — **jangan diupdate** (akan dihapus user)
- `src/data/*.json` — struktur data berubah

Bisa juga dipanggil manual via prompt:
- "update UI" / "ubah design" — update komponen existing berdasarkan DESIGN.md baru
- "Make UI" — buat halaman/komponen **baru** berdasarkan NEW_DESIGN.md yang user kasi sebagai referensi
- "tambah halaman X" — buat halaman spesifik

## Stack Target

| Layer | Teknologi |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| Icons | Material Symbols (Google Fonts) |
| Images | picsum.photos (seed-based) |
| State | React Context + localStorage |
| Data | JSON di `src/data/` |

## Workflow

### Diagram Alur

```
                                ┌──────────────────────────┐
                                │   TRIGGER                │
                                │  • File komponen berubah  │
                                │  • File DESIGN.md manual  │
                                │  • Prompt user            │
                                └───────────┬──────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────────┐
                          │  KONFIRMASI?                        │
                          │  (Jika user kirim DESIGN.md baru)   │
                          │  Tanya fitur mana mau digabung      │
                          └────────────────┬────────────────────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                  ┌─────────────────────┐    ┌──────────────────┐
                  │ Step 1: SCAN UI     │    │ TOLAK / TUNDA    │
                  │ • src/components/   │    └──────────────────┘
                  │ • src/pages/        │
                  │ • src/App.jsx       │
                  │ • src/CartContext   │
                  └──────────┬──────────┘
                             │
                             ▼
                   ┌──────────────────────┐
                   │ Step 2: UPDATE       │
                   │         DESIGN.md    │
                   │ • Versi ↑            │
                   │ • Structure/Routes   │
                   │ • Components/State   │
                   │ • Styling/Data Flow  │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Step 3: BUAT MOCK    │
                   │         JSON         │
                   │ • docs/mock/<page>/  │
                   │ • Format kontrak BE  │
                   │ • Response = props   │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Step 4: GENERATE     │
                   │         / UPDATE     │
                   │         KOMPONEN     │
                   │ • Baru → create file │
                   │ • Existing → edit    │
                   │ • Route → App.jsx    │
                   │ • State → CartContext│
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Step 5: CHANGELOG    │
                   │ • Komponen           │
                   │ • Fitur              │
                   │ • Data               │
                   │ • Routing            │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │ Step 6: UPDATE       │
                   │         component.md │
                   │ • Mapping komponen   │
                   │ • API/DB mapping     │
                   │ • Mock file ref      │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │      OUTPUT          │
                   │ 1. File komponen     │
                   │ 2. Mock JSON (docs/) │
                   │ 3. DESIGN.md (v baru)│
                   │ 4. CHANGELOG.md      │
                   │ 5. component.md      │
                   │ 6. Ringkasan ke user │
                   └──────────────────────┘
```

### Step 1 — Scan UI Saat Ini

Baca dan catat seluruh komponen:

1. **`src/components/`** — Navbar, Hero, Categories, ProductGrid, Featured,
   Footer, CartDrawer, PaymentModal, FavoriteRecommendations (+ tambahan baru)
2. **`src/pages/`** — Templates, Integrations, Chatbots, Automation, AiTools,
   ProductDetail, CategoryListing (+ halaman baru)
3. **`src/App.jsx`** — daftar route
4. **`src/CartContext.jsx`** — state, method, persistensi

Untuk setiap komponen catat:
- Nama komponen
- Path file
- Halaman / section tempat komponen muncul
- Props (jika ada)
- Local state
- Hooks digunakan (useState, useEffect, useLocation, useCart, dll)
- Event handlers
- Data dependencies (JSON file apa yang diimpor)

### Step 2 — Update DESIGN.md & AI_DESIGN.md

Update **semua** file design (`DESIGN.md` dan `AI_DESIGN.md`) agar sinkron dengan kode aktual. Kecuali `NEW_DESIGN.md` — jangan disentuh.

- **Versi** — increment minor tiap update UI, major tiap redesign
- **Project Structure** — tambah/hapus file komponen
- **Routes** — tambah/hapus route
- **Component List** — sinkronkan daftar komponen + deskripsi
- **State Management** — update jika CartContext berubah
- **Data Flow** — update jika struktur JSON atau data dependencies berubah
- **Styling** — update jika theme tokens (warna, rounded, spacing) berubah

### Step 3 — Buat Mock JSON (Contract First)

Buat mock JSON sebagai **kontrak API** untuk backend. Backend akan baca mock JSON ini lalu buat OpenAPI spec + implementasi yang cocok.

Lokasi: `docs/mock/<page>/<method>-<slug>.json` — satu file per endpoint.

Format (ikuti struktur dari backend workflow):

```json
{
  "endpoint": "GET /api/products",
  "response": {
    "data": [
      {
        "id": "uuid-1",
        "name": "AI Chatbot Template",
        "price": 49.99,
        "category": "templates"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 42
    }
  }
}
```

Aturan:
- **Response keys** = props yang dipakai komponen — backend jadikan ini sebagai OpenAPI contract
- **Satu file per endpoint** — jangan gabung multiple endpoint dalam satu file
- Nama file: `get-products.json`, `post-cart.json`, `put-user-id.json`
- Response harus mencakup **happy path** (data normal) dan representasi struktur realistis
- Jika komponen butuh endpoint baru → buat mock JSON dulu SEBELUM generate komponen
- Jika cuma perubahan UI statis (warna, layout, text) → tidak perlu mock JSON

Cross-reference dengan backend:
- Backend workflow: mock JSON → OpenAPI spec (`docs/api/feat-xxx.yaml`) → DB migration → kode Go
- Frontend cuma buat mock JSON, sisanya (OpenAPI, migration, handler) urusan backend
- Ketika API real sudah jadi, komponen tinggal ganti import dari mock JSON ke fetch/axios

### Step 4 — Generate / Update Komponen

Buat atau ubah komponen React + Tailwind berdasarkan DESIGN.md:

1. Komponen baru → buat file di `src/components/` atau `src/pages/`
2. Komponen existing → update sesuai perubahan design
3. Route baru → update `App.jsx`
4. State baru → update `CartContext.jsx`
5. Data dari endpoint → render dari mock JSON di `docs/mock/` dulu

Patuhi konvensi kode existing:
- Functional component + export default
- Props destructuring
- Tailwind utility classes (bukan CSS modules)
- Material Symbols untuk icon
- picsum.photos untuk placeholder gambar
- Link dari react-router-dom untuk navigasi

### Step 5 — Catat Perubahan (Changelog)

Update file **`CHANGELOG.md`** di root project (`ai-marketplace/CHANGELOG.md`)
dengan format berikut:

```markdown
## [version] — YYYY-MM-DD

### Komponen
- **Navbar** — tambah dropdown user menu [file: src/components/Navbar.jsx]
- **ProductCard** — ubah layout hover effect, shadow-md jadi shadow-lg [file: src/components/ProductGrid.jsx]
- **Footer** — hapus social media links [file: src/components/Footer.jsx]

### Fitur
- [Feat] Search bar di hero sekarang navigate ke /templates?search=
- [Feat] Filter sidebar tambah price range slider
- [Fix] Cart badge tidak update setelah remove item
- [Style] Warna primary-container berubah #2563EB -> #1D4ED8

### Data
- templates.json: tambah field `features[]`
- aitools.json: hapus field `badge`, ganti `pricing`

### Routing
- Tambah route /profile (halaman baru)
- Hapus route /ai-tools/c/:filter

### Catatan
- Perlu migrasi localStorage untuk user existing
- incompatible dengan backend API versi lama
```

Detail tiap entri:

#### Komponen
Tiap baris format: `**NamaKomponen** — deskripsi perubahan [file: path/lengkap.jsx]`

Kategorikan sebagai:
- **Baru** — komponen belum ada sebelumnya
- **Ubah** — props/state/styling/logic berubah
- **Hapus** — komponen dihapus
- **Refactor** — logic diubah tanpa perubahan visual

#### Fitur
Gunakan prefix:
- `[Feat]` — fitur baru
- `[Fix]` — bug fix
- `[Style]` — perubahan styling/tampilan
- `[Refactor]` — perubahan kode tanpa perubahan perilaku
- `[Perf]` — optimasi performa
- `[Chore]` — tugas maintenance (rename file, update dependensi)

#### Data
Catat perubahan struktur JSON:
- Nama file
- Field ditambah/dihapus/berubah

#### Routing
- Route ditambah/dihapus/diganti path

#### Mock JSON
- `docs/mock/templates/get-products.json` — endpoint baru
- `docs/mock/cart/post-checkout.json` — response shape berubah

### Step 6 — Update component.md

Sinkronkan `component.md` (root project) dengan perubahan:
- Baris baru untuk komponen baru
- Update mapping jika API/DB berubah
- Tambah kolom `Mock File` dan `Status` untuk tiap endpoint
- Hapus baris jika komponen dihapus

### Step 7 — Push ke GitHub

Setelah semua perubahan selesai, auto-push ke kedua remote:

```bash
git add .
git commit -m "update: [ringkasan perubahan]"
git push origin skeleton
git push delcode skeleton
```

Target repo:
- `origin` → `https://github.com/Narayudha18/AI_Marketplace.git`
- `delcode` → `https://github.com/delcode92/ACM_AI_MARKETPLACE.git`
Branch: `skeleton`

Jika remote belum terdaftar, jalankan:
```bash
git remote add origin https://github.com/Narayudha18/AI_Marketplace.git
git remote add delcode https://github.com/delcode92/ACM_AI_MARKETPLACE.git
```

## Output

Setelah workflow selesai, hasilnya:

1. **File komponen** — baru / diupdate di `src/components/` atau `src/pages/`
2. **Mock JSON** — baru / diupdate di `docs/mock/<page>/`
3. **`.temp/DESIGN.md`** — versi terbaru design spec (wajib update)
4. **`AI_DESIGN.md`** — copy design spec di project (wajib update juga)
5. **`CHANGELOG.md`** — catatan perubahan lengkap (komponen, fitur, data, routing, mock)
6. **`component.md`** — mapping komponen sinkron (termasuk mock file + status)
6. **Ringkasan** — tampilkan ke user daftar perubahan yang dilakukan
7. **Push ke GitHub** — auto-commit + push ke `Narayudha18/AI_Marketplace`

## Aturan

1. **Jangan ubah kode tanpa konfirmasi** — Tanya user dulu jika perubahan besar
   (redesign, hapus komponen, ganti library, ubah routing structure)
2. **Perubahan kecil** langsung jalan (tambah button, ubah warna, ganti text)
3. **Changelog wajib diupdate** setiap kali ada perubahan komponen/fitur
4. **Semua file design** (`.temp/DESIGN.md` + `AI_DESIGN.md`) harus selalu sinkron dengan kode aktual — jangan sentuh `NEW_DESIGN.md`
5. **Mock JSON wajib dibuat** untuk tiap endpoint baru yang dibutuhkan komponen — ikuti format kontrak backend (`endpoint` + `response`)
6. **Prioritas** — jaga konsistensi dengan kode existing

## Source Priority

Saat DESIGN.md dan kode aktual tidak sinkron, ikuti aturan prioritas berikut:

| Prioritas | Source | Kapan Digunakan |
|-----------|--------|-----------------|
| 1 (Tertinggi) | **Perintah user langsung** | User bilang "ubah button jadi merah" → lakukan, meski DESIGN.md bilang biru |
| 2 | **DESIGN.md** | Untuk spec visual, layout, warna, typografi, spacing, routes |
| 3 | **Kode aktual** | Untuk detail implementasi (nama fungsi, hooks, struktur state) — asumsikan kode yang jalan adalah correct |
| 4 (Terendah) | **Deduksi / asumsi** | Jangan tebak-nebak. Jika tidak ada referensi di 3 source di atas, TANYA user |

### Contoh Kasus

| Situasi | Tindakan |
|---------|----------|
| DESIGN.md bilang Hero pakai background gradient, kode pakai solid color | Update kode ke gradient (DESIGN.md menang untuk visual) |
| Kode punya state `searchQuery`, DESIGN.md tidak sebut | Pertahankan state di kode (kode menang untuk implementasi) |
| DESIGN.md punya halaman Profile, kode belum ada | Tanya user: "DESIGN.md ada halaman Profile, mau dibuat?" |
| DESIGN.md hapus fitur filter harga, kode masih ada | Update kode: hapus filter harga (DESIGN.md menang) |
| User prompt: "ganti font Inter ke Poppins" | Langsung jalan, update DESIGN.md + kode (user command priority 1)

## Tailwind CSS v4 — Spesifik Project

Project ini pakai **Tailwind CSS v4** dengan konfigurasi CSS-based (bukan `tailwind.config.js`).

### @theme Tokens

Semua token kustom didefinisikan di `src/index.css` menggunakan `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #162D6D;
  --color-primary-container: #2563EB;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #DBEAFE;
  --color-surface: #FFFFFF;
  --color-background: #f8f9fb;
  --color-text-main: #222222;
  --color-text-muted: #555555;
  --color-border-light: #E5E7EB;
  /* ... lainnya lihat .temp/DESIGN.md */
  --font-family-sans: Inter, sans-serif;
}
```

Gunakan token ini sebagai class Tailwind:
- `bg-primary` — background `#162D6D`
- `text-on-primary` — text `#ffffff`
- `bg-primary-container` — background `#2563EB`
- `border-border-light` — border `#E5E7EB`
- `text-text-muted` — text `#555555`

### Perbedaan Tailwind v4 vs v3 yang Relevan

| v3 (Lama) | v4 (Project Ini) |
|-----------|-----------------|
| `tailwind.config.js` | `@theme` di `index.css` |
| `@apply` komponen | Utility classes langsung |
| `@layer` | Tidak perlu |
| `dark:` class | Pakai `@media (prefers-color-scheme: dark)` |
| `ring` utility | Sama, tetap bisa |
| Plugin via npm | Plugin via `@plugin` di CSS |

### Aturan Generate Komponen

1. Pakai token kustom (`bg-primary`, `text-text-muted`) — jangan hardcode hex
2. Jangan buat `tailwind.config.js` — semua konfigurasi di `index.css`
3. Jangan tambah `@apply` — utility classes langsung di JSX
4. Cek `index.css` sebelum pakai class yang mencurigakan — mungkin itu token kustom

## Code Review Checklist

Sebelum selesai, periksa:

### Struktur & Impor
- [ ] Impor React: `import ... from "react"`
- [ ] Impor react-router: `useLocation`, `Link`, `useParams`, `useNavigate`
- [ ] Impor CartContext: `useCart()` dari `../CartContext`
- [ ] Impor data JSON path benar (`../data/templates.json`)
- [ ] Export default ada di akhir file

### Routing
- [ ] Route baru udah ditambah di `App.jsx`
- [ ] `useParams` dipakai untuk baca slug dari URL
- [ ] `Link to` path cocok dengan route definition
- [ ] Navigasi setelah action (add to cart, submit) benar

### Styling
- [ ] Token kustom (`bg-primary`, dll) bukan hex hardcode
- [ ] Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- [ ] Hover state: `hover:shadow-md`, `hover:scale-105`
- [ ] Ikon Material Symbols: class `material-symbols-outlined`

### State & Data Flow
- [ ] Mengakses context dengan benar: `const { addToCart, isFavorite } = useCart()`
- [ ] State lokal pake `useState`, efek samping pake `useEffect`
- [ ] localStorage tidak diakses langsung — selalu lewat CartContext
- [ ] Data JSON diimpor sebagai array, difilter sesuai kebutuhan

### Mock JSON
- [ ] File mock JSON dibuat di `docs/mock/<page>/<method>-<slug>.json`
- [ ] Response keys cocok dengan props yang dipakai komponen
- [ ] Format mengikuti kontrak backend (`endpoint` + `response`)
- [ ] Satu file per endpoint (bukan gabung)
- [ ] Kalau cuma UI statis — tidak perlu mock JSON, skip

### component.md & DESIGN.md
- [ ] Komponen baru tercatat di `component.md`
- [ ] `component.md` kolom `Mock File` dan `Status` terisi
- [ ] `.temp/DESIGN.md` sinkron: struktur, route, daftar komponen
- [ ] `AI_DESIGN.md` juga sinkron
- [ ] Versi DESIGN.md sudah di-increment

### CHANGELOG.md
- [ ] Entri komponen ditulis (nama, deskripsi, file path)
- [ ] Entri fitur dengan prefix yang benar (`[Feat]`, `[Fix]`, dll)
- [ ] Data/routing changes dicatat jika ada
- [ ] Mock JSON baru/perubahan dicatat di `### Mock JSON`

## Penanganan DESIGN.md Baru dari User + "update ui"

Ketika user memberikan file DESIGN.md baru (unggah, tempel, atau tunjuk file lain) lalu bilang "update ui", ikuti prosedur berikut:

### Wajib: Analisis Perubahan + Tanya Selektif

Jangan langsung menggabungkan, mengganti, atau mengimplementasikan apapun. Wajib tanya user fitur mana saja yang mau diimplementasi. Formatnya:

```
Saya terima DESIGN.md baru. Ini perbandingannya:

**DESIGN.md Saat Ini (.temp/DESIGN.md):**
• [daftar fitur utama versi lama — 3-5 poin]

**DESIGN.md Baru:**
• [daftar fitur utama versi baru — 3-5 poin]

**Perubahan yang terdeteksi:**
1. [Judul perubahan] — [bagian yang berubah, 1 kalimat]
2. [Judul perubahan] — [bagian yang berubah, 1 kalimat]
3. [Judul perubahan] — [bagian yang berubah, 1 kalimat]
   ...

**Mau fitur mana yang diimplementasi?**
Bisa pilih nomornya (pisah koma), "semua", atau "tidak sama sekali".
```

Contoh konkret:

```
Saya terima DESIGN.md baru. Ini perbandingannya:

**DESIGN.md Saat Ini (.temp/DESIGN.md v4.0):**
• Hero split layout (text kiri, gambar kanan)
• Navbar dua-tier (brand + nav links)
• Filter sidebar dengan price range
• 5 halaman listing dengan sidebar filter
• Footer 4-column grid

**DESIGN.md Baru:**
• Hero full-width dengan background video
• Navbar single-tier dengan mega menu
• Filter sidebar tanpa price range (ganti toggle)
• 5 halaman listing + halaman Profile baru
• Footer 2-column grid + newsletter signup

**Perubahan yang terdeteksi:**
1. Hero — layout split jadi full-width video background
2. Navbar — dua-tier jadi single-tier + mega menu
3. Sidebar — price range dihapus, ganti toggle switch
4. Halaman baru — Profile page di /profile
5. Footer — 4-column jadi 2-column + newsletter

**Mau fitur mana yang diimplementasi?**
Bisa pilih nomornya (pisah koma), "semua", atau "tidak sama sekali".
```

Setelah user pilih, **wajib konfirmasi lagi** sebelum eksekusi:

```
Oke, saya akan update **.temp/DESIGN.md** dengan fitur nomor [1, 3, 5] dari NEW_DESIGN.md.
Lanjut update?
```

### Prinsip Penggabungan

1. **File design ada 2** — `.temp/DESIGN.md` (utama) + `AI_DESIGN.md` (copy di project). Keduanya wajib sinkron. `NEW_DESIGN.md` jangan disentuh.
2. **Gabung selektif** — jangan tambahkan semua perubahan dari DESIGN.md baru secara otomatis. Hanya bagian yang user setujui saja yang digabung
3. **Versi increment** — setelah penggabungan, naikkan versi DESIGN.md (minor jika tambah fitur, major jika redesign)
4. **Catat changelog** — tulis setiap bagian yang digabung ke CHANGELOG.md di bawah `### Design Merge`
5. **Konfirmasi akhir** — tampilkan ringkasan fitur yang akan diupdate, tanya "Lanjut update?" sebelum menyentuh file
6. **Kode hanya setelah user setuju** — jalankan workflow Step 3-6 hanya setelah user konfirmasi
7. **Semua file design** (`.temp/DESIGN.md` + `AI_DESIGN.md`) WAJIB diupdate setiap skenario — sinkron dengan kode aktual. `NEW_DESIGN.md` jangan disentuh.

### Rollback / Kembalikan Ke Sebelumnya

User bisa minta mengembalikan tampilan ke sebelum perubahan kapan saja.

**Cara kerja:**
- Sebelum mengubah file apa pun (`.temp/DESIGN.md`, `AI_DESIGN.md`, komponen, dll), **backup dulu konten asli** ke `docs/rollback/` dengan timestamp
- Format backup: `docs/rollback/<file-path-yang-diubah>.<timestamp>.bak`
- Jika user bilang "kembalikan", "balikin", "rollback", "undo", atau "kembali ke sebelum": restore file dari backup, hapus backup file, update CHANGELOG.md

**Aturan:**
1. Backup **selalu dibuat sebelum edit pertama** di sesi perubahan
2. Backup mencakup semua file yang akan disentuh: `.temp/DESIGN.md`, komponen, `App.jsx`, `CartContext.jsx`
3. Rollback mengembalikan **semua file** di sesi itu, bukan per-file
4. Backup terakhir otomatis dihapus setelah rollback dieksekusi
5. Catat rollback di CHANGELOG.md dengan label `[Rollback]`

## Perintah "Make UI" — Buat Halaman/Komponen Baru dari NEW_DESIGN.md

### Trigger

User ketik: `Make UI`

### Tujuan

Membuat halaman dan/atau komponen **baru** (tidak mengubah existing) berdasarkan file referensi visual yang user berikan (NEW_DESIGN.md).

Berbeda dengan "update ui" yang menganalisis perubahan lalu gabung selektif, "Make UI" bersifat **create-only**: baca referensi → generate kode baru.

### Cara Kerja

#### 1. Minta Referensi (jika belum ada)

Jika user belum pernah kasi NEW_DESIGN.md di sesi ini, tanya:

```
"Make UI" — Siapkan file referensi desain (nama bebas, misal NEW_DESIGN.md).
Tempel kontennya atau sebut file path-nya.
```

#### 2. Baca & Analisis Referensi

Baca file referensi yang user kasi. Identifikasi:

- **Halaman baru** yang perlu dibuat — `src/pages/<Name>.jsx`
- **Komponen baru** yang perlu dibuat — `src/components/<Name>.jsx`
- **Route baru** — path URL, params
- **Data dependencies** — JSON data, mock API
- **Styling tokens** — warna, font, layout baru (jika ada)

#### 3. Konfirmasi Rencana ke User

Tampilkan daftar item yang akan dibuat:

```
Dari NEW_DESIGN.md, saya rencanakan buat:

**Halaman Baru:**
1. /profile — ProfilePage.jsx (halaman user profile)
2. /dashboard — DashboardPage.jsx (statistik & aktivitas)

**Komponen Baru:**
3. ProfileCard — kartu informasi user
4. ActivityChart — grafik aktivitas

**Mock JSON Baru:**
5. GET /api/user/profile
6. GET /api/user/activity

Lanjut buat?
```

#### 4. Eksekusi (Create Only)

Setelah user setuju, jalankan:

**a. Backup** — backup file yang akan disentuh (App.jsx, DESIGN.md, dll) ke `docs/rollback/`

**b. Update file design** — update `.temp/DESIGN.md` dan `AI_DESIGN.md` (jangan sentuh `NEW_DESIGN.md`):
  - Versi increment minor
  - Tambah entry di Project Structure jika ada file baru
  - Tambah entry di Routes
  - Tambah entry di Component List
  - Tambah entry di Data Flow / Mock API
  - Tambah layout diagram jika halaman baru punya layout berbeda

**c. Buat Mock JSON** untuk tiap endpoint baru di `docs/mock/<page>/<method>-<slug>.json`

**d. Generate Komponen/Halaman Baru:**
  - Ikuti konvensi kode existing (functional component, Tailwind v4 tokens, Material Symbols, dll)
  - JANGAN ubah komponen existing — hanya buat file baru
  - Halaman baru → `src/pages/`
  - Komponen baru → `src/components/`

**e. Update App.jsx** — tambah route baru (import + route definition)

**f. Update CartContext.jsx** — hanya jika state global baru diperlukan

**g. Update CHANGELOG.md** — catat semua item baru

**h. Update component.md** — tambah baris baru untuk komponen + mock file

#### 5. Prinsip "Create Only"

- **Hanya buat file baru** — jangan ubah file komponen existing kecuali App.jsx (nambah route) dan DESIGN.md (nambah entry)
- Jika halaman baru butuh komponen yang mirip dengan existing → tetap buat komponen baru (jangan modifikasi existing)
- Jika referensi desain bentrok dengan existing → tanya user apakah mau overwrite atau buat dengan nama alternatif

#### 6. Rollback

Sama seperti workflow "update ui": backup sebelum edit, user bisa bilang "kembalikan" untuk undo seluruh sesi "Make UI".

## Backend Coordination

### Konteks

Project ini punya **tim backend terpisah** dengan stack Go (Gin) + PostgreSQL.
Backend punya workflow sendiri (contract-first: mock JSON → OpenAPI spec → DB migration → kode).
Frontend **hanya koordinasi**, tidak menyentuh file skill/workflow backend.

### Kapan Koordinasi Diperlukan

| Skenario | Butuh Backend? | Tindakan |
|----------|---------------|----------|
| Ubah warna/typo/spacing | Tidak | Langsung jalan, no backend |
| Tambah tombol/komponen baru tanpa data baru | Tidak | Generate komponen, mock data existing |
| Tampil data dari endpoint baru | **Ya** | Buat mock JSON → tunggu OpenAPI dari backend |
| Kirim data (form, review, cart) | **Ya** | Buat mock JSON request → tunggu API backend |
| Route/halaman baru dengan data dinamis | **Ya** | Design dulu → mock JSON → koordinasi backend |
| Hapus fitur yang ada endpoint-nya | **Ya** | Update frontend + kasih tau backend endpoint bisa dihapus |

### Alur Koordinasi Frontend → Backend

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Agent UI)                       │
│                                                             │
│  1. Design change confirmed (DESIGN.md updated)             │
│  2. Identifikasi endpoint baru/perubahan API                │
│  3. Buat mock JSON di docs/mock/<page>/<method>-<slug>.json │
│  4. Kembangkan UI pake mock JSON (frontend jalan duluan)    │
│  5. Kirim sinyal ke backlog: "need API: F-XXX"             │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Agent Go/Gin)                      │
│                                                             │
│  6. Baca mock JSON dari docs/mock/                          │
│  7. Buat OpenAPI spec di docs/api/feat-xxx.yaml             │
│  8. Implementasi handler → service → repository             │
│  9. Unit test + test doc                                    │
│  10. PR ke dev                                              │
│                                                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION                               │
│                                                             │
│  11. Frontend ganti mock JSON → panggil API real            │
│  12. Update component.md: endpoint + method + auth          │
│  13. Test integrasi frontend-backend                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mock JSON — Titik Temu Utama

Mock JSON adalah **satu-satunya contract** yang perlu frontend buat untuk backend.
Backend akan membaca mock JSON lalu membuat OpenAPI spec yang cocok.
Dibuat di **Step 3** workflow frontend (`docs/mock/<page>/<method>-<slug>.json`).

**Frontend buat mock JSON di project frontend**:
```json
{
  "endpoint": "GET /api/products",
  "response": {
    "data": [
      { "id": "uuid-1", "name": "AI Chatbot", "price": 49.99 }
    ]
  }
}
```

Aturan:
- Satu file per endpoint
- Response shape harus cocok dengan props yang dipakai komponen
- Backend akan jadikan ini sebagai OpenAPI contract
- Format `endpoint` + `response` WAJIB mengikuti struktur dari backend workflow (lihat `docs/mock/` di backend skill reference)
- Jika endpoint butuh request body (POST/PUT), tambahkan field `request` di mock JSON

### Branch Coordination

Ikuti branch strategy backend:

| Situasi | Branch Frontend | Branch Backend |
|---------|----------------|----------------|
| Frontend-only (styling, komponen statis) | `feat/F-XXX-name/sub-ui` | Tidak perlu |
| Butuh API baru | `feat/F-XXX-name/sub-ui` | `feat/F-XXX-name/sub-api` |
| Butuh DB migration juga | `feat/F-XXX-name/sub-ui` | `feat/F-XXX-name/sub-db` |
| Full feature (FE + BE + DB) | `feat/F-XXX-name/sub-ui` | `feat/F-XXX-name` (parent) |

Semua sub-branch merge ke parent `feat/F-XXX-name`, lalu parent PR ke `dev`.

### Backlog & GitHub Issues

Frontend agent harus:
1. Cek `docs/backlog/backlog.md` + GitHub Issues sebelum mulai kerja
2. Kalau perubahan butuh backend, buat GitHub Issue dengan label `backend`
3. Update `docs/backlog/features/F-XXX-name.md` dengan status frontend
4. Referensi ke issue: `gh issue create --repo delcode92/ACM_AI_MARKETPLACE --title "F-XXX: Judul" --body "Deskripsi dari frontend"`

### Perubahan yang Perlu Dikomunikasikan ke Backend

Jenis perubahan yang WAJIB dikasih tau ke backend:

1. **Endpoint baru** — UI butuh data yang belum ada API-nya
2. **Response shape berubah** — komponen butuh field baru dari API response
3. **Request body berubah** — form/input kirim field baru
4. **Route structure berubah** — URL pattern berubah, backend routing ikut berubah
5. **Data validation rules** — frontend validate X, backend harus validate sama
6. **Deprecate endpoint** — fitur dihapus, backend bisa hapus endpoint

Update `component.md` kolom `Status` jadi `waiting-backend` untuk endpoint yang belum siap.

### Sinkronisasi component.md

`component.md` (milik frontend) mencatat mapping komponen → API → DB.
Frontend **hanya update `component.md`** milik sendiri. Backend punya `docs/components/<page>.md` sendiri — biarkan backend yang mengelola.

Update `component.md` dengan kolom dari sisi frontend:

| Kolom | Sumber |
|-------|--------|
| Komponen | Frontend (ui_skill.md Step 1) |
| File Path | Frontend |
| API Endpoint + Method | Dari komunikasi dengan backend (manual / issue) |
| DB Table / Query | Backend yang tentukan |
| Mock File | Frontend (buat) |
| Status | Frontend: `planned` / `in-progress` / `waiting-backend` / `done` |
