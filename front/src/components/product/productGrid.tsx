"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ProductCardData } from "./types/product";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "../ui/Skeletons";
import { PREMIUM_EASE } from "../ui/MotionPrimitives";

interface ProductGridProps {
  products: ProductCardData[];
  columns?: number;
  initialBatchSize?: number;
  batchIncrement?: number;
}

export default function ProductGrid({
  products,
  initialBatchSize = 8,
  batchIncrement = 8,
}: ProductGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(products.length, initialBatchSize)
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(products.length, initialBatchSize));
  }, [products.length, initialBatchSize]);

  useEffect(() => {
    if (visibleCount >= products.length) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisibleCount(products.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((prev) =>
            Math.min(products.length, prev + batchIncrement)
          );
        }
      },
      { rootMargin: "280px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, products.length, batchIncrement]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
        {visibleProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: "some" }}
            transition={{
              duration: 0.36,
              delay: prefersReducedMotion ? 0 : (index % 8) * 0.035,
              ease: PREMIUM_EASE,
            }}
            className="h-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} aria-live="polite" className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 opacity-70">
            {Array.from({ length: Math.min(4, products.length - visibleCount) }).map(
              (_, idx) => (
                <ProductCardSkeleton key={idx} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
