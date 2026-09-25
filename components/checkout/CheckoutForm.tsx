"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, CheckoutFormData } from "@/lib/validations";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { CreditCard, Banknote, ShieldCheck, Tag, Loader2, MessageCircle } from "lucide-react";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total, clearCart, applyCoupon, removeCoupon, couponCode } = useCart();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "Dhaka",
      area: "",
      postalCode: "",
      deliveryNotes: "",
      paymentMethod: "COD",
      couponCode: couponCode || "",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const selectedCity = watch("city");

  // Dynamic calculated shipping preview
  const isInsideDhaka = selectedCity?.toLowerCase().includes("dhaka");
  const liveShippingFee = subtotal >= siteConfig.shipping.freeShippingThreshold
    ? 0
    : isInsideDhaka
    ? siteConfig.shipping.insideDhaka.rate
    : siteConfig.shipping.outsideDhaka.rate;
  const liveGrandTotal = Math.max(0, subtotal - discount + liveShippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        applyCoupon(data.code, data.discount);
        showToast(`Promo coupon ${data.code} applied! Saved ${formatPrice(data.discount)}`, "success");
      } else {
        showToast(data.message || "Invalid coupon code", "error");
      }
    } catch {
      showToast("Error checking coupon code.", "error");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const onSubmit = async (formData: CheckoutFormData) => {
    if (items.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        postalCode: formData.postalCode || null,
        deliveryNotes: formData.deliveryNotes || null,
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode || null,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
      };

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(data.error || "Order placement failed. Please verify your details.", "error");
        setIsSubmitting(false);
        return;
      }

      const order = data.order;
      clearCart();

      // If online payment with hosted gateway redirect:
      if (data.paymentSession?.paymentUrl) {
        window.location.href = data.paymentSession.paymentUrl;
      } else {
        // Direct confirmation for COD or instant confirmation
        showToast(`Order #${order.order_number} confirmed successfully!`, "success");
        router.push(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      showToast("An unexpected network error occurred while placing order.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Delivery & Payment Details */}
      <div className="lg:col-span-7 space-y-8">
        {/* Customer Information */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>1. Customer & Contact Details</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Full Name *
              </label>
              <Input
                {...register("fullName")}
                placeholder="e.g. Tanvir Ahmed"
                className={errors.fullName ? "border-rose-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  Phone Number (Mobile) *
                </label>
                <Input
                  {...register("phone")}
                  placeholder="01XXXXXXXXX"
                  className={errors.phone ? "border-rose-500" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  Email Address *
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className={errors.email ? "border-rose-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            <span>2. Delivery Address (Bangladesh)</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Full Street Address / House / Road *
              </label>
              <Input
                {...register("address")}
                placeholder="House 12, Road 5, Block B"
                className={errors.address ? "border-rose-500" : ""}
              />
              {errors.address && (
                <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  City / District *
                </label>
                <Input
                  {...register("city")}
                  placeholder="Dhaka"
                  className={errors.city ? "border-rose-500" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  Area / Thana *
                </label>
                <Input
                  {...register("area")}
                  placeholder="Banani, Gulshan, etc."
                  className={errors.area ? "border-rose-500" : ""}
                />
                {errors.area && (
                  <p className="text-xs text-rose-500 mt-1">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                  Postal Code
                </label>
                <Input {...register("postalCode")} placeholder="1213" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Delivery Notes (Optional)
              </label>
              <Input
                {...register("deliveryNotes")}
                placeholder="Special delivery instructions or landmark..."
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            <span>3. Payment Method</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cash on delivery */}
            <label
              className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === "COD"
                  ? "border-zinc-900 bg-zinc-50/80 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <input
                type="radio"
                value="COD"
                {...register("paymentMethod")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Recommended
                </span>
              </div>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Cash on Delivery (COD)
              </span>
              <span className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Pay in cash when you receive and inspect your parcel at your doorstep.
              </span>
            </label>

            {/* Online payment */}
            <label
              className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === "ONLINE"
                  ? "border-zinc-900 bg-zinc-50/80 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <input
                type="radio"
                value="ONLINE"
                {...register("paymentMethod")}
                className="sr-only"
              />
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Instant
                </span>
              </div>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Online Payment Gateway
              </span>
              <span className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Pay securely via bKash, Nagad, Visa, Mastercard, or Internet Banking.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary & Place Order Button */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 sticky top-28">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
          </h3>

          {/* Product Items Breakdown */}
          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80 pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden relative">
                    <img
                      src={item.product.images?.[0]?.image_url || "/images/products/apex-pro.jpg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p className="text-zinc-500 text-[11px] truncate">
                        {item.variant.name}
                      </p>
                    )}
                    <p className="text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo Coupon Form */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Tag className="w-4 h-4" />
                  <span>Coupon {couponCode} applied</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo Code (e.g. AVYZEN10)"
                  className="h-10 text-xs uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon || !couponInput.trim()}
                >
                  {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </Button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Delivery Fee ({isInsideDhaka ? "Inside Dhaka" : "Outside Dhaka"})</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {liveShippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(liveShippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-black text-zinc-950 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total Payable</span>
              <span>{formatPrice(liveGrandTotal)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full text-base font-bold shadow-lg"
          >
            {selectedPaymentMethod === "COD" ? "Confirm Order with Cash on Delivery" : "Proceed to Secure Online Payment"}
          </Button>

          {/* Trust info */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted & Verified Checkout</span>
          </div>

          {/* WhatsApp Direct Order Alternative */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="whatsapp"
              className="w-full text-xs gap-2"
              onClick={() => {
                const summary = items
                  .map((i) => `${i.product.name}${i.variant ? ` (${i.variant.name})` : ""} × ${i.quantity}`)
                  .join(", ");
                const waUrl = generateCustomerSupportUrl(
                  `Hello Avyzen Imports, I would like to place this order via WhatsApp: ${summary}. Total: ${formatPrice(liveGrandTotal)}.`
                );
                window.open(waUrl, "_blank");
              }}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Or Place Order Directly on WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
