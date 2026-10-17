import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPhotos } from "@/lib/photos";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { logout } from "./actions";
import { Library } from "./Library";

export default async function AdminPage() {
  if (!supabaseConfigured) {
    return (
      <div className="setup">
        <h1 className="display" style={{ fontSize: 44 }}>Connect Supabase first</h1>
        <p className="lead" style={{ marginTop: 20 }}>
          Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and anon key, then run the
          SQL in <code>supabase/migrations</code>. The README has the full steps.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login");

  const photos = await getAllPhotos();

  return (
    <div className="shell">
      <aside className="side">
        <div>
          <div className="brand" style={{ fontSize: 20 }}>LENSQUE</div>
          <div className="eyebrow" style={{ marginTop: 8, fontSize: 10 }}>Studio admin</div>
          <nav className="side-nav" aria-label="Admin">
            <span aria-current="page">Photo library</span>
          </nav>
        </div>
        <div className="side-foot">
          <Link href="/">View site &rarr;</Link>
          <form action={logout}>
            <button type="submit" className="pill">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="main">
        <Library photos={photos} />
      </main>
    </div>
  );
}
