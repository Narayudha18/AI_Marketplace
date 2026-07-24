---
name: UI Mockup Builder
description: Build fully functional AI Marketplace mock with JSON files on skeleton-build branch. Git worktree → pull skeleton → read backend agent skills → create/replace mock JSON → update workflow → push.
---

## Trigger
Explicitly invoked by user for UI mockup work on `skeleton-build` branch.

## Stack
- **Frontend**: React + Vite + Tailwind CSS (skeleton branch)
- **Mock Data**: JSON files at `frontend/src/data/` (React consumption) + `docs/mock/` (backend contract reference)
- **Git**: Worktree-based (`skeleton-build` worktree, separate from `skeleton`)
- **CI/CD**: GitHub Actions self-hosted runner, triggered on push to `skeleton-build`
- **Deploy**: rsync `dist/` to `/var/www/AI_MARKETPLACE/` on production server

## Workflow

### Step 0 — Check Git Worktree
- Run `git worktree list` to verify `skeleton-build` worktree exists
- If missing, create: `git worktree add ../ACM_AI_MARKETPLACE_BUILD_SKELETON skeleton-build`
- Ensure worktree is clean (`git status`)

### Step 1 — Pull Latest `skeleton` Branch
- `git checkout skeleton && git pull origin skeleton`
- Understand skeleton branch structure: React + Vite + Tailwind, no backend Go code
- Note current component architecture, routes, data flow

### Step 2 — Read Backend Agent Skills
- Read `backend_agent_skills/.agents/.agents/skills/fast-prototyping-workflow/`
- Understand contract-first workflow, mock JSON conventions, branching strategy
- Note: mock JSON must exist at both `frontend/src/data/` (React) and `docs/mock/` (backend contract)

### Step 3 — Check `skeleton-build` Worktree
- Switch to `skeleton-build` worktree
- Check what already exists, what needs update
- Identify old mock files to delete

### Step 4 — Delete Old Mock Data
- Remove `frontend/src/data/templates.json`
- Remove `frontend/src/data/integrations.json`
- Remove `frontend/src/data/chatbots.json`
- Remove `frontend/src/data/automation.json`
- Remove `frontend/src/data/aitools.json`

### Step 5 — Create New Mock JSON (Both Locations)

**Product categories:**
1. `ai-skills` — AI skill.md files
2. `ai-workflows` — AI workflow
3. `ai-agents` — AI agents
4. `ai-prompts` — AI prompts
5. `ai-tokens` — AI token

**Location 1 — `frontend/src/data/` (React consumption):**
- `ai-skills.json` — 12+ items
- `ai-workflows.json` — 12+ items
- `ai-agents.json` — 12+ items
- `ai-prompts.json` — 12+ items
- `ai-tokens.json` — 12+ items

**Location 2 — `docs/mock/` (backend contract):**
- `docs/mock/ai-skills/get-ai-skills.json`
- `docs/mock/ai-workflows/get-ai-workflows.json`
- `docs/mock/ai-agents/get-ai-agents.json`
- `docs/mock/ai-prompts/get-ai-prompts.json`
- `docs/mock/ai-tokens/get-ai-tokens.json`
- `docs/mock/products/get-product-detail.json`
- `docs/mock/cart/post-cart.json`
- `docs/mock/orders/post-orders.json`
- `docs/mock/favorites/get-favorites.json`
- `docs/mock/search/get-search.json`

### Step 6 — Update GitHub Workflow
- Update `.github/workflows/build-production.yml` with build + deploy steps
- Add comments for required secrets setup

### Step 7 — Push to `skeleton-build`
- `git add . && git commit -m "feat: AI Marketplace mock JSON" && git push origin skeleton-build`

## Rules

1. **REFERENCE.md tracking** — Every cycle must create/update `.opencode/skills/ui-mockup-builder/REFERENCE.md` with:
   - Cycle number, date, branch
   - What was done (files created/modified)
   - What is pending (next cycle)
   - Blockers or decisions
2. **Both locations** — Mock JSON always created at both `frontend/src/data/` and `docs/mock/`
3. **Delete before create** — Remove old mock files before creating new ones
4. **Worktree isolation** — All work happens in `skeleton-build` worktree, never in `skeleton`
5. **Push triggers runner** — No PR needed, push directly to `origin/skeleton-build`
6. **Secrets never in code** — Production credentials use GitHub Secrets, referenced as `${{ secrets.* }}`
7. **YAGNI** — Only create mock JSON for features that exist in the UI. No speculative endpoints.
8. **REFERENCE.md tracking** — After every cycle, update REFERENCE.md with cycle log (date, branch, files changed, status, blockers)

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Example |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | `frontend/src/data/ai-skills.json` |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `docs/mock/ai-skills/get-ai-skills.json` |

## GitHub Workflow

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md` with:

| Cycle | Date | Branch | Files Created/Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|
| 1 | 2026-07-24 | skeleton-build | ai-skills.json, ai-workflows.json, ... | ✅ Done | — | — |

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Convention |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | Array of product objects |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `{ endpoint, response: { data: [...], pagination: {...} } }` |

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md` with:

| Cycle | Date | Branch | Files Created | Files Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | skeleton-build | list files | list files | ✅ Done / 🔄 In Progress / ⬜ Pending | none | what to do next |

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Convention |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | Array of product objects |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `{ endpoint, response: { data: [...], pagination: {...} } }` |

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the **single source of truth** for cycle history — survives agent restarts and handoffs.

### REFERENCE.md Format

```markdown
# UI Mockup Builder — Cycle Reference

| Cycle | Date | Branch | Files Created | Files Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | skeleton-build | file1, file2 | file3, file4 | ✅ Done / 🔄 In Progress / ⬜ Pending | none | what to do next |
```

### Rules for REFERENCE.md

1. **Create on first cycle** — If REFERENCE.md doesn't exist, create it with header + first row
2. **Update every cycle** — After each push to `skeleton-build`, append new row
3. **Never delete history** — Only append rows, never remove
4. **Status must be explicit** — Use ✅ Done / 🔄 In Progress / ⬜ Pending
5. **Blockers must be documented** — If blocked, write blocker + reason
6. **Next Steps must be actionable** — Not vague, concrete next action

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Convention |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | Array of product objects |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `{ endpoint, response: { data: [...], pagination: {...} } }` |

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the **single source of truth** for cycle history — survives agent restarts and handoffs.

### REFERENCE.md Format

```markdown
# UI Mockup Builder — Cycle Reference

| Cycle | Date | Branch | Files Created | Files Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | skeleton-build | file1, file2 | file3, file4 | ✅ Done / 🔄 In Progress / ⬜ Pending | none | what to do next |
```

### Rules for REFERENCE.md

1. **Create on first cycle** — If REFERENCE.md doesn't exist, create with header + first row
2. **Update every cycle** — After each push to `skeleton-build`, append new row
3. **Never delete history** — Only append rows, never remove
4. **Status must be explicit** — Use ✅ Done / 🔄 In Progress / ⬜ Pending
5. **Blockers must be documented** — If blocked, write blocker + reason
6. **Next Steps must be actionable** — Concrete next action, not vague
7. **Resume protocol** — On agent restart, read REFERENCE.md first. Check last cycle status → resume at ⬜ Pending step. Do NOT re-ask answered questions.

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Convention |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | Array of product objects |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `{ endpoint, response: { data: [...], pagination: {...} } }` |

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## Rules

1. **REFERENCE.md tracking** — Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the single source of truth for cycle history — survives agent restarts and handoffs.
2. **Both locations** — Mock JSON always created at both `frontend/src/data/` and `docs/mock/`
3. **Delete before create** — Remove old mock files before creating new ones
4. **Worktree isolation** — All work in `skeleton-build` worktree, never in `skeleton`
5. **Push directly** — No PR, push to `origin/skeleton-build` triggers runner
6. **Secrets never in code** — Production credentials use GitHub Secrets, referenced as `${{ secrets.* }}`
7. **YAGNI** — Only create mock JSON for features that exist in UI. No speculative endpoints.
8. **REFERENCE.md tracking** — Every cycle must update REFERENCE.md (see below)

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the single source of truth for cycle history — survives agent restarts and handoffs.

### REFERENCE.md Format

```markdown
# UI Mockup Builder — Cycle Reference

| Cycle | Date | Branch | Files Created | Files Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | skeleton-build | file1, file2 | file3, file4 | ✅ Done / 🔄 In Progress / ⬜ Pending | none | what to do next |
```

### Rules for REFERENCE.md

1. **Create on first cycle** — If REFERENCE.md doesn't exist, create with header + first row
2. **Update every cycle** — After each push to `skeleton-build`, append new row
3. **Never delete history** — Only append rows, never remove
4. **Status must be explicit** — Use ✅ Done / 🔄 In Progress / ⬜ Pending
5. **Blockers must be documented** — If blocked, write blocker + reason
6. **Next Steps must be actionable** — Concrete next action, not vague
7. **Resume protocol** — On agent restart, read REFERENCE.md first. Check last cycle status → resume at ⬜ Pending step. Do NOT re-ask answered questions.

## Product Types & Fields

| Product Type | Fields |
|---|---|
| `ai-skills` | id, name, description, price, sales, rating, category, author, image, fileFormat, fileSize, compatibility[], difficulty, seed |
| `ai-workflows` | id, name, description, price, sales, rating, category, author, image, steps, tools[], difficulty, seed |
| `ai-agents` | id, name, description, price, sales, rating, category, author, image, capabilities[], platform, seed |
| `ai-prompts` | id, name, description, price, sales, rating, category, author, image, promptLength, useCase, seed |
| `ai-tokens` | id, name, description, price, sales, rating, category, author, image, tokenCount, pricePerToken, seed |

## Mock JSON Locations

| Location | Purpose | Convention |
|---|---|---|
| `frontend/src/data/<type>.json` | React app data source | Array of product objects |
| `docs/mock/<type>/get-<type>.json` | Backend contract reference | `{ endpoint, response: { data: [...], pagination: {...} } }` |

## GitHub Workflow Template

File: `.github/workflows/build-production.yml`

```yaml
name: Build & Deploy Skeleton Build

on:
  push:
    branches: [skeleton-build]

jobs:
  build-and-deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to production
        run: rsync -avz --delete dist/ ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }}:/var/www/AI_MARKETPLACE/
```

## Rules

1. **REFERENCE.md tracking** — Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the single source of truth for cycle history — survives agent restarts and handoffs.
2. **Both locations** — Mock JSON always created at both `frontend/src/data/` and `docs/mock/`
3. **Delete before create** — Remove old mock files before creating new ones
4. **Worktree isolation** — All work in `skeleton-build` worktree, never in `skeleton`
5. **Push directly** — No PR, push to `origin/skeleton-build` triggers runner
6. **Secrets never in code** — Production credentials use GitHub Secrets, referenced as `${{ secrets.* }}`
7. **YAGNI** — Only create mock JSON for features that exist in UI. No speculative endpoints.
8. **REFERENCE.md tracking** — Every cycle must update REFERENCE.md (see below)

## REFERENCE.md Tracking

Every cycle must update `.opencode/skills/ui-mockup-builder/REFERENCE.md`. This is the single source of truth for cycle history — survives agent restarts and handoffs.

### REFERENCE.md Format

```markdown
# UI Mockup Builder — Cycle Reference

| Cycle | Date | Branch | Files Created | Files Modified | Status | Blockers | Next Steps |
|---|---|---|---|---|---|---|---|
| 1 | YYYY-MM-DD | skeleton-build | file1, file2 | file3, file4 | ✅ Done / 🔄 In Progress / ⬜ Pending | none | what to do next |
```

### Rules for REFERENCE.md

1. **Create on first cycle** — If REFERENCE.md doesn't exist, create with header + first row
2. **Update every cycle** — After each push to `skeleton-build`, append new row
3. **Never delete history** — Only append rows, never remove
4. **Status must be explicit** — Use ✅ Done / 🔄 In Progress / ⬜ Pending
5. **Blockers must be documented** — If blocked, write blocker + reason
6. **Next Steps must be actionable** — Concrete next action, not vague
7. **Resume protocol** — On agent restart, read REFERENCE.md first. Check last cycle status → resume at ⬜ Pending step. Do NOT re-ask answered questions.
