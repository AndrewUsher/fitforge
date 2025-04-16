import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/supabase/profile'
import ProfileForms from './ProfileForms'
import type { Profile, Goal } from '@/lib/supabase/types'

export default async function ProfileSettings() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return <div className="text-center py-10">Please sign in to view your profile.</div>
  }

  const { profile, goals, error } = await getUserProfile(supabase)

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load profile data
      </div>
    )
  }

  return <ProfileForms initialProfile={profile as Profile | null} initialGoals={goals as Goal[]} />
} 