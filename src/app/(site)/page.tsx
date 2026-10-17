import Image from "next/image";
import Link from "next/link";
import { EmptyTile, PhotoTile } from "@/components/PhotoTile";
import { getFeaturedPhotos } from "@/lib/photos";
import { CATEGORIES, instagramDmUrl, PORTRAIT, SERIES_COPY } from "@/lib/site";
import { photoUrl } from "@/lib/photo-shared";
import "./home.css";

export default async function HomePage() {
  const featured = await getFeaturedPhotos(3);
  const [lead, second, third] = featured;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <div>
              <div className="eyebrow">Photography by Saish</div>
              <h1 className="display" style={{ fontSize: "clamp(44px, 6.4vw, 76px)" }}>
                Every frame tells a <span className="shimmer">different story.</span>
              </h1>
              <p className="lead">
                Portraits, events, products and places, gathered as one body of quiet light.
              </p>
            </div>
            <div className="hero-actions">
              <Link href="/work" className="btn">View the work</Link>
              <a href={instagramDmUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                Message on Instagram
              </a>
            </div>
          </div>
          {lead ? (
            <Link href={`/work/${lead.id}`} className="hero-panel panel">
              <Image
                src={photoUrl(lead.storage_path)}
                alt={lead.title || "Featured photograph"}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <span className="meta">
                <span className="t">{lead.title || "Untitled"}</span>
                <span className="hero-arrow" aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ) : (
            <div className="hero-panel panel">
              <span className="glow" />
            </div>
          )}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="display display-lg">Latest frames</h2>
          <Link href="/work" className="link-arrow">All work &rarr;</Link>
        </div>
        <div className="latest">
          {lead ? <PhotoTile photo={lead} height={740} sizes="(max-width: 900px) 100vw, 60vw" /> : <EmptyTile height={740} />}
          <div className="latest-side">
            {second ? <PhotoTile photo={second} height={360} /> : <EmptyTile height={360} />}
            {third ? <PhotoTile photo={third} height={360} /> : <EmptyTile height={360} />}
          </div>
        </div>
      </section>

      <section className="rule-top rule-bottom tint">
        <div className="wrap section">
          <div className="section-head">
            <h2 className="display display-lg">Four ways of seeing</h2>
            <Link href="/work" className="link-arrow">All work &rarr;</Link>
          </div>
          <div className="cards">
            {CATEGORIES.map((c, i) => (
              <Link key={c} href={`/work?c=${c}`} className="card-link tile">
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t" style={{ display: "block" }}>{c}</span>
                  <span className="d" style={{ display: "block" }}>{SERIES_COPY[c]}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="teaser">
          <div className="teaser-photo panel">
            <Image
              src={PORTRAIT.src}
              alt={PORTRAIT.alt}
              fill
              sizes="(max-width: 900px) 100vw, 440px"
              style={{ objectFit: "cover", objectPosition: "50% 20%" }}
            />
          </div>
          <div className="teaser-copy">
            <div className="eyebrow" style={{ marginBottom: 28 }}>The photographer</div>
            <p className="display italic display-lg" style={{ lineHeight: 1.15 }}>
              I look for the quiet second just before the moment, and the light that makes it worth keeping.
            </p>
            <Link href="/about" className="link-arrow" style={{ display: "inline-block", marginTop: 40 }}>
              Meet Saish &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="rule-top cta-band">
        <div className="wrap section">
          <h2 className="display" style={{ fontSize: "clamp(48px, 7vw, 76px)" }}>
            Tell <span className="shimmer">yours.</span>
          </h2>
          <a href={instagramDmUrl} className="btn" target="_blank" rel="noopener noreferrer">
            Message on Instagram
          </a>
        </div>
      </section>
    </>
  );
}
