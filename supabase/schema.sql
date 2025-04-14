-- Create a table for profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  height NUMERIC(5, 2), -- in cm
  weight NUMERIC(5, 2), -- in kg
  date_of_birth DATE
);

-- Create a table for workouts
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in minutes
  calories_burned INTEGER
);

-- Create a table for exercise categories
CREATE TABLE IF NOT EXISTS exercise_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create a table for exercises
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES exercise_categories(id),
  is_default BOOLEAN DEFAULT FALSE -- Indicates if this is a system-defined exercise
);

-- Create a table for workout exercises (junction table)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  sets INTEGER DEFAULT 1,
  reps INTEGER,
  weight NUMERIC(6, 2), -- in kg
  duration INTEGER, -- in seconds, for timed exercises
  distance NUMERIC(6, 2), -- in meters, for distance exercises
  notes TEXT,
  order_position INTEGER NOT NULL -- To maintain the order of exercises in a workout
);

-- Create a table for goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_date DATE,
  goal_type TEXT NOT NULL, -- e.g., 'weight_loss', 'strength', 'endurance', etc.
  target_value NUMERIC(8, 2), -- Numeric value for the goal (e.g., target weight, target reps)
  current_value NUMERIC(8, 2), -- Current progress value
  unit TEXT -- The unit of measurement (e.g., 'kg', 'reps', 'minutes')
);

-- Create a table for body measurements
CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  weight NUMERIC(5, 2), -- in kg
  body_fat_percentage NUMERIC(4, 1),
  chest NUMERIC(5, 2), -- in cm
  waist NUMERIC(5, 2), -- in cm
  hips NUMERIC(5, 2), -- in cm
  biceps NUMERIC(5, 2), -- in cm
  thighs NUMERIC(5, 2), -- in cm
  notes TEXT
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Workouts RLS policies
CREATE POLICY "Users can view their own workouts" 
  ON workouts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
  ON workouts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
  ON workouts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
  ON workouts FOR DELETE 
  USING (auth.uid() = user_id);

-- Exercise categories RLS policies
CREATE POLICY "Everyone can view exercise categories" 
  ON exercise_categories FOR SELECT 
  USING (true);

-- Exercises RLS policies
CREATE POLICY "Everyone can view exercises" 
  ON exercises FOR SELECT 
  USING (true);

CREATE POLICY "Users can create custom exercises" 
  ON exercises FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their custom exercises" 
  ON exercises FOR UPDATE 
  USING (NOT is_default);

-- Workout exercises RLS policies
CREATE POLICY "Users can view their workout exercises" 
  ON workout_exercises FOR SELECT 
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND auth.uid() = workouts.user_id));

CREATE POLICY "Users can create their workout exercises" 
  ON workout_exercises FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND auth.uid() = workouts.user_id));

CREATE POLICY "Users can update their workout exercises" 
  ON workout_exercises FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND auth.uid() = workouts.user_id));

CREATE POLICY "Users can delete their workout exercises" 
  ON workout_exercises FOR DELETE 
  USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND auth.uid() = workouts.user_id));

-- Goals RLS policies
CREATE POLICY "Users can view their own goals" 
  ON goals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
  ON goals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON goals FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON goals FOR DELETE 
  USING (auth.uid() = user_id);

-- Body measurements RLS policies
CREATE POLICY "Users can view their own body measurements" 
  ON body_measurements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own body measurements" 
  ON body_measurements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body measurements" 
  ON body_measurements FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body measurements" 
  ON body_measurements FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default exercise categories
INSERT INTO exercise_categories (name, description) VALUES
  ('Cardio', 'Cardiovascular exercises that improve heart health and endurance'),
  ('Strength', 'Exercises focused on building muscle strength and power'),
  ('Flexibility', 'Exercises that improve joint range of motion and muscle elasticity'),
  ('Balance', 'Exercises that enhance stability and coordination'),
  ('Core', 'Exercises targeting abdominal and back muscles for core stability')
ON CONFLICT (name) DO NOTHING;

-- Insert some default exercises
INSERT INTO exercises (name, description, category_id, is_default) VALUES
  ('Running', 'Running on a treadmill or outdoors', (SELECT id FROM exercise_categories WHERE name = 'Cardio'), TRUE),
  ('Cycling', 'Stationary bike or outdoor cycling', (SELECT id FROM exercise_categories WHERE name = 'Cardio'), TRUE),
  ('Bench Press', 'Barbell or dumbbell chest press lying on a bench', (SELECT id FROM exercise_categories WHERE name = 'Strength'), TRUE),
  ('Squat', 'Lower body compound exercise with barbell or bodyweight', (SELECT id FROM exercise_categories WHERE name = 'Strength'), TRUE),
  ('Deadlift', 'Compound exercise lifting a barbell from the ground', (SELECT id FROM exercise_categories WHERE name = 'Strength'), TRUE),
  ('Yoga', 'Mind-body practice combining physical postures and breathing techniques', (SELECT id FROM exercise_categories WHERE name = 'Flexibility'), TRUE),
  ('Plank', 'Core strengthening isometric exercise', (SELECT id FROM exercise_categories WHERE name = 'Core'), TRUE),
  ('Single Leg Balance', 'Standing on one leg to improve stability', (SELECT id FROM exercise_categories WHERE name = 'Balance'), TRUE)
ON CONFLICT DO NOTHING; 