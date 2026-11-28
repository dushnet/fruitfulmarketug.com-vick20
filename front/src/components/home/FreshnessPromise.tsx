"use client";

import Link from "next/link";
import { Leaf, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { ScrollReveal } from "../ui/MotionPrimitives";

const pillars = [
  {
    index: "01",
    title: "Harvested Fresh Daily",
    description:
      "Hand-selected every morning from partner Ugandan farms so fruits, greens, and herbs arrive crisp and full of flavor.",
    icon: Leaf,
  },
  {
    index: "02",
    title: "Same-Day Doorstep Dispatch",
    description:
      "Packed in breathable, produce-safe crates and delivered straight to your kitchen or business across Kampala and beyond.",
    icon: Truck,
  },
  {
    index: "03",
    title: "Transparent Fair Pricing",
    description:
      "Every weight, bunch, and crate is priced clearly in UGX with instant WhatsApp confirmation and order tracking.",
    icon: ShieldCheck,
  },
];

export default function FreshnessPromise() {
  return (
    <section
      aria-labelledby="freshness-promise-heading"
      className="mx-auto mt-14 w-full max-w-7xl border-t border-border pt-10 pb-8 px-1"
    >
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">
              Our Standard
            </p>
            <h2
              id="freshness-promise-heading"
              className="mt-1 text-2xl font-bold text-primary md:text-3xl text-balance"
            >
              From Ugandan farms to your table
            </h2>
          </div>
          <Link
            href="/about-us"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <span>Our story</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <ScrollReveal
              key={pillar.index}
              delay={idx * 0.08}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-text-muted tabular-nums">
                  {pillar.index}.
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-base font-bold text-primary">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pillar.description}
              </p>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
