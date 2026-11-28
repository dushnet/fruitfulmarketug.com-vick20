import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, ScrollReveal } from "@/src/components/ui/MotionPrimitives";

export default function MobileBarPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
          Events &amp; Catering
        </p>
        <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl text-balance">
          Mobile Bar
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-text-muted">
          Bring fresh tropical fruit juices, smoothies, and curated bar service
          to your weddings, corporate gatherings, and private celebrations with
          the Fruitful Market UG Mobile Bar.
        </p>
      </FadeIn>

      <ScrollReveal delay={0.08} className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/cocktails"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-fresh active:scale-[0.98]"
        >
          <span>Explore Cocktails</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/products"
          className="inline-flex rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-background active:scale-[0.98]"
        >
          Shop Fresh Ingredients
        </Link>
      </ScrollReveal>
    </section>
  );
}
