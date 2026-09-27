"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { generateCartWhatsAppOrderUrl } from "@/services/whatsapp";
import { QuickAddressModal, QuickOrderInfo } from "@/components/order/QuickAddressModal";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, total, itemCount } = useCart();
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = siteConfig.shipping.freeShippingThreshold;
  const freeShippingGap = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleWhatsAppConfirm = (info: QuickOrderInfo) => {
    const waUrl = generateCartWhatsAppOrderUrl({
      items: items.map((i) => ({
        name: i.product.name,
        variantName: i.variant?.name || null,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
      })),
      subtotal,
      shippingFee: info.shippingFee,
      total: subtotal + info.shippingFee,
      customerName: info.customerName,
      customerPhone: info.customerPhone,
      customerAddress: info.customerAddress,
      customerCity: info.customerCity,
    });
    window.open(waUrl, "_blank");
    setIsCartOpen(false);
  };

  const itemsSummary = items
    .map((i) => `${i.product.name} (x${i.quantity})`)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Your Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3.5 border-b border-zinc-100 dark:border-zinc-800 text-xs">
            {freeShippingGap > 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400 mb-1.5">
                Add <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(freeShippingGap)}</span> more to unlock <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE Delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <span>🎉</span> Congratulations! You qualify for Free Delivery.
              </p>
            )}
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-zinc-500 max-w-xs mb-6">
                  Explore our curated imports and add authentic tech & luxury gear to your collection.
                </p>
                <Button onClick={() => setIsCartOpen(false)} asChild>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-800">
                    <Image
                      src={item.product.images?.[0]?.image_url || "/images/products/apex-pro.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                        {formatPrice(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-500 font-bold">FREE</span>
                    ) : (
                      "Calculated at checkout"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button className="w-full justify-between" size="lg" asChild onClick={() => setIsCartOpen(false)}>
                  <Link href="/checkout">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="whatsapp"
                  className="w-full gap-2"
                  size="md"
                  onClick={() => setAddressModalOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Quick Order via WhatsApp</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Delivery Address Modal before WhatsApp Order */}
      <QuickAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        itemsSummary={itemsSummary}
        subtotal={subtotal}
        freeShippingEligible={subtotal >= freeShippingThreshold}
        onConfirm={handleWhatsAppConfirm}
      />
    </div>
  );
}
