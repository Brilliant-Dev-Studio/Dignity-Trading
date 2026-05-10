import Link from "next/link";
import ClientBlogWrite from "../components/ClientBlogWrite";
import SaveToDatabaseButtons from "../components/SaveToDatabaseButtons";
import { cn } from "@/lib/utils";

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
            className={cn(
              "relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md px-3",
              "text-sm font-medium text-white shadow-sm transition",
              "bg-zinc-950 hover:brightness-110 active:brightness-95",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
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
            <span className="relative z-10">Preview</span>
          </Link>
          <SaveToDatabaseButtons variant="draft" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[760px]">
        <ClientBlogWrite />
      </div>
    </div>
  );
}

