/**
 * Server-safe blog HTML helpers: normalize YouTube embeds for public (and preview) rendering.
 */

export function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed") {
        const id = parts[1]?.split("?")[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

export function makeYoutubeEmbedMarkup(videoId: string, title = "YouTube video"): string {
  const t = escapeHtmlAttr(title);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return [
    '<div class="blog-youtube-embed my-6 w-full overflow-hidden rounded-2xl ring-1 ring-white/15">',
    '<div class="relative aspect-video w-full">',
    `<iframe class="absolute inset-0 h-full w-full border-0" src="${src}" title="${t}" loading="lazy" `,
    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ',
    'allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>',
    "</div></div>",
  ].join("");
}

/** Quill sometimes stores pasted iframe markup as escaped entities in HTML. */
function upgradeEscapedYoutubeIframes(html: string): string {
  return html.replace(/&lt;iframe\b[\s\S]*?&lt;\/iframe&gt;/gi, (escaped) => {
    const decoded = escaped
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'");
    const srcMatch = decoded.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!srcMatch?.[1]) return escaped;
    const id = extractYoutubeId(srcMatch[1]);
    if (!id) return escaped;
    const titleMatch = decoded.match(/\btitle\s*=\s*["']([^"']*)["']/i);
    return makeYoutubeEmbedMarkup(id, titleMatch?.[1] ?? "YouTube video");
  });
}

function replaceYoutubeIframes(html: string): string {
  return html.replace(
    /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/iframe>/gi,
    (full, src: string) => {
      const id = extractYoutubeId(src);
      if (!id) return full;
      const titleMatch = full.match(/\btitle\s*=\s*["']([^"']*)["']/i);
      return makeYoutubeEmbedMarkup(id, titleMatch?.[1] ?? "YouTube video");
    },
  );
}

function wrapTablesForDisplay(html: string): string {
  if (!html.includes("<table")) return html;
  // Avoid double-wrapping.
  if (html.includes("blog-table-wrap")) return html;

  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    return [
      '<div class="blog-table-wrap my-6 w-full overflow-x-auto rounded-2xl ring-1 ring-white/12 bg-white/[0.03]">',
      '<div class="min-w-full p-2">',
      table,
      "</div></div>",
    ].join("");
  });
}

/** Single-line embed URL inside a paragraph (no iframe). */
function upgradeBareYoutubeEmbedParagraphs(html: string): string {
  return html.replace(
    /<p>\s*(https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})[^<\s]*)\s*<\/p>/gi,
    (_full, _url: string, id: string) => makeYoutubeEmbedMarkup(id, "YouTube video"),
  );
}

/** Optional defaults when a slug should always show a clip (until content is edited in CMS). */
const DEFAULT_YOUTUBE_BY_SLUG: Record<string, { videoId: string; title: string }> = {
  "the-cryptyo": { videoId: "Fc-fa6cAe2c", title: "YouTube video" },
};

function appendDefaultYoutubeIfMissing(html: string, slug: string | undefined): string {
  if (!slug) return html;
  const spec = DEFAULT_YOUTUBE_BY_SLUG[slug];
  if (!spec) return html;
  if (html.includes(spec.videoId)) return html;
  const trimmed = html.trim();
  const base = trimmed.length ? trimmed : "<p></p>";
  return `${base}\n${makeYoutubeEmbedMarkup(spec.videoId, spec.title)}`;
}

export function enhanceBlogContentForDisplay(
  html: string,
  options?: { slug?: string },
): string {
  const input = html?.trim() ? html : "<p></p>";
  let out = upgradeEscapedYoutubeIframes(input);
  out = replaceYoutubeIframes(out);
  out = upgradeBareYoutubeEmbedParagraphs(out);
  out = appendDefaultYoutubeIfMissing(out, options?.slug);
  out = wrapTablesForDisplay(out);
  return out;
}
