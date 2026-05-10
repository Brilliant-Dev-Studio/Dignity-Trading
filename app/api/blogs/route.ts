import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      author: true,
      category: true,
      coverUrl: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ posts });
}

