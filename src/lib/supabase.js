import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fslkykyavvtoxnnwubdp.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tYVd7N2UrwyP6u1MUIK4YQ_PUD0YKWe'

export const supabase = createClient(supabaseUrl, supabaseKey)

