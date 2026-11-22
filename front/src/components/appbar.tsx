"use client";
import { useState } from "react";
import Searchbar from "./searchbar";
import { ShoppingCart } from "lucide-react";
import MenuToggle from "./toggleMenue";
import Image from "next/image";
import CartIcon from "./cart/CartIcon";
import { AnimatedCartBadge } from "./cart/Animatedcart";
import useCart from "../hooks/useCart";


export default function Appbar() {
  var {count } =useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            <MenuToggle
              bg="bg-background"
              isOpen={isMenuOpen}
              onToggle={setIsMenuOpen}
            />
          </div>
        </div>
      </div>


      {/* 3. Main Navigation Menu */}
      <nav className=""></nav>
      <div
        role="dialog"
        aria-label="Menu"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        className={`fixed right-0 top-0 z-[60] h-dvh w-[85vw] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="absolute right-4 top-4 text-primary"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </>
  );
}
