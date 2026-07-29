/**
 * Browser Supabase client for Client Components.
 * Prefer importing from `@/lib/supabase/client` in new code.
 * Uses `@supabase/ssr` so the session is stored in cookies (RLS-compatible).
 */
export { createClient } from "@/lib/supabase/client";
export { createClient as createBrowserClient } from "@/lib/supabase/client";
