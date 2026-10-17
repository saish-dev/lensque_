import Image from "next/image";
import Link from "next/link";
import { photoUrl, type Photo } from "@/lib/photos";

type Props = {
  photo: Photo;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

export function PhotoTile({ photo, height = 420, sizes = "(max-width: 700px) 100vw, 33vw", priority }: Props) {
  return (
    <Link href={`/work/${photo.id}`} className="tile" style={{ height }}>
      <Image
        src={photoUrl(photo.storage_path)}
        alt={photo.title || `${photo.category} photograph`}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
      <span className="tile-label">
        <span>
          <span className="tile-title" style={{ display: "block" }}>{photo.title || "Untitled"}</span>
          <span className="tile-cat" style={{ display: "block" }}>{photo.category}</span>
        </span>
      </span>
    </Link>
  );
}

export function EmptyTile({ height = 420 }: { height?: number }) {
  return <div className="tile tile-empty" style={{ height }} aria-hidden="true" />;
}
