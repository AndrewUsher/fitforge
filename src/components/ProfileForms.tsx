'use client'

import { useState } from 'react'
import { updateProfile, createGoal } from '@/lib/supabase/profile'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Goal } from '@/lib/supabase/types'
import GoalCard from './GoalCard'

const supabase = createClient()

interface ProfileFormsProps {
  initialProfile: Profile | null
  initialGoals: Goal[]
}

export default function ProfileForms({ initialProfile, initialGoals }: ProfileFormsProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [error, setError] = useState<string | null>(null)

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { data, error } = await updateProfile({
        full_name: formData.get('full_name') as string,
        height: Number(formData.get('height')),
        weight: Number(formData.get('weight')),
        date_of_birth: formData.get('date_of_birth') as string,
      })
      
      if (error) throw error
      if (data) setProfile(data as Profile)
      setError(null)
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    }
  }

  const handleGoalCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log({user})
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await createGoal({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        start_date: formData.get('start_date') as string,
        target_date: formData.get('target_date') as string,
        goal_type: formData.get('goal_type') as string,
        target_value: Number(formData.get('target_value')),
        current_value: Number(formData.get('current_value')),
        unit: formData.get('unit') as string,
        completed: false,
        completed_date: null,
        user_id: user.id
      })
      
      if (error) throw error
      if (data) setGoals(prev => [data as Goal, ...prev])
      setError(null)
      e.currentTarget.reset()
    } catch (err) {
      setError('Failed to create goal')
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Profile Update Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              defaultValue={profile?.full_name || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                id="height"
                defaultValue={profile?.height || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                defaultValue={profile?.weight || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              defaultValue={profile?.date_of_birth || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Goals Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Fitness Goals</h2>
        
        {/* Create Goal Form */}
        <form onSubmit={handleGoalCreate} className="space-y-4 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Goal Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
                Target Date
              </label>
              <input
                type="date"
                name="target_date"
                id="target_date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="goal_type" className="block text-sm font-medium text-gray-700">
                Goal Type
              </label>
              <select
                name="goal_type"
                id="goal_type"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                name="unit"
                id="unit"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="reps">Repetitions</option>
                <option value="min">Minutes</option>
                <option value="km">Kilometers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="target_value" className="block text-sm font-medium text-gray-700">
                Target Value
              </label>
              <input
                type="number"
                name="target_value"
                id="target_value"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="current_value" className="block text-sm font-medium text-gray-700">
                Current Value
              </label>
              <input
                type="number"
                name="current_value"
                id="current_value"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Goal
          </button>
        </form>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  )
} 