# Plan — Expired Domain Discovery Platform

## Overview
Build a production-grade full-stack web app for expired domain discovery, evaluation, and monetization.
Positioning: "Expired domain intelligence platform for buyers, SEOs, and domain investors."

## Skill Routing
- **vibecoding-webapp-swarm**: Full-stack Next.js app build (UI + API + DB)
- **pm-mode**: Project management, task decomposition, and quality gates
- **webapp-building-swarm**: Component architecture, page routing, deployment

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- PostgreSQL (Neon/Supabase) + Prisma ORM
- Tailwind CSS + shadcn/ui
- NextAuth.js (auth)
- Stripe (payments)
- Vercel (hosting)

## Stage 1 — Design & Architecture
**Objective**: Create design documents, database schema, and project structure.
**Agents**:
- `design_agent`: Create design.md (design system, tokens, components)
- `db_architect`: Design database schema (schema.prisma), seed data strategy
- `product_architect`: Design information architecture, page routing, API structure

## Stage 2 — Backend Foundation
**Objective**: Database setup, Prisma schema, API routes, auth, seed data.
**Agents**:
- `backend_dev`: Implement Prisma schema, migrations, seed scripts
- `api_dev`: Build API routes (domains, filters, saved searches, watchlist)
- `auth_dev`: Implement NextAuth, session management, middleware

## Stage 3 — Frontend App Shell
**Objective**: Build app shell, sidebar/nav, layout, auth pages.
**Agents**:
- `frontend_shell`: App layout, navigation, auth UI (login/register)
- `component_dev`: Core components (score badges, premium locks, filters)

## Stage 4 — Core Feature Build
**Objective**: Domain list, filters, detail page, scoring engine.
**Agents**:
- `scoring_engine`: Brand Score + SEO Score calculation functions
- `domain_list_dev`: Domain table, search, sort, filters
- `detail_page_dev`: Domain detail page with score explanations

## Stage 5 — User Features
**Objective**: Saved searches, watchlist, alerts.
**Agents**:
- `user_features_dev`: Saved searches, watchlist functionality
- `alert_dev`: Alert system UI and API

## Stage 6 — Premium & Monetization
**Objective**: Premium lock states, pricing page, Stripe integration.
**Agents**:
- `premium_dev`: Premium lock cards, paywall UX
- `pricing_dev`: Pricing page, Stripe checkout

## Stage 7 — Marketing Site
**Objective**: Public homepage, features, SEO pages.
**Agents**:
- `marketing_dev`: Landing page, public pages
- `seo_pages_dev`: Programmatic SEO structure

## Stage 8 — Polish & Deploy
**Objective**: QA, performance, accessibility, deployment.
**Agents**:
- `qa_polish`: Final review, bug fixes, polish
- `deploy_agent`: Build, deploy to Vercel

## Key Design Decisions
1. Two primary scores: Brand Score (0-100) + SEO Score (0-100)
2. Three metric tiers: Core (free) / Premium (paid) / Launch Soon (roadmap)
3. Mocked domain data with realistic scoring for demo
4. Monolith architecture — no microservices
5. Conversion-aware UX with contextual upgrade prompts
