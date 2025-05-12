import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Handle profile paths to ensure proper encoding of usernames
  if (url.pathname.startsWith('/p/')) {
    const path = url.pathname
    
    // Check if the path has spaces that need encoding
    if (path.includes(' ')) {
      // Properly encode the username part
      const basePath = '/p/'
      const username = path.slice(basePath.length)
      const encodedUsername = encodeURIComponent(username)
      
      // Create a new properly encoded URL
      const newPath = `${basePath}${encodedUsername}`
      url.pathname = newPath
      
      // Redirect to the properly encoded URL
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/p/:path*'],
} 