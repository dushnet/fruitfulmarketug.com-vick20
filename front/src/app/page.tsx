import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "../components/product/productGrid";
import HeroSlider from "../components/slider";
import { getProducts } from "../lib/product/productsProvider";
import { HeroSkeleton, ProductGridSkeleton } from "../components/ui/Skeletons";

const FreshnessPromise = dynamic(
  () => import("../components/home/FreshnessPromise"),
  {
    loading: () => (
      <div className="mx-auto mt-14 w-full max-w-7xl border-t border-border pt-10 pb-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="animate-shimmer h-44 rounded-2xl" />
          <div className="animate-shimmer h-44 rounded-2xl" />
          <div className="animate-shimmer h-44 rounded-2xl" />
        </div>
      </div>
    ),
  }
);

async function FeaturedProducts() {
  const { items } = await getProducts({ page: 1, pageSize: 12 });
  return <ProductGrid products={items} />;
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background font-sans dark:bg-black">
      <div className="min-h-screen w-full p-3 md:px-6">
        <div className="mx-auto mt-3 max-w-7xl">
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSlider />
          </Suspense>
        </div>

        {/* Featured product grid */}
        <section
          aria-labelledby="featured-products-heading"
          className="mx-auto mt-8 max-w-7xl"
        >
          <div className="mb-4 flex flex-row items-center justify-between text-primary">
            <div>
              <h2
                id="featured-products-heading"
                className="text-lg font-bold capitalize tracking-tight md:text-xl"
              >
                Featured Produce
              </h2>
              <p className="text-xs text-text-muted">
                Fresh harvest picks ready for doorstep delivery
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              <span>See all</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <FeaturedProducts />
          </Suspense>
        </section>

        <FreshnessPromise />
      </div>
    </div>
  );
}
