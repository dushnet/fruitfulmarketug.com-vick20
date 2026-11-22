import type { ProductCardData } from "@/src/components/product/types/product";

type ProductJsonLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description?: string;
  image?: string[];
  category?: string;
  productID: string;
  sku?: string;
  offers?: {
    "@type": "AggregateOffer";
    priceCurrency: "UGX";
    lowPrice: number;
    highPrice: number;
    offerCount: number;
  };
};

export function createProductJsonLd(product: ProductCardData): ProductJsonLd {
  const activeVariants = product.variants.filter((variant) => variant.is_active);
  const prices = activeVariants.flatMap((variant) =>
    variant.attributes.length > 0
      ? variant.attributes.map((attribute) => attribute.price ?? variant.price)
      : [variant.price],
  ).filter((price) => Number.isFinite(price) && price >= 0);

  const images = product.images
    .map((image) => image.url)
    .filter((url) => url.length > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(product.categories[0] ? { category: product.categories[0].name } : {}),
    productID: String(product.id),
    ...(activeVariants.length === 1 ? { sku: activeVariants[0].sku } : {}),
    ...(prices.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer" as const,
            priceCurrency: "UGX" as const,
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
          },
        }
      : {}),
  };
}
