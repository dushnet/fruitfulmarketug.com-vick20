"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { number } = useCart();

  return (
    <div className="relative inline-flex">
      <ShoppingCart size={24} />

      {number > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-light">
          {number}
        </span>
      )}
    </div>
  );
}