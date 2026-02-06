# AGENTS.md - Project-Specific Agent Instructions

## MANDATORY RULES (NON-NEGOTIABLE)

### 0. Documentation Lookup Priority (ABSOLUTE SOURCE OF TRUTH)

**When researching external libraries, APIs, or frameworks:**

| Priority | Tool | When to Use |
|----------|------|-------------|
| **1st (REQUIRED)** | **Nia** | ALWAYS try Nia first - most up-to-date documentation |
| **2nd (Fallback)** | Exa | Only if Nia fails or returns no results |
| **3rd (Last Resort)** | Context7 / Web Search | Only if both Nia and Exa fail |

**How to use Nia for documentation:**
```
mcp__nia__context(
  action: "search",
  query: "<library/framework name> <specific topic>",
  limit: 5
)
```

**Fallback Chain (MANDATORY - NEVER SKIP):**
```
1. TRY: Nia search
   ├── SUCCESS → Use Nia results
   └── FAIL/EMPTY → Continue to step 2

2. TRY: Exa web search (mcp_websearch_web_search_exa)
   ├── SUCCESS → Use Exa results
   └── FAIL/EMPTY → Continue to step 3

3. TRY: Context7 / Google Search / Web Fetch
   ├── SUCCESS → Use results
   └── FAIL → Document the failure, ask user for guidance

⚠️ NEVER SKIP THIS PROCESS
⚠️ NEVER rely on training knowledge alone for external APIs/libraries
⚠️ ALWAYS verify documentation before implementing
```

**Why Nia is the source of truth:**
- Most up-to-date documentation (newer than agent training data)
- Curated and verified content
- Cross-agent context sharing capability
- Reduces hallucination risk for API/library details

**NEVER rely on training knowledge for:**
- Library versions (e.g., "Next.js 14" IS outdated - currently Next.js 16)
- API signatures that may have changed
- Framework features that evolve rapidly

---

### 1. Research Documentation Rule

**EVERY piece of research MUST be documented in an actual file.**

| What is NOT acceptable | What IS required |
|------------------------|------------------|
| Thinking about findings | Writing findings to a file |
| Summarizing in chat only | Persisting in documentation file |
| Mental notes | `.md` file updates |
| Verbal descriptions | Structured documentation |

**When doing ANY research (exploration, app testing, feature discovery):**

1. **BEFORE starting:** Identify the documentation file to update
2. **DURING research:** Take notes mentally, but know they MUST be written
3. **AFTER research:** IMMEDIATELY update the documentation file with ALL findings
4. **NO EXCEPTIONS:** Even small discoveries must be documented

**Documentation file for this project:** `.sisyphus/drafts/portpal-app-documentation.md`

**Why this matters:**
- Research in chat/thinking is EPHEMERAL - it disappears
- Documentation files are PERSISTENT - they survive sessions
- Future agents need WRITTEN context, not verbal summaries
- Plan agents can ONLY use what's documented in files

### 2. Screenshot Organization Rule

All screenshots MUST be saved to: `.sisyphus/drafts/screenshots/`

Naming convention: `{number}-{descriptive-name}.png`
- Example: `01-dashboard-main.png`
- Example: `02-signin-page.png`
- Example: `03-worked-entry-step1.png`

### 3. Environment Variables Rule (CRITICAL - PRIVACY)

**NEVER read `.env` files. Period.**

- Do NOT read `.env`
- Do NOT read `.env.local`
- Do NOT read `.env.example`
- Do NOT read any file starting with `.env`

**If you need environment variable information:**
1. ASK the user directly
2. User will provide what you need to know
3. Never assume or guess values

**Why this matters:**
- `.env` contains secrets (API keys, database URLs, passwords)
- Reading it risks exposing sensitive data in conversation logs
- User controls what information is shared

**Exact env var names (use these, don't guess):**
```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon/public key (public)
SUPABASE_SERVICE_ROLE_KEY         # Supabase service role key (SECRET - server only)
```

---

### 4. Background Agent Execution (MANDATORY - NO BLOCKING)

**NEVER block on a single agent while doing nothing. Run agents in background.**

| Scenario | WRONG | CORRECT |
|----------|-------|---------|
| User has multiple requests queued | `delegate_task(..., run_in_background=false)` then wait | `delegate_task(..., run_in_background=true)` then handle other requests |
| Need exploration + implementation | Explore sync, wait, then implement | Explore async, work on other tasks, collect results later |
| Multiple independent tasks | Do one at a time | Launch all in parallel with `run_in_background=true` |

**When to use `run_in_background=true`:**
- Exploration agents (`explore`, `librarian`)
- Research tasks that don't block other work
- When user has multiple requests queued
- When you can do productive work while waiting

**When to use `run_in_background=false`:**
- ONLY when the result is immediately needed for the next step
- ONLY when there's nothing else to do
- ONLY for the final verification step

**Pattern:**
```typescript
// Launch multiple agents in parallel
delegate_task(subagent_type="explore", run_in_background=true, prompt="Find X")
delegate_task(subagent_type="explore", run_in_background=true, prompt="Find Y")
delegate_task(subagent_type="librarian", run_in_background=true, prompt="Research Z")

// Continue with other work while they run
// Handle other user requests
// Do direct tool calls

// Collect results when notified
background_output(task_id="bg_xxx")
```

**WHY THIS MATTERS:**
- User's time is valuable - don't make them wait
- Queued messages = user is waiting = bad UX
- Parallel work = faster completion
- Blocking = wasted context window

**NEVER sit idle waiting for one agent when you could be:**
- Handling other user requests
- Reading files for context
- Running diagnostics
- Preparing next steps

---

### 5. shadcn/ui Component Rule (MANDATORY)

**ALL shadcn/ui components are already installed in this project.**

**RULE: If shadcn has a component for the job, USE IT. Do NOT create custom components.**

| Need | Use This shadcn Component | DO NOT |
|------|---------------------------|--------|
| Modal/Dialog | `Dialog` | Create custom modal |
| Dropdown select | `Select` | Create custom dropdown |
| User menu | `DropdownMenu` | Create custom menu |
| Date picker | `Calendar` + `Popover` | Create custom calendar |
| Toast notifications | `Sonner` | Create custom toast |
| Charts | `Chart` (Recharts wrapper) | Install recharts separately |
| Form inputs | `Input`, `Button`, `Label`, `Textarea` | Create custom inputs |
| Cards | `Card` | Create custom card |
| Tabs | `Tabs` | Create custom tabs |
| Toggle | `Switch` | Create custom toggle |
| Progress bar | `Progress` | Create custom progress |

**Import pattern:**
```typescript
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
```

**Why this matters:**
- Consistent styling across the app
- Accessible by default (Radix primitives)
- Already tested and production-ready
- Reduces bundle size (no duplicate components)

### 6. Supabase Database Rules (CRITICAL)

#### Migration Files via Supabase CLI (MANDATORY)

**ALL database changes MUST use Supabase CLI migrations.**

```bash
# Create a new migration
supabase migration new <migration_name>

# This creates: supabase/migrations/<timestamp>_<migration_name>.sql
# Edit this file with your SQL, then apply:
supabase db push
```

**NEVER:**
- Run raw SQL directly in Supabase dashboard for schema changes
- Create tables/columns without a migration file
- Skip the migration process "just to test something"

**WHY:** Migration files create an audit trail of all database changes. This enables:
- Rollbacks if something goes wrong
- Team collaboration (everyone runs same migrations)
- Deployment consistency (dev → staging → prod)
- History of what changed and when

#### Pagination (1000 Row Limit - ALWAYS IMPLEMENT)

**Supabase has a 1000 row limit per request. ALWAYS implement pagination.**

```typescript
// ❌ WRONG - Will silently truncate at 1000 rows
const { data } = await supabase.from('shifts').select('*')

// ✅ CORRECT - Paginate with range()
async function fetchAllShifts() {
  const PAGE_SIZE = 1000
  let allData: Shift[] = []
  let page = 0
  let hasMore = true

  while (hasMore) {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .range(from, to)
    
    if (error) throw error
    
    allData = [...allData, ...data]
    hasMore = data.length === PAGE_SIZE
    page++
  }
  
  return allData
}
```

**When to paginate:**
- ANY query that might return > 1000 rows
- Data exports/migrations
- Analytics aggregations over full dataset
- Admin views showing all records

**When pagination is optional:**
- User's own shifts (unlikely to exceed 1000)

#### Running Database Queries (Scripts Only)

**Supabase CLI does NOT have a direct SQL execute command.**

To run queries or seed data, write a TypeScript script and run with `npx tsx`:

```bash
# Create script in scripts/ folder
# Then run:
npx tsx scripts/your-script.ts
```

**Example query script:**
```typescript
// scripts/verify-counts.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true })
  console.log('Jobs count:', count)
}

main()
```

**NEVER try:** `supabase db execute --sql "..."` (doesn't exist)
- Reference data (jobs, locations, holidays - all under 1000)
- Single record lookups by ID

---

## Teaching Mode: Stack Traces & Debugging

**When errors occur, ALWAYS explain stack traces to teach the user debugging skills.**

### How to Read a Stack Trace (Simple → Technical)

#### 1. The Simple Version
A stack trace is like a "breadcrumb trail" showing exactly where the error happened and how the code got there.

```
TypeError: Cannot read properties of undefined (reading 'map')
    at POST (app/api/shifts/route.ts:74:46)
```

**Read it like this:**
- **Line 1**: What broke → "Tried to call .map() on something that doesn't exist"
- **Line 2**: Where it broke → "In the POST function, file route.ts, line 74, character 46"

#### 2. The Technical Version
```
TypeError: Cannot read properties of undefined (reading 'map')
    at POST (app/api/shifts/route.ts:74:46)
    at async handleRequest (next/server.js:123:15)
    at async NextServer.handle (server.js:456:20)
```

**Components:**
| Part | Meaning |
|------|---------|
| `TypeError` | Error type (TypeError, ReferenceError, SyntaxError, etc.) |
| `Cannot read properties of undefined` | The actual problem |
| `(reading 'map')` | What operation failed |
| `at POST` | Function name where error occurred |
| `app/api/shifts/route.ts` | File path |
| `:74:46` | Line number : Column number |

**Reading order (top to bottom):**
1. **Top = where it crashed** (most useful)
2. **Middle = how it got there** (the call chain)
3. **Bottom = where it started** (often framework code, less useful)

#### 3. Common Error Types

| Error Type | What It Means | Common Cause |
|------------|---------------|--------------|
| `TypeError` | Wrong type or undefined | Accessing property on null/undefined |
| `ReferenceError` | Variable doesn't exist | Typo in variable name, forgot to import |
| `SyntaxError` | Code grammar is wrong | Missing bracket, comma, quote |
| `RangeError` | Value out of allowed range | Infinite recursion, invalid array length |

#### 4. Debugging Workflow

```
1. READ the error message (what broke)
2. FIND the line number (where it broke)
3. LOOK at that exact line in your code
4. TRACE backwards - what variable is undefined? Why?
5. ADD console.log() before the error line to inspect values
6. FIX the root cause, not the symptom
```

**Agent Rule:** When showing errors to the user, ALWAYS break down the stack trace using this format.

---

## Project Context

**Project:** PortPal - Shift tracking app for ILWU longshoremen
**Current Phase:** Documentation of existing Bubble.io app for Next.js + Supabase rebuild
**Primary Documentation:** `.sisyphus/drafts/portpal-app-documentation.md`
**Working Directory:** `/Users/edwardtran/BLI/veetesh's stuff/portpal-2/portpal-2-next/`
**GitHub Repo:** `giaphutran12/portpal-2`

### Test Credentials (Dev Environment)

| Field | Value |
|-------|-------|
| Email | `test@portpal.dev` |
| Password | `testpassword123` |

**Dev Server:** `http://localhost:3000`

---

## Agent-Specific Instructions

### For Exploration Agents
- Document ALL UI elements, fields, dropdowns, buttons
- Note ALL URLs and navigation patterns
- Record ALL validation rules and error messages
- Capture ALL edge cases and special behaviors

### For Plan Agents
- Use ONLY the documentation file as source of truth
- Do NOT assume features exist unless documented
- Flag any gaps in documentation before planning

### For Implementation Agents
- Reference documentation for exact field names, types, options
- Match existing app behavior exactly
- Verify implementation against documented specs

---

## File Structure

```
/portpal-2/
├── AGENTS.md                          # This file - agent instructions
├── .sisyphus/
│   └── drafts/
│       ├── portpal-app-documentation.md  # Main documentation (SOURCE OF TRUTH)
│       └── screenshots/                   # All app screenshots
└── PORTPAL_Developer_Package2/        # Original developer package
    ├── TECHNICAL_SPEC.md
    ├── pay_data/PAYDIFFS_clean.csv
    └── ...
```
