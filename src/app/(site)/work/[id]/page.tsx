import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoTile } from "@/components/PhotoTile";
import { getPhoto, getPublishedPhotos, photoUrl } from "@/lib/photos";
import { instagramDmUrl } from "@/lib/site";
import "../work.css";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhoto(id);
  return { title: photo?.title || "Frame" };
}

export default async function FramePage({ params }: Props) {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo) notFound();

  const all = await getPublishedPhotos();
  const index = all.findIndex((p) => p.id === photo.id);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;
  const more = all.filter((p) => p.category === photo.category && p.id !== photo.id).slice(0, 4);

  return (
    <>
      <div className="wrap crumbs caps">
        <span>
          <Link href="/work">Work</Link> &nbsp;/&nbsp;{" "}
          <Link href={`/work?c=${photo.category}`}>{photo.category}</Link> &nbsp;/&nbsp;{" "}
          <span style={{ color: "#a9bcb9" }}>{photo.title || "Untitled"}</span>
        </span>
        <span>
          {prev ? <Link href={`/work/${prev.id}`}>&larr; Prev</Link> : <span>&larr; Prev</span>}
          &nbsp;&nbsp; {index + 1} / {all.length} &nbsp;&nbsp;
          {next ? <Link href={`/work/${next.id}`}>Next &rarr;</Link> : <span>Next &rarr;</span>}
        </span>
      </div>

      <section className="wrap detail">
        <div className="detail-photo">
          <Image
            src={photoUrl(photo.storage_path)}
            alt={photo.title || `${photo.category} photograph`}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 66vw"
          />
        </div>
        <div className="detail-info">
          <div className="eyebrow" style={{ marginBottom: 24 }}>{photo.category}</div>
          <h1 className="display display-lg">{photo.title || "Untitled"}</h1>
          {photo.caption && <p className="lead" style={{ marginTop: 28 }}>{photo.caption}</p>}
          <dl className="facts">
            <dt>Series</dt>
            <dd>{photo.category}</dd>
            <dt>Added</dt>
            <dd>{new Date(photo.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</dd>
          </dl>
          <div className="stack">
            <a href={instagramDmUrl} className="btn" target="_blank" rel="noopener noreferrer">
              Enquire on Instagram
            </a>
            <Link href="/work" className="btn btn-ghost">Back to all work</Link>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="rule-top tint">
          <div className="wrap section">
            <div className="section-head">
              <h2 className="display display-lg">
                More from <span className="shimmer">{photo.category}</span>
              </h2>
              <Link href={`/work?c=${photo.category}`} className="link-arrow">View all &rarr;</Link>
            </div>
            <div className="more">
              {more.map((p) => <PhotoTile key={p.id} photo={p} height={380} sizes="(max-width: 700px) 100vw, 25vw" />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
