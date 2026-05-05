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

export const defaultDraft: BlogDraft = {
  title: "The Calm Trading Plan Beginners Need",
  subtitle: "A practical guide to risk, structure, and repeatable decisions.",
  author: "Dignity Trading",
  coverUrl: "",
  tags: "Trading, Risk Management, Education",
  contentHtml: starterContent,
  contentText: "",
};

export function safeReadDraft(): BlogDraft {
  if (typeof window === "undefined") return defaultDraft;
  const raw = window.localStorage.getItem(BLOG_DRAFT_STORAGE_KEY);
  if (!raw) return defaultDraft;
  try {
    return { ...defaultDraft, ...(JSON.parse(raw) as Partial<BlogDraft>) };
  } catch {
    return defaultDraft;
  }
}

export function saveDraft(next: BlogDraft) {
  window.localStorage.setItem(BLOG_DRAFT_STORAGE_KEY, JSON.stringify(next));
}

