
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Appbar from "../components/appbar";
import MyFooter from "../components/footer";
import CartProvider from '../contexts/CartContext'
import StickySearchBar from "../components/StickySearchbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "fruitful market ug | online fresh fruits and vegetables we deliver to your door step",
  description:
    "fruitful market ug is an online fresh fruits and vegetables store that delivers to your door step. we offer a wide range of fresh fruits and vegetables at affordable prices. we are committed to providing our customers with the best quality products and services.",
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
    >
      <body className="min-h-screen ">
        <CartProvider>
        <Appbar />

        {/* 2. Sticky Search Bar: Now a sibling, so it sticks to the top of the screen */}
        <div className="flex flex-row gap-2 w-full sticky top-0 z-50 text-background px-2 pb-2 pt-3 shadow-md bg-primary backdrop-blur-sm bg-opacity-80">
          <StickySearchBar />
        </div>
        <main>{children}</main>
        <MyFooter />
        </CartProvider>
      </body>
    </html>
  );
}
