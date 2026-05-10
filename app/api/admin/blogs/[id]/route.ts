import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { AdminPatchBlogRequest } from "../createTypes";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      author: true,
      category: true,
      coverUrl: true,
      tags: true,
      contentHtml: true,
      contentText: true,
      status: true,
      publishedAt: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { id: true, publishedAt: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: AdminPatchBlogRequest;
  try {
    body = (await req.json()) as AdminPatchBlogRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.title !== undefined && !String(body.title).trim()) {
    return NextResponse.json({ error: "title_required" }, { status: 400 });
  }

  const data: {
    title?: string;
    subtitle?: string;
    author?: string;
    category?: string;
    coverUrl?: string;
    tags?: string;
    contentHtml?: string;
    contentText?: string;
    status?: "DRAFT" | "REVIEW" | "PUBLISHED";
    publishedAt?: Date | null;
  } = {};

  if (body.title !== undefined) data.title = String(body.title).trim();
  if (body.subtitle !== undefined) data.subtitle = String(body.subtitle ?? "");
  if (body.author !== undefined) data.author = String(body.author ?? "");
  if (body.category !== undefined) data.category = String(body.category ?? "");
  if (body.coverUrl !== undefined) data.coverUrl = String(body.coverUrl ?? "");
  if (body.tags !== undefined) data.tags = String(body.tags ?? "");
  if (body.contentHtml !== undefined) {
    data.contentHtml = String(body.contentHtml ?? "");
  }
  if (body.contentText !== undefined) {
    data.contentText = String(body.contentText ?? "");
  }

  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "PUBLISHED") {
      data.publishedAt = existing.publishedAt ?? new Date();
    } else {
      data.publishedAt = null;
    }
  }

  const post = await prisma.post.update({
    where: { id },
    data,
    select: {
      id: true,
      slug: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
