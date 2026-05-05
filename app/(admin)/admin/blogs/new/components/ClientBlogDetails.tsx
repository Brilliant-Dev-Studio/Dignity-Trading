"use client";

import dynamic from "next/dynamic";

const BlogDetailsForm = dynamic(() => import("./BlogDetailsForm"), {
  ssr: false,
  loading: () => <div className="h-[520px] rounded-lg border border-zinc-200 bg-white" />,
});

export default function ClientBlogDetails() {
  return <BlogDetailsForm />;
}

