"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  PanelRightClose,
  Trash2,
  MessageCircle,
  History,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import useCart from "@/src/hooks/useCart";
import CartItem from "./CartItem";
import { AnimatedCartBadge, AnimatedCartCounter } from "./Animatedcart";
import { SITE_URL, WHATSAPP_PHONE } from "@/src/lib/config";
import { saveOrderToHistory } from "@/src/lib/orders/order-history";
import {
  DEFAULT_COUNTRY_CODE,
  validateInternationalPhone,
} from "@/src/lib/phone";
import { PREMIUM_EASE } from "../ui/MotionPrimitives";

export default function CartSlideIn({
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  const { cart, uiOpen, count, subtotal, isReady, clearCart } = useCart();
  const isOpen = uiOpen({ state: false, change: false });
  const hasItems = isReady && cart.items.length > 0;
  const prefersReducedMotion = useReducedMotion();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState(DEFAULT_COUNTRY_CODE);
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    uiOpen({ state: false, change: true });
  };

  const handleBackToCart = () => {
    if (isSubmitting) return;
    setIsCheckingOut(false);
    setSubmitError(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        uiOpen({ state: false, change: true });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, uiOpen]);

  const handleClearCart = () => {
    clearCart();
    setIsCheckingOut(false);
    setSubmitError(null);
    toast("Cart cleared", {
      description: "All items have been removed from your basket.",
    });
  };

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasItems || isSubmitting) return;

    const trimmedName = customerName.trim();
    const trimmedEmail = customerEmail.trim();
    const trimmedAddress = shippingAddress.trim();

    if (trimmedName.length < 2) {
      setSubmitError("Please enter your full name.");
      return;
    }

    const phoneValidation = validateInternationalPhone(customerPhone);
    if (!phoneValidation.valid) {
      setSubmitError(
        phoneValidation.error ||
          "Phone number must start with a country code (default +256, e.g. +256701234567)."
      );
      return;
    }
    const trimmedPhone = phoneValidation.normalized;

    if (trimmedAddress.length < 5) {
      setSubmitError("Please enter your delivery location/address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: trimmedName,
          customerPhone: trimmedPhone,
          customerEmail: trimmedEmail || null,
          shippingAddress: trimmedAddress,
          items: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        orderId?: string;
        totalAmount?: number;
      };

      if (!response.ok) {
        const message =
          data.error || "Unable to place your order. Please try again.";
        setSubmitError(message);
        toast.error("Order failed", { description: message });
        return;
      }

      const formattedTotal = Number(data.totalAmount ?? subtotal).toLocaleString(
        "en-UG"
      );

      const orderId = data.orderId ?? crypto.randomUUID();
      const orderUrl = `${SITE_URL}/orders/${orderId}`;
      const itemSummary = cart.items
        .map(
          (i) =>
            `- ${i.quantity}x ${i.name} @ UGX ${(
              i.unitPrice * i.quantity
            ).toLocaleString("en-UG")}`
        )
        .join("\n");

      saveOrderToHistory({
        orderId,
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        shippingAddress: trimmedAddress,
        totalAmount: Number(data.totalAmount ?? subtotal),
        createdAt: new Date().toISOString(),
        items: cart.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      });

      const waText = `Hello Fruitful Market UG! I have placed an order.\n\nOrder ID: #${orderId.slice(
        0,
        8
      )}\nName: ${trimmedName}\nPhone: ${trimmedPhone}\n${
        trimmedEmail ? `Email: ${trimmedEmail}\n` : ""
      }Delivery Location: ${trimmedAddress}\nTotal: UGX ${formattedTotal}\n\nItems:\n${itemSummary}\n\nView Order: ${orderUrl}`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
        waText
      )}`;

      toast.success("Order placed in system successfully!", {
        description: `Order #${orderId.slice(0, 8)} saved. WhatsApp will now open to send confirmation.`,
        duration: 20000,
        action: {
          label: "Open WhatsApp",
          onClick: () => window.open(waUrl, "_blank"),
        },
        cancel: {
          label: "Dismiss",
          onClick: () => {},
        },
      });

      window.open(waUrl, "_blank");

      clearCart();
      setCustomerName("");
      setCustomerPhone(DEFAULT_COUNTRY_CODE);
      setCustomerEmail("");
      setShippingAddress("");
      setIsCheckingOut(false);
      setSubmitError(null);
      handleClose();
    } catch {
      const message =
        "Network error while placing your order. Please try again.";
      setSubmitError(message);
      toast.error("Order failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showingCheckout = isCheckingOut && hasItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[55] bg-black/45 backdrop-blur-[2px]"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={showingCheckout ? "Checkout" : "Shopping Basket"}
            initial={prefersReducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className={`cart-slide-in fixed right-0 top-0 z-[60] flex h-dvh max-h-dvh w-full md:max-w-md flex-col overflow-hidden bg-white shadow-2xl ${className}`}
          >
            {/* Fixed Top Header */}
            <div className="cart-slide-in-header flex flex-none items-center justify-between gap-2 bg-primary px-4 py-3.5 text-white">
              {showingCheckout ? (
                <button
                  type="button"
                  onClick={handleBackToCart}
                  disabled={isSubmitting}
                  aria-label="Back to shopping basket"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-white/95 transition hover:bg-white/10 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Back to Cart</span>
                </button>
              ) : (
                <h2 className="text-lg font-bold md:text-xl">
                  Shopping Basket
                </h2>
              )}

              <div className="flex items-center gap-2">
                {showingCheckout ? (
                  <span className="text-xs font-semibold text-accent">
                    Checkout
                  </span>
                ) : (
                  <AnimatedCartBadge
                    count={isReady ? count : 0}
                    icon="basket"
                    onClick={() => uiOpen({ state: true, change: true })}
                  />
                )}
                <motion.button
                  type="button"
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                  className="close-button cursor-pointer rounded-md p-1.5 transition hover:bg-white/10"
                  onClick={handleClose}
                  aria-label="Close shopping basket"
                >
                  <PanelRightClose size={22} />
                </motion.button>
              </div>
            </div>

            {/* Body & Footer switch smoothly between Cart View and Checkout View */}
            <AnimatePresence mode="wait" initial={false}>
              {showingCheckout ? (
                <motion.div
                  key="checkout-view"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: 20 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                  {/* Internally Scrollable Checkout Form Area */}
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <ShoppingBag className="h-4 w-4 text-primary-dark" aria-hidden="true" />
                        <span>
                          {count} {count === 1 ? "item" : "items"} in basket
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackToCart}
                        disabled={isSubmitting}
                        className="cursor-pointer font-semibold text-primary-dark hover:underline disabled:opacity-50"
                      >
                        Edit items
                      </button>
                    </div>

                    <p className="rounded-lg bg-emerald-50 p-2.5 text-[11px] leading-relaxed text-emerald-800">
                      <strong className="font-semibold">Note:</strong> Your order
                      is placed in our system first when you confirm below.
                      WhatsApp will then open so you can send your order
                      confirmation.
                    </p>

                    <form
                      id="cart-checkout-form"
                      onSubmit={handlePlaceOrder}
                      className="space-y-3.5 pb-2"
                    >
                      <div>
                        <label
                          htmlFor="order-customer-name"
                          className="mb-1 block text-xs font-medium text-primary"
                        >
                          Full Name (Required)
                        </label>
                        <input
                          id="order-customer-name"
                          type="text"
                          required
                          minLength={2}
                          maxLength={120}
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Sarah Namukasa"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="order-customer-phone"
                          className="mb-1 flex items-center justify-between text-xs font-medium text-primary"
                        >
                          <span>Phone Number (WhatsApp - Required)</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </span>
                        </label>
                        <input
                          id="order-customer-phone"
                          type="tel"
                          required
                          pattern="^\+[1-9]\d{8,14}$"
                          title="Must start with country code, default +256 (e.g. +256701234567)"
                          maxLength={20}
                          value={customerPhone}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^\d+]/g, "");
                            const normalized = cleaned.startsWith("+")
                              ? "+" + cleaned.slice(1).replace(/\+/g, "")
                              : cleaned
                              ? cleaned
                              : DEFAULT_COUNTRY_CODE;
                            setCustomerPhone(normalized);
                          }}
                          placeholder="+256701234567"
                          className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm text-text transition-colors focus:border-primary focus:outline-none"
                        />
                        <p className="mt-1 text-[11px] leading-snug text-text-muted">
                          Must start with country code (default{" "}
                          <strong className="text-primary">+256</strong>, e.g.{" "}
                          <span className="font-mono">+256701234567</span> — omit
                          leading 0).
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="order-customer-email"
                          className="mb-1 block text-xs font-medium text-primary"
                        >
                          Email (Optional)
                        </label>
                        <input
                          id="order-customer-email"
                          type="email"
                          maxLength={150}
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. sarah@example.com"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="order-shipping-address"
                          className="mb-1 block text-xs font-medium text-primary"
                        >
                          Delivery Location / Address (Required)
                        </label>
                        <textarea
                          id="order-shipping-address"
                          required
                          minLength={5}
                          maxLength={500}
                          rows={3}
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Street, area, and delivery landmark"
                          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors focus:border-primary focus:outline-none"
                        />
                      </div>

                      {submitError && (
                        <p
                          role="alert"
                          className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                        >
                          {submitError}
                        </p>
                      )}
                    </form>
                  </div>

                  {/* Fixed Bottom Checkout Action Footer */}
                  <div className="flex-none border-t border-gray-200 bg-white p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between text-primary">
                      <span className="text-sm font-semibold">Order Total</span>
                      <span className="inline-flex items-center gap-1 text-base font-bold text-primary-dark tabular-nums">
                        <span>UGX</span>
                        <AnimatedCartCounter
                          value={isReady ? subtotal : 0}
                          formatValue={(val) => val.toLocaleString("en-UG")}
                          showPulse={false}
                          ariaLabel="Checkout total"
                        />
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBackToCart}
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-full border border-border px-4 py-3 text-sm font-semibold text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        form="cart-checkout-form"
                        disabled={isSubmitting}
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.98 }
                        }
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {isSubmitting
                            ? "PLACING ORDER..."
                            : "PLACE ORDER VIA WHATSAPP"}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cart-view"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, x: -20 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                  {/* Internally Scrollable Cart Items List */}
                  <div className="cart-slide-in-content min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    {hasItems ? (
                      <AnimatePresence initial={false}>
                        {cart.items.map((item) => (
                          <CartItem key={item.variantId} item={item} />
                        ))}
                      </AnimatePresence>
                    ) : (
                      <div className="p-6 text-center space-y-4">
                        <p className="text-text-muted">
                          Your basket is empty.
                        </p>
                        <div className="pt-2">
                          <Link
                            href="/orders/history"
                            onClick={handleClose}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <History className="h-3.5 w-3.5" />
                            View browser order history
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Bottom Cart Summary Footer */}
                  <div className="cart-slide-in-footer flex-none border-t border-gray-200 bg-white p-5 sm:p-6">
                    <div className="mb-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-primary">
                          Cart Summary
                        </h3>
                        <div className="flex items-center gap-3">
                          <Link
                            href="/orders/history"
                            onClick={handleClose}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            title="View order history"
                          >
                            <History className="h-3.5 w-3.5" />
                            History
                          </Link>
                          {hasItems && (
                            <button
                              type="button"
                              onClick={handleClearCart}
                              disabled={isSubmitting}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-primary">
                        <span className="font-semibold">Total</span>
                        <span className="inline-flex items-center gap-1 font-bold text-primary-dark tabular-nums">
                          <span>UGX</span>
                          <AnimatedCartCounter
                            value={isReady ? subtotal : 0}
                            formatValue={(val) => val.toLocaleString("en-UG")}
                            showPulse={false}
                            ariaLabel="Cart total"
                          />
                        </span>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      disabled={!hasItems}
                      whileTap={
                        prefersReducedMotion || !hasItems
                          ? undefined
                          : { scale: 0.98 }
                      }
                      onClick={() => {
                        setSubmitError(null);
                        setIsCheckingOut(true);
                      }}
                      className="checkout-button w-full cursor-pointer rounded-full bg-accent px-4 py-3 font-semibold text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      MAKE ORDER
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
