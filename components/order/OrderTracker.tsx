"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { generateCustomerSupportUrl } from "@/services/whatsapp";

interface TrackedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  city: string;
  area: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
  items?: Array<{
    product_name: string;
    variant_name?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export function OrderTracker() {
  const searchParams = useSearchParams();
  const initialOrderNum = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNum);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const fetchTracking = useCallback(async (num: string, ph: string) => {
    if (!num.trim() || !ph.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: num.trim(), phone: ph.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "No order found with these credentials.");
        setOrder(null);
      }
    } catch {
      setError("Network error while tracking order. Please try again.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialOrderNum && initialPhone) {
      fetchTracking(initialOrderNum, initialPhone);
    }
  }, [initialOrderNum, initialPhone, fetchTracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, phone);
  };

  // Status step index calculation
  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PAYMENT_PENDING":
        return 1;
      case "PAID":
        return 2;
      case "PROCESSING":
        return 3;
      case "SHIPPED":
        return 4;
      case "DELIVERED":
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  const steps = [
    { title: "Order Placed", desc: "Order recorded & verified" },
    { title: "Payment Confirmed", desc: "Payment or COD approved" },
    { title: "Processing & QC", desc: "Carefully inspected & packed" },
    { title: "Shipped", desc: "Handed over to courier" },
    { title: "Delivered", desc: "Successfully delivered" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Track Your Delivery
        </h2>
        <p className="text-xs text-zinc-500 mb-6">
          Enter your Order Reference Number (e.g. ORD-2026-XXXXXX) and the phone number used during checkout.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order Number (e.g. ORD-2026-981240)"
              required
              className="h-11 font-mono uppercase text-xs"
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (01XXXXXXXXX)"
              required
              className="h-11 text-xs"
            />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" isLoading={loading} className="w-full h-11">
              <Search className="w-4 h-4 mr-2" />
              <span>Track</span>
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Order Status Timeline Result */}
      {order && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                Tracking Details For
              </span>
              <h3 className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {order.order_number}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs py-1 px-3">
                Status: {order.order_status}
              </Badge>
              <Badge
                variant={order.payment_status === "PAID" ? "success" : "secondary"}
                className="text-xs py-1 px-3"
              >
                Payment: {order.payment_status}
              </Badge>
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="relative">
            {/* Progress line */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
              {steps.map((st, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum <= currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div key={st.title} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-300 dark:border-zinc-700"
                      } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isCompleted
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400"
                        }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 hidden sm:block mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destination & Meta Info */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block mb-0.5">Customer:</span>
              <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{order.customer_name}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Destination:</span>
              <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{order.area}, {order.city}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block mb-0.5">Total Amount:</span>
              <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{formatPrice(order.total)}</strong>
            </div>
          </div>

          {/* WhatsApp Support Callout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-500 text-center sm:text-left">
              Need immediate updates on dispatch or courier tracking number?
            </span>
            <Button
              variant="whatsapp"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => {
                const url = generateCustomerSupportUrl(
                  `Hello Avyzen Imports, I am inquiring about the status of my order #${order.order_number}.`
                );
                window.open(url, "_blank");
              }}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Contact Courier via WhatsApp</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
