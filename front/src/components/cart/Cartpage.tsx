"use client";

import useCart from "@/src/hooks/useCart";
import CartItem from "./CartItem";
import { PanelRightClose } from "lucide-react";
import { AnimatedCartBadge } from "./Animatedcart";

//lets see if this commit will worl

export default function CartSlideIn({...props}:any){ {
    const {cart, uiOpen, count, isReady} = useCart();
    console.log("cart slide in open state",uiOpen({state:false, change:false}));
    return <div className={`transition-all duration-300 cart-slide-in fixed top-0 ${uiOpen({state:false, change:false})?"right-0": "right-[-100%]"} h-full w-[100%] bg-white shadow-lg z-50 overflow-y-auto ${props.className}`} {...props}>
        <div className="cart-slide-in-header bg-primary text-white p-4 flex flex-row justify-between items-center">
            <h2 className="font-bold text-[1.25rem]">Shopping Basket</h2>
            <AnimatedCartBadge 
            // just to make sure the count is updated when the cart is opened
                    count={isReady ? count : 0}
                    icon="basket"
                    onClick={() => uiOpen({state: true, change: true})}
                  />
            
            <button className="close-button" onClick={() => uiOpen({state: false, change: true})}>
            <PanelRightClose size={24} />
            </button>
        </div>

        <div className="cart-slide-in-content">
            {/* Render cart items here */}
            {cart.items.map((item) => (
                <CartItem key={'ff' + Math.random()} item={item} />
            ))}
        </div>

        <div className="cart-slide-in-footer fixed bottom-0 w-full p-8 bg-black border-t border-gray-200 items-center justify-between flex flex-row">
            <button className="checkout-button rounded-full bg-accent text-white px-4 py-1 w-full">MAKE ORDER</button>
        </div>
    </div>;
}}
