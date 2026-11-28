"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import useCart from "../../hooks/useCart";
import { useHasHydrated } from "../../hooks/useHasHydrated";
import {
  ProductCardData,
  VariantWithAttributes,
  ProductImage,
} from "./types/product";
import { toCartitem } from "@/src/lib/product/ProductWrapper";
import { createProductJsonLd } from "@/src/lib/product/product-schema";
import { CartQuantityStepper } from "../cart/Animatedcart";
import { ProgressiveImage } from "../ui/ProgressiveImage";
import { PREMIUM_EASE } from "../ui/MotionPrimitives";

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images: ProductImage[] = product.images;
  const variants: VariantWithAttributes[] = product.variants;
  const { cart, addItem, updateQuantity } = useCart();
  const hasHydrated = useHasHydrated();
  const prefersReducedMotion = useReducedMotion();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const cartItem = toCartitem(product);
  const existingCartItem = hasHydrated
    ? cart.items.find((item) => item.variantId === cartItem.variantId)
    : undefined;
  const productJsonLd = createProductJsonLd(product);
  const productPrices = variants
    .filter((variant) => variant.is_active)
    .flatMap((variant) =>
      variant.attributes.length > 0
        ? variant.attributes.map((attribute) => attribute.price ?? variant.price)
        : [variant.price]
    )
    .filter((price) => Number.isFinite(price) && price >= 0);
  const displayedPrices =
    productPrices.length > 0 ? productPrices : [product.base_price];
  const minPrice = Math.min(...displayedPrices);
  const maxPrice = Math.max(...displayedPrices);
  const formatPrice = (price: number) => `UGX ${price.toLocaleString("en-UG")}`;

  const handleToggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    toast(next ? `Saved ${product.name}` : `Removed ${product.name}`, {
      description: next
        ? "Added to your favourites for this session."
        : "Removed from your favourites.",
    });
  };

  return (
    <article
      aria-labelledby={`product-title-${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <Link
          href={`/products/${product.id}`}
          tabIndex={-1}
          aria-label={`View ${product.name}`}
          className="relative block h-full w-full"
        >
          {images[0]?.url ? (
            <ProgressiveImage
              src={images[0].url}
              alt={images[0].alt_text?.trim() || product.name}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 25vw"
              fallbackLabel={product.name}
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div aria-hidden="true" className="h-full w-full bg-background" />
          )}

          <span className="absolute left-2.5 top-2.5 rounded-md bg-primary/90 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-xs">
            Fresh
          </span>
        </Link>

        <motion.button
          type="button"
          onClick={handleToggleWishlist}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.84 }}
          animate={
            isWishlisted && !prefersReducedMotion
              ? { scale: [1, 1.28, 0.94, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.28, ease: PREMIUM_EASE }}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from favourites`
              : `Save ${product.name} to favourites`
          }
          aria-pressed={isWishlisted}
          className={`absolute right-2.5 top-2.5 z-10 grid size-9 cursor-pointer place-items-center rounded-full shadow-sm backdrop-blur-xs transition-colors ${
            isWishlisted
              ? "bg-white text-rose-500"
              : "bg-white/90 text-text hover:bg-white hover:text-primary"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            }`}
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {/* Product information */}
      <div className="flex flex-1 flex-col justify-between space-y-3 p-3">
        <Link
          href={`/products/${product.id}`}
          className="block space-y-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div>
            {product.categories[0] && (
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {product.categories[0].name}
              </p>
            )}
            <h3
              id={`product-title-${product.id}`}
              className="mt-0.5 font-semibold text-text transition-colors duration-150 group-hover:text-primary line-clamp-1"
            >
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                {product.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-base font-bold text-primary-dark tabular-nums md:text-lg">
              {productPrices.length > 0
                ? minPrice === maxPrice
                  ? formatPrice(minPrice)
                  : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                : formatPrice(product.base_price)}
            </span>
          </div>
        </Link>

        <div>
          <AnimatePresence mode="wait" initial={false}>
            {existingCartItem ? (
              <motion.div
                key="stepper"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, scale: 0.94, y: 4 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }
                }
                transition={{ duration: 0.16, ease: PREMIUM_EASE }}
                className="flex justify-end"
              >
                <CartQuantityStepper
                  min={1}
                  max={100}
                  value={existingCartItem.quantity}
                  onChange={(quantity) =>
                    updateQuantity(cartItem.variantId, quantity)
                  }
                  size="sm"
                  itemName={product.name}
                />
              </motion.div>
            ) : (
              <motion.button
                key="add-btn"
                type="button"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, scale: 0.96 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                transition={{ duration: 0.16, ease: PREMIUM_EASE }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
                onClick={() => addItem({ ...cartItem, quantity: 1 })}
                aria-label={`Add ${product.name} to basket`}
              >
                <span>+</span>
                <span>Add to</span>
                <ShoppingBasket size={16} aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}
