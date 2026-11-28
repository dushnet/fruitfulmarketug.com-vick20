"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MenuToggle from "./toggleMenue";
import { PWAInstallButton } from "./pwa/PWAInstallButton";
import { PREMIUM_EASE } from "./ui/MotionPrimitives";

const navItems = [
  { label: "About Us", href: "/about-us" },
  { label: "Mobile Bar", href: "/mobile-bar" },
  { label: "Cocktails", href: "/cocktails" },
  { label: "Admin", href: "/admin" },
];

function DesktopNavLinks({ activePath }: { activePath: string | null }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {navItems.map((item) => {
        const isActive = activePath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative py-1 text-sm font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-accent ${
              isActive ? "text-accent" : "text-white/90"
            }`}
          >
            {item.label}
            {isActive && (
              <motion.span
                layoutId={prefersReducedMotion ? undefined : "desktop-nav-underline"}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent"
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

function DesktopNavWithPathname() {
  const pathname = usePathname();
  return <DesktopNavLinks activePath={pathname} />;
}

function MobileNavLinks({
  activePath,
  onNavigate,
}: {
  activePath: string | null;
  onNavigate: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {navItems.map((item, idx) => {
        const isActive = activePath === item.href;
        return (
          <motion.div
            key={item.href}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.24,
              delay: prefersReducedMotion ? 0 : idx * 0.045,
              ease: PREMIUM_EASE,
            }}
          >
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-text hover:bg-background hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          </motion.div>
        );
      })}
    </>
  );
}

function MobileNavWithPathname({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return <MobileNavLinks activePath={pathname} onNavigate={onNavigate} />;
}

export default function Appbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      {/* 1. Top Bar */}
      <header className="appbar flex flex-col bg-primary text-white px-2 md:px-6">
        <div className="flex flex-row justify-between items-center md:mx-auto md:w-full md:max-w-7xl md:py-2">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src="/full_logo.png"
              alt="Fruitful Market UG logo"
              width={200}
              height={160}
              className="h-auto w-[160px] sm:w-[180px] md:w-[190px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-7"
          >
            <Suspense fallback={<DesktopNavLinks activePath={null} />}>
              <DesktopNavWithPathname />
            </Suspense>
            <PWAInstallButton variant="compact" />
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="icons flex flex-row items-center gap-2 md:hidden">
            <PWAInstallButton variant="compact" />
            <MenuToggle
              bg="bg-background"
              isOpen={isMenuOpen}
              onToggle={setIsMenuOpen}
            />
          </div>
        </div>
      </header>

      {/* Mobile Navigation Backdrop & Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="mobile-nav-backdrop"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-[2px] md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="mobile-nav-drawer"
              role="dialog"
              aria-label="Menu"
              aria-modal="true"
              initial={prefersReducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="fixed right-0 top-0 z-[60] flex h-dvh w-[85vw] max-w-sm flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border bg-primary px-5 py-4 text-white">
                <span className="text-lg font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 cursor-pointer place-items-center rounded-md text-2xl leading-none text-white transition hover:bg-white/10"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 p-4"
              >
                <Suspense
                  fallback={
                    <MobileNavLinks
                      activePath={null}
                      onNavigate={() => setIsMenuOpen(false)}
                    />
                  }
                >
                  <MobileNavWithPathname
                    onNavigate={() => setIsMenuOpen(false)}
                  />
                </Suspense>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
