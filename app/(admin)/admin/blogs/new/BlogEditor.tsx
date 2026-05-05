"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type Quill from "quill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOG_DRAFT_STORAGE_KEY, type BlogDraft } from "@/lib/blog-draft";

const starterContent = `
  <h2>Start with the promise</h2>
  <p>Write the core idea in plain language. Medium-style posts work best when the intro is clean, personal, and direct.</p>
  <h3>What readers will learn</h3>
  <ul>
    <li>How to manage risk before entries</li>
    <li>Why a repeatable setup matters</li>
    <li>What to review after every trade</li>
  </ul>
  <blockquote>Good trading content should feel calm, useful, and honest.</blockquote>
  <p>Use <strong>bold</strong> for key ideas, <em>italic</em> for emphasis, and code formatting for terms or formulas.</p>
`;

function safeReadDraft(): BlogDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BlogDraft;
  } catch {
    return null;
  }
}

export default function BlogEditor() {
  const router = useRouter();
  const [initialContentHtml] = useState(() => {
    const draft = safeReadDraft();
    return draft?.contentHtml ?? starterContent;
  });

  const [title, setTitle] = useState(() => {
    const draft = safeReadDraft();
    return draft?.title ?? "The Calm Trading Plan Beginners Need";
  });
  const [subtitle, setSubtitle] = useState(() => {
    const draft = safeReadDraft();
    return (
      draft?.subtitle ??
      "A practical guide to risk, structure, and repeatable decisions."
    );
  });
  const [author, setAuthor] = useState(() => {
    const draft = safeReadDraft();
    return draft?.author ?? "Dignity Trading";
  });
  const [coverUrl, setCoverUrl] = useState(() => {
    const draft = safeReadDraft();
    return draft?.coverUrl ?? "";
  });
  const [tags, setTags] = useState(() => {
    const draft = safeReadDraft();
    return draft?.tags ?? "Trading, Risk Management, Education";
  });
  const [contentHtml, setContentHtml] = useState(initialContentHtml);
  const [contentText, setContentText] = useState("");
  const editorElementRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEditor() {
      const { default: QuillEditor } = await import("quill");
      if (!isMounted || !editorElementRef.current || quillRef.current) {
        return;
      }

      const quill = new QuillEditor(editorElementRef.current, {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
        placeholder: "Write your blog content here...",
        theme: "snow",
      });

      quill.clipboard.dangerouslyPasteHTML(initialContentHtml);
      quillRef.current = quill;
      setContentHtml(quill.root.innerHTML);
      setContentText(quill.getText());

      quill.on("text-change", () => {
        setContentHtml(quill.root.innerHTML);
        setContentText(quill.getText());
      });
    }

    loadEditor();

    return () => {
      isMounted = false;
    };
  }, [initialContentHtml]);

  function getDraft(): BlogDraft {
    return {
      title,
      subtitle,
      author,
      coverUrl,
      tags,
      contentHtml,
      contentText,
    };
  }

  function saveDraft() {
    window.localStorage.setItem(
      BLOG_DRAFT_STORAGE_KEY,
      JSON.stringify(getDraft()),
    );
  }

  function previewBlog() {
    saveDraft();
    router.push("/admin/blogs/preview");
  }

  const wordCount = Math.max(
    0,
    contentText.trim().split(/\s+/).filter(Boolean).length,
  );

  return (
    <div className="w-full max-w-none">
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-medium text-zinc-600">Draft editor</div>
            <div className="truncate text-sm text-zinc-500">
              Save your draft, preview it, then publish when ready.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={saveDraft}>
              Save Draft
            </Button>
            <Button type="button" variant="outline" onClick={previewBlog}>
              Preview Blog
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h3 className="text-base font-semibold">Post details</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Title, subtitle, cover, and discovery metadata.
            </p>
          </div>
          <div className="space-y-5 p-5">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Write a strong headline"
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
                onChange={(event) => setSubtitle(event.target.value)}
                placeholder="A short Medium-style description"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-author">Author</Label>
                <Input
                  id="blog-author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags</Label>
                <Input
                  id="blog-tags"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="Trading, Education"
                />
                <p className="text-xs text-zinc-500">
                  Separate with commas. Example: Risk, Psychology, Strategy
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-cover">Cover image URL</Label>
              <Input
                id="blog-cover"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-zinc-500">
                Use a landscape image for best results (1200×630 recommended).
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h3 className="text-base font-semibold">Write</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Draft the article body using the editor toolbar.
            </p>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              <Label>Editor</Label>
              <div className="quill-editor rounded-md border border-zinc-200 bg-white">
                <div ref={editorElementRef} className="min-h-[520px]" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                <span>Tip: Use headings (H2/H3) for structure.</span>
                <span className="tabular-nums">{wordCount} words</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
