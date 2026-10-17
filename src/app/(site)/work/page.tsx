import type { Metadata } from "next";
import Link from "next/link";
import { EmptyTile, PhotoTile } from "@/components/PhotoTile";
import { getPublishedPhotos } from "@/lib/photos";
import { CATEGORIES, instagramDmUrl, isCategory } from "@/lib/site";
import "./work.css";

export const metadata: Metadata = { title: "Work" };

const HEIGHTS = [440, 340, 400, 520, 360, 460];

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const category = isCategory(c) ? c : undefined;

  const all = await getPublishedPhotos();
  const photos = category ? all.filter((p) => p.category === category) : all;
  const count = (name: string) => all.filter((p) => p.category === name).length;

  return (
    <>
      <section className="wrap page-head">
        <div className="eyebrow">Portfolio</div>
        <div className="row">
          <h1 className="display display-xl">
            All <span className="shimmer">work.</span>
          </h1>
          <nav className="pill-row" aria-label="Filter by category">
            <Link href="/work" className="pill" aria-current={!category}>
              All <span>{all.length}</span>
            </Link>
            {CATEGORIES.map((name) => (
              <Link key={name} href={`/work?c=${name}`} className="pill" aria-current={category === name}>
                {name} <span>{count(name)}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="wrap">
        {photos.length > 0 ? (
          <>
            <div className="grid">
              {photos.map((p, i) => (
                <PhotoTile key={p.id} photo={p} height={HEIGHTS[i % HEIGHTS.length]} priority={i < 3} />
              ))}
            </div>
            <div className="grid-count caps">Showing {photos.length} frames</div>
          </>
        ) : (
          <div className="grid">
            {HEIGHTS.slice(0, 6).map((h, i) => <EmptyTile key={i} height={h} />)}
          </div>
        )}
        {photos.length === 0 && (
          <p className="empty-note" style={{ paddingTop: 0 }}>
            {category ? `No ${category.toLowerCase()} frames yet.` : "New frames are on their way."}
          </p>
        )}
      </section>

      <section className="rule-top">
        <div className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", alignItems: "center" }}>
          <span className="display italic display-md">Like what you see?</span>
          <a href={instagramDmUrl} className="btn" target="_blank" rel="noopener noreferrer">
            Message on Instagram
          </a>
        </div>
      </section>
    </>
  );
}
