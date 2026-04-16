# Musika Multi-Vendor Marketplace

A responsive React + TypeScript web application focused on helping international students discover trusted vendors and services (accommodation, transportation, dining, legal, wellness, electronics, and more).

This README documents the current implementation state, architecture, quality status, and recommended engineering next steps.

## Executive Summary

- Product stage: Frontend prototype / pre-MVP.
- Strengths: Strong UI coverage, reusable component library, responsive layouts, typed cart state management.
- Main gap: No backend integration yet (all data is mock/in-memory).
- Engineering status:
  - Lint: passes with warnings only.
  - Build: currently failing due to strict TypeScript unused-parameter checks.

## Current Quality Snapshot (as of 2026-04-16)

Commands executed from project root:

- `npm run lint`
  - Result: 0 errors, 3 warnings.
  - Warnings are unused `eslint-disable` comments in:
    - `src/App.tsx`
    - `src/components/ui/badge.tsx`
    - `src/components/ui/sidebar.tsx`
- `npm run build`
  - Result: fails.
  - TypeScript errors:
    - `src/pages/Categories.tsx`: `navigateTo` is declared but never used.
    - `src/pages/Marketplace.tsx`: `navigateTo` is declared but never used.

## Product Scope Implemented

- Home page with hero, value proposition, process steps, and CTA.
- Services listing with filter UI and add-to-cart interactions.
- Categories page with featured vendors and popular services.
- Marketplace product detail experience with related products.
- Sign in and sign up forms with validation-oriented UX patterns.
- Global cart sidebar with quantity controls and price summary.
- Mobile-friendly header/menu and responsive page layouts.

## Architecture Overview

### Frontend Framework

- React 19 + TypeScript + Vite 7.
- Tailwind CSS for utility styling.
- Radix primitives + reusable UI components (`src/components/ui/*`).
- Lucide icons for visual language.

### Navigation Strategy

- Custom client-side navigation in `src/App.tsx` using:
  - `window.history.pushState`
  - `popstate` listener
  - Internal `Page` union type
- Note: React Router is not used.

### State Management

- Cart is managed with React Context in `src/hooks/useCart.tsx`.
- Cart state includes:
  - `items`, `totalItems`, `totalPrice`
  - `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - `isCartOpen` visibility state
- Persistence is not yet implemented (cart resets on refresh).

### Data Layer

- Data source is static mock data from `src/lib/data.ts`.
- No API client, no backend persistence, no auth service integration yet.

## Project Structure

```text
src/
  App.tsx                # App shell + manual route handling
  main.tsx               # React entry point
  index.css              # Tailwind + theme tokens + custom animations
  components/
    Header.tsx           # Desktop/mobile header + search + cart trigger
    Footer.tsx           # Global footer
    CartSidebar.tsx      # Cart overlay panel
    AnimatedSection.tsx  # Shared reveal animation wrappers
    ui/                  # Reusable Radix-based UI primitives
  hooks/
    useCart.tsx          # Cart context and business logic
    use-mobile.ts        # Responsive helper hook
  lib/
    data.ts              # Mock domain data
    utils.ts             # Utility helpers (class merging, etc.)
  pages/
    Home.tsx
    Services.tsx
    Categories.tsx
    Marketplace.tsx
    SignIn.tsx
    SignUp.tsx
```

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7
- Tailwind CSS 3
- Radix UI primitives
- Framer Motion (installed)
- React Hook Form + Zod (installed)
- ESLint 9

## Setup and Run

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Scripts

- `dev`: start Vite dev server
- `build`: type-check + production build
- `lint`: run ESLint
- `preview`: serve built output

## Engineering Findings

### What is working well

- Consistent design language (navy/emerald palette, card patterns, badge semantics).
- Good component decomposition for UI sections.
- Cart interactions are predictable and typed.
- Responsive behavior is present across major pages.

### Technical debt / risks

- Manual route handling increases maintenance cost as app grows.
- Build currently blocked by strict TypeScript unused parameter checks.
- Auth pages are UI-only; no real authentication flow.
- Filters and search are primarily UI-level with limited functional depth.
- Data is static, so there is no true multi-vendor or transactional workflow yet.

## Recommended Next Steps

1. Stabilize CI quality gate.
   - Fix TypeScript build blockers in `Categories.tsx` and `Marketplace.tsx`.
   - Remove stale `eslint-disable` comments.
2. Introduce production-grade routing.
   - Migrate from manual `pushState` handling to React Router.
3. Define backend/API contract.
   - Start with catalog, vendor profile, cart, and order endpoints.
4. Add persistence and auth.
   - Persist cart (local storage first, backend later).
   - Integrate real sign-in/sign-up and session handling.
5. Add test coverage.
   - Unit tests for cart logic.
   - Component tests for page-critical flows.
   - Basic E2E happy path for browse -> add to cart.

## Notes

- Vite base is configured as `./` in `vite.config.ts`, which supports relative asset paths for static hosting.
- Path alias `@/*` is configured in `tsconfig.app.json` and Vite resolve config.

## License

No license file is currently present in the repository. Add one before public distribution.
