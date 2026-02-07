import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',                    // Root redirect
    '/home/:path*',         // All home pages
    '/analytics/:path*',    // All analytics pages
    '/shifts/:path*',       // All shift pages
    '/goals/:path*',        // All goal pages
  ],
}
