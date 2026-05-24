import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Range = "today" | "7d" | "30d" | "all";

function parseRange(input: string | null): Range {
  if (input === "today" || input === "30d" || input === "all") return input;
  return "7d";
}

function startOfUtcDay(now: Date) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rangeStartDate(range: Range, today: Date): Date | null {
  if (range === "today") return today;
  if (range === "7d") return addDays(today, -6);
  if (range === "30d") return addDays(today, -29);
  return null;
}

type DistinctVisitorRow = { day: Date; ipHash: string; country: string };

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const range = parseRange(url.searchParams.get("range"));

  const today = startOfUtcDay(new Date());
  const start = rangeStartDate(range, today);

  const whereDay = start ? { day: { gte: start } } : {};

  const [visitorRows, viewsTotal] = await Promise.all([
    prisma.pageView.findMany({
      where: whereDay,
      select: { day: true, ipHash: true, country: true },
    }) as Promise<DistinctVisitorRow[]>,
    prisma.pageView.count({ where: whereDay }),
  ]);

  const uniqueKeys = new Set<string>();
  const uniqueByDay = new Map<string, Set<string>>();
  const uniqueByCountry = new Map<string, Set<string>>();

  for (const row of visitorRows) {
    const dayKey = formatDayKey(row.day);
    const uniqKey = `${dayKey}|${row.ipHash}`;

    uniqueKeys.add(uniqKey);

    if (!uniqueByDay.has(dayKey)) uniqueByDay.set(dayKey, new Set());
    uniqueByDay.get(dayKey)!.add(row.ipHash);

    const country = row.country || "XX";
    if (!uniqueByCountry.has(country)) uniqueByCountry.set(country, new Set());
    uniqueByCountry.get(country)!.add(uniqKey);
  }

  // Build a contiguous byDay series for non-"all" ranges.
  const byDay: { day: string; unique: number }[] = [];
  if (range === "today") {
    const k = formatDayKey(today);
    byDay.push({ day: k, unique: uniqueByDay.get(k)?.size ?? 0 });
  } else if (range === "7d" || range === "30d") {
    const days = range === "7d" ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = addDays(today, -i);
      const k = formatDayKey(d);
      byDay.push({ day: k, unique: uniqueByDay.get(k)?.size ?? 0 });
    }
  } else {
    // all: emit only days that have data, sorted
    Array.from(uniqueByDay.keys())
      .sort()
      .forEach((k) => byDay.push({ day: k, unique: uniqueByDay.get(k)!.size }));
  }

  const topCountries = Array.from(uniqueByCountry.entries())
    .map(([country, set]) => ({ country, unique: set.size }))
    .sort((a, b) => b.unique - a.unique)
    .slice(0, 10);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    range,
    stats: {
      uniqueVisitors: uniqueKeys.size,
      viewsTotal,
      countryCount: uniqueByCountry.size,
    },
    byDay,
    topCountries,
  });
}
