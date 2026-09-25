"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye, Star, MessageCircle } from "lucide-react";
import { Product } from "@/types/database";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { Badge } from "@/components/ui/badge";
import { generateProductInquiryUrl } from "@/services/whatsapp";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discountPercent = product.compare_at_price
    ? calculateDiscountPercent(product.compare_at_price, product.price)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const mainImage = product.images?.[0]?.image_url || "/images/products/apex-pro.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    if (product.variants && product.variants.length > 0) {
      // If variants exist, open quick view to let customer choose variant
      setQuickViewOpen(true);
      return;
    }

    addItem(product, 1);
    showToast(`Added "${product.name}" to bag!`, "success");
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : `/products/${product.slug}`;
    const waUrl = generateProductInquiryUrl(product.name, productUrl);
    window.open(waUrl, "_blank");
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Top Image Showcase */}
        <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <Badge variant="destructive" className="font-bold shadow-xs">
                -{discountPercent}% OFF
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge variant="default" className="bg-amber-500 text-white font-bold shadow-xs">
                Best Seller
              </Badge>
            )}
            {product.is_new_arrival && (
              <Badge variant="success" className="font-bold shadow-xs">
                New Arrival
              </Badge>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-white/90 text-zinc-900 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="flex-1 h-9 rounded-xl bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="h-9 w-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md hover:bg-[#20ba5a] transition-colors"
              title="Order on WhatsApp"
              aria-label="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>
          </div>
        </Link>

        {/* Content Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category and Rating */}
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span>{product.category?.name || "Imported Gear"}</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || "5.0"}</span>
                <span className="text-zinc-400">({product.review_count || 12})</span>
              </div>
            </div>

            {/* Product Title */}
            <Link
              href={`/products/${product.slug}`}
              className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors line-clamp-2 leading-snug"
            >
              {product.name}
            </Link>

            {/* Stock status indicator */}
            {isLowStock && (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">
                Only {product.stock} left in stock!
              </p>
            )}
          </div>

          {/* Price & Action Button */}
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-zinc-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Add to bag button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="h-9 px-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label={`Add ${product.name} to bag`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.variants && product.variants.length > 0 ? "Options" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
