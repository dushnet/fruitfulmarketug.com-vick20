'use client'
import useCart from '../../hooks/useCart';
import Image from "next/image";
import { ProductCardData,VariantWithAttributes, ProductImage} from "./types/product";
import { CartItem } from '@/src/lib/cart/cart-types';
import { toCartitem } from '@/src/lib/product/ProductWrapper';
import { CartQuantityStepper } from '../cart/Animatedcart';
import { useState } from 'react';
import { ShoppingBasket } from 'lucide-react';

 interface ProductCardProps{
   product:ProductCardData;
 }
export default function ProductCard({product} :ProductCardProps){
  const images:ProductImage[] =product.images;
  const variants:VariantWithAttributes[]=product.variants;;
  const basPrice=product.base_price;
  //qty picker 
  const [qty, setQty] = useState(1);
  

  //cart 
  const {cart, addItem}= useCart();
 //add item to cart
  function addToCart(item:CartItem, quantity:number=qty){
    return ()=>{
      addItem({...item,quantity:quantity});
      
    }
  }

  //get minmax price
  var min=0
  var Max=0;
  type minMax={
    min:number,
    max:number
  }
  function minMaxPrice():minMax{
    var prices:number[]=[];
   for (const variant of variants){
     for(const attribute of variant.attributes){
         prices.push(attribute.price ?? variant.price)
     }
   }
    var min:number=0;
    var max:number=0;
    for (const price of prices){
      if(price < min) min=price;
      if(price > max) max=price;
    }
    return {min:min,max:max}
  }

  
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">

      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background">

        <Image
          src={images[0].url}
          alt={images[0].alt_text?? ""}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />

        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
          Fresh
        </span>

        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white text-text shadow-sm hover:text-primary"
        >
          ♡
        </button>
      </div>

      {/* Product information */}
      <div className="space-y-3 p-3">

        <div>
          <p className="text-xs text-text-muted">Vegetables</p>
          <h3 className="font-semibold text-text">
            {product.name}
          </h3>
        </div>

        {/* Variant */}
       

        {/* Price and stock */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary-dark">
            UGX 4,000
          </span>

          <span className="text-xs font-medium text-primary">
            In stock
          </span>
        </div>

        {/* price selector */}
         <div className="flex items-center justify-between gap-2">
          {/* <span className="text-sm text-text-muted">Size: 1 kg</span>
          <span className="text-xs text-primary">Choose size</span> */}
          <CartQuantityStepper min={1} max={100} onIncrement={()=>setQty(q => q + 1)} onDecrement={()=>setQty(q => q - 1)} value={qty} size="sm" />
        </div>

        {/* Add to cart */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
           onClick={addToCart(toCartitem(product))}>
          <span>+</span>
          Add to <ShoppingBasket size={16} />
        </button>

      </div>
    </article>
  );
}
