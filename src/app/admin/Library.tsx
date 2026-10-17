"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { photoUrl, type Photo } from "@/lib/photo-shared";
import { CATEGORIES, type Category } from "@/lib/site";
import { createPhotos, deletePhoto, updatePhoto, type PhotoPatch } from "./actions";

type Filter = "All" | Category;

function readSize(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function Library({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const visible = filter === "All" ? photos : photos.filter((p) => p.category === filter);
  const publishedCount = photos.filter((p) => p.published).length;
  const uploadCategory: Category = filter === "All" ? "Portraits" : filter;

  function run(task: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await task();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const supabase = createClient();
    const uploaded = [];
    try {
      let n = 0;
      for (const file of Array.from(files)) {
        n += 1;
        setUploading(`Uploading ${n} of ${files.length}`);
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("photos").upload(path, file, {
          contentType: file.type,
          cacheControl: "31536000",
        });
        if (upErr) throw new Error(upErr.message);
        const size = await readSize(file);
        uploaded.push({
          storage_path: path,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: uploadCategory,
          ...size,
        });
      }
      await createPhotos(uploaded);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <>
      <div className="main-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12, fontSize: 11 }}>Photo library</div>
          <h1 className="display" style={{ fontSize: 52 }}>
            Your <span className="shimmer">frames.</span>
          </h1>
        </div>
        <div className="stats">
          <div><b>{photos.length}</b><span>Photos</span></div>
          <div><b>{publishedCount}</b><span>Published</span></div>
          <div><b>{photos.length - publishedCount}</b><span>Drafts</span></div>
        </div>
      </div>

      <label className="drop" aria-busy={uploading !== null}>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          disabled={uploading !== null}
          onChange={(e) => onFiles(e.target.files)}
        />
        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 17v3h16v-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="drop-title">{uploading ?? "Choose photos to upload"}</span>
        <span className="drop-sub">JPG, PNG or WebP. They arrive as drafts in {uploadCategory}.</span>
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="pill-row filters">
        {(["All", ...CATEGORIES] as Filter[]).map((name) => (
          <button
            key={name}
            type="button"
            className="pill"
            aria-current={filter === name}
            onClick={() => setFilter(name)}
          >
            {name} <span>{name === "All" ? photos.length : photos.filter((p) => p.category === name).length}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty-note">Nothing here yet. Upload a photo above.</p>
      ) : (
        <div className="cards">
          {visible.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i + 1} run={run} />
          ))}
        </div>
      )}
    </>
  );
}

function PhotoCard({
  photo,
  index,
  run,
}: {
  photo: Photo;
  index: number;
  run: (task: () => Promise<void>) => void;
}) {
  const [title, setTitle] = useState(photo.title);
  const patch = (p: PhotoPatch) => run(() => updatePhoto(photo.id, p));
  const nextCategory = CATEGORIES[(CATEGORIES.indexOf(photo.category) + 1) % CATEGORIES.length];

  return (
    <article className="pcard">
      <div className="pcard-img">
        <Image src={photoUrl(photo.storage_path)} alt={photo.title || "Uploaded photograph"} fill sizes="280px" style={{ objectFit: "cover" }} />
        <span className="badge" data-live={photo.published}>{photo.published ? "Published" : "Draft"}</span>
        <span className="no">{String(index).padStart(2, "0")}</span>
      </div>
      <div className="pcard-body">
        <label className="field small">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== photo.title && patch({ title })}
          />
        </label>
        <div className="pcard-actions">
          <button type="button" className="pill" onClick={() => patch({ category: nextCategory })} title={`Move to ${nextCategory}`}>
            {photo.category} &#8635;
          </button>
          <button
            type="button"
            className="pill"
            aria-current={photo.published}
            onClick={() => patch({ published: !photo.published })}
          >
            {photo.published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            className="pill"
            aria-pressed={photo.featured}
            data-on={photo.featured}
            onClick={() => patch({ featured: !photo.featured })}
            title="Show on the home page"
          >
            {photo.featured ? "Featured" : "Feature"}
          </button>
          <button
            type="button"
            className="pill danger"
            aria-label={`Delete ${photo.title || "photo"}`}
            onClick={() => {
              if (window.confirm("Delete this photo for good?")) run(() => deletePhoto(photo.id));
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
