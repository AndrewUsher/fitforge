import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Use a dedicated client instance for middleware
// This avoids creating a new client on every request and eliminates warning
let middlewareSupabase: ReturnType<typeof createSupabaseClient> | null = null

// Initialize the middleware Supabase client only once
const getMiddlewareClient = () => {
  if (middlewareSupabase) return middlewareSupabase
  
  middlewareSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
  
  return middlewareSupabase
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = getMiddlewareClient()
  
  // Check for session cookie
  const supabaseAccessToken = request.cookies.get('sb-access-token')?.value
  const supabaseRefreshToken = request.cookies.get('sb-refresh-token')?.value
  
  let session = await supabase.auth.getSession()
  
  if (!(await session).data.session && supabaseAccessToken && supabaseRefreshToken) {
    
    
    const { data, error } = await supabase.auth.setSession({
      access_token: supabaseAccessToken,
      refresh_token: supabaseRefreshToken
    })
    
    if (!error) {
      session = data.session
    }
  }

  // If no session and requesting a protected route, redirect to auth
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If session exists and trying to go to auth page, redirect to dashboard
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
} 