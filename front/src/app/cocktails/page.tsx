import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, ScrollReveal } from "@/src/components/ui/MotionPrimitives";

export default function CocktailsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
          Fresh Blends &amp; Mixology
        </p>
        <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl text-balance">
          Cocktails
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-text-muted">
          Discover refreshing fruit-forward cocktails and mocktails crafted from
          ripe Ugandan mangoes, passion fruit, pineapples, and fresh garden
          herbs.
        </p>
      </FadeIn>

      <ScrollReveal delay={0.08} className="mt-8">
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark active:scale-[0.98]"
        >
          <span>Shop Cocktail Fruits &amp; Herbs</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </ScrollReveal>
    </section>
  );
}
