import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a single instance of the Supabase client to be used on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance with server-specific settings
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  // For server components, we don't want to reuse the instance between requests
  // as each request could be for a different user
  if (typeof window === 'undefined') {
    return createSupabaseClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false
        }
      }
    )
  }

  // On the client side in server components, we can reuse the instance
  if (supabaseInstance) return supabaseInstance
  
  supabaseInstance = createSupabaseClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false
      }
    }
  )
  
  return supabaseInstance
} 