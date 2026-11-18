"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import Image from "next/image";

const slides = [
  {
    title: "Freshness You Can Trust",
    description:
      "Your trusted source for fresh, healthy fruits, vegetables and herbs.",
    button: "Shop Fresh Produce",
    link: "/products",
    image: "/images/hero-fresh.jpg",
  },
  {
    title: "Everything Your Kitchen Needs",
    description:
      "From everyday groceries to fresh produce, we deliver quality right to your doorstep, on time.",
    button: "Explore Groceries",
    link: "/categories",
    image: "/images/hero-groceries.jpg",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
      speed={1000}
      className="w-full rounded-2xl"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <section className="relative flex min-h-[400px] items-center overflow-hidden rounded-2xl">

            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 max-w-xl px-8 py-12 text-white md:px-16">

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
                Welcome to Fruitful Market
              </p>

              <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
                {slide.title}
              </h1>

              <p className="mb-7 text-base leading-relaxed text-white/90 md:text-lg">
                {slide.description}
              </p>

              <a
                href={slide.link}
                className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
              >
                {slide.button}
              </a>

            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}