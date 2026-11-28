"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PREMIUM_EASE } from "./ui/MotionPrimitives";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    eyebrow: "Fruitful Market UG",
    title: "Trusted freshness",
    description:
      "Your trusted source for fresh, healthy fruits, vegetables and herbs.",
    actions: [
      { label: "Shop fresh produce", href: "/products" },
      { label: "Mobile Bar", href: "/mobile-bar" },
    ],
  },
  {
    eyebrow: "Fresh for every day",
    title: "Good food, picked with care",
    description:
      "Discover fresh produce to bring more goodness to your everyday meals.",
    actions: [{ label: "Browse catalog", href: "/products" }],
  },
  {
    eyebrow: "Delivered to your door",
    title: "Your kitchen, well stocked",
    description:
      "Find quality groceries and fresh market favourites, all in one place.",
    actions: [{ label: "Explore fresh picks", href: "/products" }],
  },
];

export default function HeroSlider() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5200,
          disableOnInteraction: false,
        }}
        loop
        speed={900}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full rounded-2xl"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;
          return (
            <SwiperSlide key={slide.title}>
              <section className="relative flex min-h-[360px] items-center overflow-hidden rounded-2xl bg-primary px-6 py-10 md:min-h-[410px] md:px-12">
                <Image
                  src={index === 0 ? "/bg1.svg" : "/bg2.webp"}
                  alt=""
                  fill
                  priority={index === 0}
                  className={`object-cover transition-transform duration-[6000ms] ease-out ${
                    isActive && !prefersReducedMotion ? "scale-105" : "scale-100"
                  }`}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/25" />

                <div className="relative z-10 max-w-xl text-background">
                  <motion.div
                    key={`content-${index}-${activeIndex}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: PREMIUM_EASE }}
                  >
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent md:text-sm">
                      {slide.eyebrow}
                    </p>
                    <h1 className="mb-4 text-3xl font-bold leading-tight text-balance md:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mb-7 max-w-lg text-sm leading-relaxed text-white/90 md:text-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {slide.actions.map((action, actionIdx) => (
                        <Link
                          key={action.label}
                          href={action.href}
                          className={`group/cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                            actionIdx === 0
                              ? "bg-accent text-primary shadow-sm hover:bg-white"
                              : "border border-white/35 bg-white/10 text-white backdrop-blur-xs hover:bg-white hover:text-primary"
                          }`}
                        >
                          <span>{action.label}</span>
                          {actionIdx === 0 && (
                            <ArrowRight
                              className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { y: [0, -7, 0] }
                  }
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 ml-auto hidden md:block"
                >
                  <Image
                    src="/full_shopping.webp"
                    alt=""
                    width={290}
                    height={290}
                    priority={index === 0}
                    className="max-h-72 w-auto object-contain drop-shadow-xl"
                  />
                </motion.div>
              </section>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Subtle Slide Controls */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-center justify-between md:inset-x-8">
        <div
          className="pointer-events-auto flex items-center gap-1.5"
          role="tablist"
          aria-label="Hero slide pagination"
        >
          {slides.map((slide, idx) => {
            const selected = activeIndex === idx;
            return (
              <button
                key={slide.title}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                onClick={() => swiperRef.current?.slideToLoop(idx)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  selected
                    ? "w-7 bg-accent"
                    : "w-2 bg-white/40 hover:bg-white/75"
                }`}
              />
            );
          })}
        </div>

        <div className="pointer-events-auto hidden items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous slide"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next slide"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
