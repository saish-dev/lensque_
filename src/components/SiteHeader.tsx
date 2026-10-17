"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { instagramDmUrl } from "@/lib/site";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">LENSQUE</Link>
        <nav className="nav" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href || pathname.startsWith(l.href + "/") ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <a className="enquire" href={instagramDmUrl} target="_blank" rel="noopener noreferrer">
            Enquire
          </a>
        </nav>
      </div>
    </header>
  );
}
