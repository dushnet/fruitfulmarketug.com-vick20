
import { ProductCardData  } from "./types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductCardData[];
  columns?: number;
}
export default function ProductGrid({
  products,
  columns = 2,
}: ProductGridProps) {
  // log('productss length',)
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
      className={`grid ${gridColumns[columns] ?? "grid-cols-4"} gap-4`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
