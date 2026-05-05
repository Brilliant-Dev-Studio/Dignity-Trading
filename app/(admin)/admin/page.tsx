 "use client";

import { Badge } from "@/components/ui/badge";
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
import { BookOpenText, Eye, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  formatShortDay,
  mockBlogs,
  parseCompactNumber,
  parseUpdatedDate,
} from "@/lib/mock-blogs";

const statCardStyles = [
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-sky-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-amber-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-emerald-50/80",
  "border-zinc-200/70 bg-gradient-to-br from-white via-white to-violet-50/80",
];

export default function AdminDashboardPage() {
  const blogCount = mockBlogs.length;
  const draftCount = mockBlogs.filter((b) => b.status === "Draft").length;
  const totalReads = mockBlogs.reduce(
    (sum, blog) => sum + parseCompactNumber(blog.reads),
    0,
  );

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

  const byDay = (() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        date: d,
        label: formatShortDay(d),
        posts: 0,
        reads: 0,
      };
    });

    for (const blog of mockBlogs) {
      const d = parseUpdatedDate(blog.updated);
      if (!d) continue;
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const idx = Math.floor(
        (dayStart.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (idx < 0 || idx >= buckets.length) continue;
      buckets[idx].posts += 1;
      buckets[idx].reads += parseCompactNumber(blog.reads);
    }

    return buckets.map((b) => ({
      day: b.label,
      posts: b.posts,
      reads: Math.round(b.reads),
    }));
  })();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
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
            Updated from mock blog dataset
          </div>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {stats.map((stat, index) => {
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
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
            <CardDescription>Last 7 days — posts vs reads.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="overflow-hidden !shadow-none">
          <CardHeader>
            <CardTitle>Posting Days</CardTitle>
            <CardDescription>Posts uploaded each day.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
