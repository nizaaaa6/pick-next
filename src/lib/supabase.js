import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kymvmiwrppubvdyrvjmk.supabase.co'
const supabaseKey = 'sb_publishable_usVeQWhlFHenZ2tpNiXa-A_yQF-PBM3'

export const supabase = createClient(supabaseUrl, supabaseKey)
