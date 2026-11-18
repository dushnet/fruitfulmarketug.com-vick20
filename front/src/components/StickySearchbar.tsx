"use client";

import Searchbar from "./searchbar";
import {AnimatedCartBadge} from "./cart/Animatedcart";
import  useCart  from "../hooks/useCart";

export default function StickySearchBar() {
  const { count, isReady } = useCart();

  return (
    <div className="flex flex-row gap-2 w-full sticky top-0 z-50 text-background px-2 pb-2 pt-3 shadow-md bg-primary backdrop-blur-sm bg-opacity-80">

      <Searchbar />

      <AnimatedCartBadge
        count={isReady ? count : 0}
        icon="basket"
        onClick={() => {}}
      />

    </div>
  );
}