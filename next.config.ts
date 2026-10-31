import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

function r2PublicHostname() {
  const base = process.env.R2_PUBLIC_URL?.trim();
  if (!base) return null;
  try {
    return new URL(base).hostname;
  } catch {
    return null;
  }
}

const r2Host = r2PublicHostname();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  // Tree-shake heavy icon / motion barrels — smaller client JS.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "sweetalert2"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 92, 95],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Product media bucket (Cloudflare R2 / S3).
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      // Custom R2 public domain (from R2_PUBLIC_URL), e.g. media.hydra.com.bd
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
      // ImgBB public hosts (admin paste links).
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "*.ibb.co" },
      { protocol: "https", hostname: "imagebb.com" },
      { protocol: "https", hostname: "*.imagebb.com" },
    ],
  },
  async headers() {
    const headers = [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/products/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];

    // Never pin /_next/static in development — immutable year-long cache keeps stale
    // Turbopack chunks (hero, CSS) after HMR and breaks theme work.
    if (process.env.NODE_ENV === "production") {
      headers.push({
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      });
    }

    return headers;
  },
};

export default nextConfig;
