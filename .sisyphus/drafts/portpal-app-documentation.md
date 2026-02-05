# PortPal App Documentation

> Complete documentation of portpal.app for Next.js recreation
> Last Updated: Feb 5, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [App Structure & Navigation](#app-structure--navigation)
3. [Entry Types (6 Types)](#entry-types-6-types)
4. [Dropdown Options (Complete Lists)](#dropdown-options-complete-lists)
5. [Pay Calculation System](#pay-calculation-system)
6. [Dashboard Features](#dashboard-features)
7. [Shifts Page](#shifts-page)
8. [Analytics Page](#analytics-page)
9. [Gamification System](#gamification-system)
10. [Posts & Feedback](#posts--feedback)
11. [Data Models for Supabase](#data-models-for-supabase)
12. [CRUD Operations List](#crud-operations-list)
13. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

**PortPal** is a shift tracking app for ILWU (International Longshore and Warehouse Union) longshoremen. It helps workers:
- Log shifts with accurate pay calculations
- Track earnings (weekly, monthly, yearly)
- Monitor stat holiday qualifying days
- Track benefits (sick days, personal leave)
- Set and track yearly earnings goals

**Tech Stack (Current):** Bubble.io (no-code)
**Target Stack:** Next.js + Supabase, mobile-first (90% mobile users)

**Login Credentials (Test):** `test@gmail.com` / `Cutkhoiacctao@123`

---

## App Structure & Navigation

### Bottom Navigation (Always Visible)
| Tab | URL Pattern | Description |
|-----|-------------|-------------|
| HOME | `/index/home/dashboard` | Dashboard with earnings, holidays, benefits |
| ANALYTICS | `/index/analytics/insights` | Work insights and journey/gamification |
| SHIFTS | `/index/shifts/weekly` | Shift list (weekly/monthly/yearly views) |
| ADD SHIFT | Opens modal | 6 entry types |

### Header Navigation (Context-Dependent)

**On HOME page:**
- DASHBOARD | POSTS | FEEDBACK

**On SHIFTS page:**
- WEEKLY | MONTHLY | YEARLY

**On ANALYTICS page:**
- INSIGHTS | JOURNEY

---

## Entry Types (6 Types)

### 1. WORKED (Most Complex - 3-Step Wizard)

**Step 1: "What job did you work?"**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Job Type | Dropdown (43 options) | Yes | Determines pay differential |
| Sub-type | Dropdown (conditional) | Conditional | Only shows for jobs with subjobs (Tractor Trailer, Head Checker, Labour, First Aid) |

**Step 2: "Where and when?"**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Date | Date picker with calendar | Yes | Defaults to today |
| Shift Type | **3 Button selection** (NOT dropdown!) | Yes | Day / Night / Graveyard - clickable icon buttons |
| Location | Dropdown (24 options) | Yes | Affects hours via PAYDIFFS |

**Step 3: "Hours and pay"**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Regular Hours | Number input | Yes | Auto-calculated from Job+Location (e.g., 8.00) |
| Rate ($/hr) | Number input | Yes | Auto-calculated: Base ($55.30) + Differential |
| Overtime Hours | Number input | No | Default 0 |
| Overtime Rate ($/hr) | Number input | Auto | Calculated as (Base × 1.5) + Differential |
| Include Travel | Toggle switch | No | Reveals Travel Hours + Travel Rate ($53.17/hr) fields |
| Include Meal Period | Toggle switch | No | Fixed 0.50 hours × OT Rate (e.g., $83.60) = $41.80 |
| Foreman name | Text input | No | Placeholder: "Enter foreman name" |
| Vessel | Text input | No | Placeholder: "Enter vessel" |
| Notes | Textarea | No | Placeholder: "Add any notes about this shift" |
| Add attachment | File upload | No | Placeholder: "Click to add attachments" |

**Total Pay Display:** Shows real-time calculation (e.g., "Total Pay = $447.60")

**Button:** "Add Shift"

### 2. LEAVE (Single Form)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Leave Type | Dropdown | Yes | Sick Leave / Personal Leave / Parental Leave |
| Date | Date picker | Yes | |
| Hours | Number input | Yes | Similar to WORKED but no overtime fields |
| Rate ($/hr) | Number input | Yes | |
| Will receive paystub later | Toggle | No | |

**Button:** "Add Log" (NOT "Add Shift")

### 3. VACATION (Simple)
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | Yes |
| Notes | Textarea | No |

**Button:** "Add Log"

### 4. STANDBY (Simple)
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | Yes |
| Notes | Textarea | No |

**Button:** "Add Log"

### 5. STAT HOLIDAY (Form)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Holiday | Dropdown (26 options) | Yes | 2025-2027 holidays. Note: "Thanksgiving" missing year suffix while others have it |
| Qualifying Days | Dropdown (15 options) | Yes | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15+ |
| Date | Date picker | Yes | |
| Notes | Textarea | No | |

**Button:** "Add Log"

### 6. DAY OFF (Simple)
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker | Yes |
| Notes | Textarea | No |

**Button:** "Add Log"

---

## Dropdown Options (Complete Lists)

### Jobs (43 Total)
```
Labour, First Aid, Rubber Tire Gantry, Lift Truck, Head Checker, 
Dock Checker, Wheat Machine, Loci, Bulk Operator, Liquid Bulk, 
Wheat Specialty, Welder, Reachstacker, Dock Gantry, Winch Driver, 
Hatch Tender/signals, Storesperson, Ship Gantry, Hd Mechanic, 
Gearperson, Rail Mounted Gantry, Dow Men, Tractor Trailer, 
Millwright, Front End Loader, Switchman, Trainer, Excavator, 
Bulldozer, Komatsu, Trackmen, Painter, Carpenter, Electrician, 
Bunny Bus, Pusher, Lockerman, 40 Ton (top Pick), Plumber, 
Training, Lines, Ob, Mobile Crane
```

### Jobs WITH Subjobs

**Tractor Trailer (4 subjobs):**
- Rail, Ship, Yard, Barge

**Head Checker (13 subjobs):**
- Canopy, Ingate, Outgate, Reefer, Gopher, Rail, Penthouse, 
  Rail Planner, Yard Planner, Rail Planner Gphr, Equip. Control, Tower, Roc

**Labour (9 subjobs):**
- (blank), Janitor, Lashing, Slingman, Shedmen, Utility, 
  Coastwise, Holdmen, Spare

**First Aid (3 subjobs):**
- Ship, Dock, Stores

### Locations (24 Total)
```
G3, Alliance Grain, Annacis Auto, Cargill, Cascadia, Centennial, 
Deltaport, Bc Sugar, Canada Place, Chemtrade, Fibreco, 
Fraser Surrey, Lynnterm, Neptune, Port Moody, Richardson, 
Squamish, Univar, Van Wharves, Vanterm, Viterra Pac, 
Waterfront Train. Cntr, Western Locker, Westshore
```

### Shift Types (3)
```
Day, Night, Graveyard
```

### Leave Types (3)
```
Sick Leave, Personal Leave, Parental Leave
```
**Note:** Full names are used in the dropdown, not abbreviated.

### Stat Holidays (26 for 2025-2027)

**2025:**
- Family Day (Feb 17), Good Friday (Apr 18), Easter Monday (Apr 21),
  Victoria Day (May 19), Canada Day (Jul 01), BC Day (Aug 04),
  Labour Day (Sep 01), National Day For Truth & Reconciliation (Sep 30),
  Thanksgiving (Oct 13), Remembrance Day (Nov 11), Christmas (Dec 25),
  Boxing Day (Dec 26)

**2026:**
- New Years (Jan 01), Family Day (Feb 15), Good Friday (Apr 03),
  Easter Monday (Apr 06), Victoria Day (May 18), Canada Day (Jul 01),
  BC Day (Aug 03), Labour Day (Sep 07), National Day For Truth & Reconciliation (Sep 30),
  Thanksgiving (Oct 12), Remembrance Day (Nov 11), Christmas (Dec 25),
  Boxing Day (Dec 28)

**2027:**
- New Years (Jan 01)

---

## Pay Calculation System

### Base Rate
**$55.30/hour** (as of current data)

### Differential Classes

| Class | Differential | Examples |
|-------|-------------|----------|
| BASE | +$0.00 | Labour, First Aid |
| CLASS_1 | +$2.50 | HD Mechanic, Millwright, Electrician, Welder |
| CLASS_2 | +$1.50 | Ship Gantry, Dock Gantry, Rail Mounted Gantry, Rubber Tire Gantry |
| CLASS_3 | +$0.65 | Tractor Trailer, Lift Truck, Front End Loader, Reachstacker |
| CLASS_4 | +$0.40 | Winch Driver, Hatch Tender, Gearperson |

### Rate Calculation Formula
```
Regular Rate = Base Rate ($55.30) + Differential

Overtime Rate = (Base Rate × 1.5) + Differential
             = ($55.30 × 1.5) + Differential
             = $82.95 + Differential

Example for Tractor Trailer (CLASS_3, +$0.65):
- Regular Rate = $55.30 + $0.65 = $55.95
- OT Rate = $82.95 + $0.65 = $83.60

IMPORTANT: The differential is NOT multiplied by 1.5 for overtime.
```

### Hours Override System (PAYDIFFS)
- **330 combinations** in CSV file (verified count)
- Stored in: `pay_data/PAYDIFFS_clean.csv`

**⚠️ CRITICAL: CSV vs App Mismatch Detected!**

| Combination | CSV Hours | App Hours | Status |
|-------------|-----------|-----------|--------|
| Tractor Trailer + Rail + Centennial + Day | 9.0 | 8.0 | MISMATCH |
| Tractor Trailer + Rail + Centennial + Night | 9.0 | 8.0 | MISMATCH |
| Tractor Trailer + Rail + Centennial + Graveyard | 7.5 | 6.5 | MISMATCH |

**Verified App Behavior (Tractor Trailer + Rail + Centennial):**
| Shift Type | Hours | Rate | OT Rate |
|------------|-------|------|---------|
| Day | 8.00 | $55.95 | $83.60 |
| Night | 8.00 | $70.32 | $105.16 |
| Graveyard | 6.50 | $86.70 | $129.73 |

**Note:** The PAYDIFFS CSV may be outdated or the app uses different logic. Hours DO vary by shift type (Graveyard is different), but actual values don't match the CSV.

### Verified Examples
| Job | Differential | Calculation | Rate |
|-----|-------------|-------------|------|
| Labour | BASE (+$0.00) | $55.30 + $0.00 | $55.30 |
| Tractor Trailer | CLASS_3 (+$0.65) | $55.30 + $0.65 | $55.95 |
| HD Mechanic | CLASS_1 (+$2.50) | $55.30 + $2.50 | $57.80 |

---

## Dashboard Features

### URL: `/index/home/dashboard`

### 1. Gamification Widget (Top)
- **Streak**: Shows current logging streak (e.g., "1 Day Streak" or "No Streak Yet")
- **Points**: Separate gamification metric (e.g., "Points - 5") - NOT the same as XP
- **XP**: Experience points display (e.g., "0.05")

**Note:** Clicking this widget navigates to Journey page (`/index/analytics/journey`)

### 2. Yearly Goal Widget
- Editable yearly earnings goal (default: $120,000.00)
- Progress tracking toward goal

### 3. Earnings at a Glance

**This Week Card:**
- Date range (e.g., "Feb 01 - Feb 07")
- Earnings amount
- Shifts count (X/7)
- Hours worked

**Last Week Card:**
- Same structure as This Week

**This Year Card:**
- Date range (fiscal year: Jan 04, 2026 - Jan 03, 2027)
- Total earnings
- Total shifts
- Total hours
- Pension earned (separate tracking with percentage)

### 4. Upcoming Holidays Section
- Shows next 3 holidays with:
  - Holiday name and date
  - Qualifying period (e.g., "Jan 18 - Feb 14")
  - Days worked tracker (X/15)
- "See all" button expands to show:
  - All upcoming holidays
  - Past holidays section

### 5. Benefits Section

**Sick Days:**
- Available | Used | Remaining
- Usage percentage with progress bar
- "Update" button

**Personal Leave:**
- Available | Used | Remaining
- Usage percentage with progress bar
- "Update" button

---

## Shifts Page

### Weekly View (`/index/shifts/weekly`)

**Header Stats:**
- Total Shifts
- Total Hours
- Total Earned

**"Add Shift" Button:** Located at TOP of page (in addition to bottom navigation) with icon + "Add Shift" text

**Week Navigation:**
- Left/Right arrows
- Current week display (e.g., "Feb 01 - Feb 07, 2026")

**Calendar Grid:**
- 7 days (Sunday - Saturday)
- Each day shows:
  - Day name (SUNDAY, MONDAY, etc.)
  - Date (Feb 01, Feb 02, etc.)
  - Shift status or "No Shift"
  - "TODAY" badge on current day

### Monthly View (`/index/shifts/monthly`)

**Header:**
- Month navigation (left/right arrows)
- Month name (e.g., "February 2026")

**Calendar Grid:**
- Standard month calendar
- Days with shifts show icons
- Clickable days
- Weekend days (Sat/Sun) show calendar icons (not shift icons)
- Next month preview days are visible but NOT clickable

### Yearly View (`/index/shifts/yearly`)

**Header Stats:**
- Total Shifts
- Total Hours
- **Avg/Shift** (unique to yearly view)

**Year Navigation:**
- Left/Right arrows (Left arrow disabled for 2025 - can't go before 2025)
- Year display (e.g., "2025") - Note: Default shows 2025, not current year

**Monthly Grid:**
- 12 month cards (Jan - Dec)
- Each shows: Month name + Shift count (Note: Grammar issue - shows "X shift" singular even for 0 or multiple)
- Clickable to drill down

---

## Analytics Page

### Work Insights View (`/index/analytics/insights`)

**Note:** Page title is "Work Insights" (not just "Insights")

**Time Period Selector:**
| Option | Description |
|--------|-------------|
| This Week | Current week |
| This Month | Current month |
| This Year | Current year |
| Last Week | Previous week |
| Last Month | Previous month |
| Last Year | Previous year |
| Custom Range | Date picker for custom range |

**Date Range Pickers:** ALWAYS visible for ALL time period options (not just Custom Range). Shows Start and End date pickers.

**Summary Stats (6 Cards):**
1. Total Earnings
2. Earnings Split - Shows BOTH formats:
   - Dollar amounts: "$X + $Y"
   - Shift counts: "X worked + Y leave"
3. Total Shifts
4. Total Worked Hours
5. Locations (unique count)
6. Most Frequent (location)

**Charts:**
1. **Earnings by Location** - Bar/pie chart
2. **Shifts by Type** - Distribution chart

### Journey View (`/index/analytics/journey`)

**Current Level Display:**
- Badge icon
- Level name (e.g., "New Guy")
- Level number
- XP progress bar with "XP to earn" label (e.g., "0/199 XP")
- Percentage (e.g., "1%")

**This Week's Progress:**
- Shifts Logged count
- Earned amount
- Motivational message (e.g., "Keep logging shifts to earn more XP and unlock badges!")

**My Badges Section:**
- Shows "X/4" count (e.g., "0/4")
- **App Typo Note:** Shows "Badged Unlocked" (should be "Badges Unlocked")

**Badge System (4 Levels):**
| Badge | Level | XP Required |
|-------|-------|-------------|
| New Guy | 1 | 0-199 XP |
| Casual | 2 | 200-? XP |
| Member | 3 | ?-? XP |
| Real Longshore | 4+ | ? XP |

**All Time Stats:**
- Total XP Earned
- Badges Unlocked (X/4)
- Longest Streak (days)
- Total Shifts

---

## Gamification System

### XP System
- Earn XP by logging shifts
- XP accumulates toward level progression
- Progress bar shows XP to next level
- **⚠️ VERIFICATION NEEDED:** XP earning formula unknown (how much XP per shift type?)

### Points System
- Separate from XP (displayed as "Points - X" on dashboard)
- **⚠️ VERIFICATION NEEDED:** Points earning formula unknown (how much points per shift type?)
- **⚠️ VERIFICATION NEEDED:** What are points used for vs XP?

### Streak System
- Consecutive days of logging shifts
- Displayed on dashboard (e.g., "1 Day Streak")
- Tracked in "All Time Stats"
- **⚠️ VERIFICATION NEEDED:** Exact streak rules (does it require logging every day? specific shift types?)

### Badge/Level System
1. **New Guy** (Level 1) - 0-199 XP
2. **Casual** (Level 2) - 200-? XP (**⚠️ threshold unknown**)
3. **Member** (Level 3) - ?-? XP (**⚠️ threshold unknown**)
4. **Real Longshore** (Level 4) - ? XP (**⚠️ threshold unknown**)

---

## Posts & Feedback

### Posts Page (`/index/home/posts`)

**Page Title:** "Posts Archive"

**Purpose:** Admin announcements and updates

**Post Structure:**
- Title (with emoji support, e.g., "🔍 Better Selection Features Are Here!")
- Date
- Preview text (truncated)
- "Read more" button with arrow icon to expand
- When expanded: full content displayed, button changes to "Read less"

**Sample Posts:**
- PortPal Beta is LIVE! (Jan 1, 2026)
- 🔍 Better Selection Features Are Here! (Apr 24, 2025)
- 🎉 The New PortPal is Live! (Feb 9, 2025)
- 🚀 Major Update Coming to PortPal!
- Features & Functionality (Jan 9, 2025)
- Fake E-mails (Jan 9, 2024)
- Pay rate/hours accuracy (Jan 3, 2025)
- Beta Testing (Dec 30, 2024)

### Feedback Page (`/index/home/feedback`)

**Page Title:** "Share Your Feedback"

**Feedback Form:**
| Field | Type | Placeholder | Required |
|-------|------|-------------|----------|
| ILWU Local | Text input | "e.g 500, 502, etc..." | No |
| Comments/Feedback | Textarea | "Share your thoughts, suggestions, or report issues" | Yes |
| Upload Images (Optional) | File upload | "Upload an Image" / "Choose File" buttons | No |
| Share anonymously | Switch (toggle) | - | No |

**Submit Button:** "Submit Feedback"

---

## Data Models for Supabase

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  ilwu_local TEXT, -- '500', '502', 'Other'
  board TEXT, -- 'A BOARD', 'B BOARD', 'C BOARD', 'T BOARD', '00 BOARD', 'R BOARD', 'UNION'
  theme_preference TEXT DEFAULT 'light', -- 'dark', 'light'
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'premium'
  subscription_billing TEXT, -- 'monthly', 'annually'
  
  -- Benefits with validity periods
  sick_days_available INTEGER DEFAULT 10,
  sick_days_used INTEGER DEFAULT 0,
  sick_leave_start DATE,
  sick_leave_end DATE,
  personal_leave_available INTEGER DEFAULT 10,
  personal_leave_used INTEGER DEFAULT 0,
  personal_leave_start DATE,
  personal_leave_end DATE,
  
  -- Gamification
  xp INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0, -- Points (separate from XP - different gamification metric)
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Shifts Table
```sql
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL, -- 'worked', 'leave', 'vacation', 'standby', 'stat_holiday', 'day_off'
  date DATE NOT NULL,
  
  -- Worked fields
  job TEXT,
  subjob TEXT,
  location TEXT,
  shift_type TEXT, -- 'day', 'night', 'graveyard'
  hours DECIMAL(4,2), -- Regular hours
  rate DECIMAL(6,2), -- Regular rate (Base + Differential)
  overtime_hours DECIMAL(4,2) DEFAULT 0, -- Overtime hours
  overtime_rate DECIMAL(6,2), -- OT Rate = (Base × 1.5) + Differential
  travel BOOLEAN DEFAULT FALSE,
  meal BOOLEAN DEFAULT FALSE,
  foreman TEXT,
  vessel TEXT,
  total_pay DECIMAL(10,2), -- Calculated: (hours × rate) + (ot_hours × ot_rate) + travel + meal
  
  -- Leave fields
  leave_type TEXT, -- 'sick_leave', 'personal_leave', 'parental_leave'
  will_receive_paystub BOOLEAN DEFAULT FALSE,
  
  -- Stat holiday fields
  holiday TEXT,
  qualifying_days INTEGER, -- 1-14 or 15+
  
  -- Common fields
  notes TEXT,
  attachments TEXT[], -- Array of URLs
  points_earned INTEGER DEFAULT 0, -- Points earned from this shift
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Jobs Table (Reference)
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  differential_class TEXT NOT NULL, -- 'BASE', 'CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4'
  differential_amount DECIMAL(4,2) NOT NULL,
  has_subjobs BOOLEAN DEFAULT FALSE
);
```

### Subjobs Table (Reference)
```sql
CREATE TABLE subjobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);
```

### Locations Table (Reference)
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);
```

### Pay Overrides Table (PAYDIFFS)
```sql
CREATE TABLE pay_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job TEXT NOT NULL,
  subjob TEXT,
  location TEXT NOT NULL,
  shift_type TEXT NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  UNIQUE(job, subjob, location, shift_type)
);
```

### Holidays Table (Reference)
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  qualifying_start DATE NOT NULL,
  qualifying_end DATE NOT NULL,
  qualifying_days_required INTEGER DEFAULT 15,
  year INTEGER NOT NULL
);
```

### Posts Table (Admin)
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ilwu_local TEXT,
  content TEXT NOT NULL,
  images TEXT[],
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## CRUD Operations List

### Shifts (Core Feature)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| CREATE | POST /api/shifts | Create new shift entry |
| READ | GET /api/shifts | List shifts (with filters) |
| READ | GET /api/shifts/:id | Get single shift |
| UPDATE | PUT /api/shifts/:id | Update shift |
| DELETE | DELETE /api/shifts/:id | Delete shift |

### User Profile
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| READ | GET /api/user/profile | Get user profile |
| UPDATE | PUT /api/user/profile | Update profile |
| UPDATE | PUT /api/user/yearly-goal | Update yearly goal |
| UPDATE | PUT /api/user/benefits | Update sick/personal leave |

### Analytics (Read-Only)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| READ | GET /api/analytics/earnings | Get earnings by period |
| READ | GET /api/analytics/shifts | Get shift stats |
| READ | GET /api/analytics/locations | Get location breakdown |
| READ | GET /api/analytics/journey | Get XP/badge progress |

### Reference Data (Read-Only)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| READ | GET /api/jobs | List all jobs |
| READ | GET /api/jobs/:id/subjobs | Get subjobs for job |
| READ | GET /api/locations | List all locations |
| READ | GET /api/holidays | List holidays |
| READ | GET /api/pay-rate | Calculate pay rate |

### Posts (Read-Only for Users)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| READ | GET /api/posts | List published posts |
| READ | GET /api/posts/:id | Get single post |

### Feedback
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| CREATE | POST /api/feedback | Submit feedback |

---

## Implementation Roadmap

### Phase 1: Core CRUD (MVP) - Week 1-2
1. **Auth System**
   - Email/password login
   - User registration
   - Password reset

2. **Shift Entry (All 6 Types)**
   - Worked entry wizard (3 steps)
   - Leave entry form
   - Simple entries (Vacation, Standby, Day Off, Stat Holiday)

3. **Shifts List**
   - Weekly view
   - Monthly view
   - Yearly view
   - Navigation between views

4. **Reference Data**
   - Seed jobs, locations, holidays
   - Import PAYDIFFS (330 overrides)

### Phase 2: Dashboard & Analytics - Week 2-3
1. **Dashboard**
   - Earnings at a Glance widget
   - Upcoming Holidays widget
   - Benefits tracker

2. **Analytics**
   - Insights view with time filters
   - Earnings by location chart
   - Shifts by type chart

3. **Yearly Goal**
   - Goal setting
   - Progress tracking

### Phase 3: Gamification & Extras - Week 3-4
1. **Journey/Gamification**
   - XP system
   - Badge/level progression
   - Streak tracking

2. **Posts & Feedback**
   - Posts archive (read-only)
   - Feedback form

3. **Polish**
   - Mobile optimization
   - PWA setup
   - Performance optimization

### Phase 4: AI Features (Future)
- Smart shift suggestions
- Earnings predictions
- Anomaly detection
- Voice entry

---

## Technical Notes

### Mobile-First Design
- 90% of users on mobile
- PWA for app-like experience
- Touch-optimized UI
- Bottom navigation pattern

### Key UX Patterns
- Wizard for complex entries (Worked)
- Single forms for simple entries
- Collapsible sections (holidays)
- Toggle switches for booleans
- Date pickers for dates

### Pay Calculation Priority
1. Check PAYDIFFS for Job+Location+ShiftType override
2. If no override, use default hours
3. Calculate rate: Base + Differential
4. Calculate total: Hours × Rate

---

## Files Reference

```
/PORTPAL_Developer_Package2/
├── TECHNICAL_SPEC.md          # Full technical spec (977 lines)
├── vee-msg.txt                # Context from boss
├── pay_data/
│   └── PAYDIFFS_clean.csv     # 330 hour overrides
├── presentations/
│   └── developer-brief.html   # Interactive brief with rate tables
└── app/src/
    ├── data/mockData.ts       # Pay calculation reference
    ├── pages/*.tsx            # Page components
    └── components/*.tsx       # Shared components
```

---

## Screenshots

All screenshots saved to: `.sisyphus/drafts/screenshots/`

| # | Filename | Description |
|---|----------|-------------|
| 01 | 01-dashboard-main.png | Dashboard full view |
| 02 | 02-user-menu-dropdown.png | User avatar dropdown menu |
| 03 | 03-signin-page.png | Sign In page |
| 04 | 04-signup-page.png | Sign Up page |
| 05 | 05-dashboard-holidays-expanded.png | Dashboard with "See all" holidays expanded |
| 06 | 06-analytics-insights.png | Analytics Insights (Work Insights) page |
| 07 | 07-analytics-journey.png | Analytics Journey page |
| 08 | 08-shifts-weekly.png | Shifts Weekly view |
| 09 | 09-shifts-monthly.png | Shifts Monthly view |
| 10 | 10-shifts-yearly.png | Shifts Yearly view |
| 11 | 11-add-shift-modal.png | Add Shift entry type selection |
| 12 | 12-worked-step1-with-subjob.png | WORKED Step 1 with Tractor Trailer subjob |
| 13 | 13-worked-step2.png | WORKED Step 2 (Where and when?) |
| 14 | 14-worked-step3-pay.png | WORKED Step 3 (Hours and pay) |
| 15 | 15-leave-entry.png | Leave entry form |
| 16 | 16-stat-holiday-entry.png | Stat Holiday entry form |
| 17 | 17-posts-page.png | Posts Archive page |
| 18 | 18-feedback-page.png | Feedback form page |
| 19 | 19-account-page.png | Account settings page |
| 20 | 20-vacation-entry.png | Vacation entry form |
| 21 | 21-standby-entry.png | Standby entry form |
| 22 | 22-travel-meal-fields.png | Travel and Meal fields expanded |

---

## Data Migration (Bubble.io → Supabase)

### Export File Details

**File:** `portpal-2-next/export_All-SHIFTS-modified--_2026-02-01_05-58-52.csv`

| Metric | Value |
|--------|-------|
| Total Records | 77,275 shifts |
| Unique Users | 3,068 users |
| Total Columns | 52 |
| Date Range | Dec 2024 - Feb 2026 |

### Column Structure (52 Columns)

| # | Column Name | Description | Maps To |
|---|-------------|-------------|---------|
| 1 | attachment (New) | New attachments | shifts.attachments |
| 2 | attachments | Legacy attachments | shifts.attachments |
| 3 | DATE | Shift date | shifts.date |
| 4 | DNG | Shift type (DAY/NIGHT/GRAVEYARD) | shifts.shift_type |
| 5 | double | Double shift flag | - |
| 6 | Foreman | Foreman name | shifts.foreman |
| 7 | holidaydesc-other | Holiday description | - |
| 8 | Images | Image attachments | shifts.attachments |
| 9 | JOB | Job type | shifts.job |
| 10 | job-other | Custom job (if "Other") | shifts.job |
| 11 | leaveType | Leave type (Sick/Personal/Parental) | shifts.leave_type |
| 12 | LOCATION | Work location | shifts.location |
| 13 | locationother | Custom location | shifts.location |
| 14 | meal | Meal period included | shifts.meal |
| 15 | monthlyBonusAwarded? | Monthly bonus flag | - |
| 16 | notes | Shift notes | shifts.notes |
| 17 | OT HR | Overtime hours | shifts.overtime_hours |
| 18 | OT RT | Overtime rate | shifts.overtime_rate |
| 19 | paid-check | Payment confirmed | - |
| 20 | paystubLater? | Paystub pending | shifts.will_receive_paystub |
| 21 | payStubReceivedDate | Paystub received date | - |
| 22 | personalday-check | Personal leave flag | (entry_type = 'leave') |
| 23 | pluggedin | Standby flag | (entry_type = 'standby') |
| 24 | pointsAwarded | Points earned | shifts.points_earned |
| 25 | qualifyingDays | Stat holiday qualifying days | shifts.qualifying_days |
| 26 | quarter | Quarter number | - |
| 27 | REG HR | Regular hours | shifts.hours |
| 28 | REG RT | Regular rate | shifts.rate |
| 29 | relStreakLog | Streak log reference | - |
| 30 | relUser | User email (PRIMARY KEY) | users.email |
| 31 | sickday-check | Sick leave flag | (entry_type = 'leave') |
| 32 | sickLeavePaidOut? | Sick leave paid out | - |
| 33 | stat - desc | Stat holiday description | shifts.holiday |
| 34 | stat-check | Stat counting flag | - |
| 35 | stat-holiday | Stat holiday name | shifts.holiday |
| 36 | StatCountingDays | Days counting toward stat | - |
| 37 | stathol-check | Stat holiday entry flag | (entry_type = 'stat_holiday') |
| 38 | SUBJOB | Subjob type (legacy) | shifts.subjob |
| 39 | subjob | Subjob type | shifts.subjob |
| 40 | subjobnew | Subjob type (new) | shifts.subjob |
| 41 | totalpay | Calculated total pay | shifts.total_pay |
| 42 | travelhours | Travel hours | (calculate travel pay) |
| 43 | type | Entry type marker | - |
| 44 | vacday-check | Vacation flag | (entry_type = 'vacation') |
| 45 | vacpay-check | Vacation pay flag | - |
| 46 | Vessel | Vessel name | shifts.vessel |
| 47 | weeklyBonusAwarded? | Weekly bonus flag | - |
| 48 | Creation Date | Record created | shifts.created_at |
| 49 | Modified Date | Record modified | shifts.updated_at |
| 50 | Slug | URL slug | - |
| 51 | Creator | Creator email | - |
| 52 | unique id | Bubble unique ID | (use for deduplication) |

### Entry Type Determination Logic

Entry type is NOT stored in a single column. Determine by checking flag columns:

```
IF stathol-check = "yes" THEN entry_type = "stat_holiday"
ELSE IF vacday-check = "yes" THEN entry_type = "vacation"
ELSE IF sickday-check = "yes" THEN entry_type = "leave", leave_type = "sick_leave"
ELSE IF personalday-check = "yes" THEN entry_type = "leave", leave_type = "personal_leave"
ELSE IF pluggedin = "yes" THEN entry_type = "standby"
ELSE IF JOB is empty AND totalpay = 0 THEN entry_type = "day_off"
ELSE entry_type = "worked"
```

### User Identification

- **No user IDs in Bubble export** - users identified by email only
- `relUser` column contains user email (e.g., "tonyguzzo70@gmail.com")
- `Creator` column also contains email (usually same as relUser)

**Migration Strategy:**
1. Extract unique emails from `relUser` column
2. Create user records in Supabase with email as lookup key
3. Link shifts to users via email → user_id mapping

### Data Quality Issues

| Issue | Description | Resolution |
|-------|-------------|------------|
| CSV Column Alignment | Some rows have shifted columns due to commas in data | Use proper CSV parser with quote handling |
| Duplicate Subjob Columns | `SUBJOB`, `subjob`, `subjobnew` all exist | Prioritize: subjobnew > subjob > SUBJOB |
| Empty vs Null | Empty strings vs actual nulls | Treat "" as NULL |
| Date Formats | "Dec 9, 2024 12:12 pm" format | Parse with moment.js or similar |
| Numeric Strings | Numbers stored as strings (e.g., "7.5") | Cast to DECIMAL |

### Migration Steps

**Phase 1: User Migration**
```sql
-- Extract unique users from CSV
INSERT INTO users (email, created_at)
SELECT DISTINCT 
  "relUser" as email,
  MIN("Creation Date") as created_at
FROM bubble_export
WHERE "relUser" IS NOT NULL
GROUP BY "relUser";
```

**Phase 2: Shift Migration**
```sql
-- Map shifts to users and transform entry types
INSERT INTO shifts (user_id, entry_type, date, job, subjob, location, ...)
SELECT 
  u.id as user_id,
  CASE 
    WHEN "stathol-check" = 'yes' THEN 'stat_holiday'
    WHEN "vacday-check" = 'yes' THEN 'vacation'
    WHEN "sickday-check" = 'yes' THEN 'leave'
    WHEN "personalday-check" = 'yes' THEN 'leave'
    WHEN "pluggedin" = 'yes' THEN 'standby'
    WHEN "JOB" = '' AND "totalpay" = '0' THEN 'day_off'
    ELSE 'worked'
  END as entry_type,
  ...
FROM bubble_export b
JOIN users u ON u.email = b."relUser";
```

**Phase 3: Validation**
- Compare total counts: Bubble vs Supabase
- Verify earnings totals match
- Check date ranges preserved
- Validate user-shift relationships

### PAYDIFFS Validation

The export data **validates** the PAYDIFFS CSV hours are correct:

| Combination | CSV Hours | Export Shows | Status |
|-------------|-----------|--------------|--------|
| TRACTOR TRAILER + CENTENNIAL + DAY | 9.0 | 9.0 | ✅ MATCH |
| WHEAT SPECIALTY + CASCADIA + DAY | 7.5 | 7.5 | ✅ MATCH |
| WHEAT SPECIALTY + RICHARDSON + NIGHT | 7.5 | 7.5 | ✅ MATCH |

**Conclusion:** PAYDIFFS CSV is authoritative for hours overrides. Any discrepancy seen in app UI during testing was likely a display issue, not a data issue.

---

---

## NEW FINDINGS (Critical Exploration - Feb 5, 2026)

### Authentication System

#### Sign In Page (`/signin`)

**URL:** `/signin`

**Tabs:**
- Sign in (default)
- Sign up

**Login Form:**
| Field | Type | Placeholder |
|-------|------|-------------|
| E-mail | Text input | example@gmail.com |
| Password | Text input (masked) | Enter your password |
| Remember me | Checkbox | - |

**Buttons:**
- Forgot Password? (link)
- Sign in (primary button)

**Social Login Options:**
- Continue with Facebook
- Continue with Google

#### Onboarding Modal (First-Time Setup)

When a new user logs in or account is incomplete, this modal appears:

**Title:** "Please enter the following details"

| Field | Type | Options |
|-------|------|---------|
| Board | Dropdown | A Board, B Board, C Board, T Board, 00 Board, R Board, Union |
| Local | Dropdown | 500, 502 |

**Button:** Continue

---

### User Menu (Avatar Dropdown)

Clicking the user avatar (shows first letter of name, e.g., "T") opens:

| Menu Item | Action |
|-----------|--------|
| Account | Navigate to `/index/home/account` |
| Contact | Navigate to `/index/home/feedback` (same as Feedback) |
| About Us | Static text (not clickable) |
| Log out | Logs out user, redirects to `/signin` |

---

### Account Page (`/index/home/account`)

**URL:** `/index/home/account`

**Form Fields:**
| Field | Type | Options/Notes |
|-------|------|---------------|
| First name | Text input | Editable |
| Last name | Text input | Editable |
| Email | Text input | Editable |
| Local | Dropdown | **500**, **502**, **Other** (NEW - not in onboarding!) |
| Board | Dropdown | A BOARD, B BOARD, C BOARD, T BOARD, 00 BOARD, R BOARD, UNION |
| Subscription | Button | "Manage" → opens `/memberships` in new tab |
| Theme preference | Dropdown | (blank), Dark, Light |

**Action Buttons:**
- Discard changes
- Save Changes

**KEY FINDING:** "Other" option for Local is only available in Account settings, not in onboarding!

---

### Memberships/Subscription Page (`/memberships`)

**URL:** `/memberships` (opens in new tab from Account)

#### Premium Plan
**Features:**
- Pay stub upload & auto-population
- Pension threshold tracker
- Benefits hours tracker
- Priority support

**Pricing:**
| Option | Price | Savings |
|--------|-------|---------|
| Monthly | $14.99/month | - |
| Annually | $129.99/year ($10.83/month) | $50 OFF |

**Note:** 60 day free trial available

**Buttons:**
- Pay Monthly
- Pay Annually ($50 OFF)

#### Free Plan (Current for test account)
**Features:**
- Pay stub upload & auto-population
- Pension threshold tracker
- General Support (not Priority)

**Button:** "Current" (indicates active plan)

#### Feature Comparison
| Feature | Free | Premium |
|---------|------|---------|
| Pay stub upload & auto-population | ✅ | ✅ |
| Pension threshold tracker | ✅ | ✅ |
| Benefits hours tracker | ❌ | ✅ |
| Priority support | ❌ | ✅ |

---

### Benefits Update Modals

#### Sick Leave Update Modal
Triggered by clicking "Update" on Sick Days section.

**Title:** "Sick Leave" (with X close button)

| Field | Type | Default |
|-------|------|---------|
| Validity | Date range picker (Start - End) | Current dates |
| Total Sick Leaves Available | Number input | 10 |

**Buttons:**
- Cancel
- Save

#### Personal Leave Update Modal
Same structure as Sick Leave modal:

**Title:** "Personal Leave"

| Field | Type | Default |
|-------|------|---------|
| Validity | Date range picker (Start - End) | Current dates |
| Total Personal Leaves Available | Number input | 10 |

**Buttons:**
- Cancel
- Save

---

### Goals System (Yearly Goal Creation)

#### Goal Creation Flow
Triggered by clicking "Ready to get started? Click to create your first Yearly goal"

**Navigation:** Shows "Goals" page with "Create" button

**Create Goal Form:**
| Field | Type | Options |
|-------|------|---------|
| Name your goal | Text input | Placeholder: "e.g Level-Up Year" |
| Goal type | Dropdown | Weekly, Monthly, **Yearly** (default) |
| Date range | Date pickers | Start date - End date |
| Kind of goal? | Dropdown | **Earnings**, **Hours**, **Shifts**, **Pension** |

**Buttons:**
- Back (returns to previous screen)
- Cancel
- Create Goal

#### Goal Types Available
1. **Earnings** - Track dollar amount earned
2. **Hours** - Track hours worked
3. **Shifts** - Track number of shifts
4. **Pension** - Track pension contributions

---

### Clickable/Interactive Elements (Previously Undocumented)

| Element | Location | Action |
|---------|----------|--------|
| Streak/XP widget | Dashboard top | Navigates to Journey page (`/index/analytics/journey`) |
| $120,000.00 yearly goal | Dashboard | Opens goal edit (clickable) |
| User avatar (letter) | Header | Opens user dropdown menu |
| Hamburger menu | Header | Triggers data load (may have other function) |

---

### URL Structure (Complete)

| Page | URL |
|------|-----|
| Sign In | `/signin` |
| Sign Up | `/signin` (tab) |
| Dashboard | `/index/home/dashboard` |
| Account | `/index/home/account` |
| Posts | `/index/home/posts` |
| Feedback | `/index/home/feedback` |
| Shifts Weekly | `/index/shifts/weekly` |
| Shifts Monthly | `/index/shifts/monthly` |
| Shifts Yearly | `/index/shifts/yearly` |
| Analytics Insights | `/index/analytics/insights` |
| Analytics Journey | `/index/analytics/journey` |
| Memberships | `/memberships` |

---

### Data Model Updates (Based on New Findings)

#### Users Table (Updated)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  ilwu_local TEXT, -- '500', '502', 'Other'
  board TEXT, -- 'A BOARD', 'B BOARD', etc.
  theme_preference TEXT DEFAULT 'light', -- 'dark', 'light'
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'premium'
  subscription_billing TEXT, -- 'monthly', 'annually'
  
  -- Benefits with validity periods
  sick_days_available INTEGER DEFAULT 10,
  sick_days_used INTEGER DEFAULT 0,
  sick_leave_start DATE,
  sick_leave_end DATE,
  personal_leave_available INTEGER DEFAULT 10,
  personal_leave_used INTEGER DEFAULT 0,
  personal_leave_start DATE,
  personal_leave_end DATE,
  
  -- Gamification
  xp INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0, -- Points (separate from XP - different gamification metric)
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Goals Table (NEW)
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal_type TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
  goal_kind TEXT NOT NULL, -- 'earnings', 'hours', 'shifts', 'pension'
  target_value DECIMAL(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  current_value DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Board Options (Complete List)
```
A Board, B Board, C Board, T Board, 00 Board, R Board, Union
```

### Local Options (Complete List)
```
500, 502, Other
```

---

### Edge Cases & Notes

1. **Contact vs Feedback:** "Contact" menu item redirects to Feedback page - they are the same
2. **Onboarding vs Account:** "Other" option for Local only appears in Account settings, not in initial onboarding
3. **Subscription Management:** Opens in new tab, not in-app
4. **Benefits Validity:** Sick/Personal leave have date validity periods (not just counts)
5. **Goals:** Multiple goal types supported (Weekly/Monthly/Yearly) with different target metrics (Earnings/Hours/Shifts/Pension)
6. **Theme:** Dark mode is supported via Account settings

---

---

## Authentication Flows (Complete)

### Sign Up Page (`/signin` - Sign up tab)

**Title:** "Create an account"

**Privacy Notice:**
> "You are free to use non-personal information here such as an alias or just initials. Ensure you have access to the e-mail you sign up with (in case you need to reset your password)"

**Form Fields:**
| Field | Type | Placeholder/Options |
|-------|------|---------------------|
| Name | Text input | "John Smith" |
| Local | Dropdown | 500, 502 |
| Board | Dropdown | A BOARD, B BOARD, C BOARD, T BOARD, 00 BOARD, R BOARD, UNION |
| E-mail | Text input | "example@gmail.com" |
| Password | Text input | "Enter a password" |

**Buttons:**
- Sign up for free (primary)
- Continue with Facebook
- Continue with Google
- **Start a 60 Day Free** (premium trial button)

### Forgot Password Flow

**Process:**
1. Enter email in the email field
2. Click "Forgot Password?" button
3. **Success message appears:** "A password reset link has been sent to your email"

**Note:** No separate page - inline flow on sign in page

---

## Entry Type Descriptions (From ADD SHIFT Modal)

| Entry Type | Description |
|------------|-------------|
| Worked | "Log your shift details" |
| Leave | "Taking care of yourself" |
| Vacation | "Enjoying time off" |
| Standby | "Plugged in but no work" |
| Stat Holiday | "Public Holiday" |
| Day Off | "Scheduled rest day" |

**Current Date Display:** Shows current day (e.g., "Thursday, February 5, 2026")

---

## WORKED Entry Wizard (Complete - 3 Steps)

### Step 1: "What job did you work?"

**Progress Indicator:** 1 - 2 - 3

| Field | Type | Notes |
|-------|------|-------|
| Job Type | Dropdown (43 options) | Full list in documentation |
| Sub-type | Dropdown (conditional) | Only shows for jobs with subjobs |

**Buttons:** Go Back, Next

### Step 2: "Where and when?"

| Field | Type | Notes |
|-------|------|-------|
| Date | Date picker with calendar | Defaults to today |
| Shift type | **3 Button options** (NOT dropdown!) | Day, Night, Graveyard |
| Location | Dropdown (24 options) | Full list in documentation |

**Buttons:** Previous, Next

### Step 3: "Hours and pay"

**Hours and Pay Section:**
| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Regular Hours | Number input | Auto-calculated (e.g., 8.00) | Based on Job+Location |
| Rate ($/hr) | Number input | Auto-calculated (e.g., 55.95) | Base + Differential |
| **Overtime Hours** | Number input | 0 | NEW - was missing! |
| **Overtime Rate ($/hr)** | Number input | Auto-calculated (e.g., 83.60) | 1.5x regular rate |
| Include Travel | Toggle switch | Off | Adds travel pay |
| Include Meal Period | Toggle switch | Off | Adds meal allowance |

**Total Pay Display:** Shows calculated total (e.g., "Total Pay = $447.60")

**Additional Details:**
| Field | Type | Placeholder |
|-------|------|-------------|
| Foreman name | Text input | "Enter foreman name" |
| Vessel | Text input | "Enter vessel" |
| Notes | Textarea | "Add any notes about this shift" |
| Add attachment | File upload | "Click to add attachments" |

**Buttons:** Previous, Add Shift

---

## Shift Type Selection (UI Detail)

**Important:** Shift type is selected via **button icons**, not a dropdown!

```
[Day icon] [Night icon] [Graveyard icon]
   Day       Night       Graveyard
```

Each is a clickable button with an icon.

---

## Data Model Updates (Based on Wizard Exploration)

### Shifts Table (Updated with Overtime)
```sql
CREATE TABLE shifts (
  -- ... existing fields ...
  
  -- Regular pay
  hours DECIMAL(4,2),
  rate DECIMAL(6,2),
  
  -- Overtime (NEW!)
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  overtime_rate DECIMAL(6,2), -- 1.5x regular rate
  
  -- Calculated
  total_pay DECIMAL(10,2), -- (hours × rate) + (overtime_hours × overtime_rate) + travel + meal
  
  -- ... rest of fields ...
);
```

### Pay Calculation Formula (Updated)
```
Regular Pay = Regular Hours × Rate
Overtime Pay = Overtime Hours × Overtime Rate (1.5x)
Travel Pay = (if enabled) fixed amount
Meal Pay = (if enabled) fixed amount
Total Pay = Regular Pay + Overtime Pay + Travel Pay + Meal Pay
```

---

## Screenshots Reference

- `portpal-dashboard-home.png` - Dashboard home view
- `portpal-shifts-weekly.png` - Shifts weekly view
- `portpal-analytics-insights.png` - Analytics insights view
- `portpal-add-shift-modal.png` - Add shift entry type selection

---

---

## Exploration Summary

### Newly Discovered (Not in Original Documentation)

1. **Authentication System**
   - Sign Up form with privacy notice and all fields
   - Forgot Password inline flow (sends email, shows success message)
   - Social login: Facebook and Google
   - "Start a 60 Day Free" premium trial button on signup

2. **User Account Management**
   - Account page (`/index/home/account`) with all editable fields
   - Theme preference: Dark/Light mode support
   - "Other" option for Local (only in Account, not onboarding)

3. **Subscription System**
   - Memberships page (`/memberships`)
   - Premium: $14.99/month or $129.99/year
   - Free vs Premium feature comparison
   - 60-day free trial

4. **Benefits Management**
   - Sick Leave Update modal with validity dates
   - Personal Leave Update modal
   - Total available days configurable

5. **Goals System**
   - Create goals for: Earnings, Hours, Shifts, Pension
   - Goal types: Weekly, Monthly, Yearly
   - Custom date ranges

6. **Worked Entry - Missing Fields**
   - **Overtime Hours** field
   - **Overtime Rate** field (1.5x calculation)
   - **Total Pay** real-time calculation display
   - Shift type is **button selection**, not dropdown

7. **User Menu**
   - Account, Contact, About Us, Log out
   - Contact → redirects to Feedback page

8. **UI Details**
   - Entry type descriptions (e.g., "Log your shift details")
   - Current date display in ADD SHIFT modal
   - "Add Log" button (Leave, Stat Holiday) vs "Add Shift" (Worked)

### Verified (Matched Original Documentation)

- ✅ All 43 job types
- ✅ All subjobs (Tractor Trailer, Head Checker, Labour, First Aid)
- ✅ All 24 locations
- ✅ All 26 stat holidays (2025-2027)
- ✅ Qualifying days: 1-14, 15+
- ✅ Leave types: Sick, Personal, Parental
- ✅ Shift types: Day, Night, Graveyard
- ✅ Pay differentials (BASE, CLASS_1-4)
- ✅ Dashboard widgets (Earnings, Holidays, Benefits)
- ✅ Shifts page views (Weekly, Monthly, Yearly)
- ✅ Analytics page (Insights, Journey)
- ✅ Gamification (XP, Badges, Streaks)
- ✅ Posts archive and Feedback form

---

## Shift CRUD Operations (View/Edit/Delete)

### Viewing a Shift (Shift Details Panel)

**Trigger:** Click on any day with a shift in the calendar (Weekly/Monthly view)

**URL Pattern:** `/index/shifts/weekly/{shift_id}` or `/index/shifts/monthly/{shift_id}`
- Example: `/index/shifts/weekly/1770275253567x597258222902673700`

**Panel Structure:**
| Section | Icon | Content |
|---------|------|---------|
| Header | - | "Shift Details" title + X close button |
| Date & Location | Calendar icon | Full date (e.g., "Thursday, February 5, 2026") |
| Log Info | Info icon | Entry type (e.g., "Day Off", "Worked", "Leave") |
| Notes | Notes icon | User's notes (if any) |

**Action Buttons:**
- **Edit Shift** (pencil icon) - Opens edit form
- **Delete** (trash icon) - Opens delete confirmation

**Behavior:**
- Panel slides in from the right side
- Clicking X or outside panel closes it
- URL updates to include shift ID when panel is open

---

### Editing a Shift

**Trigger:** Click "Edit Shift" button in Shift Details panel

**Edit Form Structure (varies by entry type):**

#### Day Off / Vacation / Standby (Simple entries)
| Step | Fields | Buttons |
|------|--------|---------|
| Step 1 | Date (calendar picker), Notes (textarea) | Go Back, Next |
| Step 2 | Same fields displayed | Previous, Next |
| Step 3 | Same fields displayed | Previous, Save Shift |

#### Worked Entry (Complex - 3 steps)
| Step | Fields | Buttons |
|------|--------|---------|
| Step 1 | Job, Subjob (if applicable) | Go Back, Next |
| Step 2 | Date, Shift Type, Location | Previous, Next |
| Step 3 | Hours, Rate, OT Hours, OT Rate, Travel, Meal, Foreman, Vessel, Notes, Attachments | Previous, Save Shift |

**Edit Form Header:**
- "Back" button (returns to Shift Details without saving)
- Entry type name (e.g., "Day Off")
- Entry type description (e.g., "Scheduled rest day")

**Date Picker Features:**
- Full calendar grid (Sun-Sat)
- Month/Year navigation buttons
- Selected date highlighted
- "Today", "Clear", "× Close" buttons (may be disabled)

**Save Behavior:**
- Click "Save Shift" to save changes
- Returns to Shifts list after successful save
- No explicit success message shown (list updates immediately)

---

### Deleting a Shift

**Trigger:** Click "Delete" button in Shift Details panel

**Delete Confirmation Dialog:**

| Element | Content |
|---------|---------|
| Icon | Warning/alert icon |
| Title | "Delete log permanently?" |
| Warning | "This may affect your streak and points" |
| Cancel Button | "Keep Log" - Cancels deletion |
| Confirm Button | "Delete" - Permanently deletes shift |

**Delete Behavior:**
1. User clicks "Delete" in Shift Details panel
2. Confirmation dialog appears (modal overlay)
3. If "Keep Log" clicked → Dialog closes, shift preserved
4. If "Delete" clicked → Shift permanently deleted
5. After deletion:
   - Dialog closes
   - Shift Details panel closes
   - Calendar updates immediately (shows "No Shift")
   - Stats update (Total Shifts count decreases)
   - URL changes back to base (e.g., `/index/shifts/weekly`)
   - **No explicit success toast/message** (immediate UI update serves as confirmation)

**Important Notes:**
- Deletion affects streak and XP points (as warned)
- No undo functionality visible
- Deletion is immediate (no server delay noticeable)

---

### Weekly View Shift Card

**Shift cards on calendar days show:**
| Element | Example |
|---------|---------|
| Entry Type | "Day Off", "Worked", "Leave" |
| Notes preview | "Test day off for documentation" |
| Earnings | "Earnings - $442.40" |

**Note:** Even "Day Off" entries show earnings, which may be a display bug or calculated based on missed work value.

---

---

## Verification Status

**Last Verified:** Feb 5, 2026

### Verified Items
- ✅ All 43 job types
- ✅ All subjob options (Tractor Trailer: 4, Head Checker: 13, Labour: 9, First Aid: 3)
- ✅ All 24 locations
- ✅ All 26 stat holidays (2025-2027)
- ✅ Sign In/Sign Up forms and fields
- ✅ Social login (Facebook, Google)
- ✅ Forgot Password flow
- ✅ User menu items (Account, Contact, About Us, Log out)
- ✅ Shift type as button selection (Day, Night, Graveyard)
- ✅ Pay differentials (BASE, CLASS_1-4)
- ✅ Edit/Delete shift flows
- ✅ Delete confirmation dialog
- ✅ WORKED Entry Wizard (3 steps verified)
- ✅ Leave Entry form
- ✅ Stat Holiday Entry form
- ✅ Dashboard gamification widget (Streak, Points, XP)
- ✅ Analytics - Work Insights page
- ✅ Analytics - Journey page
- ✅ Posts page structure (Posts Archive, Read more/less)
- ✅ Feedback page fields (ILWU Local, Comments, Upload, Anonymous toggle)
- ✅ Account page fields (First/Last name, Email, Local, Board, Subscription, Theme)
- ✅ Vacation entry form (Date + Notes only)
- ✅ Standby entry form (Date + Notes only)
- ✅ PAYDIFFS: Tractor Trailer at Centennial = 8 hours (Day shift)
- ✅ PAYDIFFS: Tractor Trailer at Vanterm = 8 hours (Day shift)

### Verified (Quick Tests)
| Item | Status | Finding |
|------|--------|---------|
| 330 PAYDIFFS combinations | ✅ VERIFIED | CSV has exactly 330 data rows |
| PAYDIFFS Night/Graveyard hours | ✅ VERIFIED | Hours DO differ: Day=8, Night=8, Graveyard=6.5 |
| PAYDIFFS with specific subjobs | ✅ VERIFIED | Tested Rail subjob - same hours as no subjob |
| Travel pay | ✅ VERIFIED | Travel Hours (user input) × $53.17/hr |
| Meal pay | ✅ VERIFIED | Fixed 0.50 hours × OT Rate ($83.60) = $41.80 |
| Shift rates differ | ✅ VERIFIED | Day=$55.95, Night=$70.32, Graveyard=$86.70 |

### Cannot Verify (Impractical)
| Item | Status | Notes |
|------|--------|-------|
| XP earning formula | ⚠️ SKIP | Would need to track real shifts over time |
| Points earning formula | ⚠️ SKIP | Would need to track real shifts over time |
| Streak rules | ⚠️ SKIP | Would need to test over multiple days |
| Level 2-4 XP thresholds | ⚠️ SKIP | Would need 200+ XP or source code |
| Premium features | ⚠️ SKIP | Need premium account ($15/mo) |

### Known Issues
| Item | Status | Notes |
|------|--------|-------|
| CSV vs App Hours Mismatch | ⚠️ BUG? | App shows different hours than PAYDIFFS CSV |
| "Day Off" showing earnings | ⚠️ UNCLEAR | Shows earnings value - bug or intentional? |

### Screenshots Captured (This Session)
| # | Filename | Description |
|---|----------|-------------|
| 17 | 17-posts-page.png | Posts Archive page |
| 18 | 18-feedback-page.png | Feedback form page |
| 19 | 19-account-page.png | Account settings page |
| 20 | 20-vacation-entry.png | Vacation entry form |
| 21 | 21-standby-entry.png | Standby entry form |
| 22 | 22-travel-meal-fields.png | Travel and Meal fields expanded |
