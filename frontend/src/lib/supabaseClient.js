// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwecdhrtojagygcnyxch.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZWNkaHJ0b2phZ3lnY255eGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDAyMjIsImV4cCI6MjA2Mjk3NjIyMn0.rIiIdbCtc5Q80gnaJL_uUYsqPx4GIUfuSI-PY7-DuA0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
