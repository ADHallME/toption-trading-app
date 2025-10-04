import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createBrowserClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side client for API routes
export const createClient = () => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
} 