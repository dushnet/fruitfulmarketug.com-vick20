'use client';
import { ProductCardData  } from "./types/product";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

interface ProductGridProps {
  products: ProductCardData[];
  columns?: number;
}
export default function ProductGrid({
  products,
  columns = 2,
}: ProductGridProps) {

  const gridColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
