import Link from "next/link";
import ClientBlogWrite from "../components/ClientBlogWrite";

export default function BlogWritePage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">Blog / Create</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Write</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blogs/new/details"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 shadow-sm transition-colors hover:bg-zinc-50"
          >
            Back: Details
          </Link>
          <Link
            href="/admin/blogs/preview"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800"
          >
            Preview
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[760px]">
        <ClientBlogWrite />
      </div>
    </div>
  );
}

