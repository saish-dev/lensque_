import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Photo } from "@/lib/photo-shared";
import type { Category } from "@/lib/site";

export { photoUrl, type Photo } from "@/lib/photo-shared";

const ORDER = [
  { column: "sort_order", ascending: true },
  { column: "created_at", ascending: false },
] as const;

// Public reads. RLS only returns published rows to visitors; if Supabase isn't
// configured yet the site renders with empty states instead of crashing.
export const getPublishedPhotos = cache(async (category?: Category): Promise<Photo[]> => {
  if (!supabaseConfigured) return [];
  const supabase = createPublicClient();
  let query = supabase.from("photos").select("*").eq("published", true);
  if (category) query = query.eq("category", category);
  for (const o of ORDER) query = query.order(o.column, { ascending: o.ascending });
  const { data } = await query;
  return (data as Photo[]) ?? [];
});

export const getPhoto = cache(async (id: string): Promise<Photo | null> => {
  if (!supabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data } = await supabase.from("photos").select("*").eq("id", id).eq("published", true).maybeSingle();
  return (data as Photo) ?? null;
});

export async function getFeaturedPhotos(limit = 3): Promise<Photo[]> {
  const all = await getPublishedPhotos();
  const featured = all.filter((p) => p.featured);
  return (featured.length >= limit ? featured : all).slice(0, limit);
}

// Admin read: every row, including drafts (RLS allows this for admins only).
export async function getAllPhotos(): Promise<Photo[]> {
  if (!supabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data as Photo[]) ?? [];
}
