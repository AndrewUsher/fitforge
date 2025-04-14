export type Profile = {
  id: string
  created_at: string
  updated_at: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  height: number | null
  weight: number | null
  date_of_birth: string | null
}

export type Workout = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  name: string
  notes: string | null
  date: string
  duration: number | null
  calories_burned: number | null
}

export type ExerciseCategory = {
  id: string
  created_at: string
  name: string
  description: string | null
}

export type Exercise = {
  id: string
  created_at: string
  name: string
  description: string | null
  category_id: string | null
  is_default: boolean
}

export type WorkoutExercise = {
  id: string
  created_at: string
  workout_id: string
  exercise_id: string
  sets: number
  reps: number | null
  weight: number | null
  duration: number | null
  distance: number | null
  notes: string | null
  order_position: number
}

export type Goal = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  title: string
  description: string | null
  start_date: string
  target_date: string | null
  completed: boolean
  completed_date: string | null
  goal_type: string
  target_value: number | null
  current_value: number | null
  unit: string | null
}

export type BodyMeasurement = {
  id: string
  created_at: string
  user_id: string
  date: string
  weight: number | null
  body_fat_percentage: number | null
  chest: number | null
  waist: number | null
  hips: number | null
  biceps: number | null
  thighs: number | null
  notes: string | null
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      workouts: {
        Row: Workout
        Insert: Omit<Workout, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Workout, 'id' | 'created_at' | 'updated_at'>>
      }
      exercise_categories: {
        Row: ExerciseCategory
        Insert: Omit<ExerciseCategory, 'id' | 'created_at'>
        Update: Partial<Omit<ExerciseCategory, 'id' | 'created_at'>>
      }
      exercises: {
        Row: Exercise
        Insert: Omit<Exercise, 'id' | 'created_at'>
        Update: Partial<Omit<Exercise, 'id' | 'created_at'>>
      }
      workout_exercises: {
        Row: WorkoutExercise
        Insert: Omit<WorkoutExercise, 'id' | 'created_at'>
        Update: Partial<Omit<WorkoutExercise, 'id' | 'created_at'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at'>>
      }
      body_measurements: {
        Row: BodyMeasurement
        Insert: Omit<BodyMeasurement, 'id' | 'created_at'>
        Update: Partial<Omit<BodyMeasurement, 'id' | 'created_at'>>
      }
    }
  }
} 