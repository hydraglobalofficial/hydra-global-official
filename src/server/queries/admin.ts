import "server-only";
import { db } from "@/lib/db";
import {
  adminCached,
  adminCacheInvalidate,
  adminCacheSet,
  getAdminCacheStatus,
  type AdminCacheStatus,
} from "@/lib/admin-cache";

export type AdminNavBadges = {
  pendingOrders: number;
  newInquiries: number;
  pendingReviews: number;
};

const TTL = {
  badges: 180,
  overview: 120,
  contentIndex: 90,
} as const;

async function loadAdminNavBadges(): Promise<AdminNavBadges> {
  const [pendingOrders, newInquiries, pendingReviews] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.inquiry.count({ where: { status: "NEW" } }),
    db.review.count({ where: { status: "PENDING" } }),
  ]);
  return { pendingOrders, newInquiries, pendingReviews };
}

/** Badge counts for the admin shell — Redis tagged `nav`. */
export async function getAdminNavBadges() {
  const { value } = await adminCached("badges", TTL.badges, ["nav"], loadAdminNavBadges);
  return value;
}

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export type AdminOverview = {
  badges: AdminNavBadges;
  revenueTotal: number;
  orders30: number;
  lowStock: { id: string; name: string; stock: number }[];
  recentOrders: {
    id: string;
    number: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  recentInquiries: {
    id: string;
    name: string;
    type: string;
    message: string;
    createdAt: string;
  }[];
  cache: {
    hit: boolean;
    backend: "redis" | "memory";
    cachedAt: string;
    status: AdminCacheStatus;
  };
};

async function loadAdminOverview(): Promise<Omit<AdminOverview, "cache">> {
  const since = daysAgo(30);
  const [badges, revenue, orders30, lowStock, recentOrders, recentInquiries] = await Promise.all([
    loadAdminNavBadges(),
    // Revenue counts only confirmed+ orders (not PENDING / CANCELLED / RETURNED).
    db.order.aggregate({
      where: {
        createdAt: { gte: since },
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
      _sum: { total: true },
    }),
    db.order.count({ where: { createdAt: { gte: since } } }),
    db.product.findMany({
      where: { status: "ACTIVE", stock: { lt: 15 } },
      select: { id: true, name: true, stock: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, number: true, customerName: true, total: true, status: true, createdAt: true },
    }),
    db.inquiry.findMany({
      where: { status: "NEW" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, type: true, message: true, createdAt: true },
    }),
  ]);

  // Keep shell badges warm with the same snapshot.
  await adminCacheSet("badges", badges, TTL.badges, ["nav"]);

  return {
    badges,
    revenueTotal: revenue._sum.total ?? 0,
    orders30,
    lowStock,
    recentOrders: recentOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    })),
    recentInquiries: recentInquiries.map((i) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
    })),
  };
}

/** Overview dashboard — Redis tagged `dashboard` (+ warms `nav`). */
export async function getAdminOverview(): Promise<AdminOverview> {
  const result = await adminCached("overview", TTL.overview, ["dashboard", "nav"], loadAdminOverview);
  return {
    ...result.value,
    cache: {
      hit: result.hit,
      backend: result.backend,
      cachedAt: result.cachedAt,
      status: getAdminCacheStatus(),
    },
  };
}

export type AdminContentIndex = {
  announcements: {
    id: string;
    message: string;
    href: string | null;
    position: number;
    active: boolean;
  }[];
  pages: { slug: string; title: string; updatedAt: Date }[];
  sections: { key: string; updatedAt: Date }[];
};

async function loadAdminContentIndex(): Promise<AdminContentIndex> {
  const [announcements, pages, sections] = await Promise.all([
    db.announcement.findMany({
      orderBy: { position: "asc" },
      select: { id: true, message: true, href: true, position: true, active: true },
    }),
    db.page.findMany({ orderBy: { slug: "asc" }, select: { slug: true, title: true, updatedAt: true } }),
    db.siteSection.findMany({ select: { key: true, updatedAt: true } }),
  ]);
  return { announcements, pages, sections };
}

/** Content hub lists — Redis tagged `dashboard`. */
export async function getAdminContentIndex() {
  const { value } = await adminCached("content-index", TTL.contentIndex, ["dashboard"], loadAdminContentIndex);
  return value;
}

/** Call after orders / inquiries / reviews change. */
export async function invalidateAdminCache(scope: "nav" | "dashboard" | "all" = "all") {
  if (scope === "all") {
    await adminCacheInvalidate("all");
    return;
  }
  if (scope === "nav") {
    await adminCacheInvalidate(["nav"]);
    return;
  }
  await adminCacheInvalidate(["nav", "dashboard"]);
}

export { getAdminCacheStatus };
