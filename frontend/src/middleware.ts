import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// We'll disable this middleware for now as it's causing issues
// Instead of redirecting, we'll handle the decoding in the profile page component
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/p/:path*'],
} 