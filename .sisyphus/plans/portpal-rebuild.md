# PortPal Rebuild: Bubble.io → Next.js + Supabase

## TL;DR

> **Quick Summary**: Rebuild the PortPal shift tracking app (currently Bubble.io) as a modern Next.js + Supabase PWA with full feature parity, including data migration of 77,275 existing shifts from 3,068 users.
> 
> **Deliverables**:
> - Next.js 16 App Router application with Supabase backend
> - PWA with mobile-first UI (90% mobile users)
> - All 6 entry types (WORKED wizard, Leave, Vacation, Standby, Stat Holiday, Day Off)
> - Pay calculation engine with 330 PAYDIFFS overrides
> - Dashboard, Shifts calendar, Analytics, Gamification (full feature parity)
> - Data migration scripts for complete user/shift import
> 
> **Estimated Effort**: XL (4-5 weeks)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Foundation → Pay Engine → Entry Types → Views → Migration

---

## Context

### Original Request
Rebuild PortPal (Bubble.io shift tracking app for ILWU longshoremen) as Next.js + Supabase application with full feature parity, including migration of all existing data.

### Interview Summary
**Key Decisions**:
- **MVP Scope**: Full feature parity (all features from current app)
- **Tech Stack**: Next.js 16 + Supabase + Supabase Auth + PWA (Turbopack, React 19.2)
- **Testing**: TDD (Test-Driven Development)
- **Data Migration**: Include (77,275 shifts, 3,068 users)
- **Premium Features**: Deferred (no Stripe integration in this phase)
- **Gamification**: Reverse-engineer formulas from export data, fallback to simple formulas
- **User Migration**: Password reset on first login
- **Goals System**: Full implementation (4 types × 3 periods = 12 combinations)
- **Multi-tenant**: NO - Local (500/502) is just a user attribute, not tenant separation

**Research Findings**:
- Documentation complete: 1,723 lines covering all features
- 22 screenshots of all app screens captured
- PAYDIFFS CSV validated against export data (330 combinations)
- Export structure analyzed (52 columns, entry type flags identified)

### Metis Review
**Identified Gaps (addressed)**:
- Gamification formulas unknown → Will reverse-engineer from export
- User password migration impossible → Password reset on first login
- Goals scope unclear → Full 12-combination system
- Multi-tenant confusion → Clarified as simple user attribute

---

## Work Objectives

### Core Objective
Rebuild PortPal as a modern, performant Next.js + Supabase PWA that exactly replicates all functionality of the existing Bubble.io app, with complete data migration preserving all 77,275 shifts and 3,068 user accounts.

### Concrete Deliverables
1. Next.js 16 application with App Router (Turbopack default)
2. Supabase database with all tables and RLS policies
3. Supabase Auth with email/password + Google + Facebook
4. Pay calculation engine (TDD, 100% test coverage)
5. 6 entry type forms (WORKED 3-step wizard, 5 simple forms)
6. Dashboard with earnings, holidays, benefits widgets
7. Shifts views (weekly, monthly, yearly calendars)
8. Analytics (Work Insights + Journey/Gamification)
9. Posts archive + Feedback form
10. PWA manifest and service worker
11. Data migration scripts and validation
12. Account settings and user profile

### Definition of Done
- [ ] `npm test` → All tests pass (100% coverage on pay calculations)
- [ ] `npm run build` → Production build succeeds with no errors
- [ ] Playwright E2E tests pass for all 6 entry types
- [ ] Data migration validation: 77,275 shifts imported correctly
- [ ] Lighthouse PWA score ≥ 90
- [ ] All URLs match existing patterns (/index/home/dashboard, etc.)

### Must Have
- Exact pay calculation matching (base + differential + PAYDIFFS overrides)
- All 43 jobs, 24 locations, 26 holidays as reference data
- Mobile-first responsive design
- Offline view capability (PWA)
- Password reset flow for migrated users

### Must NOT Have (Guardrails)
- ❌ Premium feature gates or subscription paywalls
- ❌ Stripe/payment integration
- ❌ Admin dashboard for posts/user management
- ❌ AI features (chat, OCR, predictions)
- ❌ Push notifications
- ❌ Over-abstracted architecture (no PayCalculationServiceFactoryStrategy)
- ❌ Redis caching (premature optimization)
- ❌ Excessive JSDoc documentation
- ❌ **Custom UI components when shadcn has one** (use shadcn Dialog, Select, Calendar, etc.)
- ❌ **Installing Radix primitives directly** (shadcn already includes them)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
> ALL verification is automated via tests, playwright, or CLI commands.

### Test Decision
- **Infrastructure exists**: NO (new project)
- **Automated tests**: YES (TDD)
- **Framework**: Vitest (fast, native ESM support for Next.js)

### TDD Workflow

Each TODO follows RED-GREEN-REFACTOR:
1. **RED**: Write failing test first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Clean up while keeping green

### Agent-Executed QA Scenarios

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| Pay Calculations | Vitest | Unit tests against known values |
| Entry Forms | Playwright | Fill forms, submit, verify database |
| Dashboard | Playwright | Navigate, assert widgets display correctly |
| API Endpoints | curl/httpie | Send requests, assert responses |
| Migration | psql/Supabase CLI | Query counts, sums, verify integrity |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (First - Before Everything):
└── Task 0: Update AGENTS.md with Supabase rules

Wave 1 (After Wave 0) - Foundation:
├── Task 1: Project Setup (Next.js, Supabase CLI, Recharts, Vitest, Playwright)
├── Task 2: Database Schema via Supabase CLI migrations + Seed Reference Data
└── Task 3: Supabase Auth Integration

Wave 2 (After Wave 1) - Core Engine:
├── Task 4: Pay Calculation Engine (TDD - 100% coverage)
├── Task 5: Reverse-Engineer Gamification Formulas
└── Task 6: API Routes Foundation

Wave 3 (After Wave 2) - Entry Types:
├── Task 7: WORKED Entry Wizard (3 steps)
├── Task 8: Leave Entry Form
├── Task 9: Simple Entry Forms (Vacation, Standby, Day Off, Stat Holiday)
└── Task 10: Shift CRUD (View, Edit, Delete)

Wave 4 (After Wave 3) - Views & Features:
├── Task 11: Dashboard Page
├── Task 12: Shifts Views (Weekly, Monthly, Yearly)
├── Task 13: Analytics Pages (Insights + Journey)
├── Task 14: Goals System (Full CRUD)
├── Task 15: Posts Archive + Feedback Form
├── Task 16: Account Settings

Wave 5 (After Wave 4) - Migration & Polish:
├── Task 17: Data Migration Scripts
├── Task 18: PWA Setup
├── Task 19: E2E Test Suite
└── Task 20: Final Validation & Cleanup

Critical Path: Task 0 → Task 1 → Task 4 → Task 7 → Task 11 → Task 17
```

### Dependency Matrix

| Task | Depends On | Blocks | Parallel With |
|------|------------|--------|---------------|
| 0 | None | 1,2,3,4,5,6 (all) | None |
| 1 | 0 | 2,3,4,5,6 | None |
| 2 | 1 | 4,7,8,9 | 3 |
| 3 | 1 | 7,8,9,16 | 2 |
| 4 | 2 | 7,8,10,11 | 5,6 |
| 5 | 2 | 11,13 | 4,6 |
| 6 | 1 | 7,8,9,10 | 4,5 |
| 7 | 4,6 | 10,11,12 | 8,9 |
| 8 | 4,6 | 10,11 | 7,9 |
| 9 | 6 | 10,12 | 7,8 |
| 10 | 7,8,9 | 12 | None |
| 11 | 4,5,7 | 17 | 12,13,14,15,16 |
| 12 | 7,10 | 17 | 11,13,14,15,16 |
| 13 | 5,7 | 17 | 11,12,14,15,16 |
| 14 | 6 | 17 | 11,12,13,15,16 |
| 15 | 6 | 17 | 11,12,13,14,16 |
| 16 | 3,6 | 17 | 11,12,13,14,15 |
| 17 | 11,12,13,14,15,16 | 18,19 | None |
| 18 | 17 | 20 | 19 |
| 19 | 17 | 20 | 18 |
| 20 | 18,19 | None | None |

---

## TODOs

---

### Wave 0: Pre-Setup (Before Everything)

---

- [x] 0. Update AGENTS.md with Supabase Rules

  **What to do**:
  - Copy content from `.sisyphus/drafts/agents-md-additions.md` into `AGENTS.md`
  - Add after "### 2. Screenshot Organization Rule" section
  - Verify the Supabase CLI migration rules are clear
  - Verify the 1000-row pagination rules are clear

  **Why this is Task 0**:
  - AGENTS.md governs ALL future agent behavior
  - Must be in place BEFORE any database work begins
  - Ensures all agents follow Supabase CLI migration audit trail

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (must be first)
  - **Blocks**: All other tasks
  - **Blocked By**: None

  **Acceptance Criteria**:
  ```
  Scenario: AGENTS.md contains Supabase rules
    Tool: Bash
    Steps:
      1. grep -q "Supabase CLI" AGENTS.md
      2. grep -q "1000 row limit" AGENTS.md
    Expected Result: Both patterns found
  ```

  **Commit**: YES
  - Message: `docs: add Supabase CLI migration and pagination rules to AGENTS.md`
  - Files: `AGENTS.md`

---

### Wave 1: Foundation

---

- [x] 1. Project Setup & Configuration

  **What to do**:
  - Initialize Next.js 16 with App Router (`npx create-next-app@latest`)
  - Install dependencies:
    - `@supabase/supabase-js@2`, `@supabase/ssr` (database + auth)
    - `vitest@4`, `@playwright/test@1.58` (testing - see Testing Strategy below)
    - `@testing-library/react` (component testing)
    - `zod` (runtime validation)
    - `date-fns@4` (date manipulation for calendar views - ~4KB tree-shaken)
  - **shadcn/ui is already installed** - ALL components available
    - Use shadcn components for ALL UI (Dialog, Select, DropdownMenu, Calendar, Button, Input, Card, Sonner, etc.)
    - **MANDATORY**: If shadcn has a component for the job, USE IT. Do NOT create custom components.
    - Recharts is included via shadcn/ui charts
  - Initialize Supabase CLI: `supabase init`
  - Configure Vitest 4.0 for TDD workflow (stable Browser Mode)
  - Configure Playwright 1.58 for E2E tests
  - Set up Tailwind CSS v4 with mobile-first breakpoints (CSS-first config, no tailwind.config.js)
  - Create environment variables template (.env.example)
  - Set up project structure following App Router conventions
  - Create `src/lib/supabase/pagination.ts` helper for >1000 row queries

  **Testing Strategy (Vitest vs Playwright)**:
  | Tool | Type | Purpose | Example |
  |------|------|---------|---------|
  | **Vitest** | Unit tests | Test individual functions/logic in isolation | `calculatePay(8, 55.30)` returns `442.40` |
  | **Playwright** | E2E tests | Test full user flows in real browser | User signs in → creates shift → sees it on dashboard |

  **Must NOT do**:
  - Do NOT add unnecessary dependencies (no Redux, no complex state management)
  - Do NOT create custom UI components if shadcn has one (use shadcn Dialog, Select, Calendar, etc.)
  - Do NOT install Serwist/next-pwa (native PWA in Task 18)
  - Do NOT set up CI/CD yet
  - Do NOT add linting rules beyond defaults

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard project scaffolding, well-documented process
  - **Skills**: `[]`
    - No special skills needed for project init

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (first task)
  - **Blocks**: Tasks 2, 3, 4, 5, 6
  - **Blocked By**: None

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:36-37` - Tech stack requirements
  - `.sisyphus/drafts/portpal-app-documentation.md:797-810` - Mobile-first design notes
  - Next.js App Router docs: https://nextjs.org/docs/app
  - Supabase Next.js guide: https://supabase.com/docs/guides/auth/server-side/nextjs

  **Acceptance Criteria**:

  ```
  Scenario: Project builds successfully
    Tool: Bash
    Steps:
      1. cd portpal-2-next && npm install
      2. npm run build
    Expected Result: Build completes with exit code 0
    Evidence: Build output captured

  Scenario: Vitest runs
    Tool: Bash
    Steps:
      1. npm test -- --run
    Expected Result: Test runner executes (0 tests initially)
    Evidence: Vitest output captured

  Scenario: Playwright installed
    Tool: Bash
    Steps:
      1. npx playwright test --list
    Expected Result: Playwright lists test files (empty initially)
    Evidence: Playwright output captured
  ```

  **shadcn/ui Component Mapping** (use these, don't reinvent):
  | Feature | shadcn Component |
  |---------|------------------|
  | Modals (Delete confirm, Benefits update) | `Dialog` |
  | Dropdowns (Jobs, Locations, Leave types) | `Select` |
  | User avatar menu | `DropdownMenu` |
  | Date pickers | `Calendar` + `Popover` |
  | Toast notifications | `Sonner` |
  | Charts (Insights page) | `Chart` (Recharts wrapper) |
  | Forms | `Input`, `Button`, `Label`, `Textarea` |
  | Cards (Dashboard widgets) | `Card` |
  | Tabs (Shifts views, Analytics) | `Tabs` |
  | Toggle switches | `Switch` |
  | Progress bars | `Progress` |

  **Commit**: YES
  - Message: `chore: initialize Next.js 16 project with Supabase, Vitest, Playwright`
  - Files: `package.json, tsconfig.json, next.config.js, vitest.config.ts, playwright.config.ts, app/globals.css (Tailwind v4 CSS-first config), .env.example, app/layout.tsx, app/page.tsx`

---

- [x] 2. Database Schema & Reference Data Seeding

  **What to do**:
  - Create Supabase project (or use existing)
  - **USE SUPABASE CLI FOR ALL MIGRATIONS** (per AGENTS.md rules):
    ```bash
    supabase migration new create_initial_schema
    # Edit the generated .sql file, then:
    supabase db push
    ```
  - Create all tables per data model in documentation:
    - `users` (with gamification fields, benefits, onboarding)
    - `shifts` (with all entry type fields)
    - `jobs` (43 jobs with differential classes)
    - `subjobs` (29 subjobs linked to 4 parent jobs)
    - `locations` (24 locations)
    - `holidays` (26 holidays for 2025-2027)
    - `pay_overrides` (330 PAYDIFFS combinations)
    - `goals` (with type, kind, dates, target)
    - `posts` (for announcements)
    - `feedback` (user submissions)
  - Set up Row Level Security (RLS) policies:
    - Users can only read/write their own shifts
    - Users can only read/write their own goals
    - Reference tables (jobs, locations, holidays, pay_overrides) are read-only for all
    - Posts are read-only for authenticated users
  - Create seed scripts for reference data from CSV/documentation
  - Import PAYDIFFS from `PORTPAL_Developer_Package2/pay_data/PAYDIFFS_clean.csv`

  **Must NOT do**:
  - Do NOT create admin-only tables (deferred)
  - Do NOT implement multi-tenant RLS (not needed)
  - Do NOT add triggers/functions yet (only if needed for specific features)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Database design requires attention to detail, many tables
  - **Skills**: `[]`
    - Standard SQL/Supabase work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 3)
  - **Blocks**: Tasks 4, 7, 8, 9
  - **Blocked By**: Task 1

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:524-682` - Complete data models with SQL
  - `.sisyphus/drafts/portpal-app-documentation.md:148-196` - All dropdown options (jobs, locations, etc.)
  - `.sisyphus/drafts/portpal-app-documentation.md:197-216` - Stat holidays list
  - `PORTPAL_Developer_Package2/pay_data/PAYDIFFS_clean.csv` - 330 hour override combinations
  - `.sisyphus/drafts/portpal-app-documentation.md:226-247` - Differential classes

  **Acceptance Criteria**:

  ```
  Scenario: All tables created with correct structure
    Tool: Bash (Supabase CLI or psql)
    Steps:
      1. supabase db diff
      2. Verify tables: users, shifts, jobs, subjobs, locations, holidays, pay_overrides, goals, posts, feedback
    Expected Result: All 10 tables exist with correct columns
    Evidence: Schema dump captured

  Scenario: Reference data seeded correctly
    Tool: Bash (psql)
    Steps:
      1. SELECT COUNT(*) FROM jobs; -- Assert: 43
      2. SELECT COUNT(*) FROM subjobs; -- Assert: 29
      3. SELECT COUNT(*) FROM locations; -- Assert: 24
      4. SELECT COUNT(*) FROM holidays; -- Assert: 26
      5. SELECT COUNT(*) FROM pay_overrides; -- Assert: 330
    Expected Result: All counts match expected values
    Evidence: Query results captured

  Scenario: RLS policies active
    Tool: Bash (psql as anon role)
    Steps:
      1. Attempt SELECT * FROM shifts; as anonymous
    Expected Result: Returns 0 rows (RLS blocks access)
    Evidence: Query result captured
  ```

  **Commit**: YES
  - Message: `feat(db): create schema and seed reference data (43 jobs, 330 PAYDIFFS)`
  - Files: `supabase/migrations/*.sql, supabase/seed.sql, scripts/seed-paydiffs.ts`

---

- [x] 3. Supabase Auth Integration

  **What to do**:
  - Configure Supabase Auth providers:
    - Email/Password (primary)
    - Google OAuth
    - Facebook OAuth
  - Create auth utility functions (`lib/supabase/auth.ts`):
    - `signIn(email, password)`
    - `signUp(email, password, metadata)`
    - `signOut()`
    - `resetPassword(email)`
    - `getUser()`
    - `getSession()`
  - Create auth middleware for protected routes
  - Build auth pages:
    - `/signin` - Sign in form with tabs (Sign in / Sign up)
    - Forgot password inline flow (sends email, shows success message)
    - Password reset handler page
  - Create onboarding modal component (Board, Local selection)
  - Implement "password reset on first login" flow for migrated users

  **Must NOT do**:
  - Do NOT implement custom JWT handling
  - Do NOT build account management yet (Task 16)
  - Do NOT add session persistence beyond Supabase defaults

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Auth is critical, needs careful implementation
  - **Skills**: `["frontend-ui-ux"]`
    - Sign in/up pages need good mobile UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 7, 8, 9, 16
  - **Blocked By**: Task 1

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:874-909` - Sign In page structure
  - `.sisyphus/drafts/portpal-app-documentation.md:1165-1197` - Sign Up form with all fields
  - `.sisyphus/drafts/portpal-app-documentation.md:1140-1148` - Board/Local dropdown options
  - `.sisyphus/drafts/screenshots/03-signin-page.png` - Visual reference
  - `.sisyphus/drafts/screenshots/04-signup-page.png` - Visual reference
  - Supabase Auth docs: https://supabase.com/docs/guides/auth

  **Acceptance Criteria**:

  ```
  Scenario: User can sign up with email/password
    Tool: Playwright
    Steps:
      1. Navigate to /signin
      2. Click "Sign up" tab
      3. Fill: input[name="name"] → "Test User"
      4. Fill: input[name="email"] → "newuser@test.com"
      5. Fill: input[name="password"] → "TestPass123!"
      6. Select: Local dropdown → "500"
      7. Select: Board dropdown → "A BOARD"
      8. Click: button[type="submit"]
      9. Wait for: redirect to /index/home/dashboard OR onboarding modal
    Expected Result: User created in Supabase, redirected to app
    Evidence: .sisyphus/evidence/task-3-signup.png

  Scenario: User can sign in with existing account
    Tool: Playwright
    Steps:
      1. Navigate to /signin
      2. Fill: input[name="email"] → "test@gmail.com"
      3. Fill: input[name="password"] → "Cutkhoiacctao@123"
      4. Click: button[type="submit"]
      5. Wait for: /index/home/dashboard
    Expected Result: User logged in, at dashboard
    Evidence: .sisyphus/evidence/task-3-signin.png

  Scenario: Forgot password sends email
    Tool: Playwright
    Steps:
      1. Navigate to /signin
      2. Fill: input[name="email"] → "test@gmail.com"
      3. Click: "Forgot Password?" link
      4. Wait for: success message visible
    Expected Result: Message "A password reset link has been sent to your email"
    Evidence: .sisyphus/evidence/task-3-forgot-password.png
  ```

  **Commit**: YES
  - Message: `feat(auth): implement Supabase Auth with email, Google, Facebook providers`
  - Files: `lib/supabase/auth.ts, app/(auth)/signin/page.tsx, app/(auth)/reset-password/page.tsx, middleware.ts, components/OnboardingModal.tsx`

---

### Wave 2: Core Engine

---

- [x] 4. Pay Calculation Engine (TDD)

  **What to do**:
  - Create pay calculation module with 100% test coverage
  - Implement pure functions (no side effects):
    - `getJobDifferential(job: string): DifferentialClass`
    - `calculateRegularRate(baseRate: number, differential: number): number`
    - `calculateOvertimeRate(baseRate: number, differential: number): number`
    - `getHoursOverride(job: string, subjob: string | null, location: string, shiftType: string): number | null`
    - `calculateShiftPay(params: ShiftParams): PayCalculation`
  - Handle all differential classes:
    - BASE: +$0.00 (Labour, First Aid)
    - CLASS_1: +$2.50 (HD Mechanic, Millwright, Electrician, Welder)
    - CLASS_2: +$1.50 (Ship Gantry, Dock Gantry, RTG, Rubber Tire Gantry)
    - CLASS_3: +$0.65 (Tractor Trailer, Lift Truck, Front End Loader, Reachstacker)
    - CLASS_4: +$0.40 (Winch Driver, Hatch Tender, Gearperson)
  - Handle shift type rate multipliers:
    - Day: base rate
    - Night: includes night differential
    - Graveyard: highest premium
  - Load and lookup PAYDIFFS overrides
  - Calculate travel pay: hours × $53.17/hr
  - Calculate meal pay: 0.50 hrs × OT rate

  **Must NOT do**:
  - Do NOT create abstraction layers (no PayCalculatorFactory)
  - Do NOT fetch from database in calculation functions (pure functions only)
  - Do NOT handle UI concerns (this is pure business logic)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Complex business logic requiring TDD discipline, must be 100% correct
  - **Skills**: `[]`
    - Pure logic, no special tools needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 7, 8, 10, 11
  - **Blocked By**: Task 2

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:219-276` - Pay calculation system with formulas
  - `.sisyphus/drafts/portpal-app-documentation.md:226-232` - Differential classes table
  - `.sisyphus/drafts/portpal-app-documentation.md:234-247` - Rate calculation formulas
  - `.sisyphus/drafts/portpal-app-documentation.md:1299-1306` - Total pay formula
  - `PORTPAL_Developer_Package2/pay_data/PAYDIFFS_clean.csv` - 330 overrides
  - `.sisyphus/drafts/portpal-app-documentation.md:1539-1540` - Verified rates (Day=$55.95, Night=$70.32, Graveyard=$86.70)

  **Acceptance Criteria**:

  ```
  Scenario: Tractor Trailer + Centennial + Day calculates correctly
    Tool: Vitest
    Steps:
      1. npm test -- src/lib/pay/__tests__/calculate.test.ts --filter="Tractor Trailer"
    Expected Result: 
      - hours: 8.00 (or 9.00 per PAYDIFFS)
      - rate: $55.95 (base $55.30 + CLASS_3 $0.65)
      - OT rate: $83.60 ($82.95 + $0.65)
    Evidence: Test output captured

  Scenario: Labour + Deltaport + Night + 2hr OT
    Tool: Vitest
    Steps:
      1. npm test -- --filter="Labour overtime"
    Expected Result:
      - Regular: 8hrs × $55.30 = $442.40
      - OT: 2hrs × $82.95 = $165.90
      - Total: $608.30
    Evidence: Test output captured

  Scenario: All 330 PAYDIFFS combinations valid
    Tool: Vitest
    Steps:
      1. npm test -- --filter="PAYDIFFS coverage"
    Expected Result: 330 test cases pass
    Evidence: Test summary shows 330 passing

  Scenario: Travel + Meal calculation
    Tool: Vitest
    Steps:
      1. npm test -- --filter="travel and meal"
    Expected Result:
      - Travel: 1hr × $53.17 = $53.17
      - Meal: 0.5hr × $83.60 = $41.80
    Evidence: Test output captured
  ```

  **Commit**: YES
  - Message: `feat(pay): implement pay calculation engine with 100% test coverage`
  - Files: `src/lib/pay/calculate.ts, src/lib/pay/differentials.ts, src/lib/pay/paydiffs.ts, src/lib/pay/__tests__/*.test.ts`
  - Pre-commit: `npm test -- src/lib/pay`

---

- [x] 5. Reverse-Engineer Gamification Formulas

  **What to do**:
  - Analyze `pointsAwarded` column in export CSV (77,275 shifts)
  - Identify patterns:
    - Points per shift type (WORKED, Leave, etc.)
    - Points per earnings amount
    - Points per hours worked
  - If consistent formula found → document and implement
  - If inconsistent → use fallback formulas:
    - XP = 10 per shift logged
    - Points = floor(earnings / 10)
    - Streak = consecutive calendar days with any entry
  - Create gamification module:
    - `calculateXP(shift: Shift): number`
    - `calculatePoints(shift: Shift): number`
    - `updateStreak(userId: string, shiftDate: Date): StreakResult`
    - `getBadgeLevel(totalXP: number): BadgeLevel`
  - Document badge thresholds:
    - Level 1 "New Guy": 0-199 XP
    - Level 2 "Casual": 200-? XP
    - Level 3 "Member": ?-? XP
    - Level 4 "Real Longshore": ? XP

  **Must NOT do**:
  - Do NOT spend more than 2 hours on reverse engineering
  - Do NOT create complex gamification rules
  - Do NOT implement leaderboards or social features

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Data analysis + implementation
  - **Skills**: `[]`
    - Standard data analysis

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Tasks 11, 13
  - **Blocked By**: Task 2

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:456-480` - Gamification system docs
  - `.sisyphus/drafts/portpal-app-documentation.md:440-447` - Badge levels
  - `portpal-2-next/export_All-SHIFTS-modified--_2026-02-01_05-58-52.csv` - Column 24: pointsAwarded
  - `.sisyphus/drafts/portpal-app-documentation.md:284-290` - Dashboard gamification widget

  **Acceptance Criteria**:

  ```
  Scenario: Analyze points patterns in export
    Tool: Bash
    Steps:
      1. Analyze pointsAwarded column distribution
      2. Check correlation with totalpay, hours, entry type
    Expected Result: Pattern documented (consistent or fallback decision made)
    Evidence: Analysis notes in code comments

  Scenario: XP calculation works
    Tool: Vitest
    Steps:
      1. npm test -- src/lib/gamification/__tests__/xp.test.ts
    Expected Result: XP calculated correctly per formula
    Evidence: Test output captured

  Scenario: Streak tracking works
    Tool: Vitest
    Steps:
      1. Create shifts for consecutive days
      2. Verify streak increments
      3. Skip a day, verify streak resets
    Expected Result: Streak logic correct
    Evidence: Test output captured
  ```

  **Commit**: YES
  - Message: `feat(gamification): implement XP, points, streak, badge level calculations`
  - Files: `src/lib/gamification/xp.ts, src/lib/gamification/streak.ts, src/lib/gamification/badges.ts, src/lib/gamification/__tests__/*.test.ts, docs/gamification-analysis.md`

---

- [x] 6. API Routes Foundation

  **What to do**:
  - Create Next.js API routes (App Router route handlers):
    - `POST /api/shifts` - Create shift
    - `GET /api/shifts` - List shifts (with date filters)
    - `GET /api/shifts/[id]` - Get single shift
    - `PUT /api/shifts/[id]` - Update shift
    - `DELETE /api/shifts/[id]` - Delete shift
    - `GET /api/user/profile` - Get user profile
    - `PUT /api/user/profile` - Update profile
    - `GET /api/reference/jobs` - List jobs with subjobs
    - `GET /api/reference/locations` - List locations
    - `GET /api/reference/holidays` - List holidays
    - `GET /api/pay/calculate` - Calculate pay for given params
  - Implement Supabase client for server-side operations
  - Add request validation (Zod schemas)
  - Handle errors consistently (standardized error responses)

  **Must NOT do**:
  - Do NOT implement analytics aggregations yet (Task 13)
  - Do NOT implement goals CRUD yet (Task 14)
  - Do NOT add rate limiting (premature)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple endpoints, needs consistent patterns
  - **Skills**: `[]`
    - Standard API development

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Tasks 7, 8, 9, 10
  - **Blocked By**: Task 1

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:686-732` - CRUD operations list
  - `.sisyphus/drafts/portpal-app-documentation.md:565-604` - Shifts table structure
  - Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

  **Acceptance Criteria**:

  ```
  Scenario: Create shift via API
    Tool: Bash (curl)
    Steps:
      1. curl -X POST http://localhost:3000/api/shifts \
           -H "Authorization: Bearer $TOKEN" \
           -H "Content-Type: application/json" \
           -d '{"entry_type":"worked","date":"2026-02-05","job":"LABOUR","location":"DELTAPORT","shift_type":"day","hours":8,"rate":55.30}'
      2. Assert: HTTP 201
      3. Assert: response has id, created_at
    Expected Result: Shift created, returns shift object
    Evidence: Response captured

  Scenario: List shifts with date filter
    Tool: Bash (curl)
    Steps:
      1. curl "http://localhost:3000/api/shifts?start=2026-02-01&end=2026-02-07" \
           -H "Authorization: Bearer $TOKEN"
      2. Assert: HTTP 200
      3. Assert: Array of shifts in date range
    Expected Result: Filtered shifts returned
    Evidence: Response captured

  Scenario: Calculate pay via API
    Tool: Bash (curl)
    Steps:
      1. curl "http://localhost:3000/api/pay/calculate?job=TRACTOR TRAILER&subjob=RAIL&location=CENTENNIAL&shift_type=day"
      2. Assert: HTTP 200
      3. Assert: response.hours, response.rate, response.overtime_rate present
    Expected Result: Pay calculation returned
    Evidence: Response captured
  ```

  **Commit**: YES
  - Message: `feat(api): implement shift CRUD and reference data endpoints`
  - Files: `app/api/shifts/route.ts, app/api/shifts/[id]/route.ts, app/api/user/profile/route.ts, app/api/reference/*/route.ts, app/api/pay/calculate/route.ts, lib/api/validation.ts`

---

### Wave 3: Entry Types

---

- [x] 7. WORKED Entry Wizard (3 Steps)

  **What to do**:
  - Build 3-step wizard component for WORKED entries:
    - Step 1: "What job did you work?"
      - Job dropdown (43 options)
      - Subjob dropdown (conditional, only for 4 jobs)
    - Step 2: "Where and when?"
      - Date picker with calendar
      - Shift type: 3 BUTTON icons (Day/Night/Graveyard) - NOT dropdown!
      - Location dropdown (24 options)
    - Step 3: "Hours and pay"
      - Regular Hours (auto-calculated from PAYDIFFS)
      - Rate $/hr (auto-calculated)
      - Overtime Hours (default 0)
      - Overtime Rate (auto-calculated)
      - Include Travel toggle → reveals Travel Hours input
      - Include Meal Period toggle
      - Foreman, Vessel, Notes, Attachments
      - Total Pay display (real-time calculation)
  - Integrate with pay calculation engine
  - Submit to API endpoint
  - Navigate to shifts page on success

  **Must NOT do**:
  - Do NOT use dropdown for shift type (must be icon buttons)
  - Do NOT skip steps or combine them
  - Do NOT auto-advance steps (user clicks Next)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex multi-step form with dynamic UI
  - **Skills**: `["frontend-ui-ux"]`
    - Mobile-first wizard UX is critical

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Tasks 10, 11, 12
  - **Blocked By**: Tasks 4, 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:67-98` - WORKED entry fields
  - `.sisyphus/drafts/portpal-app-documentation.md:1215-1261` - Complete wizard documentation
  - `.sisyphus/drafts/portpal-app-documentation.md:1263-1275` - Shift type as buttons
  - `.sisyphus/drafts/screenshots/12-worked-step1-with-subjob.png` - Step 1 visual
  - `.sisyphus/drafts/screenshots/13-worked-step2.png` - Step 2 visual
  - `.sisyphus/drafts/screenshots/14-worked-step3-pay.png` - Step 3 visual
  - `.sisyphus/drafts/screenshots/22-travel-meal-fields.png` - Travel/Meal expanded

  **Acceptance Criteria**:

  ```
  Scenario: Complete WORKED entry wizard
    Tool: Playwright
    Steps:
      1. Navigate to app, click "ADD SHIFT" in bottom nav
      2. Click "WORKED" entry type
      3. Step 1: Select Job "TRACTOR TRAILER" → Subjob dropdown appears
      4. Select Subjob "RAIL" → Click "Next"
      5. Step 2: Select date via calendar
      6. Click Day button (icon button, not dropdown)
      7. Select Location "CENTENNIAL" → Click "Next"
      8. Step 3: Verify hours auto-filled (should be 8.00 or 9.00 per PAYDIFFS)
      9. Verify rate shows $55.95
      10. Toggle "Include Meal Period" ON
      11. Verify Total Pay updates in real-time
      12. Click "Add Shift"
      13. Wait for: redirect to shifts page
      14. Verify: new shift appears in calendar
    Expected Result: Shift created with correct pay calculation
    Evidence: .sisyphus/evidence/task-7-worked-complete.png

  Scenario: Subjob dropdown only shows for specific jobs
    Tool: Playwright
    Steps:
      1. Open WORKED wizard
      2. Select Job "LABOUR" → Verify Subjob dropdown appears (9 options)
      3. Select Job "DOCK CHECKER" → Verify NO Subjob dropdown
      4. Select Job "HEAD CHECKER" → Verify Subjob dropdown appears (13 options)
    Expected Result: Subjob conditional visibility correct
    Evidence: Screenshots of each state

  Scenario: Shift type buttons not dropdown
    Tool: Playwright
    Steps:
      1. Navigate to Step 2
      2. Assert: NO select/dropdown element for shift type
      3. Assert: 3 clickable buttons with icons for Day/Night/Graveyard
    Expected Result: Icon buttons present, no dropdown
    Evidence: .sisyphus/evidence/task-7-shift-buttons.png
  ```

  **Commit**: YES
  - Message: `feat(entry): implement WORKED 3-step wizard with pay calculation`
  - Files: `components/entry/WorkedWizard.tsx, components/entry/steps/*.tsx, components/ui/ShiftTypeButtons.tsx`
  - Pre-commit: `npm test && npx playwright test e2e/worked-entry.spec.ts`

---

- [ ] 8. Leave Entry Form

  **What to do**:
  - Build Leave entry form (single page, not wizard):
    - Leave Type dropdown: Sick Leave, Personal Leave, Parental Leave
    - Date picker
    - Hours input
    - Rate $/hr input
    - "Will receive paystub later" toggle
  - Button text: "Add Log" (NOT "Add Shift")
  - Submit to API
  - Update user's leave balance (sick_days_used or personal_leave_used)

  **Must NOT do**:
  - Do NOT use wizard steps (single form)
  - Do NOT auto-calculate hours/rate (user enters manually)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple single form
  - **Skills**: `["frontend-ui-ux"]`
    - Mobile form UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Tasks 4, 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:100-109` - Leave entry fields
  - `.sisyphus/drafts/screenshots/15-leave-entry.png` - Visual reference

  **Acceptance Criteria**:

  ```
  Scenario: Submit Leave entry
    Tool: Playwright
    Steps:
      1. Open ADD SHIFT modal
      2. Click "LEAVE" entry type
      3. Select Leave Type "Sick Leave"
      4. Select Date
      5. Enter Hours: 8
      6. Enter Rate: 55.30
      7. Click "Add Log" (verify button text is "Add Log" not "Add Shift")
      8. Wait for: success, modal closes
    Expected Result: Leave entry created, sick_days_used incremented
    Evidence: .sisyphus/evidence/task-8-leave.png

  Scenario: Leave type uses full names
    Tool: Playwright
    Steps:
      1. Open Leave form
      2. Click Leave Type dropdown
      3. Assert: Options are "Sick Leave", "Personal Leave", "Parental Leave"
    Expected Result: Full names, not abbreviations
    Evidence: Screenshot of dropdown
  ```

  **Commit**: YES
  - Message: `feat(entry): implement Leave entry form with balance tracking`
  - Files: `components/entry/LeaveForm.tsx`

---

- [ ] 9. Simple Entry Forms (Vacation, Standby, Day Off, Stat Holiday)

  **What to do**:
  - Build 4 simple entry forms:
    - **Vacation**: Date + Notes only
    - **Standby**: Date + Notes only
    - **Day Off**: Date + Notes only
    - **Stat Holiday**: Holiday dropdown (26 options) + Qualifying Days dropdown (1-14, 15+) + Date + Notes
  - All use "Add Log" button text
  - Single-page forms (no wizard)

  **Must NOT do**:
  - Do NOT add fields not in documentation
  - Do NOT use wizard pattern for these

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Very simple forms
  - **Skills**: `["frontend-ui-ux"]`
    - Mobile form UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Tasks 10, 12
  - **Blocked By**: Task 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:111-143` - All simple entry forms
  - `.sisyphus/drafts/screenshots/20-vacation-entry.png` - Vacation form
  - `.sisyphus/drafts/screenshots/21-standby-entry.png` - Standby form
  - `.sisyphus/drafts/screenshots/16-stat-holiday-entry.png` - Stat Holiday form

  **Acceptance Criteria**:

  ```
  Scenario: Submit Vacation entry
    Tool: Playwright
    Steps:
      1. Open ADD SHIFT → Click "VACATION"
      2. Select Date
      3. Enter Notes: "Family trip"
      4. Click "Add Log"
    Expected Result: Vacation entry created
    Evidence: .sisyphus/evidence/task-9-vacation.png

  Scenario: Submit Stat Holiday entry
    Tool: Playwright
    Steps:
      1. Open ADD SHIFT → Click "STAT HOLIDAY"
      2. Select Holiday "Family Day (Feb 17)" from dropdown
      3. Select Qualifying Days "10" from dropdown
      4. Select Date
      5. Click "Add Log"
    Expected Result: Stat holiday entry created
    Evidence: .sisyphus/evidence/task-9-stat-holiday.png

  Scenario: Qualifying days dropdown has correct options
    Tool: Playwright
    Steps:
      1. Open Stat Holiday form
      2. Click Qualifying Days dropdown
      3. Assert: Options 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15+
    Expected Result: 15 options present
    Evidence: Screenshot of dropdown
  ```

  **Commit**: YES
  - Message: `feat(entry): implement Vacation, Standby, Day Off, Stat Holiday forms`
  - Files: `components/entry/VacationForm.tsx, components/entry/StandbyForm.tsx, components/entry/DayOffForm.tsx, components/entry/StatHolidayForm.tsx`

---

- [ ] 10. Shift CRUD (View, Edit, Delete)

  **What to do**:
  - Build Shift Details panel (slides in from right):
    - Shows: Date, Entry type, Location (if WORKED), Notes
    - "Edit Shift" button
    - "Delete" button
  - Build Edit flow:
    - Re-use entry forms in edit mode
    - Pre-populate fields with existing values
    - "Save Shift" button (not "Add Shift")
  - Build Delete confirmation dialog:
    - Title: "Delete log permanently?"
    - Warning: "This may affect your streak and points"
    - Buttons: "Keep Log" (cancel), "Delete" (confirm)
  - After delete: Update streak/points, close panel, refresh calendar

  **Must NOT do**:
  - Do NOT allow bulk delete
  - Do NOT add undo functionality

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple UI states, edit flows
  - **Skills**: `["frontend-ui-ux"]`
    - Slide panel, confirmation dialog UX

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential after Wave 3 entries
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 7, 8, 9

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:1385-1477` - Complete shift CRUD documentation
  - `.sisyphus/drafts/portpal-app-documentation.md:1459-1477` - Delete confirmation dialog

  **Acceptance Criteria**:

  ```
  Scenario: View shift details
    Tool: Playwright
    Steps:
      1. Navigate to Shifts weekly view
      2. Click on a day with a shift
      3. Wait for: panel slides in from right
      4. Assert: Date displayed correctly
      5. Assert: Entry type shown (e.g., "Day Off", "Worked")
      6. Assert: "Edit Shift" and "Delete" buttons visible
    Expected Result: Shift details panel displays
    Evidence: .sisyphus/evidence/task-10-view.png

  Scenario: Edit shift
    Tool: Playwright
    Steps:
      1. Open shift details panel
      2. Click "Edit Shift"
      3. Modify Notes field
      4. Click "Save Shift"
      5. Wait for: panel closes, calendar updates
    Expected Result: Shift updated
    Evidence: .sisyphus/evidence/task-10-edit.png

  Scenario: Delete shift with confirmation
    Tool: Playwright
    Steps:
      1. Open shift details panel
      2. Click "Delete"
      3. Wait for: confirmation dialog appears
      4. Assert: Title "Delete log permanently?"
      5. Assert: Warning about streak/points
      6. Click "Delete" (confirm)
      7. Wait for: dialog closes, panel closes
      8. Assert: Shift removed from calendar
    Expected Result: Shift deleted
    Evidence: .sisyphus/evidence/task-10-delete.png
  ```

  **Commit**: YES
  - Message: `feat(shifts): implement view, edit, delete with confirmation dialog`
  - Files: `components/shifts/ShiftDetailsPanel.tsx, components/shifts/DeleteConfirmDialog.tsx, components/entry/EditWrapper.tsx`

---

### Wave 4: Views & Features

---

- [ ] 11. Dashboard Page

  **What to do**:
  - Build dashboard at `/index/home/dashboard`:
    - Gamification widget (top): Streak, Points, XP - clickable → Journey page
    - Yearly Goal widget: Editable goal, progress bar
    - Earnings at a Glance:
      - This Week card (date range, earnings, shifts X/7, hours)
      - Last Week card (same structure)
      - This Year card (fiscal year Jan 4 - Jan 3, earnings, shifts, hours, pension)
    - Upcoming Holidays section:
      - Next 3 holidays with qualifying period and days worked tracker
      - "See all" button expands to show all + past holidays
    - Benefits section:
      - Sick Days: Available | Used | Remaining + progress bar + Update button
      - Personal Leave: same structure
  - Build Benefits Update modals (Sick Leave, Personal Leave):
    - Validity date range picker
    - Total available input
    - Save/Cancel buttons

  **Must NOT do**:
  - Do NOT implement pension tracker in detail (just display)
  - Do NOT add edit for This Week/Last Week (read-only aggregations)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex dashboard layout, multiple widgets
  - **Skills**: `["frontend-ui-ux"]`
    - Dashboard card design, mobile layout

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 12-16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 4, 5, 7

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:279-332` - Dashboard features
  - `.sisyphus/drafts/portpal-app-documentation.md:996-1018` - Benefits update modals
  - `.sisyphus/drafts/screenshots/01-dashboard-main.png` - Main dashboard
  - `.sisyphus/drafts/screenshots/05-dashboard-holidays-expanded.png` - Holidays expanded

  **Acceptance Criteria**:

  ```
  Scenario: Dashboard loads with all widgets
    Tool: Playwright
    Steps:
      1. Navigate to /index/home/dashboard
      2. Assert: Gamification widget visible (Streak, Points, XP)
      3. Assert: Yearly Goal widget visible
      4. Assert: This Week card visible
      5. Assert: Last Week card visible
      6. Assert: This Year card visible
      7. Assert: Upcoming Holidays section visible
      8. Assert: Benefits section visible (Sick Days, Personal Leave)
    Expected Result: All widgets render
    Evidence: .sisyphus/evidence/task-11-dashboard.png

  Scenario: Update sick days
    Tool: Playwright
    Steps:
      1. Click "Update" on Sick Days section
      2. Wait for: modal appears
      3. Change "Total Sick Leaves Available" to 15
      4. Click "Save"
      5. Wait for: modal closes
      6. Assert: Sick Days Available shows 15
    Expected Result: Sick days updated
    Evidence: .sisyphus/evidence/task-11-sick-update.png

  Scenario: Gamification widget navigates to Journey
    Tool: Playwright
    Steps:
      1. Click on Streak/Points/XP widget
      2. Wait for: navigation to /index/analytics/journey
    Expected Result: Journey page loads
    Evidence: URL check
  ```

  **Commit**: YES
  - Message: `feat(dashboard): implement full dashboard with earnings, holidays, benefits widgets`
  - Files: `app/index/home/dashboard/page.tsx, components/dashboard/*.tsx, components/modals/BenefitsUpdateModal.tsx`

---

- [ ] 12. Shifts Views (Weekly, Monthly, Yearly)

  **What to do**:
  - Build Shifts page with 3 views:
    - **Weekly** (`/index/shifts/weekly`):
      - Header stats: Total Shifts, Total Hours, Total Earned
      - "Add Shift" button at top
      - Week navigation (left/right arrows, date range display)
      - 7-day calendar grid (Sun-Sat)
      - Each day shows: day name, date, shift status or "No Shift", "TODAY" badge
    - **Monthly** (`/index/shifts/monthly`):
      - Month navigation (arrows, month name)
      - Standard calendar grid
      - Days with shifts show icons
      - Clickable days open shift details
    - **Yearly** (`/index/shifts/yearly`):
      - Header stats: Total Shifts, Total Hours, Avg/Shift
      - Year navigation (arrows, year display)
      - Note: Left arrow disabled for 2025 (can't go before 2025)
      - 12 month cards showing month name + shift count
      - Clickable to drill down
  - Tab navigation: WEEKLY | MONTHLY | YEARLY

  **Must NOT do**:
  - Do NOT allow navigation before 2025 in yearly view
  - Do NOT add drag-drop shift moving

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex calendar UI, multiple views
  - **Skills**: `["frontend-ui-ux"]`
    - Calendar design, navigation UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11, 13-16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 7, 10

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:335-386` - All shift views
  - `.sisyphus/drafts/screenshots/08-shifts-weekly.png` - Weekly view
  - `.sisyphus/drafts/screenshots/09-shifts-monthly.png` - Monthly view
  - `.sisyphus/drafts/screenshots/10-shifts-yearly.png` - Yearly view

  **Acceptance Criteria**:

  ```
  Scenario: Weekly view displays correctly
    Tool: Playwright
    Steps:
      1. Navigate to /index/shifts/weekly
      2. Assert: Header shows Total Shifts, Total Hours, Total Earned
      3. Assert: 7 day grid visible (Sunday to Saturday)
      4. Assert: Current day has "TODAY" badge
      5. Assert: Week navigation arrows work
    Expected Result: Weekly view renders correctly
    Evidence: .sisyphus/evidence/task-12-weekly.png

  Scenario: Monthly view calendar
    Tool: Playwright
    Steps:
      1. Click "MONTHLY" tab
      2. Wait for: /index/shifts/monthly
      3. Assert: Full month calendar grid visible
      4. Click on a day with a shift
      5. Wait for: Shift details panel opens
    Expected Result: Monthly calendar interactive
    Evidence: .sisyphus/evidence/task-12-monthly.png

  Scenario: Yearly view blocks before 2025
    Tool: Playwright
    Steps:
      1. Click "YEARLY" tab
      2. Navigate to 2025
      3. Assert: Left arrow is disabled
      4. Assert: Cannot navigate before 2025
    Expected Result: Navigation constrained
    Evidence: .sisyphus/evidence/task-12-yearly-limit.png
  ```

  **Commit**: YES
  - Message: `feat(shifts): implement weekly, monthly, yearly calendar views`
  - Files: `app/index/shifts/weekly/page.tsx, app/index/shifts/monthly/page.tsx, app/index/shifts/yearly/page.tsx, components/shifts/WeeklyCalendar.tsx, components/shifts/MonthlyCalendar.tsx, components/shifts/YearlyGrid.tsx`

---

- [ ] 13. Analytics Pages (Insights + Journey)

  **What to do**:
  - Build Work Insights page (`/index/analytics/insights`):
    - Time period selector: This Week, This Month, This Year, Last Week, Last Month, Last Year, Custom Range
    - Date range pickers (always visible)
    - 6 summary stat cards:
      1. Total Earnings
      2. Earnings Split ("$X + $Y" and "X worked + Y leave")
      3. Total Shifts
      4. Total Worked Hours
      5. Locations (unique count)
      6. Most Frequent (location)
    - Charts (use **Recharts v3** via shadcn/ui):
      - Earnings by Location (horizontal BarChart)
      - Shifts by Type (PieChart/DonutChart)
      - Import from `recharts`: `BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer`
  - Build Journey page (`/index/analytics/journey`):
    - Current Level display (badge, name, level number)
    - XP progress bar with "XP to earn" label
    - This Week's Progress (shifts logged, earned)
    - My Badges section (X/4 count)
    - Note: Fix typo "Badged Unlocked" → "Badges Unlocked"
    - Badge display (4 levels: New Guy, Casual, Member, Real Longshore)
    - All Time Stats: Total XP, Badges Unlocked, Longest Streak, Total Shifts
  - Tab navigation: INSIGHTS | JOURNEY

  **Must NOT do**:
  - Do NOT implement complex chart interactions
  - Do NOT add export functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Charts, complex data visualization
  - **Skills**: `["frontend-ui-ux"]`
    - Data visualization, mobile charts

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11, 12, 14-16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 5, 7

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:388-453` - Analytics pages
  - `.sisyphus/drafts/screenshots/06-analytics-insights.png` - Insights view
  - `.sisyphus/drafts/screenshots/07-analytics-journey.png` - Journey view

  **Acceptance Criteria**:

  ```
  Scenario: Insights page with time filters
    Tool: Playwright
    Steps:
      1. Navigate to /index/analytics/insights
      2. Assert: Time period selector visible
      3. Select "This Month"
      4. Assert: 6 stat cards update with data
      5. Assert: Charts visible
    Expected Result: Insights render with data
    Evidence: .sisyphus/evidence/task-13-insights.png

  Scenario: Journey page gamification
    Tool: Playwright
    Steps:
      1. Navigate to /index/analytics/journey
      2. Assert: Current level badge visible
      3. Assert: XP progress bar visible
      4. Assert: Badge section shows "X/4" count
      5. Assert: All Time Stats section visible
    Expected Result: Journey page renders
    Evidence: .sisyphus/evidence/task-13-journey.png
  ```

  **Commit**: YES
  - Message: `feat(analytics): implement Work Insights and Journey/Gamification pages`
  - Files: `app/index/analytics/insights/page.tsx, app/index/analytics/journey/page.tsx, components/analytics/*.tsx, components/charts/*.tsx`

---

- [ ] 14. Goals System (Full CRUD)

  **What to do**:
  - Build Goals system with full 12 combinations:
    - Goal Types: Weekly, Monthly, Yearly
    - Goal Kinds: Earnings, Hours, Shifts, Pension
  - Build Goals page (accessible from dashboard):
    - List of user's goals
    - "Create" button
  - Build Create Goal form:
    - Name input (placeholder: "e.g Level-Up Year")
    - Goal type dropdown: Weekly, Monthly, Yearly
    - Date range pickers: Start date, End date
    - Kind dropdown: Earnings, Hours, Shifts, Pension
    - Target value input (based on kind - dollars, hours, count)
  - Build Goal detail view:
    - Progress tracking
    - Edit and Delete options
  - API endpoints:
    - `POST /api/goals` - Create goal
    - `GET /api/goals` - List user's goals
    - `PUT /api/goals/[id]` - Update goal
    - `DELETE /api/goals/[id]` - Delete goal

  **Must NOT do**:
  - Do NOT implement goal sharing/social features
  - Do NOT add goal templates

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Full CRUD with multiple types
  - **Skills**: `["frontend-ui-ux"]`
    - Form design, progress visualization

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11-13, 15-16)
  - **Blocks**: Task 17
  - **Blocked By**: Task 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:1020-1046` - Goals system
  - `.sisyphus/drafts/portpal-app-documentation.md:1125-1136` - Goals table schema

  **Acceptance Criteria**:

  ```
  Scenario: Create yearly earnings goal
    Tool: Playwright
    Steps:
      1. Navigate to Goals page
      2. Click "Create" button
      3. Enter Name: "2026 Target"
      4. Select Goal Type: Yearly
      5. Select Kind: Earnings
      6. Enter Target: 150000
      7. Select date range
      8. Click "Create Goal"
      9. Wait for: redirect to goals list
      10. Assert: New goal appears in list
    Expected Result: Goal created
    Evidence: .sisyphus/evidence/task-14-create-goal.png

  Scenario: All goal combinations available
    Tool: Playwright
    Steps:
      1. Open Create Goal form
      2. Assert: Goal Type has 3 options (Weekly, Monthly, Yearly)
      3. Assert: Kind has 4 options (Earnings, Hours, Shifts, Pension)
    Expected Result: All 12 combinations possible
    Evidence: Screenshot of dropdowns
  ```

  **Commit**: YES
  - Message: `feat(goals): implement full goals system with 12 type/kind combinations`
  - Files: `app/goals/page.tsx, app/goals/create/page.tsx, app/goals/[id]/page.tsx, app/api/goals/*.ts, components/goals/*.tsx`

---

- [ ] 15. Posts Archive + Feedback Form

  **What to do**:
  - Build Posts Archive page (`/index/home/posts`):
    - Page title: "Posts Archive"
    - List of posts with:
      - Title (emoji support)
      - Date
      - Preview text (truncated)
      - "Read more" button → expands to full content, button changes to "Read less"
  - Seed initial posts (from current app):
    - "PortPal Beta is LIVE!"
    - "🔍 Better Selection Features Are Here!"
    - "🎉 The New PortPal is Live!"
    - etc.
  - Build Feedback page (`/index/home/feedback`):
    - Page title: "Share Your Feedback"
    - Form fields:
      - ILWU Local text input (placeholder: "e.g 500, 502, etc...")
      - Comments/Feedback textarea (required)
      - Upload Images (optional file upload)
      - Share anonymously toggle
    - "Submit Feedback" button
  - API: `POST /api/feedback`

  **Must NOT do**:
  - Do NOT build admin CRUD for posts (read-only for users)
  - Do NOT implement file upload to our storage (external service or defer)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple read-only list + form
  - **Skills**: `["frontend-ui-ux"]`
    - Clean content display

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11-14, 16)
  - **Blocks**: Task 17
  - **Blocked By**: Task 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:483-521` - Posts & Feedback
  - `.sisyphus/drafts/screenshots/17-posts-page.png` - Posts Archive
  - `.sisyphus/drafts/screenshots/18-feedback-page.png` - Feedback form

  **Acceptance Criteria**:

  ```
  Scenario: Posts archive with expand/collapse
    Tool: Playwright
    Steps:
      1. Navigate to /index/home/posts
      2. Assert: Page title "Posts Archive"
      3. Assert: Multiple posts visible with titles and dates
      4. Click "Read more" on first post
      5. Assert: Full content expands, button changes to "Read less"
      6. Click "Read less"
      7. Assert: Content collapses
    Expected Result: Posts expand/collapse correctly
    Evidence: .sisyphus/evidence/task-15-posts.png

  Scenario: Submit feedback
    Tool: Playwright
    Steps:
      1. Navigate to /index/home/feedback
      2. Assert: Page title "Share Your Feedback"
      3. Fill ILWU Local: "500"
      4. Fill Comments: "Great app!"
      5. Toggle "Share anonymously" ON
      6. Click "Submit Feedback"
      7. Wait for: success indication
    Expected Result: Feedback submitted
    Evidence: .sisyphus/evidence/task-15-feedback.png
  ```

  **Commit**: YES
  - Message: `feat(content): implement Posts Archive and Feedback form`
  - Files: `app/index/home/posts/page.tsx, app/index/home/feedback/page.tsx, app/api/feedback/route.ts, components/posts/*.tsx`

---

- [ ] 16. Account Settings

  **What to do**:
  - Build Account page (`/index/home/account`):
    - Form fields:
      - First name (text input)
      - Last name (text input)
      - Email (text input)
      - Local dropdown: 500, 502, Other
      - Board dropdown: A BOARD, B BOARD, C BOARD, T BOARD, 00 BOARD, R BOARD, UNION
      - Subscription button: "Manage" → opens membership info (no Stripe yet)
      - Theme preference dropdown: (blank), Dark, Light
    - Action buttons: "Discard changes", "Save Changes"
  - Build user menu (avatar dropdown):
    - Account → `/index/home/account`
    - Contact → `/index/home/feedback`
    - About Us → static text
    - Log out → sign out and redirect to `/signin`
  - Implement theme switching (dark/light mode)
  - Note: "Other" option for Local is only in Account, not in onboarding

  **Must NOT do**:
  - Do NOT implement Stripe subscription management
  - Do NOT add password change (use Supabase's reset flow)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard settings form
  - **Skills**: `["frontend-ui-ux"]`
    - Settings UI, theme switching

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11-15)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 3, 6

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:924-945` - Account page fields
  - `.sisyphus/drafts/portpal-app-documentation.md:911-922` - User menu items
  - `.sisyphus/drafts/screenshots/19-account-page.png` - Account page
  - `.sisyphus/drafts/screenshots/02-user-menu-dropdown.png` - User menu

  **Acceptance Criteria**:

  ```
  Scenario: Update account settings
    Tool: Playwright
    Steps:
      1. Navigate to /index/home/account
      2. Change First name
      3. Select Theme: Dark
      4. Click "Save Changes"
      5. Wait for: success indication
      6. Assert: Theme changes to dark mode
    Expected Result: Settings saved, theme applied
    Evidence: .sisyphus/evidence/task-16-account.png

  Scenario: User menu navigation
    Tool: Playwright
    Steps:
      1. Click user avatar in header
      2. Assert: Dropdown shows Account, Contact, About Us, Log out
      3. Click "Account"
      4. Wait for: /index/home/account
      5. Navigate back
      6. Click avatar → Click "Contact"
      7. Wait for: /index/home/feedback
    Expected Result: Menu navigates correctly
    Evidence: .sisyphus/evidence/task-16-menu.png

  Scenario: Local dropdown has "Other" option
    Tool: Playwright
    Steps:
      1. Navigate to /index/home/account
      2. Click Local dropdown
      3. Assert: Options are 500, 502, Other
    Expected Result: "Other" option present (unlike onboarding)
    Evidence: Screenshot of dropdown
  ```

  **Commit**: YES
  - Message: `feat(account): implement settings page with theme switching and user menu`
  - Files: `app/index/home/account/page.tsx, components/layout/UserMenu.tsx, lib/theme.ts`

---

### Wave 5: Migration & Polish

---

- [ ] 17. Data Migration Scripts

  **What to do**:
  - Create migration scripts to import from Bubble export:
    - Step 1: Parse CSV file (handle alignment issues, quoted fields)
    - Step 2: Extract unique users from `relUser` column
    - Step 3: Create user records (email-based, password reset required on first login)
    - Step 4: Determine entry type for each shift (using flag columns logic)
    - Step 5: Map columns to Supabase schema
    - Step 6: Import shifts linked to users
    - Step 7: Calculate and store gamification data (XP, points per shift)
  - Create validation queries:
    - Total shift count: 77,275
    - Unique users: 3,068
    - Total earnings sum matches export
  - Handle edge cases:
    - Duplicate entries (dedupe by unique_id)
    - Invalid data (negative hours, missing required fields)
    - Character encoding (UTF-8)
  - **CRITICAL: Use pagination for all Supabase operations** (per AGENTS.md):
    - 77,275 shifts >> 1000 row limit
    - Use `src/lib/supabase/pagination.ts` helper
    - Batch inserts in chunks of 500-1000 rows
    - Verify counts after each batch

  **Must NOT do**:
  - Do NOT run migration automatically (manual trigger only)
  - Do NOT delete source data after migration
  - Do NOT query all shifts without pagination (will truncate at 1000)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Complex data transformation, must be 100% accurate
  - **Skills**: `[]`
    - Data engineering

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after all features)
  - **Blocks**: Tasks 18, 19
  - **Blocked By**: Tasks 11, 12, 13, 14, 15, 16

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:870-970` - Data Migration section (column mappings, entry type logic)
  - `portpal-2-next/export_All-SHIFTS-modified--_2026-02-01_05-58-52.csv` - Source data

  **Acceptance Criteria**:

  ```
  Scenario: Migration script runs successfully
    Tool: Bash
    Steps:
      1. npx tsx scripts/migrate.ts --dry-run
      2. Assert: No errors, shows expected counts
      3. npx tsx scripts/migrate.ts --execute
      4. Wait for: completion
    Expected Result: Migration completes without errors
    Evidence: Migration log captured

  Scenario: Validate shift count
    Tool: Bash (psql)
    Steps:
      1. SELECT COUNT(*) FROM shifts;
    Expected Result: 77275
    Evidence: Query result

  Scenario: Validate user count
    Tool: Bash (psql)
    Steps:
      1. SELECT COUNT(*) FROM users;
    Expected Result: 3068
    Evidence: Query result

  Scenario: Validate earnings total
    Tool: Bash (psql)
    Steps:
      1. SELECT SUM(total_pay) FROM shifts;
      2. Compare with: sum of totalpay column in CSV
    Expected Result: Totals match (within rounding tolerance)
    Evidence: Comparison documented

  Scenario: Migrated user can log in with password reset
    Tool: Playwright
    Steps:
      1. Navigate to /signin
      2. Enter email from export (e.g., tonyguzzo70@gmail.com)
      3. Assert: Prompted to reset password (not regular login)
    Expected Result: Password reset flow triggered for migrated users
    Evidence: .sisyphus/evidence/task-17-password-reset.png
  ```

  **Commit**: YES
  - Message: `feat(migration): implement data migration from Bubble export (77,275 shifts)`
  - Files: `scripts/migrate.ts, scripts/validate-migration.ts, docs/migration-report.md`

---

- [ ] 18. PWA Setup (Native - No Library)

  **What to do**:
  - Configure Progressive Web App using **native Next.js 16 PWA support** (NO Serwist needed):
    - Create `app/manifest.ts` (native Next.js 16 typed manifest):
      ```typescript
      import type { MetadataRoute } from 'next'
      export default function manifest(): MetadataRoute.Manifest {
        return {
          name: 'PortPal',
          short_name: 'PortPal',
          description: 'Shift tracking for ILWU longshoremen',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#000000',
          icons: [
            { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        }
      }
      ```
    - Create `public/sw.js` (~40 LOC custom service worker):
      - Cache static assets on install
      - Serve offline fallback page when network fails
      - Use cache-first strategy for reference data
    - Create `components/SWRegistration.tsx` (client component to register SW)
    - Create `public/offline.html` fallback page
    - Add PWA icons to `public/` directory
  - Test with Lighthouse PWA audit

  **Must NOT do**:
  - Do NOT use Serwist/@serwist/next (overkill for basic PWA)
  - Do NOT use deprecated next-pwa
  - Do NOT implement offline shift creation (view-only offline)
  - Do NOT add push notifications
  - Do NOT implement background sync (future feature if needed)

  **Why native instead of Serwist**:
  - Next.js 16 has built-in `app/manifest.ts` support
  - Basic PWA (installable + offline fallback) needs only ~105 LOC
  - Zero additional dependencies
  - Serwist adds value for advanced caching/background sync, not needed for MVP

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple native PWA setup
  - **Skills**: `[]`
    - Basic PWA configuration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Task 19)
  - **Blocks**: Task 20
  - **Blocked By**: Task 17

  **References**:
  - `.sisyphus/drafts/portpal-app-documentation.md:797-800` - Mobile-first, PWA requirements
  - Next.js PWA docs: https://nextjs.org/docs/app/guides/progressive-web-apps
  - MDN Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

  **Acceptance Criteria**:

  ```
  Scenario: Lighthouse PWA score
    Tool: Bash
    Steps:
      1. npx lighthouse http://localhost:3000 --only-categories=pwa --output=json
      2. Parse score from output
    Expected Result: PWA score >= 90
    Evidence: Lighthouse report

  Scenario: App installable
    Tool: Playwright (Chromium)
    Steps:
      1. Navigate to app
      2. Assert: Install prompt available (or beforeinstallprompt event fires)
    Expected Result: App is installable
    Evidence: Install prompt screenshot

  Scenario: Offline fallback
    Tool: Playwright
    Steps:
      1. Load app online
      2. Go offline (network.offline)
      3. Refresh page
      4. Assert: Offline fallback page or cached content displays
    Expected Result: Graceful offline experience
    Evidence: .sisyphus/evidence/task-18-offline.png
  ```

  **Commit**: YES
  - Message: `feat(pwa): configure PWA with manifest, service worker, offline support`
  - Files: `public/manifest.json, public/sw.js, next.config.js (pwa config)`

---

- [ ] 19. E2E Test Suite

  **What to do**:
  - Create comprehensive Playwright E2E test suite:
    - Auth flows: sign up, sign in, sign out, password reset
    - All 6 entry types: create, view, edit, delete
    - Dashboard: all widgets load, benefits update
    - Shifts views: weekly, monthly, yearly navigation
    - Analytics: insights filtering, journey display
    - Goals: CRUD operations
    - Posts: expand/collapse
    - Feedback: form submission
    - Account: settings update, theme switch
  - Set up test fixtures and helpers
  - Configure for CI (headless mode)
  - Generate test coverage report

  **Must NOT do**:
  - Do NOT test implementation details (test user flows)
  - Do NOT mock Supabase (use test database)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive test coverage
  - **Skills**: `["playwright"]`
    - E2E testing expertise

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Task 18)
  - **Blocks**: Task 20
  - **Blocked By**: Task 17

  **References**:
  - All acceptance criteria from Tasks 3-16 define test cases
  - Playwright docs: https://playwright.dev/docs/intro

  **Acceptance Criteria**:

  ```
  Scenario: Full E2E suite passes
    Tool: Bash
    Steps:
      1. npx playwright test
    Expected Result: All tests pass
    Evidence: Playwright report

  Scenario: Coverage includes all entry types
    Tool: Bash
    Steps:
      1. npx playwright test --grep="entry"
    Expected Result: 6 entry type tests pass (WORKED, Leave, Vacation, Standby, Day Off, Stat Holiday)
    Evidence: Test output

  Scenario: CI-ready configuration
    Tool: Bash
    Steps:
      1. CI=true npx playwright test --reporter=github
    Expected Result: Runs in headless mode, outputs CI-friendly format
    Evidence: CI output format
  ```

  **Commit**: YES
  - Message: `test(e2e): comprehensive Playwright test suite for all features`
  - Files: `e2e/*.spec.ts, e2e/fixtures/*.ts, playwright.config.ts`

---

- [ ] 20. Final Validation & Cleanup

  **What to do**:
  - Run full validation checklist:
    - All unit tests pass
    - All E2E tests pass
    - Lighthouse scores: Performance ≥ 80, PWA ≥ 90, Accessibility ≥ 90
    - Migration data validated
    - All URLs match existing app patterns
  - Clean up:
    - Remove any console.logs
    - Remove unused dependencies
    - Update README with setup instructions
    - Document environment variables
  - Final manual smoke test:
    - Complete user journey (sign up → create shifts → view dashboard → analytics)

  **Must NOT do**:
  - Do NOT add new features
  - Do NOT refactor working code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Validation and cleanup
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final (after all)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 18, 19

  **References**:
  - All previous task acceptance criteria
  - `.sisyphus/drafts/portpal-app-documentation.md` - URL patterns, feature specs

  **Acceptance Criteria**:

  ```
  Scenario: All tests pass
    Tool: Bash
    Steps:
      1. npm test
      2. npx playwright test
    Expected Result: All tests green
    Evidence: Test summary

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. npm run build
    Expected Result: No errors, production build created
    Evidence: Build output

  Scenario: Lighthouse audit
    Tool: Bash
    Steps:
      1. npx lighthouse http://localhost:3000 --output=json
    Expected Result: Performance ≥ 80, PWA ≥ 90, Accessibility ≥ 90
    Evidence: Lighthouse scores

  Scenario: Complete user journey
    Tool: Playwright
    Steps:
      1. Sign up new user
      2. Complete onboarding
      3. Create WORKED shift
      4. View dashboard (verify shift reflected in earnings)
      5. View shifts weekly (verify shift in calendar)
      6. View analytics insights
      7. Create goal
      8. Update account settings
      9. Sign out
      10. Sign in again
    Expected Result: Full journey completes without errors
    Evidence: Journey screenshots
  ```

  **Commit**: YES
  - Message: `chore: final validation, cleanup, and documentation`
  - Files: `README.md, .env.example, package.json (remove unused deps)`

---

## Commit Strategy

| After Task | Message | Key Files |
|------------|---------|-----------|
| 1 | `chore: initialize Next.js 16 project` | package.json, configs |
| 2 | `feat(db): create schema and seed reference data` | supabase/migrations |
| 3 | `feat(auth): implement Supabase Auth` | lib/supabase/auth.ts, signin page |
| 4 | `feat(pay): implement pay calculation engine` | src/lib/pay |
| 5 | `feat(gamification): implement XP, points, streak` | src/lib/gamification |
| 6 | `feat(api): implement shift CRUD endpoints` | app/api |
| 7 | `feat(entry): implement WORKED wizard` | components/entry |
| 8 | `feat(entry): implement Leave form` | components/entry |
| 9 | `feat(entry): implement simple entry forms` | components/entry |
| 10 | `feat(shifts): implement view, edit, delete` | components/shifts |
| 11 | `feat(dashboard): implement full dashboard` | app/index/home/dashboard |
| 12 | `feat(shifts): implement calendar views` | app/index/shifts |
| 13 | `feat(analytics): implement Insights and Journey` | app/index/analytics |
| 14 | `feat(goals): implement full goals system` | app/goals |
| 15 | `feat(content): implement Posts and Feedback` | app/index/home |
| 16 | `feat(account): implement settings and user menu` | app/index/home/account |
| 17 | `feat(migration): implement data migration` | scripts/migrate.ts |
| 18 | `feat(pwa): configure PWA` | manifest.json, sw.js |
| 19 | `test(e2e): comprehensive test suite` | e2e/*.spec.ts |
| 20 | `chore: final validation and cleanup` | README.md |

---

## Success Criteria

### Verification Commands
```bash
# All tests pass
npm test && npx playwright test

# Build succeeds
npm run build

# Migration validated
psql -c "SELECT COUNT(*) FROM shifts"  # 77275
psql -c "SELECT COUNT(*) FROM users"   # 3068

# Lighthouse PWA
npx lighthouse http://localhost:3000 --only-categories=pwa
# Score >= 90
```

### Final Checklist
- [ ] All 43 jobs present with correct differentials
- [ ] All 24 locations present
- [ ] All 26 holidays present
- [ ] All 330 PAYDIFFS combinations loaded
- [ ] All 6 entry types working
- [ ] Dashboard shows correct aggregations
- [ ] Shifts views (weekly/monthly/yearly) working
- [ ] Analytics (insights/journey) working
- [ ] Goals system (12 combinations) working
- [ ] Posts archive displaying
- [ ] Feedback form submitting
- [ ] Account settings saving
- [ ] Theme switching working
- [ ] PWA installable
- [ ] All 77,275 shifts migrated
- [ ] All 3,068 users migrated
- [ ] Password reset flow for migrated users working
- [ ] All URLs match existing patterns
- [ ] Mobile-first responsive design
- [ ] All tests passing
