# DomFindr — Expired Domain Intelligence Platform

## Session: 2026-06-12 — Single Domain Check + Auth

### Status: COMPLETED

### Previous Sessions
- v1: Full frontend SPA (52 mock domains)
- v2: Real scoring + Archive.org + CSV upload + Supabase schema

### What Was Added Today (v3)

#### 1. Single Domain Checker (`/app/check`) [MOST IMPORTANT]
- Input field → ketik domain → klik Check
- Scoring REAL via Archive.org CDX API:
  - Brand Score: length, TLD quality, keyword detection, hyphen/number penalty
  - SEO Score: Archive.org snapshot count + first seen year + age
- Tampilan hasil lengkap:
  - 3 score cards (Brand, SEO, Total) dengan animasi
  - Archive.org info banner (snapshots count, first seen year)
  - Brand signals breakdown (6 bars)
  - SEO signals breakdown (5 bars)
  - Positive/Negative/Warning flags
  - Premium lock teaser
  - Links ke Wayback Machine + visit domain
- Quick suggestions: 4 domain example yang bisa diklik
- Demo accounts: demo@web-library.net / demo123

#### 2. Auth System (`src/lib/auth.ts`)
- LocalStorage-based (works tanpa Supabase)
- Register, Login, Logout
- Demo account: demo@web-library.net / demo123 (auto Pro plan)
- User object: id, email, name, plan
- Supabase integration optional (backward compatible)

#### 3. Updated Navigation
- Sidebar: Check Domain (NEW, paling atas setelah Dashboard)
- Route: /app/check

### Live URL
https://zxqsl3f4ngic2.kimi.page

### New Routes
- `/app/check` — Single domain checker (REAL scoring)

### How to Use Single Domain Check
1. Buka https://zxqsl3f4ngic2.kimi.page/#/app/check
2. Ketik domain di input (contoh: `techflow.io`)
3. Klik **Check**
4. Tunggu 1-2 detik (API call ke Archive.org)
5. Lihat hasil scoring lengkap

### Demo Login
- Email: `demo@web-library.net`
- Password: `demo123`
- Atau register akun baru (data di localStorage)

### Archive.org Limitations (HONEST)
- API call dari browser bisa kena CORS block
- Rate limit: ~3 req/detik
- Kalau API gagal: Brand Score tetap jalan (pure calculation), SEO Score = base score
- Fallback: Tetap tampilkan hasil dengan warning

### Files Added/Modified
- NEW: `src/pages/CheckDomain.tsx` — Single domain checker page
- NEW: `src/lib/auth.ts` — Auth system
- MOD: `src/App.tsx` — Tambah route /app/check
- MOD: `src/components/app/AppSidebar.tsx` — Tambah nav Check Domain

### Scoring Real vs Fake (Updated)
| Komponen | Status | Keterangan |
|----------|--------|------------|
| Brand Score | Real (calculated) | Formula client-side dari nama domain |
| Archive History | Real API call | Wayback Machine CDX API (bisa kena CORS/ratelimit) |
| SEO Score | Semi-real | Archive data + formula, fallback kalau API gagal |
| Backlink/Traffic | Fake | Premium placeholder, perlu API berbayar |
