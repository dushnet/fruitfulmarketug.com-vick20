"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface ProgressiveImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackLabel?: string;
  containerClassName?: string;
}

export function ProgressiveImage({
  className = "",
  containerClassName = "",
  fallbackLabel,
  alt,
  ...props
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-1.5 bg-background text-text-muted ${containerClassName}`}
      >
        <ImageOff className="h-6 w-6 opacity-45" aria-hidden="true" />
        {fallbackLabel && (
          <span className="px-2 text-center text-xs line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="animate-shimmer absolute inset-0 h-full w-full"
        />
      )}
      <Image
        alt={alt}
        {...props}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </>
  );
}
