"use client";
import Searchbar from "./searchbar";
import { ShoppingCart } from "lucide-react";
import MenuToggle from "./toggleMenue";
import Image from "next/image";
import CartIcon from "./cart/CartIcon";
import { AnimatedCartBadge } from "./cart/Animatedcart";
import useCart from "../hooks/useCart";


export default function Appbar() {
  var {count } =useCart();
  return (
    <>
      {/* 1. Top Bar: Scrolls away naturally */}
      <div className="appbar flex flex-col bg-primary text-white  px-2 ">
        <div className="flex flex-row justify-between items-center">
          {/* logo */}
          <Image
            src="/full_logo.png"
            alt="logo"
            width={200}
            height={160}
          />
          {/* icons */}
          <div className="icons flex flex-row items-center gap-3">
             
            <MenuToggle bg="bg-background" />
          </div>
        </div>
      </div>


      {/* 3. Main Navigation Menu */}
      <nav className=""></nav>
    </>
  );
}
