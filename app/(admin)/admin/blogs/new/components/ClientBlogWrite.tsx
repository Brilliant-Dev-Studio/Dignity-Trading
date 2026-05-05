"use client";

import dynamic from "next/dynamic";

const BlogWriteEditor = dynamic(() => import("./BlogWriteEditor"), {
  ssr: false,
  loading: () => <div className="h-[720px] rounded-lg border border-zinc-200 bg-white" />,
});

export default function ClientBlogWrite() {
  return <BlogWriteEditor />;
}

