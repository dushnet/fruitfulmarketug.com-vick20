"use client";

import useCart from "@/src/hooks/useCart";
import CartItem from "./CartItem";
import { PanelRightClose } from "lucide-react";
import { AnimatedCartBadge } from "./Animatedcart";

export default function CartSlideIn({ ...props }: any) {
    const { cart, uiOpen, count, isReady } = useCart();
    const subtotal = cart.items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
    );
    const formattedSubtotal = `UGX ${subtotal.toLocaleString("en-UG")}`;

    return (
        <div
            className={`cart-slide-in fixed top-0 z-50 flex h-dvh w-full flex-col overflow-hidden bg-white shadow-lg transition-all duration-300 ${uiOpen({ state: false, change: false }) ? "right-0" : "right-[-100%]"
                } ${props.className ?? ""}`}
            {...props}
        >
            <div className="cart-slide-in-header flex flex-none flex-row items-center justify-between bg-primary p-4 text-white">
                <h2 className="text-[1.25rem] font-bold">Shopping Basket</h2>
                <AnimatedCartBadge
                    count={isReady ? count : 0}
                    icon="basket"
                    onClick={() => uiOpen({ state: true, change: true })}
                />
                <button
                    className="close-button"
                    onClick={() => uiOpen({ state: false, change: true })}
                    aria-label="Close shopping basket"
                >
                    <PanelRightClose size={24} />
                </button>
            </div>

            <div className="cart-slide-in-content min-h-0 flex-1 overflow-y-auto">
                {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <CartItem key={item.variantId} item={item} />
                    ))
                ) : (
                    <p className="p-6 text-center text-text-muted">Your basket is empty.</p>
                )}
            </div>

            <div className="cart-slide-in-footer flex-none border-t border-gray-200 bg-white p-6">
                <div className="mb-5">
                    <h3 className="mb-3 text-lg font-bold text-primary">Cart Summary</h3>
                    <div className="flex items-center justify-between text-primary">
                        <span>Subtotal</span>
                        <span className="font-semibold">{formattedSubtotal}</span>
                    </div>
                </div>
                <button className="checkout-button w-full rounded-full bg-accent px-4 py-3 font-semibold text-primary">
                    MAKE ORDER
                </button>
            </div>
        </div>
    );
}
