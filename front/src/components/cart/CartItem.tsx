"use client";

import { motion, useReducedMotion } from "motion/react";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../lib/cart/cart-types";
import { AnimatedCartCounter, CartQuantityStepper } from "./Animatedcart";
import { ProgressiveImage } from "../ui/ProgressiveImage";
import useCart from "@/src/hooks/useCart";
import { PREMIUM_EASE } from "../ui/MotionPrimitives";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const totalPrice = item.unitPrice * item.quantity;

  return (
    <motion.aside
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 36, scale: 0.96 }
      }
      transition={{ duration: 0.22, ease: PREMIUM_EASE }}
      className="cart-item flex h-auto flex-row items-center justify-between gap-2 border-b border-gray-200 p-2 text-[0.875rem] text-primary"
    >
      <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-md bg-background">
        <ProgressiveImage
          src={item.image}
          alt={item.name}
          fill
          loading="lazy"
          sizes="120px"
          fallbackLabel={item.name}
          className="object-cover"
        />
      </div>

      <div className="cart-item-details flex w-full flex-col justify-start gap-1">
        <h3 className="cart-item-name font-bold line-clamp-2">{item.name}</h3>
        <p className="cart-item-price text-xs text-text-muted tabular-nums">
          UGX {item.unitPrice.toLocaleString("en-UG")}
        </p>
        <p className="item-total-price inline-flex items-center gap-1 text-base font-bold tabular-nums">
          <span>UGX</span>
          <AnimatedCartCounter
            value={totalPrice}
            formatValue={(val) => val.toLocaleString("en-UG")}
            showPulse={false}
            ariaLabel={`${item.name} total`}
          />
        </p>
      </div>

      <div className="cart-item-quantity flex flex-col items-end justify-end gap-2">
        <motion.button
          type="button"
          whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
          onClick={() => removeItem(item.variantId)}
          aria-label={`Remove ${item.name}`}
          className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <Trash2 className="cart-item-delete-icon h-4 w-4" aria-hidden="true" />
        </motion.button>
        <CartQuantityStepper
          min={1}
          max={100}
          onIncrement={() => updateQuantity(item.variantId, item.quantity + 1)}
          onDecrement={() => updateQuantity(item.variantId, item.quantity - 1)}
          value={item.quantity}
          size="sm"
          itemName={item.name}
        />
      </div>
    </motion.aside>
  );
}