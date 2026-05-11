import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blog-public";

export async function GET() {
  const posts = await getPublishedBlogPosts();
  return NextResponse.json({ posts });
}

