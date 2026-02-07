import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',                    // Root redirect
    '/index/:path*',        // All app pages under /index
    '/shifts/:path*',       // All shift pages
    '/goals/:path*',        // All goal pages
  ],
}
