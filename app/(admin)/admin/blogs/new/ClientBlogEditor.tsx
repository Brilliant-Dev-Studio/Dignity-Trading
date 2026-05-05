"use client";

import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("./BlogEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-none">
      <div className="mb-6 h-[60px] rounded-lg border border-zinc-200 bg-white" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="h-[520px] rounded-lg border border-zinc-200 bg-white" />
        <div className="h-[720px] rounded-lg border border-zinc-200 bg-white" />
      </div>
    </div>
  ),
});

export default function ClientBlogEditor() {
  return <BlogEditor />;
}

