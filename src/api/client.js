/* setting up the supabase client/connection to db */
console.log("Supabase config loaded:", {
  urlPresent: Boolean(import.meta.env.VITE_SUPABASE_URL),
  keyPresent: Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
});

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);