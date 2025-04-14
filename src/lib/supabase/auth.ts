import { createClient } from './client'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'

// Create a single Supabase client instance
const supabase = createClient()

/**
 * Get the current user session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session: data.session, error: null }
  } catch (error) {
    console.error('Error getting session:', error)
    return { session: null, error }
  }
}

/**
 * Get the current user
 */
export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error getting user:', error)
    return { user: null, error }
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return { data: null, error }
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, redirectTo?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error signing up:', error)
    return { data: null, error }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error }
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  
  return data.subscription
} 