"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, MessageCircle, Plus, Minus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Product, ProductVariant } from "@/types/database";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "./VariantSelector";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { generateDirectProductOrderUrl } from "@/services/whatsapp";
import { QuickAddressModal, QuickOrderInfo } from "@/components/order/QuickAddressModal";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const discountPercent = product.compare_at_price
    ? calculateDiscountPercent(product.compare_at_price, currentPrice)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    showToast(`Added ${quantity} × "${product.name}" to your bag!`, "success");
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    router.push("/checkout");
  };

  const handleWhatsAppConfirm = (info: QuickOrderInfo) => {
    const productUrl = typeof window !== "undefined"
      ? window.location.href
      : `${siteConfig.url}/products/${product.slug}`;
    const waUrl = generateDirectProductOrderUrl({
      productName: product.name,
      variantName: selectedVariant?.name || null,
      quantity,
      unitPrice: currentPrice,
      totalPrice: currentPrice * quantity,
      productUrl,
      customerName: info.customerName,
      customerPhone: info.customerPhone,
      customerAddress: info.customerAddress,
      customerCity: info.customerCity,
    });

    // Synchronize order to database so admin dashboard receives it live
    fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: info.customerName,
        customerPhone: info.customerPhone,
        customerEmail: "",
        address: info.customerAddress,
        city: info.customerCity || "Dhaka",
        area: info.customerCity || "Dhaka",
        deliveryNotes: `[Order placed via 1-Click WhatsApp on Product Page]`,
        paymentMethod: "COD",
        items: [
          {
            productId: product.id,
            variantId: selectedVariant?.id || null,
            quantity,
          },
        ],
      }),
    }).catch((err) => console.error("Error registering WhatsApp order:", err));

    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Price and Discount row */}
      <div className="flex items-baseline gap-4">
        <span className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white">
          {formatPrice(currentPrice)}
        </span>
        {product.compare_at_price && product.compare_at_price > currentPrice && (
          <span className="text-lg text-zinc-400 line-through">
            {formatPrice(product.compare_at_price)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
        />
      )}

      {/* Quantity & Stock Status */}
      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 text-sm font-bold text-zinc-900 dark:text-zinc-100 min-w-10 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="p-3 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs">
          {isOutOfStock ? (
            <span className="text-rose-600 font-bold">Currently Out of Stock</span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              In Stock ({currentStock} available in Banani warehouse)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="w-full text-sm font-bold"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Bag
          </Button>

          <Button
            type="button"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="w-full text-sm font-bold"
          >
            Buy Now
          </Button>
        </div>

        {/* WhatsApp Direct Order Button */}
        <Button
          type="button"
          size="lg"
          variant="whatsapp"
          onClick={() => setAddressModalOpen(true)}
          className="w-full text-sm gap-2"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Order via WhatsApp (+8801939846312)</span>
        </Button>
      </div>

      {/* Mandatory Delivery Address Modal before WhatsApp Order */}
      <QuickAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        itemsSummary={`${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ""} × ${quantity}`}
        subtotal={currentPrice * quantity}
        freeShippingEligible={currentPrice * quantity >= siteConfig.shipping.freeShippingThreshold}
        onConfirm={handleWhatsAppConfirm}
      />

      {/* Trust & Guarantee Badges */}
      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>24–48h Express Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>100% Authentic Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-purple-500 shrink-0" />
          <span>7-Day Return Warranty</span>
        </div>
      </div>
    </div>
  );
}
