"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200/70 ${className}`} />;
}

function paginationItems(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 1) return [1];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]!);
  }
  return out;
}

function statusChipClass(status: AdminBlogRow["status"]) {
  if (status === "Published") {
    return "!bg-emerald-50 text-emerald-800 ring-emerald-200";
  }
  if (status === "Review") {
    return "!bg-amber-50 text-amber-800 ring-amber-200";
  }
  return "!bg-slate-50 text-slate-700 ring-slate-200";
}

type AdminBlogRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  status: "Draft" | "Review" | "Published";
  category: string;
  coverUrl?: string;
  updated: string;
  reads: string;
};

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<AdminBlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogRow | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const filtersKey = useMemo(
    () => `${query}\0${status}\0${category}`,
    [query, status, category],
  );
  const prevFiltersKeyRef = useRef(filtersKey);

  useEffect(() => {
    let cancelled = false;
    const filtersChanged = prevFiltersKeyRef.current !== filtersKey;
    if (filtersChanged) {
      prevFiltersKeyRef.current = filtersKey;
      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    async function run() {
      try {
        setLoading(true);
        setLoadError(null);
        const url = new URL("/api/admin/blogs", window.location.origin);
        url.searchParams.set("page", String(page));
        url.searchParams.set("pageSize", String(pageSize));
        if (query.trim()) url.searchParams.set("search", query.trim());
        if (status !== "all") url.searchParams.set("status", status);
        if (category !== "all") url.searchParams.set("category", category);

        const res = await fetch(url.toString(), { method: "GET" });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = (await res.json()) as {
          posts?: AdminBlogRow[];
          page?: number;
          pageSize?: number;
          total?: number;
          totalPages?: number;
        };
        if (cancelled) return;
        setBlogs(Array.isArray(data.posts) ? data.posts : []);
        setPage(Number(data.page) || 1);
        setTotal(Number(data.total) || 0);
        setTotalPages(Number(data.totalPages) || 1);
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "Failed to load posts");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [category, filtersKey, page, pageSize, query, refreshTick, status]);

  useEffect(() => {
    const d = deleteDialogRef.current;
    if (!d) return;
    if (deleteTarget) {
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [deleteTarget]);

  useEffect(() => {
    const d = deleteDialogRef.current;
    if (!d) return;
    const onDialogClose = () => setDeleteTarget(null);
    d.addEventListener("close", onDialogClose);
    return () => d.removeEventListener("close", onDialogClose);
  }, []);

  async function confirmDeletePost() {
    const blog = deleteTarget;
    if (!blog) return;

    setDeletingId(blog.id);
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(err?.error ?? `Request failed: ${res.status}`);
      }
      setRefreshTick((t) => t + 1);
      setDeleteTarget(null);
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Could not delete this post.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredBlogs = useMemo(() => blogs, [blogs]);

  const pageButtons = useMemo(
    () => paginationItems(page, totalPages),
    [page, totalPages],
  );

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
          href="/admin/blogs/new/details?new=1"
          className={cn(
            "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md px-4",
            "text-sm font-medium text-white shadow-sm transition",
            "bg-zinc-950 hover:brightness-110 active:brightness-95",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_20%_20%,rgba(84,168,230,0.34),transparent_60%),radial-gradient(620px_360px_at_84%_76%,rgba(255,190,55,0.20),transparent_64%),linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.60))]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:14px_14px]"
          />
          <span className="relative z-10">Create New Blog</span>
        </Link>
      </div>

      <Card className="overflow-hidden !shadow-none">
        <div className="border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50/70 p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
            <div className="rounded-xl bg-white p-4">
              <div className="space-y-3">
                <Label
                  htmlFor="blog-search"
                  className="block pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600"
                >
                  Search
                </Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="blog-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search blog title or author"
                    className="h-11 bg-white pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4">
              <div className="space-y-3">
                <Label
                  htmlFor="blog-status"
                  className="block pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600"
                >
                  Status
                </Label>
                <select
                  id="blog-status"
                  className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4">
              <div className="space-y-3">
                <Label
                  htmlFor="blog-category"
                  className="block pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-600"
                >
                  Category
                </Label>
                <select
                  id="blog-category"
                  className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
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
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Cover</th>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 font-semibold">Reads</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80">
                    <td className="px-5 py-4">
                      <Skeleton className="h-9 w-12" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-[320px] max-w-full" />
                      <div className="mt-2">
                        <Skeleton className="h-3 w-[160px] max-w-full" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-[120px]" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-6 w-[92px] rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-[120px]" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-[56px]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : loadError ? (
          <div className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
            Failed to load blogs. {loadError}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500">
            No blogs match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Cover</th>
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
                  <tr
                    key={blog.id}
                    className="group transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-5 py-4">
                      {blog.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={blog.coverUrl}
                          alt=""
                          className="h-10 w-14 rounded-lg object-cover ring-1 ring-zinc-200"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-zinc-100 ring-1 ring-zinc-200" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div
                        className="max-w-[420px] truncate font-medium text-zinc-950"
                        title={blog.title}
                      >
                        {blog.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        By {blog.author}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{blog.category}</td>
                    <td className="px-5 py-4">
                      <Badge
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          "ring-1",
                          statusChipClass(blog.status),
                        ].join(" ")}
                      >
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{blog.updated}</td>
                    <td className="px-5 py-4 text-zinc-600">{blog.reads}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/blogs/edit/${blog.id}/details`}
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-800 shadow-sm",
                            "transition hover:bg-zinc-50 hover:text-zinc-950",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                          )}
                          aria-label={`Edit “${blog.title}”`}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === blog.id}
                          onClick={() => setDeleteTarget(blog)}
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-rose-600 shadow-sm",
                            "transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                            "disabled:pointer-events-none disabled:opacity-50",
                          )}
                          aria-label={`Delete “${blog.title}”`}
                          title="Delete"
                        >
                          {deletingId === blog.id ? (
                            <Loader2
                              className="h-4 w-4 animate-spin text-rose-600"
                              aria-hidden
                            />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !loadError && total > 0 ? (
          <div className="flex flex-col gap-2 border-t border-zinc-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-xs leading-5 text-zinc-600">
              Page <span className="font-medium text-zinc-900">{page}</span> of{" "}
              <span className="font-medium text-zinc-900">{totalPages}</span>
              <span className="text-zinc-400"> · </span>
              <span className="font-medium text-zinc-900">
                {Intl.NumberFormat(undefined).format(total)}
              </span>{" "}
              total
            </p>
            <nav
              aria-label="Pagination"
              className="inline-flex shrink-0 select-none items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-0.5 shadow-sm"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-zinc-500 transition-colors",
                  "hover:bg-zinc-100 hover:text-zinc-800",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
              {pageButtons.map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`e-${idx}`}
                    className="px-1 text-xs font-medium tabular-nums text-zinc-400"
                    aria-hidden
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    className={cn(
                      "inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-sm px-1.5 text-xs font-medium tabular-nums transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                      item === page
                        ? "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
                    )}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-zinc-100 text-zinc-600 transition-colors",
                  "hover:bg-zinc-200 hover:text-zinc-900",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </nav>
          </div>
        ) : null}
      </Card>

      <dialog
        ref={deleteDialogRef}
        className={cn(
          "fixed left-[50%] top-[50%] z-[100] w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%]",
          "rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl",
          "[&::backdrop]:bg-zinc-950/50 [&::backdrop]:backdrop-blur-[2px]",
        )}
        aria-labelledby="delete-blog-dialog-title"
        aria-describedby="delete-blog-dialog-desc"
      >
        <div className="flex gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 ring-1 ring-rose-100"
            aria-hidden
          >
            <Trash2 className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id="delete-blog-dialog-title"
              className="text-base font-semibold text-zinc-950"
            >
              Delete this post?
            </h3>
            <p
              id="delete-blog-dialog-desc"
              className="mt-2 text-sm leading-6 text-zinc-600"
            >
              <span className="font-medium text-zinc-900">
                {deleteTarget?.title ?? ""}
              </span>{" "}
              will be removed permanently. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={deletingId !== null}
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={deletingId !== null}
            onClick={() => void confirmDeletePost()}
          >
            {deletingId !== null ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Deleting…
              </>
            ) : (
              "Delete post"
            )}
          </Button>
        </div>
      </dialog>
    </div>
  );
}
