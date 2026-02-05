# AGENTS.md Additions

**Add this section after "### 2. Screenshot Organization Rule" and before "## Project Context":**

---

### 3. shadcn/ui Component Rule (MANDATORY)

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

### 4. Supabase Database Rules (CRITICAL)

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
- Reference data (jobs, locations, holidays - all under 1000)
- Single record lookups by ID

---
