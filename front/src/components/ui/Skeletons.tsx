export function HeroSkeleton() {
  return (
    <div className="relative flex min-h-[360px] w-full items-center overflow-hidden rounded-2xl bg-primary/90 px-6 py-10 md:min-h-[400px] md:px-12">
      <div className="max-w-xl space-y-4 w-full">
        <div className="h-3.5 w-32 rounded-full bg-white/15 animate-pulse" />
        <div className="h-10 w-3/4 rounded-xl bg-white/20 animate-pulse" />
        <div className="h-4 w-full max-w-md rounded-lg bg-white/15 animate-pulse" />
        <div className="h-4 w-2/3 max-w-sm rounded-lg bg-white/15 animate-pulse" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-28 rounded-full bg-accent/40 animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="animate-shimmer aspect-[4/3] w-full" />
      <div className="space-y-3 p-3">
        <div className="space-y-2">
          <div className="animate-shimmer h-3 w-16 rounded" />
          <div className="animate-shimmer h-4 w-4/5 rounded" />
          <div className="animate-shimmer h-3 w-full rounded" />
        </div>
        <div className="animate-shimmer h-5 w-24 rounded" />
        <div className="animate-shimmer h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-5 pb-8 md:py-8 md:pb-12">
      <div className="animate-shimmer mb-6 h-4 w-48 rounded" />
      <div className="grid items-start gap-6 md:grid-cols-2 md:gap-10">
        <div className="space-y-3">
          <div className="animate-shimmer aspect-[4/3] sm:aspect-square w-full rounded-2xl border border-border" />
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-shimmer h-16 w-16 sm:h-20 sm:w-20 rounded-xl"
              />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="animate-shimmer h-3.5 w-24 rounded" />
            <div className="animate-shimmer h-9 w-3/4 rounded-lg" />
          </div>
          <div className="animate-shimmer h-14 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="animate-shimmer h-14 rounded-xl" />
            <div className="animate-shimmer h-14 rounded-xl" />
          </div>
          <div className="animate-shimmer h-12 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}

export function OrderDetailSkeleton() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <div className="animate-shimmer mb-6 h-4 w-32 rounded" />
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="h-36 bg-primary/90 animate-pulse" />
        <div className="p-6 space-y-5">
          <div className="animate-shimmer h-12 w-full rounded-lg" />
          <div className="animate-shimmer h-28 w-full rounded-xl" />
          <div className="animate-shimmer h-36 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
