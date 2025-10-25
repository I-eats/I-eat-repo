
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'uhhhhh'
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'uhhhhh'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase