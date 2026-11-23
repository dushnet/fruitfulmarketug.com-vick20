"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "./types/product";

interface ProductGalleryProps {
  productName: string;
  images: ProductImage[];
}

export default function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex];

  if (!selectedImage) {
    return (
      <div
        role="img"
        aria-label={`No images available for ${productName}`}
        className="aspect-square rounded-xl bg-background"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-background">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt_text?.trim() || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          aria-label={`${productName} image gallery`}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length} for ${productName}`}
              aria-pressed={selectedImageIndex === index}
              className={`relative h-20 w-20 flex-none overflow-hidden rounded-md border-2 ${
                selectedImageIndex === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
