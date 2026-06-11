import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export async function getSupabaseSession() {
  if (!supabase) return null

  const { data, error } = await supabase.auth.getSession()
  if (error) return null

  return data.session
}

export async function signInToSupabase(email, password) {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  return data.session
}

export async function signOutFromSupabase() {
  if (!supabase) return
  await supabase.auth.signOut()
}
