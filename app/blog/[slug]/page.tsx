import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { ArrowLeft } from "lucide-react";
import { enhanceBlogContentForDisplay } from "@/lib/blog-html";
import { prisma } from "@/lib/prisma";
import BlogPageChrome from "../BlogPageChrome";
import { blogChromeTitleClass } from "../blog-chrome";

const contentProseClass = [
  "blog-post-body max-w-none",
  "[&_a]:text-[var(--brand-400)] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white",
  "[&_p]:mb-4 [&_p]:text-base [&_p]:leading-7 [&_p]:text-white/82",
  "[&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-white",
  "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-white",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-white/80",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ol]:text-white/80",
  "[&_li]:pl-1",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[color-mix(in_oklab,var(--brand-400)_55%,white)] [&_blockquote]:pl-4 [&_blockquote]:text-white/72 [&_blockquote]:italic",
  "[&_strong]:font-semibold [&_strong]:text-white/95",
  "[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-white/90",
  "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/40 [&_pre]:p-4 [&_pre]:ring-1 [&_pre]:ring-white/10",
  "[&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:ring-1 [&_img]:ring-white/15",
].join(" ");

type Props = { params: Promise<{ slug: string }> };

function formatBlogDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, subtitle: true, coverUrl: true },
  });
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.subtitle || undefined,
    openGraph: {
      title: post.title,
      description: post.subtitle || undefined,
      type: "article",
      url: `/blog/${slug}`,
      ...(post.coverUrl?.trim() ? { images: [{ url: post.coverUrl }] } : {}),
    },
  };
}

export default async function PublicBlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      slug: true,
      id: true,
      title: true,
      subtitle: true,
      author: true,
      category: true,
      coverUrl: true,
      tags: true,
      contentHtml: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  if (!post) notFound();

  after(async () => {
    try {
      await prisma.post.update({
        where: { id: post.id },
        data: { reads: { increment: 1 } },
      });
    } catch {
      // ignore read-counter failures (e.g. DB hiccup)
    }
  });

  const tagList = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const hasCover = Boolean(post.coverUrl?.trim());
  const articleHtml = enhanceBlogContentForDisplay(post.contentHtml || "<p></p>", {
    slug: post.slug,
  });

  return (
    <BlogPageChrome lite containerClassName="py-6 sm:py-8">
      <nav
        aria-label="Article navigation"
        className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-white/[0.08] pb-3 text-sm"
      >
        <Link
          href="/blog"
          prefetch
          className="inline-flex items-center gap-1.5 text-white/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--brand-400)_45%,white)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          All posts
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-white/45">
          <Link
            href="/resources"
            className="text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:underline"
          >
            Resources
          </Link>
          <span aria-hidden="true">
            ·
          </span>
          <Link
            href="/"
            className="text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:underline"
          >
            Home
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl">
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${blogChromeTitleClass}`}>
          Blog
        </p>
        <div className="mt-2 inline-flex flex-col">
          <h1
            className={`text-3xl font-semibold leading-[1.3] tracking-tight sm:text-4xl sm:leading-[1.28] ${blogChromeTitleClass} max-w-[100%] pb-0.5 text-balance`}
          >
            {post.title}
          </h1>
          <span
            aria-hidden="true"
            className="mt-2 h-px w-24 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--brand-400)_70%,white),transparent)] opacity-70"
          />
        </div>

        {post.subtitle ? (
          <p className="mt-3 text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            {post.subtitle}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 pb-4 text-xs text-white/55">
          <span className="font-medium text-white/75">{post.author}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={(post.publishedAt ?? post.updatedAt).toISOString()}>
            {formatBlogDate(post.publishedAt ?? post.updatedAt)}
          </time>
          {post.category?.trim() ? (
            <>
              <span aria-hidden="true">•</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/12">
                {post.category.trim()}
              </span>
            </>
          ) : null}
        </div>

        {tagList.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70 ring-1 ring-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {hasCover ? (
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt=""
              className="aspect-[16/9] w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        ) : null}

        <div
          className={`mt-8 ${contentProseClass}`}
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
      </article>
    </BlogPageChrome>
  );
}
