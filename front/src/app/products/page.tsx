import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductGrid from "../../components/product/productGrid";
import { getProducts } from "../../lib/product/productsProvider";
import { ProductGridSkeleton } from "../../components/ui/Skeletons";
import { FadeIn } from "../../components/ui/MotionPrimitives";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
  }>;
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-3 py-6 md:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="animate-shimmer h-7 w-40 rounded" />
            <div className="animate-shimmer h-5 w-24 rounded" />
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      }
    >
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const resolved = await searchParams;
  const requestedPage = Number(resolved.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const category = resolved.category?.trim() || null;
  const search = resolved.q?.trim() || null;

  const { items, page, totalPages, totalCount } = await getProducts({
    page: currentPage,
    pageSize: 12,
    filters: category ? { categories: [category] } : undefined,
    search,
  });

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (category) params.set("category", category);
    if (search) params.set("q", search);
    return `/products?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
      <FadeIn>
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-primary md:text-2xl">
              {search
                ? `Results for "${search}"`
                : category
                ? category
                : "All Fresh Produce"}
            </h1>
            <p className="mt-0.5 text-xs text-text-muted tabular-nums">
              {totalCount} {totalCount === 1 ? "item" : "items"} available
            </p>
          </div>

          {(search || category) && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-background"
            >
              <span>Reset filters</span>
            </Link>
          )}
        </header>
      </FadeIn>

      {items.length === 0 ? (
        <FadeIn className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-base font-semibold text-primary">
            No matching produce found
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Try searching for another fruit, vegetable, or herb.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            View all produce
          </Link>
        </FadeIn>
      ) : (
        <ProductGrid products={items} />
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-4 py-8"
        >
          {page > 1 ? (
            <Link
              href={buildPageHref(page - 1)}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-background"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted opacity-45">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous</span>
            </span>
          )}
          <span className="text-sm font-medium text-primary tabular-nums">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildPageHref(page + 1)}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-background"
            >
              <span>Next</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted opacity-45">
              <span>Next</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
