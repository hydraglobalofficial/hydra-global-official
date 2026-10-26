import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "hero");
fs.mkdirSync(outDir, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="910" viewBox="0 0 1920 910">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1220"/>
      <stop offset="1" stop-color="#02040a"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="910" fill="url(#g)"/>
  <g fill="none" stroke="#C5E0F3" stroke-opacity="0.16" stroke-width="1.2">
    <path d="M80 710 C 380 420, 620 820, 960 510 C 1280 220, 1520 640, 1840 360"/>
    <path d="M60 260 C 420 80, 780 340, 1140 160 C 1480 -20, 1700 280, 1880 120"/>
  </g>
  <text x="140" y="430" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="112" font-weight="700" letter-spacing="10">HYDRA</text>
  <text x="148" y="500" fill="#C5E0F3" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="8">SMART ACCESSORIES</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(path.join(outDir, "banner-21-10.jpg"));
console.log("wrote public/hero/banner-21-10.jpg");
