"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockBlogs as blogs } from "@/lib/mock-blogs";

export default function BlogListPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesQuery =
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.author.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        status === "all" || blog.status.toLowerCase() === status;
      const matchesCategory =
        category === "all" ||
        blog.category.toLowerCase().replaceAll(" ", "-") === category;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, query, status]);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Blog</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Blog List
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Filter posts, review status, and create new Medium-style articles.
          </p>
        </div>
        <Link
          href="/admin/blogs/new/details"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
        >
          Create New Blog
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-4 border-b border-zinc-200 p-5 md:grid-cols-[1fr_180px_180px]">
          <div className="space-y-2">
            <Label htmlFor="blog-search">Search</Label>
            <Input
              id="blog-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blog title or author"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blog-status">Status</Label>
            <select
              id="blog-status"
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="blog-category">Category</Label>
            <select
              id="blog-category"
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              <option value="education">Education</option>
              <option value="risk-management">Risk Management</option>
              <option value="psychology">Psychology</option>
              <option value="strategy">Strategy</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 font-semibold">Reads</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredBlogs.map((blog) => (
                <tr key={blog.title} className="hover:bg-zinc-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-zinc-950">{blog.title}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      By {blog.author}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{blog.category}</td>
                  <td className="px-5 py-4">
                    <Badge className="bg-white">{blog.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{blog.updated}</td>
                  <td className="px-5 py-4 text-zinc-600">{blog.reads}</td>
                  <td className="px-5 py-4">
                    <Link
                      href="/admin/blogs/new/details"
                      className="font-medium text-zinc-950 underline-offset-4 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
            No blogs match the selected filters.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
