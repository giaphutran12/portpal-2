import { createClient } from './client'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(
  email: string,
  password: string,
  metadata: { firstName?: string; lastName?: string; ilwuLocal?: string; board?: string }
) {
  const supabase = createClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        ilwu_local: metadata.ilwuLocal,
        board: metadata.board,
      },
    },
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  })
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  return supabase.auth.updateUser({ password: newPassword })
}

export async function getUser() {
  const supabase = createClient()
  return supabase.auth.getUser()
}

export async function getSession() {
  const supabase = createClient()
  return supabase.auth.getSession()
}

export async function signInWithGoogle() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export async function signInWithFacebook() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}
