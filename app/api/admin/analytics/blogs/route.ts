import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function formatShortDay(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function startOfDay(d: Date) {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const start = startOfDay(addDays(now, -6));

  const [blogCount, draftCount, readsAgg, recent, trending] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.aggregate({ _sum: { reads: true } }),
    prisma.post.findMany({
      where: { updatedAt: { gte: start } },
      select: { updatedAt: true, reads: true },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ reads: "desc" }, { publishedAt: "desc" }],
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        reads: true,
        category: true,
        publishedAt: true,
      },
    }),
  ]);

  const buckets = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(addDays(start, i));
    return {
      date,
      day: formatShortDay(date),
      posts: 0,
      reads: 0,
    };
  });

  for (const post of recent) {
    const dayStart = startOfDay(post.updatedAt);
    const idx = Math.floor(
      (dayStart.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (idx < 0 || idx >= buckets.length) continue;
    buckets[idx]!.posts += 1;
    buckets[idx]!.reads += post.reads ?? 0;
  }

  return NextResponse.json({
    generatedAt: now.toISOString(),
    stats: {
      blogCount,
      draftCount,
      totalReads: readsAgg._sum.reads ?? 0,
    },
    byDay: buckets.map((b) => ({
      day: b.day,
      posts: b.posts,
      reads: Math.round(b.reads),
    })),
    trending: trending.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      reads: p.reads,
      category: p.category,
      publishedAt: p.publishedAt?.toISOString() ?? null,
    })),
  });
}

