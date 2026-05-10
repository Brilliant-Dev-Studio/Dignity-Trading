"use client";

import { useEffect, useState, type ReactNode } from "react";
import { safeReadDraft, saveDraft } from "../new/components/blogDraftState";

type LoadedPost = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  coverUrl: string;
  tags: string;
  contentHtml: string;
  contentText: string;
};

export default function EditBlogBootstrap({
  postId,
  children,
}: {
  postId: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = safeReadDraft();
    if (cached.postId === postId) {
      setState("ready");
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(`/api/admin/blogs/${postId}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Could not load post (${res.status})${text ? ` — ${text}` : ""}`,
          );
        }
        const data = (await res.json()) as { post?: LoadedPost };
        const post = data.post;
        if (!post) throw new Error("Invalid response: missing post");
        if (cancelled) return;

        saveDraft({
          title: post.title,
          subtitle: post.subtitle ?? "",
          author: post.author ?? "",
          category: post.category ?? "Education",
          coverUrl: post.coverUrl ?? "",
          tags: post.tags ?? "",
          contentHtml: post.contentHtml ?? "",
          contentText: post.contentText ?? "",
          postId: post.id,
        });
        setState("ready");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load post");
          setState("error");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (state === "loading") {
    return (
      <div className="px-4 py-10 text-center text-sm text-zinc-500">
        Loading post…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="px-4 py-10 text-center text-sm text-rose-600">
        {error ?? "Failed to load post"}
      </div>
    );
  }

  return <>{children}</>;
}
