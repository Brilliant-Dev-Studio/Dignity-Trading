export default function BlogPostLoading() {
  return (
    <div className="bg-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-8 w-full max-w-2xl animate-pulse rounded-md bg-white/10 sm:h-9" />
        <div className="mt-3 h-px w-20 bg-white/10" />
        <div className="mt-3 h-4 max-w-xl animate-pulse rounded bg-white/10" />
        <div className="mt-4 flex gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-[88%] animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
