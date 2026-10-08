"use client";

import { useId, useRef, useState, useTransition } from "react";
import { Film, GripVertical, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type UploadOk = { url: string };
type UploadErr = { error: string };

async function uploadFile(file: File, folder: string, kind: "image" | "video" = "image"): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  body.set("folder", folder);
  body.set("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as UploadOk & UploadErr;
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Upload failed.");
  }
  return data.url;
}

function parseUrls(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

type MultiProps = {
  id?: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  placeholder?: string;
};

/** Multi-image field: gallery previews + device upload to Cloudflare R2. */
export function ImageUrlsField({
  id: idProp,
  name,
  defaultValue = "",
  folder = "products",
  placeholder,
}: MultiProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const fileRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState(() => parseUrls(defaultValue));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function sync(next: string[]) {
    setUrls(next);
  }

  function removeAt(index: number) {
    sync(urls.filter((_, i) => i !== index));
  }

  function onPick(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);
    startTransition(async () => {
      const added: string[] = [];
      try {
        for (const file of Array.from(files)) {
          added.push(await uploadFile(file, folder));
        }
        sync([...urls, ...added]);
        setMessage(
          added.length === 1
            ? "Uploaded to Cloudflare R2."
            : `Uploaded ${added.length} images to Cloudflare R2.`,
        );
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  function onDropReorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    const next = [...urls];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    sync(next);
  }

  return (
    <div className="space-y-3">
      <textarea
        id={id}
        name={name}
        value={urls.join("\n")}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      />

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {urls.map((url, index) => (
            <li
              key={`${url}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) onDropReorder(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-line bg-surface-2",
                dragIndex === index && "opacity-60",
              )}
            >
              <div className="relative aspect-square bg-black/40">
                <img
                  src={url}
                  alt=""
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0.25";
                  }}
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-100">
                    Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/70 text-zinc-200 opacity-0 transition group-hover:opacity-100 hover:bg-danger/80 hover:text-white"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
                <span className="absolute bottom-2 left-2 grid size-7 place-items-center rounded-md bg-black/50 text-zinc-400 opacity-0 transition group-hover:opacity-100">
                  <GripVertical size={14} />
                </span>
              </div>
              <p className="truncate px-2.5 py-2 font-mono text-[10px] text-subtle" title={url}>
                {url}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface-2/60 px-4 py-10 text-center transition hover:border-accent/40 hover:bg-accent/[0.04]"
        >
          <ImagePlus size={22} className="text-zinc-500" />
          <span className="text-sm text-muted">No images yet — upload from your device</span>
          <span className="text-xs text-subtle">or paste URLs below</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => onPick(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {pending ? "Uploading…" : "Upload from device"}
        </Button>
        <span className="text-xs text-subtle">JPEG · PNG · WebP · AVIF · GIF · max 50MB</span>
      </div>

      <details className="rounded-xl border border-line bg-surface-2/40 px-3 py-2">
        <summary className="cursor-pointer text-xs text-muted">Paste / edit image URLs</summary>
        <textarea
          value={urls.join("\n")}
          onChange={(e) => sync(parseUrls(e.target.value))}
          placeholder={placeholder}
          className="mt-2 min-h-20 w-full rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none"
        />
      </details>

      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}

type SingleProps = {
  id?: string;
  name: string;
  defaultValue?: string;
  folder?: string;
  placeholder?: string;
  required?: boolean;
};

/** Single URL input + local file picker that uploads to Cloudflare R2. */
export function ImageUrlField({
  id: idProp,
  name,
  defaultValue = "",
  folder = "content",
  placeholder,
  required,
}: SingleProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultValue);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onPick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setMessage(null);
    startTransition(async () => {
      try {
        const url = await uploadFile(file, folder);
        if (inputRef.current) {
          inputRef.current.value = url;
          inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        }
        setPreview(url);
        setMessage("Uploaded to Cloudflare R2.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className="font-mono text-xs"
          onChange={(e) => setPreview(e.currentTarget.value)}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          onChange={(e) => onPick(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
          aria-label="Upload image from device"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
        </Button>
      </div>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt=""
            className="h-20 w-20 rounded-xl border border-line object-cover"
            onError={() => setPreview("")}
          />
          <button
            type="button"
            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-line bg-surface text-muted hover:text-danger"
            onClick={() => {
              setPreview("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Clear image"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : null}
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}

/** Video URL (YouTube or R2) + device upload for mp4/webm. */
export function VideoUrlField({
  id: idProp,
  name,
  defaultValue = "",
  folder = "videos",
  placeholder = "https://youtube.com/watch?v=… or upload mp4",
}: SingleProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onPick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setMessage(null);
    startTransition(async () => {
      try {
        const url = await uploadFile(file, folder, "video");
        if (inputRef.current) {
          inputRef.current.value = url;
          inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        }
        setValue(url);
        setMessage("Video uploaded to Cloudflare R2.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="font-mono text-xs"
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="sr-only"
          onChange={(e) => onPick(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0"
          disabled={pending}
          onClick={() => fileRef.current?.click()}
          aria-label="Upload video from device"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Film size={14} />}
        </Button>
      </div>
      {isFile ? (
        <video
          src={value}
          className="max-h-36 w-full max-w-xs rounded-xl border border-line object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      {message ? <p className="text-xs text-muted">{message}</p> : null}
      <p className="text-xs text-subtle">Upload MP4/WebM (max 40MB) or paste a YouTube / R2 URL.</p>
    </div>
  );
}
