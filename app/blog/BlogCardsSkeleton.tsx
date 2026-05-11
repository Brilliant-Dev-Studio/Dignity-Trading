/** Placeholder grid while post list streams — matches `BlogPostCard` shell only. */
export default function BlogCardsSkeleton() {
  return (
    <section className="mt-10" aria-busy="true" aria-label="Loading posts">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
            style={{ containIntrinsicSize: "0 420px", contentVisibility: "auto" }}
          >
            <div className="aspect-[16/9] shrink-0 animate-pulse bg-white/10" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              </div>
              <div className="mt-3 h-5 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-4 w-[88%] animate-pulse rounded bg-white/10" />
              <div className="mt-auto pt-5">
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
