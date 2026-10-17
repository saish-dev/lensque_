import type { Category } from "@/lib/site";

export type Photo = {
  id: string;
  title: string;
  caption: string;
  category: Category;
  storage_path: string;
  width: number | null;
  height: number | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export function photoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`;
}
