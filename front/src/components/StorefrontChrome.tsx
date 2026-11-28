"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Appbar from "./appbar";
import StickySearchBar from "./StickySearchbar";
import MyFooter from "./footer";
import { MotionProvider, RouteTransition } from "./ui/MotionPrimitives";

const CartSlideIn = dynamic(() => import("./cart/Cartpage"), {
  ssr: false,
});

const OfflineIndicator = dynamic(
  () => import("./pwa/OfflineIndicator").then((m) => m.OfflineIndicator),
  { ssr: false }
);

function StorefrontChromeInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <MotionProvider>
        <RouteTransition>{children}</RouteTransition>
        <OfflineIndicator />
      </MotionProvider>
    );
  }

  return (
    <MotionProvider>
      <Appbar />

      {/* Sticky Search Bar on storefront */}
      <div className="flex flex-row gap-2 w-full sticky top-0 z-50 text-background px-2 pb-2 pt-3 shadow-md bg-primary/95 backdrop-blur-md transition-shadow">
        <StickySearchBar />
      </div>

      {/* Lazy-loaded slide-in cart drawer */}
      <CartSlideIn />

      <main>
        <RouteTransition>{children}</RouteTransition>
      </main>

      <MyFooter />

      <OfflineIndicator />
    </MotionProvider>
  );
}

export default function StorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<main>{children}</main>}>
      <StorefrontChromeInner>{children}</StorefrontChromeInner>
    </Suspense>
  );
}
