import { prisma } from "@/lib/prisma";

export type PublishedBlogListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  coverUrl: string;
  tags: string;
  publishedAt: Date | null;
  updatedAt: Date;
};

/** Server-only: published posts for public blog list (same shape as /api/blogs). */
export async function getPublishedBlogPosts(): Promise<PublishedBlogListItem[]> {
  return prisma.post.findMany({
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
}
