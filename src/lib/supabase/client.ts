import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a single instance of the Supabase client to be used throughout the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance with browser-specific settings
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance
  
  supabaseInstance = createSupabaseClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        storageKey: 'sb-auth',
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
  
  return supabaseInstance
} 