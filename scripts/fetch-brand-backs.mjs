import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "brands");

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
          Referer: "https://www.gsmarena.com/",
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 5) {
          fetchBuf(new URL(res.headers.location, url).href, redirects + 1).then(resolve, reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode || 0, body: Buffer.concat(chunks) }));
      },
    );
    req.on("error", reject);
  });
}

async function download(url, dest) {
  const { status, body } = await fetchBuf(url);
  if (status !== 200) throw new Error(`HTTP ${status}`);
  if (body.length < 25000) throw new Error(`too small (${body.length})`);
  fs.writeFileSync(dest, body);
  return body.length;
}

const CANDIDATES = {
  iphone: [
    "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone18-pro-max-1.jpg",
    "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone18-pro-max-2.jpg",
    "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone18-pro-max-3.jpg",
    "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone18-pro-max-4.jpg",
  ],
  samsung: [
    "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-2.jpg",
    "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-3.jpg",
    "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-4.jpg",
    "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-1.jpg",
    "https://fdn.gsmarena.com/imgroot/reviews/25/samsung-galaxy-s25-ultra/lifestyle/-1024w2/gsmarena_002.jpg",
    "https://fdn.gsmarena.com/imgroot/reviews/25/samsung-galaxy-s25-ultra/lifestyle/-1024w2/gsmarena_003.jpg",
  ],
};

async function pickAndSave(key, filename) {
  const dest = path.join(outDir, filename);
  for (const url of CANDIDATES[key]) {
    try {
      const size = await download(url, dest);
      console.log(`OK ${key}: ${size}b <- ${url}`);
      return url;
    } catch (e) {
      console.warn(`fail ${url}: ${e.message}`);
    }
  }
  throw new Error(`No candidate worked for ${key}`);
}

fs.mkdirSync(outDir, { recursive: true });
await pickAndSave("iphone", "iphone-back.jpg");
await pickAndSave("samsung", "samsung-back.jpg");
console.log("done");
