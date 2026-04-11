import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fslkykyavvtoxnnwubdp.supabase.co'
const supabaseKey = 'sb_publishable_tYVd7N2UrwyP6u1MUIK4YQ_PUD0YKWe'

export const supabase = createClient(supabaseUrl, supabaseKey)
