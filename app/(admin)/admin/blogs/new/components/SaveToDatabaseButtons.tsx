"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BLOG_DRAFT_STORAGE_KEY } from "@/lib/blog-draft";
import { safeReadDraft } from "./blogDraftState";
import { cn } from "@/lib/utils";

type Props = {
  variant: "draft" | "publish";
};

export default function SaveToDatabaseButtons({ variant }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    try {
      setSaving(true);
      setError(null);
      const draft = safeReadDraft();
      const editingId = draft.postId?.trim();
      const payload = {
        title: draft.title,
        subtitle: draft.subtitle,
        author: draft.author,
        coverUrl: draft.coverUrl,
        tags: draft.tags,
        contentHtml: draft.contentHtml,
        contentText: draft.contentText,
        category: draft.category ?? "Education",
        status: variant === "publish" ? ("PUBLISHED" as const) : ("DRAFT" as const),
      };

      const res = editingId
        ? await fetch(`/api/admin/blogs/${editingId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/blogs", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status}${text ? ` — ${text}` : ""}`);
      }

      if (variant === "publish") {
        toast.success("Published", { description: "Your blog post is live." });
      } else {
        toast.success("Saved", {
          description: editingId
            ? "Draft updated in database."
            : "Draft saved to database.",
        });
      }
      window.localStorage.removeItem(BLOG_DRAFT_STORAGE_KEY);
      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save post";
      setError(msg);
      toast.error("Error", { description: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className={cn(
          "relative inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-md px-3",
          "text-sm font-medium text-white shadow-sm transition",
          "bg-zinc-950 hover:brightness-110 active:brightness-95",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
          "disabled:pointer-events-none disabled:opacity-50",
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
        <span className="relative z-10 inline-flex items-center gap-2">
        {saving ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        ) : null}
          {variant === "publish"
            ? saving
              ? "Publishing…"
              : "Publish"
            : saving
              ? "Saving…"
              : "Draft"}
        </span>
      </button>
      {error ? (
        <div className="text-xs text-rose-600 sm:max-w-[420px]">{error}</div>
      ) : null}
    </div>
  );
}

