import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { AdminCreateBlogRequest } from "./createTypes";

function isDbUnreachableError(e: unknown) {
  if (!e || typeof e !== "object") return false;
  const anyErr = e as { code?: unknown };
  return anyErr.code === "P1001";
}

function formatCompactReads(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1_000_000) return `${Math.round((value / 1_000_000) * 10) / 10}m`;
  if (value >= 1_000) return `${Math.round((value / 1_000) * 10) / 10}k`;
  return String(Math.round(value));
}

function formatHumanDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(status: "DRAFT" | "REVIEW" | "PUBLISHED") {
  if (status === "DRAFT") return "Draft";
  if (status === "REVIEW") return "Review";
  return "Published";
}

function parsePositiveInt(input: string | null, fallback: number) {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function statusFromQuery(input: string | null) {
  if (!input || input === "all") return null;
  if (input === "draft") return "DRAFT" as const;
  if (input === "review") return "REVIEW" as const;
  if (input === "published") return "PUBLISHED" as const;
  return null;
}

function titleCaseWords(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function categoryFromQuery(input: string | null) {
  if (!input || input === "all") return null;
  // e.g. "risk-management" -> "Risk Management"
  const spaced = input.replaceAll("-", " ");
  return titleCaseWords(spaced);
}

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const pageSize = Math.min(
    50,
    parsePositiveInt(url.searchParams.get("pageSize"), 10),
  );
  const search = (url.searchParams.get("search") ?? "").trim();
  const status = statusFromQuery(url.searchParams.get("status"));
  const category = categoryFromQuery(url.searchParams.get("category"));

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { author: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  let total: number;
  try {
    total = await prisma.post.count({ where });
  } catch (e) {
    if (isDbUnreachableError(e)) {
      return NextResponse.json(
        { error: "db_unreachable" },
        { status: 503 },
      );
    }
    throw e;
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  let posts: Array<{
    id: string;
    slug: string;
    title: string;
    author: string;
    category: string;
    coverUrl: string;
    reads: number;
    status: "DRAFT" | "REVIEW" | "PUBLISHED";
    updatedAt: Date;
  }>;
  try {
    posts = await prisma.post.findMany({
      orderBy: [{ updatedAt: "desc" }],
      where,
      skip: (safePage - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        category: true,
        coverUrl: true,
        reads: true,
        status: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    if (isDbUnreachableError(e)) {
      return NextResponse.json(
        { error: "db_unreachable" },
        { status: 503 },
      );
    }
    throw e;
  }

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      author: p.author,
      category: p.category,
      coverUrl: p.coverUrl,
      status: statusLabel(p.status),
      updated: formatHumanDate(p.updatedAt),
      reads: formatCompactReads(p.reads),
    })),
    page: safePage,
    pageSize,
    total,
    totalPages,
  });
}

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "post";
}

async function createUniqueSlug(title: string) {
  const base = slugify(title);
  let slug = base;
  for (let i = 0; i < 6; i += 1) {
    const exists = await prisma.post.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!exists) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: AdminCreateBlogRequest;
  try {
    body = (await req.json()) as AdminCreateBlogRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }

  const status = body.status ?? "DRAFT";
  let slug: string;
  try {
    slug = await createUniqueSlug(title);
  } catch (e) {
    if (isDbUnreachableError(e)) {
      return NextResponse.json(
        { error: "db_unreachable" },
        { status: 503 },
      );
    }
    throw e;
  }
  const now = new Date();

  let post: {
    id: string;
    slug: string;
    status: "DRAFT" | "REVIEW" | "PUBLISHED";
    publishedAt: Date | null;
    updatedAt: Date;
  };
  try {
    post = await prisma.post.create({
      data: {
        slug,
        title,
        subtitle: String(body.subtitle ?? ""),
        author: String(body.author ?? "Dignity Trading"),
        category: String(body.category ?? "Education"),
        coverUrl: String(body.coverUrl ?? ""),
        tags: String(body.tags ?? ""),
        contentHtml: String(body.contentHtml ?? ""),
        contentText: String(body.contentText ?? ""),
        status,
        publishedAt: status === "PUBLISHED" ? now : null,
      },
      select: { id: true, slug: true, status: true, publishedAt: true, updatedAt: true },
    });
  } catch (e) {
    if (isDbUnreachableError(e)) {
      return NextResponse.json(
        { error: "db_unreachable" },
        { status: 503 },
      );
    }
    throw e;
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({ post }, { status: 201 });
}

