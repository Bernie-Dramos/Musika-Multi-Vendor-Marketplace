# Musika Project Implementation Plan

## Objective
Move Musika from MVP prototype to a production-ready release while preserving the current visual style and UX patterns.

## Guiding Principles
- Preserve the existing Musika visual language (navy/emerald palette, rounded cards, icon-led UI, clean spacing).
- Build architecture first, then scale features.
- Keep incremental releases stable (`lint` and `build` green at every phase).
- Use secure-by-default Supabase schema and RLS policies.

## Phase 0: Stabilization (Do First)
### Goals
- Ensure engineering baseline is healthy before adding features.

### Steps
1. Fix TypeScript build blockers.
   - Remove/resolve unused `navigateTo` params in `Categories` and `Marketplace` pages.
2. Clean lint warnings.
   - Remove stale `eslint-disable` directives.
3. Validate local development workflows.
   - Confirm `npm run dev`, `npm run lint`, and `npm run build` behavior.
4. Add baseline error handling.
   - Add error boundary and a simple 404 page scaffold.

### Exit Criteria
- `npm run lint` reports no errors.
- `npm run build` completes successfully.

## Phase 1: App Architecture Upgrade
### Goals
- Introduce scalable routing, auth plumbing, and data-fetching foundations.

### Steps
1. Migrate navigation to React Router.
   - Public routes: Home, Services, Categories, Marketplace, SignIn, SignUp, International Resources, Community Forum, Become a Vendor, Help & Support.
   - Protected routes: Profile, Vendor Dashboard, My Posts, Saved Resources, My Tickets.
   - Auth routes: redirect logged-in users away from SignIn/SignUp.
2. Add auth state layer.
   - Create auth context/provider powered by Supabase session listeners.
3. Add data layer.
   - Introduce React Query for server state, caching, and loading/error consistency.
4. Refactor folder structure by feature domain.
   - Domains: `auth`, `resources`, `forum`, `vendor`, `support`, `profile`.

### Exit Criteria
- Route transitions are stable.
- Protected route behavior works with mock auth gate.
- Shared data hooks pattern is in place.

## Phase 2: Design System Continuity
### Goals
- Add new pages without visual drift from the current site.

### Steps
1. Define reusable page shell components.
   - `HeroHeader`, `SectionHeader`, `FilterSidebar`, `ContentCard`, `CTAFooter`.
2. Standardize loading/empty/error states.
   - Skeletons, empty-state cards, call-to-action blocks.
3. Document UI usage conventions.
   - Typography hierarchy, spacing rhythm, button variants, card usage.
4. Apply responsive parity.
   - Validate desktop/tablet/mobile breakpoints for all new templates.

### Exit Criteria
- New pages match existing design style.
- Reusable UI blocks eliminate duplicate layout code.

## Phase 3: New Page Implementations
### 3.1 International Resources
#### Goals
- Deliver searchable, filterable resources for international students.

#### Steps
1. Build resources index page.
   - Categories: visas, legal docs, housing guides, transport guides, healthcare, discounts, emergency contacts.
2. Add search and filters.
   - Category, country, city, verified source toggle.
3. Build resource detail page.
4. Add save/bookmark and report incorrect resource actions.

#### Exit Criteria
- Users can browse, search, and view resources.
- Logged-in users can bookmark resources.

### 3.2 Community Forum
#### Goals
- Provide community Q&A and discussion space.

#### Steps
1. Build forum feed with tabs.
   - Latest, Trending, Unanswered, My Posts.
2. Build post creation flow.
3. Build thread detail with comments/replies.
4. Add upvote/save/report interactions.

#### Exit Criteria
- Users can create posts and comments.
- Feed and thread pages are functional and responsive.

### 3.3 Become a Vendor
#### Goals
- Enable vendor onboarding and verification workflow.

#### Steps
1. Build vendor marketing/landing page.
   - Benefits, process, eligibility checklist.
2. Build onboarding wizard.
   - Personal info, business details, verification docs, payout details.
3. Build application status page.
   - Submitted, review, approved, rejected, revision required.

#### Exit Criteria
- Vendor applications can be submitted and status can be viewed.

### 3.4 Help & Support
#### Goals
- Provide self-service and ticket-based support.

#### Steps
1. Build FAQ and help center index.
2. Add article search/filter.
3. Build contact support form.
4. Build ticket list/detail pages for logged-in users.

#### Exit Criteria
- Users can submit support requests and track status.

### 3.5 Profile Click (Logged-Out State)
#### Goals
- Handle profile access when user is not authenticated.

#### Steps
1. Add auth gateway modal/page on profile click while logged out.
2. Include clear CTAs.
   - Sign In, Create Account, Continue Browsing.
3. Add return URL handling for protected route redirects.

#### Exit Criteria
- Logged-out profile access is graceful and conversion-focused.

## Phase 4: Supabase Implementation
### Goals
- Replace UI-only auth and mock persistence with real backend functionality.

### Steps
1. Configure Supabase project and client.
2. Implement authentication flows.
   - Sign-up, sign-in, sign-out, email verification, password reset.
3. Create initial database schema.
   - `profiles`
   - `vendor_applications`
   - `resources`
   - `forum_posts`
   - `forum_comments`
   - `support_tickets`
   - `support_messages`
   - `saved_resources`
4. Configure Row Level Security (RLS).
   - User-owned access for profile/private records.
   - Public read / authenticated write where appropriate (forum/resources depending on requirements).
5. Add Supabase storage buckets.
   - Vendor docs (private), avatars, support attachments.
6. (Optional) Add Supabase Edge Functions.
   - Notification hooks, moderation helpers, vendor workflow automation.

### Exit Criteria
- Auth works end-to-end.
- Critical user-generated data is persisted.
- RLS protects user data correctly.

## Phase 5: Frontend Auth + Data Flows
### Goals
- Ensure all app flows are connected and resilient.

### Steps
1. Finalize auth lifecycle handling.
   - Session restore, redirect behavior, protected route enforcement.
2. Integrate data operations per feature.
   - Resources, forum, vendor onboarding, support.
3. Add UX resilience.
   - Inline errors, toasts, loading states, optimistic updates where safe.
4. Add role-based behavior.
   - Student vs Vendor experiences and access.

### Exit Criteria
- User journeys are complete without mock placeholders.

## Phase 6: Delivery and Release Hardening
### Goals
- Reach production readiness with confidence.

### Steps
1. Add test coverage.
   - Unit tests (auth/guards/utilities), integration tests (feature flows), E2E tests (critical user journeys).
2. Perform performance review.
   - Route-level code splitting, image optimization, bundle checks.
3. Run accessibility checks.
   - Keyboard navigation, semantic labels, contrast, focus states.
4. Add monitoring and analytics.
   - Auth events, errors, key feature usage signals.
5. Prepare release checklist.
   - Environment config, migration scripts, rollback plan.

### Exit Criteria
- Release candidate is stable, measurable, and secure.

## Suggested Sprint Mapping
1. Sprint 1: Phase 0 + routing/auth scaffolding from Phase 1.
2. Sprint 2: International Resources + Help & Support (Phase 3 + data hooks).
3. Sprint 3: Community Forum implementation.
4. Sprint 4: Become a Vendor + application status.
5. Sprint 5: Supabase hardening + test coverage + release prep.

## Definition of Done
- All planned routes implemented and linked in navigation.
- Profile logged-out behavior implemented.
- Supabase auth and persistence integrated for all planned features.
- RLS policies validated.
- Mobile and desktop layouts match Musika style language.
- CI checks pass (`lint`, `build`, tests).
