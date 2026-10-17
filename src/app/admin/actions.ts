"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isCategory, type Category } from "@/lib/site";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Those details didn't match." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) throw new Error("Not authorised");
  return supabase;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export type NewPhoto = {
  storage_path: string;
  title: string;
  category: Category;
  width: number | null;
  height: number | null;
};

export async function createPhotos(items: NewPhoto[]) {
  const supabase = await requireAdmin();
  const rows = items
    .filter((i) => i.storage_path && isCategory(i.category))
    .map((i) => ({
      storage_path: i.storage_path,
      title: i.title.slice(0, 120),
      category: i.category,
      width: i.width,
      height: i.height,
      published: false,
    }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("photos").insert(rows);
  if (error) throw new Error(error.message);
  refreshSite();
}

export type PhotoPatch = Partial<{
  title: string;
  caption: string;
  category: Category;
  published: boolean;
  featured: boolean;
}>;

export async function updatePhoto(id: string, patch: PhotoPatch) {
  const supabase = await requireAdmin();
  const clean: PhotoPatch = {};
  if (patch.title !== undefined) clean.title = patch.title.slice(0, 120);
  if (patch.caption !== undefined) clean.caption = patch.caption.slice(0, 600);
  if (patch.category !== undefined && isCategory(patch.category)) clean.category = patch.category;
  if (patch.published !== undefined) clean.published = patch.published;
  if (patch.featured !== undefined) clean.featured = patch.featured;

  const { error } = await supabase.from("photos").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
}

export async function deletePhoto(id: string) {
  const supabase = await requireAdmin();
  const { data: row } = await supabase.from("photos").select("storage_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (row?.storage_path) await supabase.storage.from("photos").remove([row.storage_path]);
  refreshSite();
}
