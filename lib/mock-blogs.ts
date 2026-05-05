export type MockBlog = {
  title: string;
  author: string;
  status: "Draft" | "Review" | "Published";
  category: string;
  /** Human-readable date, e.g. "May 1, 2026" */
  updated: string;
  /** Human-readable, e.g. "1.2k" */
  reads: string;
};

export const mockBlogs: MockBlog[] = [
  {
    title: "The Calm Trading Plan Beginners Need",
    author: "Dignity Trading",
    status: "Draft",
    category: "Education",
    updated: "May 1, 2026",
    reads: "1.2k",
  },
  {
    title: "Risk First, Entries Second",
    author: "Dignity Trading",
    status: "Published",
    category: "Risk Management",
    updated: "Apr 28, 2026",
    reads: "3.8k",
  },
  {
    title: "How to Review a Losing Trade",
    author: "Admin Team",
    status: "Review",
    category: "Psychology",
    updated: "Apr 22, 2026",
    reads: "920",
  },
  {
    title: "Building a Repeatable Market Checklist",
    author: "Dignity Trading",
    status: "Published",
    category: "Strategy",
    updated: "Apr 15, 2026",
    reads: "2.4k",
  },
];

export function parseCompactNumber(input: string) {
  const raw = input.trim().toLowerCase();
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*([km])?$/);
  if (!match) {
    const n = Number(raw.replaceAll(",", ""));
    return Number.isFinite(n) ? n : 0;
  }
  const value = Number(match[1]);
  const suffix = match[2];
  if (!Number.isFinite(value)) return 0;
  if (suffix === "k") return value * 1000;
  if (suffix === "m") return value * 1_000_000;
  return value;
}

export function parseUpdatedDate(input: string) {
  const d = new Date(input);
  return Number.isFinite(d.getTime()) ? d : null;
}

export function formatShortDay(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

