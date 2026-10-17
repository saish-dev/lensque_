export const CATEGORIES = ["Portraits", "Events", "Product", "Travel"] as const;
export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string | undefined): value is Category {
  return CATEGORIES.includes(value as Category);
}

export const SITE = {
  name: "Lensque",
  tagline: "Every frame tells a different story",
  photographer: "Saish Naik",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "lensque_",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

// Fixed portrait of the photographer, served from /public.
export const PORTRAIT = { src: "/saish-naik.JPG", width: 4000, height: 6000, alt: "Portrait of Saish Naik" };

export const instagramUrl = `https://www.instagram.com/${SITE.instagram}/`;
export const instagramDmUrl = `https://ig.me/m/${SITE.instagram}`;

export const SERIES_COPY: Record<Category, string> = {
  Portraits: "People as they are, held in soft and honest light.",
  Events: "Celebrations and gatherings, caught between the moments.",
  Product: "Objects and gifting, shaped by shadow and detail.",
  Travel: "Places and landscapes, remembered by atmosphere.",
};
