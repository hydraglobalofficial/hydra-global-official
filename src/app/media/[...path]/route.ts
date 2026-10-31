import { Readable } from "node:stream";
import { NextResponse, type NextRequest } from "next/server";
import { openLocalMedia, resolveLocalMedia } from "@/lib/local-media";
import { storageDriver } from "@/lib/storage";

export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ path: string[] }> };

function parseRange(header: string | null, size: number) {
  if (!header) return null;
  const match = header.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) return null;
  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= size) {
    return null;
  }
  return { start, end: Math.min(end, size - 1) };
}

async function serve(request: NextRequest, ctx: RouteCtx, method: "GET" | "HEAD") {
  if (storageDriver() !== "local") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { path: segments } = await ctx.params;
  const file = await resolveLocalMedia(segments);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": file.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "Last-Modified": file.mtime.toUTCString(),
  });

  const range = parseRange(request.headers.get("range"), file.size);
  if (range) {
    const chunk = range.end - range.start + 1;
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${file.size}`);
    headers.set("Content-Length", String(chunk));
    if (method === "HEAD") {
      return new NextResponse(null, { status: 206, headers });
    }
    const stream = Readable.toWeb(openLocalMedia(file.abs, range.start, range.end)) as ReadableStream;
    return new NextResponse(stream, { status: 206, headers });
  }

  headers.set("Content-Length", String(file.size));
  if (method === "HEAD") {
    return new NextResponse(null, { status: 200, headers });
  }
  const stream = Readable.toWeb(openLocalMedia(file.abs)) as ReadableStream;
  return new NextResponse(stream, { status: 200, headers });
}

export function GET(request: NextRequest, ctx: RouteCtx) {
  return serve(request, ctx, "GET");
}

export function HEAD(request: NextRequest, ctx: RouteCtx) {
  return serve(request, ctx, "HEAD");
}
