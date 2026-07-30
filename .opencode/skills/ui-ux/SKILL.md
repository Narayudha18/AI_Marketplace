---
name: ui/ux
description: >
  Mengelola UI/UX project React + Tailwind. Otomatis scan komponen,
  update DESIGN.md, generate React components, dan catat setiap
  perubahan komponen/fitur ke changelog.
---

## Diagram Skill â€” Struktur Dokumen

```
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚                         UI/UX SKILL                                   â”‚
  â”‚  Mengelola UI/UX React + Tailwind. Auto scan, generate, mock JSON.   â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                      â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚                         â”‚                             â”‚
            â–¼                         â–¼                             â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚   TRIGGER    â”‚        â”‚   STACK TARGET   â”‚        â”‚  WORKFLOW (6 step) â”‚
    â”‚              â”‚        â”‚                  â”‚        â”‚                    â”‚
    â”‚ â€¢ auto: file â”‚        â”‚ React 19         â”‚        â”‚ Step 1: SCAN UI    â”‚
    â”‚   komponen   â”‚        â”‚ Vite 8           â”‚        â”‚ Step 2: UPDATE     â”‚
    â”‚ â€¢ manual:    â”‚        â”‚ Tailwind v4      â”‚        â”‚   DESIGN.md        â”‚
    â”‚   prompt     â”‚        â”‚ react-router v7  â”‚        â”‚ Step 3: MOCK JSON  â”‚
    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜        â”‚ Step 4: GENERATE   â”‚
           â”‚                                            â”‚   KOMPONEN         â”‚
           â–¼                                            â”‚ Step 5: CHANGELOG  â”‚
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                â”‚ Step 6: UPDATE     â”‚
    â”‚  KONFIRMASI?     â”‚                                â”‚   component.md     â”‚
    â”‚  (DESIGN.md baru)â”‚                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
    â”‚  Ya â”€â”€â–º Tanya    â”‚                                         â”‚
    â”‚        selektif  â”‚                                         â–¼
    â”‚  Tidakâ”€â”€â–º Lanjut â”‚                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                â”‚      OUTPUT        â”‚
                                                         â”‚ â€¢ File komponen   â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                         â”‚ â€¢ Mock JSON (docs/)â”‚
            â”‚   ATURAN (6)     â”‚                         â”‚ â€¢ DESIGN.md baru  â”‚
            â”‚                  â”‚                         â”‚ â€¢ CHANGELOG.md    â”‚
            â”‚ 1. Konfirmasi    â”‚                         â”‚ â€¢ component.md    â”‚
            â”‚ 2. Minor auto    â”‚                         â”‚ â€¢ Ringkasan user  â”‚
            â”‚ 3. Changelog     â”‚                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
            â”‚ 4. DESIGN sinkronâ”‚
            â”‚ 5. Mock JSON     â”‚        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚ 6. Konsistensi   â”‚        â”‚      BACKEND COORDINATION          â”‚
            â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜        â”‚                                    â”‚
                   â”‚                    â”‚ â€¢ Alur FEâ†’BE (mock JSON contract)  â”‚
                   â–¼                    â”‚ â€¢ Branch strategy (sub-branch)     â”‚
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”        â”‚ â€¢ Backlog & GitHub Issues          â”‚
    â”‚   SOURCE PRIORITY        â”‚        â”‚ â€¢ 6 perubahan wajib komunikasi    â”‚
    â”‚   1. User command        â”‚        â”‚ â€¢ Sinkronisasi component.md       â”‚
    â”‚   2. DESIGN.md           â”‚        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
    â”‚   3. Kode aktual         â”‚
    â”‚   4. Jangan tebak        â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚   PENANGANAN DESIGN.md      â”‚
    â”‚   BARU DARI USER            â”‚
    â”‚                             â”‚
    â”‚ â€¢ Wajib tanya dulu         â”‚
    â”‚ â€¢ Gabung selektif          â”‚
    â”‚ â€¢ DESIGN.md tetap 1 file   â”‚
    â”‚ â€¢ Versi increment          â”‚
    â”‚ â€¢ Catat changelog          â”‚
    â”‚ â€¢ Kode hanya setelah       â”‚
    â”‚   user setuju              â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚   TAILWIND CSS v4           â”‚
    â”‚   SPESIFIK PROJECT          â”‚
    â”‚                             â”‚
    â”‚ â€¢ @theme tokens             â”‚
    â”‚ â€¢ Perbedaan v4 vs v3        â”‚
    â”‚ â€¢ Aturan generate           â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                   â”‚
                   â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚   CODE REVIEW CHECKLIST     â”‚
    â”‚                             â”‚
    â”‚ â€¢ Struktur & Impor          â”‚
    â”‚ â€¢ Routing                   â”‚
    â”‚ â€¢ Styling                   â”‚
    â”‚ â€¢ State & Data Flow         â”‚
    â”‚ â€¢ Mock JSON                 â”‚
    â”‚ â€¢ component.md/DESIGN.md    â”‚
    â”‚ â€¢ CHANGELOG.md              â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Trigger

Berjalan otomatis saat ada perubahan pada file UI:
- `src/components/*.jsx` â€” komponen dibuat/diedit/dihapus
- `src/pages/*.jsx` â€” halaman baru/berubah
- `src/App.jsx` â€” routing berubah
- `src/CartContext.jsx` â€” state management berubah
- `.temp/DESIGN.md` â€” design spec utama (wajib diupdate)
- `AI_DESIGN.md` â€” copy design spec di dalam project (wajib diupdate)
- `NEW_DESIGN.md` â€” **jangan diupdate** (akan dihapus user)
- `src/data/*.json` â€” struktur data berubah

Bisa juga dipanggil manual via prompt:
- "update UI" / "ubah design" â€” update komponen existing berdasarkan DESIGN.md baru
- "Make UI" â€” buat halaman/komponen **baru** berdasarkan NEW_DESIGN.md yang user kasi sebagai referensi
- "tambah halaman X" â€” buat halaman spesifik

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
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚   TRIGGER                â”‚
                                â”‚  â€¢ File komponen berubah  â”‚
                                â”‚  â€¢ File DESIGN.md manual  â”‚
                                â”‚  â€¢ Prompt user            â”‚
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                            â”‚
                                            â–¼
                          â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                          â”‚  KONFIRMASI?                        â”‚
                          â”‚  (Jika user kirim DESIGN.md baru)   â”‚
                          â”‚  Tanya fitur mana mau digabung      â”‚
                          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                           â”‚
                              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                              â”‚                         â”‚
                              â–¼                         â–¼
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â”‚ Step 1: SCAN UI     â”‚    â”‚ TOLAK / TUNDA    â”‚
                  â”‚ â€¢ src/components/   â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                  â”‚ â€¢ src/pages/        â”‚
                  â”‚ â€¢ src/App.jsx       â”‚
                  â”‚ â€¢ src/CartContext   â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                             â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚ Step 2: UPDATE       â”‚
                   â”‚         DESIGN.md    â”‚
                   â”‚ â€¢ Versi â†‘            â”‚
                   â”‚ â€¢ Structure/Routes   â”‚
                   â”‚ â€¢ Components/State   â”‚
                   â”‚ â€¢ Styling/Data Flow  â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚ Step 3: BUAT MOCK    â”‚
                   â”‚         JSON         â”‚
                   â”‚ â€¢ docs/mock/<page>/  â”‚
                   â”‚ â€¢ Format kontrak BE  â”‚
                   â”‚ â€¢ Response = props   â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚ Step 4: GENERATE     â”‚
                   â”‚         / UPDATE     â”‚
                   â”‚         KOMPONEN     â”‚
                   â”‚ â€¢ Baru â†’ create file â”‚
                   â”‚ â€¢ Existing â†’ edit    â”‚
                   â”‚ â€¢ Route â†’ App.jsx    â”‚
                   â”‚ â€¢ State â†’ CartContextâ”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚ Step 5: CHANGELOG    â”‚
                   â”‚ â€¢ Komponen           â”‚
                   â”‚ â€¢ Fitur              â”‚
                   â”‚ â€¢ Data               â”‚
                   â”‚ â€¢ Routing            â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚ Step 6: UPDATE       â”‚
                   â”‚         component.md â”‚
                   â”‚ â€¢ Mapping komponen   â”‚
                   â”‚ â€¢ API/DB mapping     â”‚
                   â”‚ â€¢ Mock file ref      â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚
                              â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚      OUTPUT          â”‚
                   â”‚ 1. File komponen     â”‚
                   â”‚ 2. Mock JSON (docs/) â”‚
                   â”‚ 3. DESIGN.md (v baru)â”‚
                   â”‚ 4. CHANGELOG.md      â”‚
                   â”‚ 5. component.md      â”‚
                   â”‚ 6. Ringkasan ke user â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Step 1 â€” Scan UI Saat Ini

Baca dan catat seluruh komponen:

1. **`src/components/`** â€” Navbar, Hero, Categories, ProductGrid, Featured,
   Footer, CartDrawer, PaymentModal, FavoriteRecommendations (+ tambahan baru)
2. **`src/pages/`** â€” Templates, Integrations, Chatbots, Automation, AiTools,
   ProductDetail, CategoryListing (+ halaman baru)
3. **`src/App.jsx`** â€” daftar route
4. **`src/CartContext.jsx`** â€” state, method, persistensi

Untuk setiap komponen catat:
- Nama komponen
- Path file
- Halaman / section tempat komponen muncul
- Props (jika ada)
- Local state
- Hooks digunakan (useState, useEffect, useLocation, useCart, dll)
- Event handlers
- Data dependencies (JSON file apa yang diimpor)

### Step 2 â€” Update DESIGN.md & AI_DESIGN.md

Update **semua** file design (`DESIGN.md` dan `AI_DESIGN.md`) agar sinkron dengan kode aktual. Kecuali `NEW_DESIGN.md` â€” jangan disentuh.

- **Versi** â€” increment minor tiap update UI, major tiap redesign
- **Project Structure** â€” tambah/hapus file komponen
- **Routes** â€” tambah/hapus route
- **Component List** â€” sinkronkan daftar komponen + deskripsi
- **State Management** â€” update jika CartContext berubah
- **Data Flow** â€” update jika struktur JSON atau data dependencies berubah
- **Styling** â€” update jika theme tokens (warna, rounded, spacing) berubah

### Step 3 â€” Buat Mock JSON (Contract First)

Buat mock JSON sebagai **kontrak API** untuk backend. Backend akan baca mock JSON ini lalu buat OpenAPI spec + implementasi yang cocok.

Lokasi: `docs/mock/<page>/<method>-<slug>.json` â€” satu file per endpoint.

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
- **Response keys** = props yang dipakai komponen â€” backend jadikan ini sebagai OpenAPI contract
- **Satu file per endpoint** â€” jangan gabung multiple endpoint dalam satu file
- Nama file: `get-products.json`, `post-cart.json`, `put-user-id.json`
- Response harus mencakup **happy path** (data normal) dan representasi struktur realistis
- Jika komponen butuh endpoint baru â†’ buat mock JSON dulu SEBELUM generate komponen
- Jika cuma perubahan UI statis (warna, layout, text) â†’ tidak perlu mock JSON

Cross-reference dengan backend:
- Backend workflow: mock JSON â†’ OpenAPI spec (`docs/api/feat-xxx.yaml`) â†’ DB migration â†’ kode Go
- Frontend cuma buat mock JSON, sisanya (OpenAPI, migration, handler) urusan backend
- Ketika API real sudah jadi, komponen tinggal ganti import dari mock JSON ke fetch/axios

### Step 4 â€” Generate / Update Komponen

Buat atau ubah komponen React + Tailwind berdasarkan DESIGN.md:

1. Komponen baru â†’ buat file di `src/components/` atau `src/pages/`
2. Komponen existing â†’ update sesuai perubahan design
3. Route baru â†’ update `App.jsx`
4. State baru â†’ update `CartContext.jsx`
5. Data dari endpoint â†’ render dari mock JSON di `docs/mock/` dulu

Patuhi konvensi kode existing:
- Functional component + export default
- Props destructuring
- Tailwind utility classes (bukan CSS modules)
- Material Symbols untuk icon
- picsum.photos untuk placeholder gambar
- Link dari react-router-dom untuk navigasi

### Step 5 â€” Catat Perubahan (Changelog)

Update file **`CHANGELOG.md`** di root project (`ai-marketplace/CHANGELOG.md`)
dengan format berikut:

```markdown
## [version] â€” YYYY-MM-DD

### Komponen
- **Navbar** â€” tambah dropdown user menu [file: src/components/Navbar.jsx]
- **ProductCard** â€” ubah layout hover effect, shadow-md jadi shadow-lg [file: src/components/ProductGrid.jsx]
- **Footer** â€” hapus social media links [file: src/components/Footer.jsx]

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
Tiap baris format: `**NamaKomponen** â€” deskripsi perubahan [file: path/lengkap.jsx]`

Kategorikan sebagai:
- **Baru** â€” komponen belum ada sebelumnya
- **Ubah** â€” props/state/styling/logic berubah
- **Hapus** â€” komponen dihapus
- **Refactor** â€” logic diubah tanpa perubahan visual

#### Fitur
Gunakan prefix:
- `[Feat]` â€” fitur baru
- `[Fix]` â€” bug fix
- `[Style]` â€” perubahan styling/tampilan
- `[Refactor]` â€” perubahan kode tanpa perubahan perilaku
- `[Perf]` â€” optimasi performa
- `[Chore]` â€” tugas maintenance (rename file, update dependensi)

#### Data
Catat perubahan struktur JSON:
- Nama file
- Field ditambah/dihapus/berubah

#### Routing
- Route ditambah/dihapus/diganti path

#### Mock JSON
- `docs/mock/templates/get-products.json` â€” endpoint baru
- `docs/mock/cart/post-checkout.json` â€” response shape berubah

### Step 6 â€” Update component.md

Sinkronkan `component.md` (root project) dengan perubahan:
- Baris baru untuk komponen baru
- Update mapping jika API/DB berubah
- Tambah kolom `Mock File` dan `Status` untuk tiap endpoint
- Hapus baris jika komponen dihapus

### Step 7 â€” Push ke GitHub

Setelah semua perubahan selesai, auto-push ke kedua remote:

```bash
git add .
git commit -m "update: [ringkasan perubahan]"
git push origin skeleton
git push delcode skeleton
```

Target repo:
- `origin` â†’ `https://github.com/Narayudha18/AI_Marketplace.git`
- `delcode` â†’ `https://github.com/delcode92/ACM_AI_MARKETPLACE.git`
Branch: `skeleton`

Jika remote belum terdaftar, jalankan:
```bash
git remote add origin https://github.com/Narayudha18/AI_Marketplace.git
git remote add delcode https://github.com/delcode92/ACM_AI_MARKETPLACE.git
```

## Output

Setelah workflow selesai, hasilnya:

1. **File komponen** â€” baru / diupdate di `src/components/` atau `src/pages/`
2. **Mock JSON** â€” baru / diupdate di `docs/mock/<page>/`
3. **`.temp/DESIGN.md`** â€” versi terbaru design spec (wajib update)
4. **`AI_DESIGN.md`** â€” copy design spec di project (wajib update juga)
5. **`CHANGELOG.md`** â€” catatan perubahan lengkap (komponen, fitur, data, routing, mock)
6. **`component.md`** â€” mapping komponen sinkron (termasuk mock file + status)
6. **Ringkasan** â€” tampilkan ke user daftar perubahan yang dilakukan
7. **Push ke GitHub** â€” auto-commit + push ke `Narayudha18/AI_Marketplace`

## Aturan

1. **Jangan ubah kode tanpa konfirmasi** â€” Tanya user dulu jika perubahan besar
   (redesign, hapus komponen, ganti library, ubah routing structure)
2. **Perubahan kecil** langsung jalan (tambah button, ubah warna, ganti text)
3. **Changelog wajib diupdate** setiap kali ada perubahan komponen/fitur
4. **Semua file design** (`.temp/DESIGN.md` + `AI_DESIGN.md`) harus selalu sinkron dengan kode aktual â€” jangan sentuh `NEW_DESIGN.md`
5. **Mock JSON wajib dibuat** untuk tiap endpoint baru yang dibutuhkan komponen â€” ikuti format kontrak backend (`endpoint` + `response`)
6. **Prioritas** â€” jaga konsistensi dengan kode existing

## Source Priority

Saat DESIGN.md dan kode aktual tidak sinkron, ikuti aturan prioritas berikut:

| Prioritas | Source | Kapan Digunakan |
|-----------|--------|-----------------|
| 1 (Tertinggi) | **Perintah user langsung** | User bilang "ubah button jadi merah" â†’ lakukan, meski DESIGN.md bilang biru |
| 2 | **DESIGN.md** | Untuk spec visual, layout, warna, typografi, spacing, routes |
| 3 | **Kode aktual** | Untuk detail implementasi (nama fungsi, hooks, struktur state) â€” asumsikan kode yang jalan adalah correct |
| 4 (Terendah) | **Deduksi / asumsi** | Jangan tebak-nebak. Jika tidak ada referensi di 3 source di atas, TANYA user |

### Contoh Kasus

| Situasi | Tindakan |
|---------|----------|
| DESIGN.md bilang Hero pakai background gradient, kode pakai solid color | Update kode ke gradient (DESIGN.md menang untuk visual) |
| Kode punya state `searchQuery`, DESIGN.md tidak sebut | Pertahankan state di kode (kode menang untuk implementasi) |
| DESIGN.md punya halaman Profile, kode belum ada | Tanya user: "DESIGN.md ada halaman Profile, mau dibuat?" |
| DESIGN.md hapus fitur filter harga, kode masih ada | Update kode: hapus filter harga (DESIGN.md menang) |
| User prompt: "ganti font Inter ke Poppins" | Langsung jalan, update DESIGN.md + kode (user command priority 1)

## Tailwind CSS v4 â€” Spesifik Project

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
- `bg-primary` â€” background `#162D6D`
- `text-on-primary` â€” text `#ffffff`
- `bg-primary-container` â€” background `#2563EB`
- `border-border-light` â€” border `#E5E7EB`
- `text-text-muted` â€” text `#555555`

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

1. Pakai token kustom (`bg-primary`, `text-text-muted`) â€” jangan hardcode hex
2. Jangan buat `tailwind.config.js` â€” semua konfigurasi di `index.css`
3. Jangan tambah `@apply` â€” utility classes langsung di JSX
4. Cek `index.css` sebelum pakai class yang mencurigakan â€” mungkin itu token kustom

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
- [ ] localStorage tidak diakses langsung â€” selalu lewat CartContext
- [ ] Data JSON diimpor sebagai array, difilter sesuai kebutuhan

### Mock JSON
- [ ] File mock JSON dibuat di `docs/mock/<page>/<method>-<slug>.json`
- [ ] Response keys cocok dengan props yang dipakai komponen
- [ ] Format mengikuti kontrak backend (`endpoint` + `response`)
- [ ] Satu file per endpoint (bukan gabung)
- [ ] Kalau cuma UI statis â€” tidak perlu mock JSON, skip

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
â€¢ [daftar fitur utama versi lama â€” 3-5 poin]

**DESIGN.md Baru:**
â€¢ [daftar fitur utama versi baru â€” 3-5 poin]

**Perubahan yang terdeteksi:**
1. [Judul perubahan] â€” [bagian yang berubah, 1 kalimat]
2. [Judul perubahan] â€” [bagian yang berubah, 1 kalimat]
3. [Judul perubahan] â€” [bagian yang berubah, 1 kalimat]
   ...

**Mau fitur mana yang diimplementasi?**
Bisa pilih nomornya (pisah koma), "semua", atau "tidak sama sekali".
```

Contoh konkret:

```
Saya terima DESIGN.md baru. Ini perbandingannya:

**DESIGN.md Saat Ini (.temp/DESIGN.md v4.0):**
â€¢ Hero split layout (text kiri, gambar kanan)
â€¢ Navbar dua-tier (brand + nav links)
â€¢ Filter sidebar dengan price range
â€¢ 5 halaman listing dengan sidebar filter
â€¢ Footer 4-column grid

**DESIGN.md Baru:**
â€¢ Hero full-width dengan background video
â€¢ Navbar single-tier dengan mega menu
â€¢ Filter sidebar tanpa price range (ganti toggle)
â€¢ 5 halaman listing + halaman Profile baru
â€¢ Footer 2-column grid + newsletter signup

**Perubahan yang terdeteksi:**
1. Hero â€” layout split jadi full-width video background
2. Navbar â€” dua-tier jadi single-tier + mega menu
3. Sidebar â€” price range dihapus, ganti toggle switch
4. Halaman baru â€” Profile page di /profile
5. Footer â€” 4-column jadi 2-column + newsletter

**Mau fitur mana yang diimplementasi?**
Bisa pilih nomornya (pisah koma), "semua", atau "tidak sama sekali".
```

Setelah user pilih, **wajib konfirmasi lagi** sebelum eksekusi:

```
Oke, saya akan update **.temp/DESIGN.md** dengan fitur nomor [1, 3, 5] dari NEW_DESIGN.md.
Lanjut update?
```

### Prinsip Penggabungan

1. **File design ada 2** â€” `.temp/DESIGN.md` (utama) + `AI_DESIGN.md` (copy di project). Keduanya wajib sinkron. `NEW_DESIGN.md` jangan disentuh.
2. **Gabung selektif** â€” jangan tambahkan semua perubahan dari DESIGN.md baru secara otomatis. Hanya bagian yang user setujui saja yang digabung
3. **Versi increment** â€” setelah penggabungan, naikkan versi DESIGN.md (minor jika tambah fitur, major jika redesign)
4. **Catat changelog** â€” tulis setiap bagian yang digabung ke CHANGELOG.md di bawah `### Design Merge`
5. **Konfirmasi akhir** â€” tampilkan ringkasan fitur yang akan diupdate, tanya "Lanjut update?" sebelum menyentuh file
6. **Kode hanya setelah user setuju** â€” jalankan workflow Step 3-6 hanya setelah user konfirmasi
7. **Semua file design** (`.temp/DESIGN.md` + `AI_DESIGN.md`) WAJIB diupdate setiap skenario â€” sinkron dengan kode aktual. `NEW_DESIGN.md` jangan disentuh.

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

## Perintah "Make UI" â€” Buat Halaman/Komponen Baru dari NEW_DESIGN.md

### Trigger

User ketik: `Make UI`

### Tujuan

Membuat halaman dan/atau komponen **baru** (tidak mengubah existing) berdasarkan file referensi visual yang user berikan (NEW_DESIGN.md).

Berbeda dengan "update ui" yang menganalisis perubahan lalu gabung selektif, "Make UI" bersifat **create-only**: baca referensi â†’ generate kode baru.

### Cara Kerja

#### 1. Minta Referensi (jika belum ada)

Jika user belum pernah kasi NEW_DESIGN.md di sesi ini, tanya:

```
"Make UI" â€” Siapkan file referensi desain (nama bebas, misal NEW_DESIGN.md).
Tempel kontennya atau sebut file path-nya.
```

#### 2. Baca & Analisis Referensi

Baca file referensi yang user kasi. Identifikasi:

- **Halaman baru** yang perlu dibuat â€” `src/pages/<Name>.jsx`
- **Komponen baru** yang perlu dibuat â€” `src/components/<Name>.jsx`
- **Route baru** â€” path URL, params
- **Data dependencies** â€” JSON data, mock API
- **Styling tokens** â€” warna, font, layout baru (jika ada)

#### 3. Konfirmasi Rencana ke User

Tampilkan daftar item yang akan dibuat:

```
Dari NEW_DESIGN.md, saya rencanakan buat:

**Halaman Baru:**
1. /profile â€” ProfilePage.jsx (halaman user profile)
2. /dashboard â€” DashboardPage.jsx (statistik & aktivitas)

**Komponen Baru:**
3. ProfileCard â€” kartu informasi user
4. ActivityChart â€” grafik aktivitas

**Mock JSON Baru:**
5. GET /api/user/profile
6. GET /api/user/activity

Lanjut buat?
```

#### 4. Eksekusi (Create Only)

Setelah user setuju, jalankan:

**a. Backup** â€” backup file yang akan disentuh (App.jsx, DESIGN.md, dll) ke `docs/rollback/`

**b. Update file design** â€” update `.temp/DESIGN.md` dan `AI_DESIGN.md` (jangan sentuh `NEW_DESIGN.md`):
  - Versi increment minor
  - Tambah entry di Project Structure jika ada file baru
  - Tambah entry di Routes
  - Tambah entry di Component List
  - Tambah entry di Data Flow / Mock API
  - Tambah layout diagram jika halaman baru punya layout berbeda

**c. Buat Mock JSON** untuk tiap endpoint baru di `docs/mock/<page>/<method>-<slug>.json`

**d. Generate Komponen/Halaman Baru:**
  - Ikuti konvensi kode existing (functional component, Tailwind v4 tokens, Material Symbols, dll)
  - JANGAN ubah komponen existing â€” hanya buat file baru
  - Halaman baru â†’ `src/pages/`
  - Komponen baru â†’ `src/components/`

**e. Update App.jsx** â€” tambah route baru (import + route definition)

**f. Update CartContext.jsx** â€” hanya jika state global baru diperlukan

**g. Update CHANGELOG.md** â€” catat semua item baru

**h. Update component.md** â€” tambah baris baru untuk komponen + mock file

#### 5. Prinsip "Create Only"

- **Hanya buat file baru** â€” jangan ubah file komponen existing kecuali App.jsx (nambah route) dan DESIGN.md (nambah entry)
- Jika halaman baru butuh komponen yang mirip dengan existing â†’ tetap buat komponen baru (jangan modifikasi existing)
- Jika referensi desain bentrok dengan existing â†’ tanya user apakah mau overwrite atau buat dengan nama alternatif

#### 6. Rollback

Sama seperti workflow "update ui": backup sebelum edit, user bisa bilang "kembalikan" untuk undo seluruh sesi "Make UI".

## Backend Coordination

### Konteks

Project ini punya **tim backend terpisah** dengan stack Go (Gin) + PostgreSQL.
Backend punya workflow sendiri (contract-first: mock JSON â†’ OpenAPI spec â†’ DB migration â†’ kode).
Frontend **hanya koordinasi**, tidak menyentuh file skill/workflow backend.

### Kapan Koordinasi Diperlukan

| Skenario | Butuh Backend? | Tindakan |
|----------|---------------|----------|
| Ubah warna/typo/spacing | Tidak | Langsung jalan, no backend |
| Tambah tombol/komponen baru tanpa data baru | Tidak | Generate komponen, mock data existing |
| Tampil data dari endpoint baru | **Ya** | Buat mock JSON â†’ tunggu OpenAPI dari backend |
| Kirim data (form, review, cart) | **Ya** | Buat mock JSON request â†’ tunggu API backend |
| Route/halaman baru dengan data dinamis | **Ya** | Design dulu â†’ mock JSON â†’ koordinasi backend |
| Hapus fitur yang ada endpoint-nya | **Ya** | Update frontend + kasih tau backend endpoint bisa dihapus |

### Alur Koordinasi Frontend â†’ Backend

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    FRONTEND (Agent UI)                       â”‚
â”‚                                                             â”‚
â”‚  1. Design change confirmed (DESIGN.md updated)             â”‚
â”‚  2. Identifikasi endpoint baru/perubahan API                â”‚
â”‚  3. Buat mock JSON di docs/mock/<page>/<method>-<slug>.json â”‚
â”‚  4. Kembangkan UI pake mock JSON (frontend jalan duluan)    â”‚
â”‚  5. Kirim sinyal ke backlog: "need API: F-XXX"             â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â”‚
                          â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  BACKEND (Agent Go/Gin)                      â”‚
â”‚                                                             â”‚
â”‚  6. Baca mock JSON dari docs/mock/                          â”‚
â”‚  7. Buat OpenAPI spec di docs/api/feat-xxx.yaml             â”‚
â”‚  8. Implementasi handler â†’ service â†’ repository             â”‚
â”‚  9. Unit test + test doc                                    â”‚
â”‚  10. PR ke dev                                              â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                          â”‚
                          â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    INTEGRATION                               â”‚
â”‚                                                             â”‚
â”‚  11. Frontend ganti mock JSON â†’ panggil API real            â”‚
â”‚  12. Update component.md: endpoint + method + auth          â”‚
â”‚  13. Test integrasi frontend-backend                        â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Mock JSON â€” Titik Temu Utama

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

1. **Endpoint baru** â€” UI butuh data yang belum ada API-nya
2. **Response shape berubah** â€” komponen butuh field baru dari API response
3. **Request body berubah** â€” form/input kirim field baru
4. **Route structure berubah** â€” URL pattern berubah, backend routing ikut berubah
5. **Data validation rules** â€” frontend validate X, backend harus validate sama
6. **Deprecate endpoint** â€” fitur dihapus, backend bisa hapus endpoint

Update `component.md` kolom `Status` jadi `waiting-backend` untuk endpoint yang belum siap.

### Sinkronisasi component.md

`component.md` (milik frontend) mencatat mapping komponen â†’ API â†’ DB.
Frontend **hanya update `component.md`** milik sendiri. Backend punya `docs/components/<page>.md` sendiri â€” biarkan backend yang mengelola.

Update `component.md` dengan kolom dari sisi frontend:

| Kolom | Sumber |
|-------|--------|
| Komponen | Frontend (ui_skill.md Step 1) |
| File Path | Frontend |
| API Endpoint + Method | Dari komunikasi dengan backend (manual / issue) |
| DB Table / Query | Backend yang tentukan |
| Mock File | Frontend (buat) |
| Status | Frontend: `planned` / `in-progress` / `waiting-backend` / `done` |

test

---

## Mock JSON Reference

Daftar lengkap seluruh endpoint mock JSON yang sudah siap (36 endpoint, status ✅ semua):

| # | Endpoint | File | Status |
|---|----------|------|--------|
| 1 | POST /api/auth/login | docs/mock/auth/post-login.json | ✅ |
| 2 | POST /api/auth/register | docs/mock/auth/post-register.json | ✅ |
| 3 | GET /api/auth/me | docs/mock/auth/get-me.json | ✅ |
| 4 | PUT /api/auth/password | docs/mock/auth/put-password.json | ✅ |
| 5 | PUT /api/auth/picture | docs/mock/auth/put-picture.json | ✅ |
| 6 | GET /api/cart | docs/mock/cart/get-cart.json | ✅ |
| 7 | POST /api/cart | docs/mock/cart/post-cart.json | ✅ |
| 8 | PUT /api/cart | docs/mock/cart/put-cart.json | ✅ |
| 9 | DELETE /api/cart/:id | docs/mock/cart/delete-cart.json | ✅ |
| 10 | POST /api/cart/checkout | docs/mock/cart/post-checkout.json | ✅ |
| 11 | GET /api/categories | docs/mock/categories/get-categories.json | ✅ |
| 12 | GET /api/products | docs/mock/products/get-products.json | ✅ |
| 13 | GET /api/products/:slug | docs/mock/products/get-product-detail.json | ✅ |
| 14 | GET /api/products/:slug/media | docs/mock/products/get-product-media.json | ✅ |
| 15 | GET /api/products/:slug/reviews | docs/mock/products/get-reviews.json | ✅ |
| 16 | POST /api/products/:slug/reviews | docs/mock/products/post-review.json | ✅ |
| 17 | GET /api/favorites | docs/mock/favorites/get-favorites.json | ✅ |
| 18 | POST /api/favorites | docs/mock/favorites/post-favorite.json | ✅ |
| 19 | DELETE /api/favorites/:id | docs/mock/favorites/delete-favorite.json | ✅ |
| 20 | GET /api/search | docs/mock/search/get-search.json | ✅ |
| 21 | GET /api/profile/orders | docs/mock/profile/get-orders.json | ✅ |
| 22 | POST /api/orders | docs/mock/orders/post-orders.json | ✅ |
| 23 | GET /api/orders/:id | docs/mock/orders/get-order-id.json | ✅ |
| 24 | POST /api/seller/register | docs/mock/seller/post-register.json | ✅ |
| 25 | GET /api/seller/dashboard | docs/mock/seller/get-dashboard.json | ✅ |
| 26 | GET /api/admin/dashboard | docs/mock/admin/get-dashboard.json | ✅ |
| 27 | GET /api/admin/users | docs/mock/admin/get-users.json | ✅ |
| 28 | PUT /api/admin/orders/:id | docs/mock/admin/put-order-id.json | ✅ |
| 29 | DELETE /api/admin/reviews/:id | docs/mock/admin/delete-review-id.json | ✅ |
| 30 | PUT /api/admin/sellers/:id/approve | docs/mock/admin/put-seller-id-approve.json | ✅ |
| 31 | PUT /api/admin/sellers/:id/reject | docs/mock/admin/put-seller-id-reject.json | ✅ |
| 32 | GET /api/ai-agents | docs/mock/ai-agents/get-ai-agents.json | ✅ |
| 33 | GET /api/ai-prompts | docs/mock/ai-prompts/get-ai-prompts.json | ✅ |
| 34 | GET /api/ai-skills | docs/mock/ai-skills/get-ai-skills.json | ✅ |
| 35 | GET /api/ai-tokens | docs/mock/ai-tokens/get-ai-tokens.json | ✅ |
| 36 | GET /api/ai-workflows | docs/mock/ai-workflows/get-ai-workflows.json | ✅ |
---

## Mock JSON Reference

Daftar lengkap seluruh endpoint mock JSON yang sudah siap (36 endpoint, status ✅ semua):

| # | Endpoint | File | Status |
|---|----------|------|--------|
| 1 | `POST /api/auth/login` | `docs/mock/auth/post-login.json` | ✅ |
| 2 | `POST /api/auth/register` | `docs/mock/auth/post-register.json` | ✅ |
| 3 | `GET /api/auth/me` | `docs/mock/auth/get-me.json` | ✅ |
| 4 | `PUT /api/auth/password` | `docs/mock/auth/put-password.json` | ✅ |
| 5 | `PUT /api/auth/picture` | `docs/mock/auth/put-picture.json` | ✅ |
| 6 | `GET /api/cart` | `docs/mock/cart/get-cart.json` | ✅ |
| 7 | `POST /api/cart` | `docs/mock/cart/post-cart.json` | ✅ |
| 8 | `PUT /api/cart` | `docs/mock/cart/put-cart.json` | ✅ |
| 9 | `DELETE /api/cart/:id` | `docs/mock/cart/delete-cart.json` | ✅ |
| 10 | `POST /api/cart/checkout` | `docs/mock/cart/post-checkout.json` | ✅ |
| 11 | `GET /api/categories` | `docs/mock/categories/get-categories.json` | ✅ |
| 12 | `GET /api/products` | `docs/mock/products/get-products.json` | ✅ |
| 13 | `GET /api/products/:slug` | `docs/mock/products/get-product-detail.json` | ✅ |
| 14 | `GET /api/products/:slug/media` | `docs/mock/products/get-product-media.json` | ✅ |
| 15 | `GET /api/products/:slug/reviews` | `docs/mock/products/get-reviews.json` | ✅ |
| 16 | `POST /api/products/:slug/reviews` | `docs/mock/products/post-review.json` | ✅ |
| 17 | `GET /api/favorites` | `docs/mock/favorites/get-favorites.json` | ✅ |
| 18 | `POST /api/favorites` | `docs/mock/favorites/post-favorite.json` | ✅ |
| 19 | `DELETE /api/favorites/:id` | `docs/mock/favorites/delete-favorite.json` | ✅ |
| 20 | `GET /api/search` | `docs/mock/search/get-search.json` | ✅ |
| 21 | `GET /api/profile/orders` | `docs/mock/profile/get-orders.json` | ✅ |
| 22 | `POST /api/orders` | `docs/mock/orders/post-orders.json` | ✅ |
| 23 | `GET /api/orders/:id` | `docs/mock/orders/get-order-id.json` | ✅ |
| 24 | `POST /api/seller/register` | `docs/mock/seller/post-register.json` | ✅ |
| 25 | `GET /api/seller/dashboard` | `docs/mock/seller/get-dashboard.json` | ✅ |
| 26 | `GET /api/admin/dashboard` | `docs/mock/admin/get-dashboard.json` | ✅ |
| 27 | `GET /api/admin/users` | `docs/mock/admin/get-users.json` | ✅ |
| 28 | `PUT /api/admin/orders/:id` | `docs/mock/admin/put-order-id.json` | ✅ |
| 29 | `DELETE /api/admin/reviews/:id` | `docs/mock/admin/delete-review-id.json` | ✅ |
| 30 | `PUT /api/admin/sellers/:id/approve` | `docs/mock/admin/put-seller-id-approve.json` | ✅ |
| 31 | `PUT /api/admin/sellers/:id/reject` | `docs/mock/admin/put-seller-id-reject.json` | ✅ |
| 32 | `GET /api/ai-agents` | `docs/mock/ai-agents/get-ai-agents.json` | ✅ |
| 33 | `GET /api/ai-prompts` | `docs/mock/ai-prompts/get-ai-prompts.json` | ✅ |
| 34 | `GET /api/ai-skills` | `docs/mock/ai-skills/get-ai-skills.json` | ✅ |
| 35 | `GET /api/ai-tokens` | `docs/mock/ai-tokens/get-ai-tokens.json` | ✅ |
| 36 | `GET /api/ai-workflows` | `docs/mock/ai-workflows/get-ai-workflows.json` | ✅ |