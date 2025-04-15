import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
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
              <SignOutButton />
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
                    <p className="mt-1 text-sm text-gray-900">Email: {user.email}</p>
                    <p className="mt-1 text-sm text-gray-900">User ID: {user.id}</p>
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