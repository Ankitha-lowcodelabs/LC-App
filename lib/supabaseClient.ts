import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykcarggmjxhknwkynryu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2FyZ2dtanhoa253a3lucnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDgyNzcsImV4cCI6MjA0ODc4NDI3N30.q8pYhz3jZ94JdnPwQMg0JYWFvisCN57UGaEpdO8oJB8'

export const supabase = createClient(supabaseUrl, supabaseKey)

