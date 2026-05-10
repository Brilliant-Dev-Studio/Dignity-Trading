"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogDraft } from "@/lib/blog-draft";
import { safeReadDraft, saveDraft } from "./blogDraftState";

const CATEGORY_OPTIONS = [
  "Education",
  "Risk Management",
  "Psychology",
  "Strategy",
] as const;

export default function BlogDetailsForm() {
  const initial = useMemo(() => safeReadDraft(), []);
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [author, setAuthor] = useState(initial.author);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl);
  const [tags, setTags] = useState(initial.tags);
  const [category, setCategory] = useState(
    initial.category ?? "Education",
  );

  const categorySelectOptions = useMemo(() => {
    const base = new Set<string>(CATEGORY_OPTIONS);
    if (category) base.add(category);
    return [...base];
  }, [category]);

  const inputClass =
    "h-12 rounded-xl !shadow-none focus-visible:ring-0 focus-visible:ring-offset-0";

  function persist(partial: Partial<BlogDraft>) {
    const next = { ...safeReadDraft(), ...partial };
    saveDraft(next);
  }

  return (
    <div className="w-full max-w-none">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,720px)_360px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="blog-title">Title</Label>
            <Input
              id="blog-title"
              value={title}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);
                persist({ title: value });
              }}
              placeholder="Write a strong headline"
              className={inputClass}
            />
            <p className="text-xs text-zinc-500">
              Keep it specific and benefit-driven (8–14 words works well).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-subtitle">Subtitle</Label>
            <Input
              id="blog-subtitle"
              value={subtitle}
              onChange={(event) => {
                const value = event.target.value;
                setSubtitle(value);
                persist({ subtitle: value });
              }}
              placeholder="A short Medium-style description"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="blog-author">Author</Label>
              <Input
                id="blog-author"
                value={author}
                onChange={(event) => {
                  const value = event.target.value;
                  setAuthor(value);
                  persist({ author: value });
                }}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags</Label>
              <Input
                id="blog-tags"
                value={tags}
                onChange={(event) => {
                  const value = event.target.value;
                  setTags(value);
                  persist({ tags: value });
                }}
                placeholder="Trading, Education"
                className={inputClass}
              />
              <p className="text-xs text-zinc-500">
                Separate with commas. Example: Risk, Psychology, Strategy
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-category">Category</Label>
            <select
              id="blog-category"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              value={category}
              onChange={(event) => {
                const value = event.target.value;
                setCategory(value);
                persist({ category: value });
              }}
            >
              {categorySelectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-cover">Cover image URL</Label>
            <Input
              id="blog-cover"
              value={coverUrl}
              onChange={(event) => {
                const value = event.target.value;
                setCoverUrl(value);
                persist({ coverUrl: value });
              }}
              placeholder="https://..."
              className={inputClass}
            />
            <p className="text-xs text-zinc-500">
              Use a landscape image for best results (1200×630 recommended).
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-zinc-800">Cover preview</div>
          {coverUrl.trim() ? (
            <div
              className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${coverUrl})` }}
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white/70 text-xs text-zinc-500">
              Paste a cover image URL to preview it here.
            </div>
          )}
          <div className="rounded-lg border border-zinc-200 bg-white/70 p-3 text-xs text-zinc-600">
            Tip: Keep the first paragraph short—then add headings (H2/H3) in the
            next screen.
          </div>
        </div>
      </div>
    </div>
  );
}

