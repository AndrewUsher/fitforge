# FitForge

FitForge is a fitness tracking application built with Next.js and Supabase. It allows users to track workouts, set fitness goals, and monitor their progress over time.

## Features

- **User Authentication**: Secure email/password authentication
- **Workout Tracking**: Log and track your workouts, exercises, sets, reps, and weights
- **Goal Setting**: Set and track fitness goals
- **Body Measurements**: Record and visualize body measurements over time
- **Exercise Library**: Access a library of exercises or create custom ones

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [https://app.supabase.io/](https://app.supabase.io/)
2. After creating the project, go to the SQL Editor in the Supabase Dashboard
3. Run the SQL script in `supabase/schema.sql` to set up the database schema
4. Go to Authentication settings and configure email provider
5. Get the Supabase URL and anon key from the project settings (API section)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/andrewusher/fitforge.git
   cd fitforge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The Supabase backend includes the following tables:

- **profiles**: User profiles linked to authentication
- **workouts**: Records of workout sessions
- **exercise_categories**: Categories for organizing exercises
- **exercises**: Library of exercises
- **workout_exercises**: Junction table linking workouts and exercises
- **goals**: User fitness goals
- **body_measurements**: User body measurements over time

## Authentication Flow

1. Users sign up with email and password
2. Email verification is sent to confirm the account
3. Upon successful verification, users can log in
4. Authentication state is managed via Supabase Auth

## Row Level Security (RLS)

The database is secured with Row Level Security policies ensuring that:

- Users can only view and modify their own data
- Some data like exercise categories are publicly viewable
- Default exercises are protected from modification

## License

[MIT](LICENSE)

## Contributors

- [Andrew Usher](https://github.com/andrewusher)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
