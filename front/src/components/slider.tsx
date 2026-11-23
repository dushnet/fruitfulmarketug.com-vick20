"use client";

import Image from "next/image";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    eyebrow: "Fruitful Market UG",
    title: "Trusted freshness",
    description:
      "Your trusted source for fresh, healthy fruits, vegetables and herbs.",
    actions: [
      { label: "Explore", href: "/categories" },
      { label: "Shop", href: "/products" },
    ],
  },
  {
    eyebrow: "Fresh for every day",
    title: "Good food, picked with care",
    description:
      "Discover fresh produce to bring more goodness to your everyday meals.",
    actions: [{ label: "Shop fresh produce", href: "/products" }],
  },
  {
    eyebrow: "Delivered to your door",
    title: "Your kitchen, well stocked",
    description:
      "Find quality groceries and fresh market favourites, all in one place.",
    actions: [{ label: "Explore groceries", href: "/categories" }],
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
      loop
      speed={1000}
      className="w-full rounded-2xl"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.title}>
          <section className="relative flex min-h-[360px] items-center overflow-hidden rounded-2xl bg-primary px-6 py-10 md:min-h-[400px] md:px-12">
            <Image
              src={index === 0 ? "/bg1.svg" : "/bg2.webp"}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-primary/35" />
            <div className="relative z-10 max-w-xl text-background">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
                {slide.eyebrow}
              </p>
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                {slide.title}
              </h1>
              <p className="mb-7 max-w-lg text-base md:text-lg">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {slide.actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="rounded-full bg-accent px-5 py-2 font-semibold text-primary transition hover:bg-white"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
            <Image
              src="/full_shopping.webp"
              alt=""
              width={280}
              height={280}
              className="relative z-10 ml-auto hidden max-h-72 w-auto object-contain md:block"
            />
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
