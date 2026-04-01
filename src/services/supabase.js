import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://xshsocbfvliozmnymott.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaHNvY2Jmdmxpb3ptbnltb3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTc5NjYsImV4cCI6MjA5MDYzMzk2Nn0.NS2pNK-SxyeYibWbZoXUdz74zuQAGSLpiqZkW6Tdptk'
)
