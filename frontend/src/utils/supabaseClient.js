import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzekravlcxjpfeetbsfr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWtyYXZsY3hqcGZlZXRic2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDE1NjIsImV4cCI6MjA2MTA3NzU2Mn0.t1gqnRPUqXQpK62v0dA8Iqu7y8Lm0u_5VWBWHzdeKKY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 