'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { getSession, signOut } from '@/lib/supabase/auth'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { session, error } = await getSession()
        
        if (error) {
          throw error
        }
        
        console.log('Session data:', session)
        
        if (session) {
          setSession(session)
          setUser(session.user)
        } else {
          console.log('No active session found')
          router.push('/auth')
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [router])

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">No authenticated user found. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold">FitForge</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome to your fitness tracking dashboard.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">User Information</h4>
                    <p className="mt-1 text-sm text-gray-900">Email: {user?.email}</p>
                    <p className="mt-1 text-sm text-gray-900">User ID: {user?.id}</p>
                    {session && (
                      <p className="mt-1 text-sm text-gray-900">
                        Session Valid Until: {new Date(session.expires_at! * 1000).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                My Workouts
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track your fitness journey here.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-center text-gray-500 py-10">
                  No workouts logged yet. Start tracking your fitness journey today!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                My Goals
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Set and track your fitness goals.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-center text-gray-500 py-10">
                  No goals set yet. Create your first fitness goal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 