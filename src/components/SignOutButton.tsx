'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase/auth'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      
      router.push('/auth')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      Sign out
    </button>
  )
} 