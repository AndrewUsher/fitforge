import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { login, signup } from './actions'
export default async function AuthPage() {
  const supabaseClient = await createSupabaseServerClient()
  const { data } = await supabaseClient.auth.getUser()

  if (data.user) {
    return redirect('/dashboard')
  }

  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  )
}
