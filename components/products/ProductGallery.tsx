"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.length > 0 ? images[0].image_url : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000"
  );

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 pb-2 md:pb-0">
          {images.map((img) => {
            const isSelected = selectedImage === img.image_url;
            return (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.image_url)}
                className={`relative w-18 h-18 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 transition-all shrink-0 ${
                  isSelected
                    ? "border-zinc-900 dark:border-white shadow-md scale-102"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View ${img.alt_text || productName}`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Large Image */}
      <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 550px"
        />
      </div>
    </div>
  );
}
