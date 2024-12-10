import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykcarggmjxhknwkynryu.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY2FyZ2dtanhoa253a3lucnl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzIwODI3NywiZXhwIjoyMDQ4Nzg0Mjc3fQ.kKp_TRyAmZhfmrpGn-WWH5yMsir9y_E30uyBL7fV920';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
export default supabase;