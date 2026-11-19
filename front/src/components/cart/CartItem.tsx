'use client'

import type { CartItem} from "../../lib/cart/cart-types";
import Image from "next/image";
import { CartQuantityStepper } from "./Animatedcart";
import { useEffect, useState } from "react";
import { DeleteIcon, Trash2 } from "lucide-react";
import useCart from "@/src/hooks/useCart";
interface CartItemProps{
    item:CartItem
    props?:{}
}
export default function CartItem( { props,item }:CartItemProps){
    const{updateQuantity,addItem,removeItem}=useCart();
    const [qty, setQty] = useState<number>(item.quantity);
    const [totalPrice, setTotalPrice] = useState<number>(item.unitPrice * item.quantity);
    
    //calculate total price when quantity changes
    useEffect(() => {
        setTotalPrice(item.unitPrice * qty);
      }, [qty, item.unitPrice]);
      function handleIncrement() {
        updateQuantity(item.variantId,qty);
      }

    return(
        <aside className="cart-item flex flex-row justify-between items-center h-auto p-2 border-b border-gray-200 gap-2 text-[0.875rem] text-primary">
         <div className="relative w-40 aspect-[2/3] overflow-hidden bg-background rounded-md">
  <Image
    src={item.image}
    alt={item.name}
    fill
    sizes="120px"
    className="object-cover"
  />
</div>
        <div className="cart-item-details  flex flex-col justify-start gap-1 w-full">
            <h3 className="cart-item-name font-bold">{item.name}</h3>
            <p className="cart-item-price">{item.unitPrice.toFixed(2)}</p>
            <p className="item-total-price text-lg font-bold">Ugx:{totalPrice.toFixed(2)}</p>
        </div>
        <div className="cart-item-quantity flex flex-col justify-end items-end gap-2"> 
            <Trash2 className="cart-item-delete-icon" color={'red'} />
            <CartQuantityStepper min={1} max={100} onIncrement={()=>setQty(q => q + 1)} onDecrement={()=>setQty(q => q - 1)} value={qty} size="sm"  />
        </div>
    </aside>)
}