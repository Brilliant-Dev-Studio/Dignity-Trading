"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AdminToastFromQuery from "./AdminToastFromQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";
import { BookOpenText, Eye, Flame, Globe2, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function Sk({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200/75", className)}
      style={style}
      aria-hidden
    />
  );
}

const statCardStyles = [
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-sky-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-amber-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-emerald-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-violet-50/80",
];

type TrendingBlogRow = {
  id: string;
  title: string;
  slug: string;
  reads: number;
  category: string;
  publishedAt: string | null;
};

type BlogAnalyticsResponse = {
  generatedAt: string;
  stats: {
    blogCount: number;
    draftCount: number;
    totalReads: number;
  };
  byDay: Array<{ day: string; posts: number; reads: number }>;
  trending: TrendingBlogRow[];
};

type VisitorRange = "today" | "7d" | "30d" | "all";

type VisitorAnalyticsResponse = {
  generatedAt: string;
  range: VisitorRange;
  stats: {
    uniqueVisitors: number;
    viewsTotal: number;
    countryCount: number;
  };
  byDay: Array<{ day: string; unique: number }>;
  topCountries: Array<{ country: string; unique: number }>;
};

const VISITOR_RANGE_OPTIONS: { value: VisitorRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" },
];

function regionNameFromCode(code: string): string {
  if (!code || code === "XX") return "Unknown";
  try {
    const dn = new Intl.DisplayNames(undefined, { type: "region" });
    return dn.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<BlogAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [visitorRange, setVisitorRange] = useState<VisitorRange>("7d");
  const [visitorData, setVisitorData] = useState<VisitorAnalyticsResponse | null>(null);
  const [visitorLoading, setVisitorLoading] = useState(true);
  const [visitorError, setVisitorError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch("/api/admin/analytics/blogs", { method: "GET" });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = (await res.json()) as BlogAnalyticsResponse;
        if (cancelled) return;
        setData({
          ...json,
          trending: Array.isArray(json.trending) ? json.trending : [],
        });
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setVisitorLoading(true);
        setVisitorError(null);
        const res = await fetch(
          `/api/admin/analytics/visitors?range=${visitorRange}`,
          { method: "GET" },
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = (await res.json()) as VisitorAnalyticsResponse;
        if (cancelled) return;
        setVisitorData(json);
      } catch (e) {
        if (cancelled) return;
        setVisitorError(
          e instanceof Error ? e.message : "Failed to load visitor analytics",
        );
      } finally {
        if (cancelled) return;
        setVisitorLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [visitorRange]);

  const blogCount = data?.stats.blogCount ?? 0;
  const draftCount = data?.stats.draftCount ?? 0;
  const totalReads = data?.stats.totalReads ?? 0;

  const stats: Array<{
    label: string;
    value: string;
    change: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      label: "Blog posts",
      value: String(blogCount),
      change: draftCount ? `${draftCount} draft${draftCount === 1 ? "" : "s"}` : "No drafts",
      icon: BookOpenText,
    },
    {
      label: "Read total count",
      value: Intl.NumberFormat(undefined).format(Math.round(totalReads)),
      change: "Across all posts",
      icon: Eye,
    },
  ];

  const byDay = useMemo(() => data?.byDay ?? [], [data]);
  const trending = useMemo(() => data?.trending ?? [], [data]);
  const updatedLabel = useMemo(() => {
    if (loading) return "Loading analytics…";
    if (loadError) return "Couldn’t load analytics";
    if (!data?.generatedAt) return "Updated from database";
    const d = new Date(data.generatedAt);
    return `Updated ${d.toLocaleString()}`;
  }, [data, loadError, loading]);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <AdminToastFromQuery />
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-5 !shadow-none sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55] bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0.18))]"
        />
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
              <Badge>Protected</Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Quick overview of blog activity and engagement.
            </p>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-zinc-600 sm:mt-0">
            <TrendingUp className="h-4 w-4 text-zinc-700" />
            {updatedLabel}
          </div>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {loading ? (
          <>
            {[0, 1].map((i) => (
              <Card
                key={i}
                className={[
                  "relative overflow-hidden !shadow-none",
                  statCardStyles[i % statCardStyles.length],
                ].join(" ")}
                aria-busy="true"
                aria-label="Loading stat"
              >
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                      <Sk className="h-3.5 w-28" />
                      <Sk className="h-9 w-20 max-w-full" />
                    </div>
                    <Sk className="h-11 w-11 shrink-0 rounded-xl" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Sk className="h-4 w-40 max-w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={[
                  "group relative overflow-hidden",
                  "!shadow-none transition",
                  statCardStyles[index % statCardStyles.length],
                ].join(" ")}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.10),transparent_55%)]"
                />
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardDescription className="text-zinc-600">
                        {stat.label}
                      </CardDescription>
                      <CardTitle className="mt-1 text-3xl">{stat.value}</CardTitle>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 ring-1 ring-zinc-200">
                      <Icon className="h-5 w-5 text-zinc-800" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-sm text-zinc-600">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            Visitor analytics
          </h3>
          <p className="text-sm text-zinc-600">
            Unique IPs per day, grouped by country (from Vercel edge geo).
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Visitor range"
          className="flex flex-wrap items-center gap-1 self-start rounded-xl border border-zinc-200 bg-white p-1 text-xs font-medium"
        >
          {VISITOR_RANGE_OPTIONS.map((opt) => {
            const active = visitorRange === opt.value;
            return (
              <button
                key={opt.value}
                role="tab"
                aria-selected={active}
                onClick={() => setVisitorRange(opt.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition",
                  active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        {visitorLoading ? (
          <>
            {[2, 3].map((i) => (
              <Card
                key={i}
                className={[
                  "relative overflow-hidden !shadow-none",
                  statCardStyles[i % statCardStyles.length],
                ].join(" ")}
                aria-busy="true"
                aria-label="Loading stat"
              >
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                      <Sk className="h-3.5 w-28" />
                      <Sk className="h-9 w-20 max-w-full" />
                    </div>
                    <Sk className="h-11 w-11 shrink-0 rounded-xl" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Sk className="h-4 w-40 max-w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          (() => {
            const uniq = visitorData?.stats.uniqueVisitors ?? 0;
            const views = visitorData?.stats.viewsTotal ?? 0;
            const countries = visitorData?.stats.countryCount ?? 0;
            const visitorStats = [
              {
                label: "Unique visitors",
                value: Intl.NumberFormat(undefined).format(uniq),
                change: `${Intl.NumberFormat(undefined).format(views)} total views`,
                icon: Users,
              },
              {
                label: "Countries reached",
                value: String(countries),
                change:
                  countries === 0
                    ? "No data yet"
                    : `${countries} ${countries === 1 ? "country" : "countries"}`,
                icon: Globe2,
              },
            ];
            return visitorStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={[
                    "group relative overflow-hidden",
                    "!shadow-none transition",
                    statCardStyles[(index + 2) % statCardStyles.length],
                  ].join(" ")}
                >
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardDescription className="text-zinc-600">
                          {stat.label}
                        </CardDescription>
                        <CardTitle className="mt-1 text-3xl">
                          {stat.value}
                        </CardTitle>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 ring-1 ring-zinc-200">
                        <Icon className="h-5 w-5 text-zinc-800" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-zinc-600">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            });
          })()
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Daily unique visitors</CardTitle>
            <CardDescription>
              Unique IPs per UTC day for the selected range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visitorLoading ? (
              <div
                className="flex h-[260px] flex-col justify-end gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4"
                aria-busy="true"
              >
                <div className="flex flex-1 items-end justify-between gap-2 px-1 pt-8">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk
                      key={i}
                      className="w-full rounded-t-md"
                      style={{ height: `${24 + ((i * 19) % 60)}%` }}
                    />
                  ))}
                </div>
              </div>
            ) : visitorError ? (
              <p className="text-sm text-zinc-500">
                Couldn’t load visitor data.
              </p>
            ) : (visitorData?.byDay ?? []).length === 0 ? (
              <p className="text-sm text-zinc-600">No visits yet in this range.</p>
            ) : (
              <ChartContainer
                config={{
                  unique: { label: "Unique", color: "var(--brand-600)" },
                }}
              >
                <AreaChart
                  data={visitorData?.byDay ?? []}
                  margin={{ left: 8, right: 8 }}
                >
                  <ChartGrid />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="unique"
                    stroke="var(--chart-unique)"
                    fill="var(--chart-unique)"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Visitors by country</CardTitle>
            <CardDescription>Top countries by unique visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            {visitorLoading ? (
              <div
                className="flex h-[260px] flex-col gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4"
                aria-busy="true"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Sk
                    key={i}
                    className="h-5 rounded-md"
                    style={{ width: `${90 - i * 12}%` }}
                  />
                ))}
              </div>
            ) : visitorError ? (
              <p className="text-sm text-zinc-500">
                Couldn’t load country data.
              </p>
            ) : (visitorData?.topCountries ?? []).length === 0 ? (
              <p className="text-sm text-zinc-600">No country data yet.</p>
            ) : (
              <>
                <ChartContainer
                  className="h-[220px]"
                  config={{
                    unique: { label: "Unique", color: "var(--brand-600)" },
                  }}
                >
                  <BarChart
                    data={(visitorData?.topCountries ?? []).map((c) => ({
                      country: c.country,
                      unique: c.unique,
                    }))}
                    layout="vertical"
                    margin={{ left: 8, right: 12 }}
                  >
                    <ChartGrid />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="country"
                      tickLine={false}
                      axisLine={false}
                      width={44}
                    />
                    <ChartTooltip />
                    <Bar
                      dataKey="unique"
                      radius={[0, 8, 8, 0]}
                      fill="var(--chart-unique)"
                      fillOpacity={0.88}
                    />
                  </BarChart>
                </ChartContainer>
                <ul className="mt-3 space-y-1.5 text-xs">
                  {(visitorData?.topCountries ?? []).slice(0, 5).map((c) => (
                    <li
                      key={c.country}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-zinc-700">
                        <span className="font-mono text-zinc-500">{c.country}</span>{" "}
                        · {regionNameFromCode(c.country)}
                      </span>
                      <span className="font-medium tabular-nums text-zinc-900">
                        {Intl.NumberFormat(undefined).format(c.unique)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="overflow-hidden !shadow-none">
          <CardHeader className="flex flex-col gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                  <Flame className="h-4 w-4 text-amber-700" aria-hidden />
                </span>
                Trending blogs
              </CardTitle>
              <CardDescription>
                Published posts ranked by total reads (most popular first).
              </CardDescription>
            </div>
            <Link
              href="/admin/blogs"
              className="shrink-0 text-sm font-medium text-sky-700 underline-offset-4 hover:text-sky-900 hover:underline"
            >
              Manage all posts
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <ul
                className="divide-y divide-zinc-100"
                aria-busy="true"
                aria-label="Loading trending posts"
              >
                {Array.from({ length: 5 }).map((_, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Sk className="mt-0.5 h-7 w-7 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Sk className="h-4 w-full max-w-[min(100%,420px)]" />
                        <div className="flex flex-wrap gap-2">
                          <Sk className="h-3 w-24" />
                          <Sk className="h-3 w-16" />
                          <Sk className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 sm:justify-end">
                      <Sk className="h-9 w-[72px] rounded-lg" />
                      <Sk className="h-9 w-[76px] rounded-lg" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : loadError ? (
              <p className="text-sm text-zinc-500">
                Couldn’t load trending posts.
              </p>
            ) : trending.length === 0 ? (
              <p className="text-sm text-zinc-600">
                No published posts yet. When you publish, they will appear here
                by read count.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {trending.map((post, index) => (
                  <li
                    key={post.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-100 text-xs font-semibold tabular-nums text-zinc-700"
                        aria-label={`Rank ${index + 1}`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900">
                          {post.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                          <span className="font-medium text-zinc-700">
                            {Intl.NumberFormat(undefined).format(post.reads)}{" "}
                            read{post.reads === 1 ? "" : "s"}
                          </span>
                          <span aria-hidden>·</span>
                          <span>{post.category}</span>
                          {post.publishedAt ? (
                            <>
                              <span aria-hidden>·</span>
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </time>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                      <Link
                        href={`/admin/blogs/edit/${post.id}/details`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
                      >
                        View live
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
            <CardDescription>Last 7 days — posts vs reads.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div
                className="flex h-[280px] flex-col justify-end gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4"
                aria-busy="true"
                aria-label="Loading chart"
              >
                <div className="flex flex-1 items-end justify-between gap-2 px-1 pt-8">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk
                      key={i}
                      className="w-full rounded-t-md"
                      style={{
                        height: `${28 + ((i * 17) % 55)}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between gap-2 border-t border-zinc-100 pt-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk key={i} className="h-2 flex-1 rounded-sm" />
                  ))}
                </div>
              </div>
            ) : (
              <ChartContainer
                config={{
                  posts: { label: "Posts", color: "var(--brand-700)" },
                  reads: { label: "Reads", color: "var(--brand-400)" },
                }}
              >
                <AreaChart data={byDay} margin={{ left: 8, right: 8 }}>
                  <ChartGrid />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip />
                  <ChartLegend />
                  <Area
                    type="monotone"
                    dataKey="reads"
                    stroke="var(--chart-reads)"
                    fill="var(--chart-reads)"
                    fillOpacity={0.10}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="posts"
                    stroke="var(--chart-posts)"
                    fill="var(--chart-posts)"
                    fillOpacity={0.06}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Posting Days</CardTitle>
            <CardDescription>Posts uploaded each day.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div
                className="flex h-[260px] flex-col justify-end gap-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4"
                aria-busy="true"
                aria-label="Loading bar chart"
              >
                <div className="flex flex-1 items-end justify-between gap-2 px-1 pt-10">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk
                      key={i}
                      className="w-full rounded-t-md"
                      style={{
                        height: `${22 + ((i * 23) % 48)}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between gap-2 border-t border-zinc-100 pt-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk key={i} className="h-2 flex-1 rounded-sm" />
                  ))}
                </div>
              </div>
            ) : (
              <ChartContainer
                className="h-[260px]"
                config={{
                  posts: { label: "Posts", color: "var(--brand-600)" },
                }}
              >
                <BarChart data={byDay} margin={{ left: 8, right: 8 }}>
                  <ChartGrid />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip />
                  <Bar
                    dataKey="posts"
                    radius={[8, 8, 0, 0]}
                    fill="var(--chart-posts)"
                    fillOpacity={0.88}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
