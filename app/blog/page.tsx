"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import BlogPageChrome from "./BlogPageChrome";
import { blogChromeTitleClass } from "./blog-chrome";

type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  coverUrl: string;
  tags: string;
  publishedAt: string | null;
  updatedAt: string;
};

const CATEGORY_SECTION_ORDER = [
  "Education",
  "Risk Management",
  "Psychology",
  "Strategy",
] as const;

function compareCategorySections(a: string, b: string) {
  const ia = CATEGORY_SECTION_ORDER.indexOf(a as (typeof CATEGORY_SECTION_ORDER)[number]);
  const ib = CATEGORY_SECTION_ORDER.indexOf(b as (typeof CATEGORY_SECTION_ORDER)[number]);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}

function slugifyCategoryHeading(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "posts";
}

function formatBlogDate(input: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-white/[0.08] ring-1 ring-white/[0.06] ${className}`}
    />
  );
}

function BlogPostCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm"
      aria-hidden="true"
    >
      <SkeletonBlock className="aspect-[16/9] w-full shrink-0 rounded-none rounded-t-2xl" />
      <div className="flex flex-1 flex-col p-5">
        <SkeletonBlock className="h-3 w-36 rounded-md" />
        <SkeletonBlock className="mt-4 h-5 w-full max-w-[280px] rounded-md" />
        <SkeletonBlock className="mt-2 h-4 w-full rounded-md" />
        <SkeletonBlock className="mt-2 h-4 max-w-[85%] rounded-md" />
        <div className="mt-4 flex flex-wrap gap-2">
          <SkeletonBlock className="h-6 w-14 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="mt-auto mt-5 h-4 w-24 rounded-md" />
      </div>
    </article>
  );
}

function BlogCategorySectionSkeleton() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <SkeletonBlock className="h-6 w-44 rounded-md sm:h-7" />
        <SkeletonBlock className="h-4 w-14 rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <BlogPostCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogListItem }) {
  const hasCover = Boolean(post.coverUrl?.trim());

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/7"
    >
      {hasCover ? (
        <div className="aspect-[16/9] shrink-0 overflow-hidden bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="relative flex aspect-[16/9] shrink-0 flex-col items-center justify-center overflow-hidden bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,color-mix(in_oklab,var(--brand-400)_12%,transparent)_42%,rgba(255,190,55,0.08)_100%)] ring-1 ring-inset ring-white/[0.08]"
          role="img"
          aria-label="No cover image"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:12px_12px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(420px_200px_at_50%_0%,color-mix(in_oklab,var(--brand-400)_25%,transparent),transparent_65%)]"
          />
          <BookOpen
            className="relative h-9 w-9 text-white/30 transition duration-300 group-hover:text-white/45"
            strokeWidth={1.25}
            aria-hidden
          />
          <span className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Article
          </span>
          {post.category?.trim() ? (
            <span className="relative mt-3 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/15">
              {post.category.trim()}
            </span>
          ) : null}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/55">
          <span className="font-medium text-white/70">{post.author}</span>
          <span aria-hidden="true">•</span>
          <span>
            {formatBlogDate(post.publishedAt ?? post.updatedAt) || "—"}
          </span>
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          {post.title}
        </h2>
        {post.subtitle ? (
          <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-3">
            {post.subtitle}
          </p>
        ) : null}
        {post.tags ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 4)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
          </div>
        ) : null}
        <div className="mt-auto pt-5">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PublicBlogPage() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/blogs", { method: "GET" });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as { posts?: BlogListItem[] };
        if (cancelled) return;
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load posts");
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

  const hasPosts = posts.length > 0;
  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aTime = new Date(a.publishedAt ?? a.updatedAt).getTime();
      const bTime = new Date(b.publishedAt ?? b.updatedAt).getTime();
      return bTime - aTime;
    });
  }, [posts]);

  const postsByCategory = useMemo(() => {
    const map = new Map<string, BlogListItem[]>();
    for (const post of sorted) {
      const raw = post.category?.trim();
      const key = raw && raw.length > 0 ? raw : "Uncategorized";
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => compareCategorySections(a, b));
  }, [sorted]);

  return (
    <BlogPageChrome>
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
          Blog
        </p>
        <div className="mt-4 inline-flex flex-col">
          <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${blogChromeTitleClass}`}>
            Calm, useful trading notes.
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
          Practical ideas on risk, psychology, and strategy — written to be read slowly
          and applied consistently.
        </p>

        <section className="mt-10">
          {loading ? (
            <div
              className="space-y-14"
              aria-busy="true"
              aria-live="polite"
              aria-label="Loading blog posts"
            >
              <BlogCategorySectionSkeleton />
              <BlogCategorySectionSkeleton />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-rose-500/10 p-6 ring-1 ring-rose-500/20">
              <p className="text-sm text-rose-100">Couldn’t load posts.</p>
              <p className="mt-2 text-xs text-rose-100/80">{error}</p>
            </div>
          ) : !hasPosts ? (
            <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm text-white/70">
                No published posts yet. Create one in the admin editor, then publish.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/admin/blogs/new/details?new=1"
                  className={[
                    "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold",
                    "text-zinc-950",
                    "bg-[linear-gradient(165deg,#ffffff_0%,#f4f4f5_42%,#e4e4e7_100%)]",
                    "shadow-[0_12px_40px_rgba(0,0,0,0.42),0_0_32px_color-mix(in_oklab,var(--brand-400)_20%,transparent),inset_0_1px_0_rgba(255,255,255,0.92)]",
                    "ring-1 ring-white/70 transition duration-200 ease-out",
                    "hover:-translate-y-0.5 hover:shadow-[0_18px_52px_rgba(0,0,0,0.48),0_0_44px_color-mix(in_oklab,var(--brand-400)_30%,transparent),inset_0_1px_0_#fff]",
                    "hover:ring-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    "cursor-pointer active:translate-y-0",
                  ].join(" ")}
                >
                  Write a post
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              {postsByCategory.map(([category, items]) => {
                const catId = slugifyCategoryHeading(category);
                const headingId = `blog-cat-${catId}`;
                return (
                <section
                  key={category}
                  id={catId}
                  aria-labelledby={headingId}
                  className="scroll-mt-24"
                >
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <h2
                      id={headingId}
                      className="text-lg font-semibold tracking-tight text-white sm:text-xl"
                    >
                      {category}
                    </h2>
                    <p className="text-xs tabular-nums text-white/45">
                      {items.length} post{items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
                );
              })}
            </div>
          )}
        </section>
    </BlogPageChrome>
  );
}

