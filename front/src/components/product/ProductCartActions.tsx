"use client";

import { useState } from "react";
import useCart from "@/src/hooks/useCart";
import type { ProductCardData, VariantWithAttributes } from "./types/product";
import { CartQuantityStepper } from "../cart/Animatedcart";

interface ProductCartActionsProps {
  product: ProductCardData;
  variants: VariantWithAttributes[];
}

export default function ProductCartActions({
  product,
  variants,
}: ProductCartActionsProps) {
  const { cart, addItem, updateQuantity } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    String(variants[0]?.id ?? ""),
  );
  const selectedVariant = variants.find(
    (variant) => String(variant.id) === selectedVariantId,
  );
  const cartItem = cart.items.find(
    (item) => item.variantId === selectedVariantId,
  );
  const image = product.images[0];

  if (!selectedVariant) {
    return (
      <p className="text-sm text-text-muted">
        This product is currently unavailable.
      </p>
    );
  }

  const variantLabel = selectedVariant.attributes
    .map((attribute) => `${attribute.name}: ${attribute.value}`)
    .join(", ");

  return (
    <div className="space-y-4">
      {variants.length > 1 && (
        <div className="space-y-2">
          <label
            htmlFor={`variant-${product.id}`}
            className="block text-sm font-medium text-primary"
          >
            Choose an option
          </label>
          <select
            id={`variant-${product.id}`}
            value={selectedVariantId}
            onChange={(event) => setSelectedVariantId(event.target.value)}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-primary"
          >
            {variants.map((variant) => {
              const attributes = variant.attributes
                .map((attribute) => `${attribute.name}: ${attribute.value}`)
                .join(", ");

              return (
                <option key={variant.id} value={String(variant.id)}>
                  {attributes || variant.sku} — UGX{" "}
                  {variant.price.toLocaleString("en-UG")}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {cartItem ? (
        <CartQuantityStepper
          min={1}
          max={100}
          value={cartItem.quantity}
          onChange={(quantity) =>
            updateQuantity(selectedVariantId, quantity)
          }
          itemName={product.name}
          size="md"
        />
      ) : (
        <button
          type="button"
          onClick={() =>
            addItem({
              variantId: selectedVariantId,
              productId: String(selectedVariant.product_id),
              name: product.name,
              image: image?.url ?? "",
              unitPrice: selectedVariant.price,
              quantity: 1,
            })
          }
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
          aria-label={`Add ${product.name}${variantLabel ? `, ${variantLabel}` : ""} to basket`}
        >
          Add to basket
        </button>
      )}
    </div>
  );
}
