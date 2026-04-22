import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dwkyawthyweanbfcrfrd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3a3lhd3RoeXdlYW5iZmNyZnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzcxMDUsImV4cCI6MjA5MjQxMzEwNX0.6Y-V9mFSMcNy349dRUFUkiHJ_MtqRwoSNI_SojJFGnw'

export const supabase = createClient(supabaseUrl, supabaseKey)
