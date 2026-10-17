import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, instagramDmUrl, PORTRAIT, SERIES_COPY, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: 72, alignItems: "stretch" }}>
        <div className="panel" style={{ flex: "1 1 380px", maxWidth: 540, minHeight: 640 }}>
          <Image
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 540px"
            style={{ objectFit: "cover", objectPosition: "50% 20%" }}
          />
        </div>
        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 48 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>The photographer</div>
            <h1 className="display display-xl">
              Saish <span className="shimmer">Naik.</span>
            </h1>
            <p className="display italic display-md" style={{ marginTop: 36, color: "#cfdad7", fontSize: 30 }}>
              I look for the quiet second just before the moment, and the light that makes it worth keeping.
            </p>
          </div>
          <div style={{ maxWidth: 520 }}>
            <p className="lead">Lensque is built on a simple idea: no two frames should say the same thing. I photograph people, celebrations, objects and places, and I let each one set its own mood instead of pressing it into a style.</p>
            <p className="lead" style={{ marginTop: 20 }}>Working together is relaxed and unhurried. We start by talking about how you want the pictures to feel, then I stay out of the way and let things happen. What you get back is honest, softly lit and made to be kept.</p>
          </div>
        </div>
      </section>

      <section className="rule-top rule-bottom tint">
        <div className="wrap section">
          <h2 className="display display-lg" style={{ marginBottom: 48 }}>
            What I <span className="shimmer">shoot</span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {CATEGORIES.map((c, i) => (
              <Link key={c} href={`/work?c=${c}`} className="tile" style={{ flex: "1 1 260px", minWidth: 0, minHeight: 280, padding: 32, border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 18 }}>
                <span className="caps" style={{ color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="display" style={{ fontSize: 36 }}>{c}</span>
                <span style={{ fontSize: 14, lineHeight: 1.75, color: "var(--muted)" }}>{SERIES_COPY[c]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "radial-gradient(50% 80% at 50% 50%, rgba(111,154,154,0.18) 0%, transparent 70%)" }}>
        <div className="wrap section" style={{ textAlign: "center", maxWidth: 1000 }}>
          <p className="display italic" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1 }}>{SITE.tagline}.</p>
          <a href={instagramDmUrl} className="btn" target="_blank" rel="noopener noreferrer" style={{ marginTop: 48 }}>
            Message Saish on Instagram
          </a>
        </div>
      </section>
    </>
  );
}
