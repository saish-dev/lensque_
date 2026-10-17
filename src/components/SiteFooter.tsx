import { instagramUrl, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>
          {SITE.name} - {SITE.tagline}
        </span>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
          @{SITE.instagram}
        </a>
      </div>
    </footer>
  );
}
