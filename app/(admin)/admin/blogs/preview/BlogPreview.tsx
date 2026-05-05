"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_DRAFT_STORAGE_KEY, type BlogDraft } from "@/lib/blog-draft";

const emptyDraft: BlogDraft = {
  title: "Untitled Blog Post",
  subtitle: "A concise subtitle helps readers decide to continue.",
  author: "Dignity Trading",
  coverUrl: "",
  tags: "",
  contentHtml: "<p>No draft content yet.</p>",
  contentText: "",
};

function extractYoutubeId(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      // /shorts/:id or /embed/:id
      if (parts[0] === "shorts" || parts[0] === "embed") {
        return parts[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url);
}

function enhanceBlogHtml(html: string) {
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  const urlRegex = /https?:\/\/[^\s<]+/g;
  const mdImageRegex = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  const iframeSrcRegex = /src\s*=\s*["']([^"']+)["']/i;

  for (const textNode of textNodes) {
    const text = textNode.nodeValue ?? "";
    if (!text) continue;

    const hasUrl =
      urlRegex.test(text) || mdImageRegex.test(text) || text.includes("<iframe");
    if (!hasUrl) continue;

    // reset regex state
    urlRegex.lastIndex = 0;
    mdImageRegex.lastIndex = 0;

    const fragment = doc.createDocumentFragment();

    // First expand markdown image syntax to plain URL tokens so we can treat it uniformly.
    const normalized = text.replace(mdImageRegex, (_, url: string) => url);

    // If the user pasted an <iframe> snippet as text, try to extract src and embed it.
    // Quill often treats it as plain text, so we upgrade it at preview time.
    if (normalized.includes("<iframe")) {
      const srcMatch = normalized.match(iframeSrcRegex);
      const src = srcMatch?.[1];
      const youtubeId = src ? extractYoutubeId(src) : null;
      if (youtubeId) {
        const wrap = doc.createElement("div");
        wrap.className = "my-6 overflow-hidden rounded-lg border border-zinc-200 bg-white";
        const inner = doc.createElement("div");
        inner.className = "aspect-video w-full";
        const iframe = doc.createElement("iframe");
        iframe.setAttribute("src", `https://www.youtube-nocookie.com/embed/${youtubeId}`);
        iframe.setAttribute("title", "YouTube video");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        );
        iframe.setAttribute("allowfullscreen", "true");
        iframe.className = "h-full w-full";
        inner.appendChild(iframe);
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
        textNode.parentNode?.replaceChild(fragment, textNode);
        continue;
      }
    }

    let lastIndex = 0;
    for (const match of normalized.matchAll(urlRegex)) {
      const rawUrl = match[0];
      const idx = match.index ?? 0;

      const before = normalized.slice(lastIndex, idx);
      if (before) fragment.appendChild(doc.createTextNode(before));

      const cleanUrl = rawUrl.replace(/[),.]+$/, (trail) =>
        // keep query/hash punctuation, remove typical sentence trailing chars
        trail.split("").every((c) => c === "," || c === "." || c === ")") ? "" : trail,
      );

      const youtubeId = extractYoutubeId(cleanUrl);
      if (youtubeId) {
        const wrap = doc.createElement("div");
        wrap.className = "my-6 overflow-hidden rounded-lg border border-zinc-200 bg-white";
        const inner = doc.createElement("div");
        inner.className = "aspect-video w-full";
        const iframe = doc.createElement("iframe");
        iframe.setAttribute("src", `https://www.youtube-nocookie.com/embed/${youtubeId}`);
        iframe.setAttribute("title", "YouTube video");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        );
        iframe.setAttribute("allowfullscreen", "true");
        iframe.className = "h-full w-full";
        inner.appendChild(iframe);
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
      } else if (isImageUrl(cleanUrl)) {
        const img = doc.createElement("img");
        img.setAttribute("src", cleanUrl);
        img.setAttribute("alt", "Embedded image");
        img.setAttribute("loading", "lazy");
        img.className = "my-6 w-full rounded-lg border border-zinc-200 bg-white object-cover";
        fragment.appendChild(img);
      } else {
        const a = doc.createElement("a");
        a.setAttribute("href", cleanUrl);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noreferrer");
        a.textContent = cleanUrl;
        a.className = "break-words underline underline-offset-4";
        fragment.appendChild(a);
      }

      lastIndex = idx + rawUrl.length;
    }

    const after = normalized.slice(lastIndex);
    if (after) fragment.appendChild(doc.createTextNode(after));

    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  return body.innerHTML;
}

export default function BlogPreview() {
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);

    if (savedDraft) {
      setDraft(JSON.parse(savedDraft) as BlogDraft);
    }
  }, []);

  const enhancedHtml = useMemo(
    () => enhanceBlogHtml(draft.contentHtml),
    [draft.contentHtml],
  );

  const tagList = draft.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">Blog / Preview</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Blog Preview
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blogs/new/write"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Link>
          <Button type="button">
            <Send className="h-4 w-4" />
            Publish Blog
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-[560px] py-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Preview • <span className="tabular-nums">{draft.contentText.trim().length}</span>{" "}
            chars
          </div>
          <Badge className="bg-white">Draft</Badge>
        </div>

        {draft.coverUrl ? (
          <div
            aria-label="Cover image preview"
            className="mb-5 aspect-[16/9] w-full rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${draft.coverUrl})` }}
          />
        ) : (
          <div className="mb-5 flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white">
            Cover image preview
          </div>
        )}

        <h1 className="text-xl font-serif font-semibold leading-tight tracking-normal text-zinc-950 sm:text-2xl">
          {draft.title || "Untitled Blog Post"}
        </h1>
        <p className="mt-2 text-sm font-serif leading-6 text-zinc-600 sm:text-base">
          {draft.subtitle || "A concise subtitle helps readers decide to continue."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-3 text-xs text-zinc-500">
          <span className="font-medium text-zinc-800">
            {draft.author || "Dignity Trading"}
          </span>
          <span>5 min read</span>
        </div>

        {tagList.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <Badge key={tag} className="bg-white">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div
          className="medium-preview mt-5 font-serif text-[15px] leading-7 text-zinc-800"
          dangerouslySetInnerHTML={{ __html: enhancedHtml }}
        />
      </article>
    </div>
  );
}
