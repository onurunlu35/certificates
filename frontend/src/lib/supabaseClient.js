import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sdwhkqwcvouiltdpvkwi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkd2hrcXdjdm91aWx0ZHB2a3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjgyNzksImV4cCI6MjA1MzQwNDI3OX0.F5LAHTExxq8Xws7hxLN8qCgQA4P5Gwr9U7XILMkzN50'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)