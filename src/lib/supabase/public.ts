import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free client for public reads, so visitor pages don't opt into per-request rendering.
// Row-level security still limits it to published photos.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
