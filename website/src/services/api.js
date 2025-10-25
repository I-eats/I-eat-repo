import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://hgcrwdhzrrghkvcyokhj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY3J3ZGh6cnJnaGt2Y3lva2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjg0MTAsImV4cCI6MjA3NjkwNDQxMH0.ySXLHYgI_3gA0WG-BYQxO79JVOP1-YB7FsLonJrPpGA'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
