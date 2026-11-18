"use client";

import { ShoppingCart } from "lucide-react";
import  useCart  from "../../hooks/useCart";
import { useEffect } from "react";

export default function CartIcon({...props}:React.HTMLAttributes<HTMLDivElement>){ {
  const { count } = useCart();
//count is the cart count
    useEffect(() => {
      console.log("Cart count updated:", count);
    }, [count]);

  return (
    <div className={`relative inline-flex ${props.className}`} {...props}>
      <ShoppingCart size={24} />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-light">
          {count}
        </span>
      )}
    </div>
  );
}}