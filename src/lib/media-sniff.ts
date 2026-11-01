export type SniffedMedia = {
  kind: "image" | "video";
  contentType: string;
};

function ascii(buf: Buffer, start: number, end: number) {
  return buf.subarray(start, end).toString("ascii");
}

/** Identify an image or video from its leading bytes. The browser's Content-Type is not trusted. */
export function sniffMedia(body: Buffer): SniffedMedia | null {
  if (body.length >= 3 && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) {
    return { kind: "image", contentType: "image/jpeg" };
  }
  if (
    body.length >= 8 &&
    body[0] === 0x89 &&
    body[1] === 0x50 &&
    body[2] === 0x4e &&
    body[3] === 0x47 &&
    body[4] === 0x0d &&
    body[5] === 0x0a &&
    body[6] === 0x1a &&
    body[7] === 0x0a
  ) {
    return { kind: "image", contentType: "image/png" };
  }
  if (body.length >= 12 && ascii(body, 0, 4) === "RIFF" && ascii(body, 8, 12) === "WEBP") {
    return { kind: "image", contentType: "image/webp" };
  }
  if (body.length >= 6 && (ascii(body, 0, 6) === "GIF87a" || ascii(body, 0, 6) === "GIF89a")) {
    return { kind: "image", contentType: "image/gif" };
  }
  if (body.length >= 4 && body[0] === 0x1a && body[1] === 0x45 && body[2] === 0xdf && body[3] === 0xa3) {
    return { kind: "video", contentType: "video/webm" };
  }
  if (body.length >= 12 && ascii(body, 4, 8) === "ftyp") {
    const brand = ascii(body, 8, 12);
    if (brand === "avif" || brand === "avis") return { kind: "image", contentType: "image/avif" };
    if (brand === "qt  ") return { kind: "video", contentType: "video/quicktime" };
    return { kind: "video", contentType: "video/mp4" };
  }
  return null;
}
