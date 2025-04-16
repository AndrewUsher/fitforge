import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import {
  HomeIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { getUserProfile } from "@/lib/supabase/profile";
import GoalCard from "@/components/GoalCard";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const { goals } = await getUserProfile(supabase);
  console.log({ user });

  if (error || !user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-indigo-600">FitForge</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-5 sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-semibold text-white">
                    Welcome Back!
                  </h3>
                  <p className="mt-1 text-sm text-indigo-100">
                    Track your progress and achieve your fitness goals.
                  </p>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-sm font-medium text-indigo-100">
                      User Information
                    </h4>
                    <p className="mt-1 text-sm text-white">
                      Email: {user.email}
                    </p>
                    <p className="mt-1 text-sm text-white/80">ID: {user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      My Workouts
                    </h3>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-1" />
                    Add Workout
                  </button>
                </div>
              </div>
              <div className="px-4 py-12 sm:px-6 text-center">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No workouts logged yet</p>
                <p className="mt-2 text-sm text-gray-400">
                  Start tracking your fitness journey today!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FlagIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      My Goals
                    </h3>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-1" />
                    Set Goal
                  </button>
                </div>
              </div>
              <div className="px-4 py-12 sm:px-6 text-center">
                {goals?.length === 0 && (
                  <>
                    <FlagIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">No goals set yet</p>
                    <p className="mt-2 text-sm text-gray-400">
                      Create your first fitness goal to get started!
                    </p>
                  </>
                )}
                {goals?.length
                  ? goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
                  : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
