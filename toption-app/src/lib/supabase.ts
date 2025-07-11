import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createBrowserClient = () => {
  return createClientComponentClient<Database>()
} 