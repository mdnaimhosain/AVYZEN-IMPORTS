"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingBag, MessageCircle, ArrowRight, Plus, Minus, Check } from "lucide-react";
import { Product, ProductVariant } from "@/types/database";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { generateProductInquiryUrl } from "@/services/whatsapp";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.image_url || "/images/products/apex-pro.jpg"
  );

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const discountPercent = product.compare_at_price
    ? calculateDiscountPercent(product.compare_at_price, currentPrice)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    showToast(`Added ${quantity} × "${product.name}" to bag!`, "success");
    onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    onClose();
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const productUrl = typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : `/products/${product.slug}`;
    const variantNote = selectedVariant ? ` (Variant: ${selectedVariant.name})` : "";
    const waUrl = generateProductInquiryUrl(`${product.name}${variantNote}`, productUrl);
    window.open(waUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left: Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img.image_url
                      ? "border-zinc-900 dark:border-white scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.image_url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Controls */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category?.name || "Premium Import"}</Badge>
              {discountPercent > 0 && <Badge variant="destructive">Save {discountPercent}%</Badge>}
            </div>

            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {product.rating || "5.0"}
              </span>
              <span className="text-xs text-zinc-400">
                ({product.review_count || 12} customer reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-black text-zinc-950 dark:text-white">
                {formatPrice(currentPrice)}
              </span>
              {product.compare_at_price && product.compare_at_price > currentPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Select Edition / Variant:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{v.name}</span>
                        <span className="opacity-75">({formatPrice(v.price)})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Quantity:</span>
              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-zinc-900 dark:text-zinc-100 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                {currentStock > 0 ? (
                  <span className="text-emerald-600 font-medium">In Stock ({currentStock} units)</span>
                ) : (
                  <span className="text-rose-600 font-medium">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Bag
              </Button>
              <Button
                variant="primary"
                className="w-full"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            <Button
              variant="whatsapp"
              className="w-full gap-2"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order via WhatsApp</span>
            </Button>

            <div className="text-center pt-1">
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span>View Full Specifications & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
