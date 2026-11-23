'use client'
import { createContext, useEffect, useMemo, useState } from "react";
import { CartContextType, Cart, createEmptyCart, CartItem } from "../lib/cart/cart-types";
import { readStoredCart, storeCart } from "../lib/cart/cart-store";
import Logger from "../utils/Logger";
// import { createDeflate } from "zlib";

export const CartContext = createContext<CartContextType | null>(null);


export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>(createEmptyCart());
  const [isReady, setIsReady] = useState<boolean>(false);
  const [subtotal, setsubTotal] = useState<number>(0);
  const count = cart.items.length;
  const [Open, setOpen] = useState<boolean>(false);

  //load cart from storage
  useEffect(() => {
    const load: Cart = readStoredCart();
    setCart(load);
    setIsReady(true);

  }, []);

  //persist the cart changes
  useEffect(() => {
    if (isReady)
      storeCart(cart);
  }, [])

  //add cartaitem
  function addItem(item: CartItem) {
    Logger.getInstance().info('Adding item to cart:', item);
    setCart(prev => {
      const exists = prev.items?.some(i =>
        i.variantId === item.variantId
      );
      Logger.getInstance().info('Item exists in cart:', exists);
      const items = exists
        ? prev.items.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ) : [...prev.items, item]

        Logger.getInstance().info('Updated cart items:', items);
      return {
        ...prev,
        items,
        updatedAt: new Date().toISOString(),
      };

    });
  }
   
  //remove item 
  function removeItem(variantId:string){
    setCart( prev=>({
      ...prev,
      items: prev.items.filter(it=>
           variantId !== it.variantId),
      createdAt: new Date().toISOString()
    }));
  }

  //update quantiy
  function updateQuantity(variantId:string, qty:number){
     if (qty <= 0) {
      removeItem(variantId);
      return;
    }
    
    setCart(prev=>({
      ...prev,
      items: prev.items.map( item =>{
        return item.variantId === variantId ? {...item ,quantity:qty}:
        item
      }),
      updatedAt:new Date().toISOString()
    }))
  }

  //clear cart
  function clearCart() {
    setCart((prev) => ({
      ...prev,
      items: [],
      updatedAt: new Date().toISOString(),
    }));
  }
  function updateSubtotal(): number {
      //will fetch the price from the server
      return 0.00;
  }
  function uiOpen(state:boolean,change:boolean):boolean{
    change && setOpen(state);
    return Open;
  }

  const value: CartContextType = useMemo(
    () => ({
      cart,
      count,
      subtotal,
      isReady,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      updateSubtotal,
      uiOpen:({state,change})=>uiOpen(state,change)
    }),
    [cart,count,subtotal, isReady,Open]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
