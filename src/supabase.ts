import { createClient } from '@supabase/supabase-js'

// URL de Supabase clave API
const supabaseUrl = 'https://pudkcbiyyhxjjgwaynvb.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGtjYml5eWh4ampnd2F5bnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1ODAzNTgsImV4cCI6MjA0MTE1NjM1OH0.I_GDmzGKfegh6gy2ARnOwZXVDuBWXzTjUxz3P60B6oA'

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
