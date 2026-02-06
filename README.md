# PortPal

A modern shift tracking application built for ILWU longshoremen. PortPal enables workers to log various types of shifts, track earnings, monitor goals, and access comprehensive analytics—all from a mobile-first progressive web app.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## Features

- **6 Entry Types:** Log different shift categories (worked, standby, dispatch, casual, training, other)
- **Dashboard:** Real-time overview of shifts, earnings, and activity
- **Analytics:** Detailed insights into shift patterns and earnings trends
- **Goals:** Set and track personal earning and shift goals
- **PWA:** Progressive Web App with offline support and installability
- **Mobile-First:** Optimized for mobile devices with responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/giaphutran12/portpal-2.git
cd portpal-2/portpal-2-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (see Environment Variables section below)

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Workflow

The app uses Supabase for backend services. To work with the database:

1. Ensure Supabase CLI is installed: `npm install -g supabase`
2. Link your Supabase project: `supabase link --project-ref <project-id>`
3. Create migrations for schema changes: `supabase migration new <migration_name>`
4. Apply migrations: `supabase db push`

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

**Variable Descriptions:**

| Variable | Description | Visibility |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Public (client-side) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key for client auth | Public (client-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key for server-side operations | Secret (server-only) |

**Note:** Do not commit `.env.local` to version control. Use `.env.example` as a template for team members.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run migrate` | Apply Supabase migrations |

## Project Structure

```
portpal-2-next/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Main app pages
│   ├── api/                       # API routes
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── [feature]/                # Feature-specific components
├── lib/
│   ├── supabase.ts              # Supabase client setup
│   └── utils.ts                 # Utility functions
├── styles/                       # Global styles
├── public/                       # Static assets
├── supabase/
│   └── migrations/              # Database migrations
├── .env.local                   # Environment variables (not committed)
├── .env.example                 # Environment template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Database

PortPal uses Supabase (PostgreSQL) for data persistence. The database includes:

- **users:** User accounts and profiles
- **shifts:** Shift entries with type, date, duration, and earnings
- **goals:** User-defined earning and shift goals
- **jobs:** Reference data for job types
- **locations:** Reference data for work locations

### Migrations

All database schema changes must be managed through Supabase migrations:

```bash
# Create a new migration
supabase migration new add_new_column

# Apply migrations
supabase db push
```

### Data Limits

Supabase enforces a 1000-row limit per query. When fetching large datasets (e.g., all shifts), implement pagination:

```typescript
async function fetchAllShifts() {
  const PAGE_SIZE = 1000
  let allData = []
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

## Testing

Test credentials for development:

| Field | Value |
|-------|-------|
| Email | `test@portpal.dev` |
| Password | `testpassword123` |

## Deployment

PortPal is designed for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy

For detailed deployment instructions, see [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

When contributing to PortPal:

1. Create a feature branch from `main`
2. Make your changes and test thoroughly
3. Ensure TypeScript types are correct
4. Submit a pull request with a clear description

## License

This project is proprietary and confidential.

## Support

For issues, questions, or feature requests, contact the development team.
