import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from './client'
import type { Profile, Goal } from './types'

const supabase = createClient()

/**
 * Update user profile information
 */
export async function updateProfile(profileData: Partial<Profile>) {
  try {
    const { data: { user } } =  await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { data: null, error }
  }
}

/**
 * Create a new fitness goal
 */
export async function createGoal(goalData: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('goals')
      .insert({
        ...goalData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating goal:', error)
    return { data: null, error }
  }
}

/**
 * Update an existing fitness goal
 */
export async function updateGoal(goalId: string, goalData: Partial<Goal>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('goals')
      .update({
        ...goalData,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating goal:', error)
    return { data: null, error }
  }
}

/**
 * Get user's profile and goals
 */
export async function getUserProfile(client?: SupabaseClient) {
    const serverOrClientSupabase = client || supabase
  try {
    const { data: { user } } = await serverOrClientSupabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const [profileResponse, goalsResponse] = await Promise.all([
      serverOrClientSupabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      serverOrClientSupabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ])

    if (profileResponse.error) throw profileResponse.error
    if (goalsResponse.error) throw goalsResponse.error

    return {
      profile: profileResponse.data,
      goals: goalsResponse.data,
      error: null
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { profile: null, goals: null, error }
  }
} 