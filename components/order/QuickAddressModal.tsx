"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { MessageCircle, MapPin, User, Phone } from "lucide-react";
import { useToast } from "@/context/toast-context";

export interface QuickOrderInfo {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  shippingFee: number;
}

interface QuickAddressModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  itemsSummary: string;
  subtotal: number;
  freeShippingEligible?: boolean;
  onConfirm: (info: QuickOrderInfo) => void;
}

const STORAGE_KEY = "avyzen_saved_customer_info";

export function QuickAddressModal({
  open,
  onClose,
  title = "অর্ডার সম্পন্ন করতে ডেলিভারি ঠিকানা প্রদান করুন",
  itemsSummary,
  subtotal,
  freeShippingEligible = false,
  onConfirm,
}: QuickAddressModalProps) {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).fullName || "" : "";
    } catch {
      return "";
    }
  });

  const [phone, setPhone] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).phone || "" : "";
    } catch {
      return "";
    }
  });

  const [address, setAddress] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).address || "" : "";
    } catch {
      return "";
    }
  });

  const [cityZone, setCityZone] = useState<"dhaka" | "outside">(() => {
    if (typeof window === "undefined") return "dhaka";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).cityZone || "dhaka" : "dhaka";
    } catch {
      return "dhaka";
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingFee = freeShippingEligible
    ? 0
    : cityZone === "dhaka"
    ? siteConfig.shipping.insideDhaka.rate
    : siteConfig.shipping.outsideDhaka.rate;

  const totalPayable = subtotal + shippingFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName || cleanName.length < 2) {
      errs.fullName = "আপনার নাম লিখুন (কমপক্ষে ২ অক্ষর)";
    }

    const bdPhoneRegex = /^(?:\+?880|0)?1[3-9]\d{8}$/;
    if (!cleanPhone || !bdPhoneRegex.test(cleanPhone)) {
      errs.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)";
    }

    if (!cleanAddress || cleanAddress.length < 5) {
      errs.address = "সম্পূর্ণ ডেলিভারি ঠিকানা দিন (বাসা/রোড/এলাকা সহ কমপক্ষে ৫ অক্ষর)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast("ঠিকানা ও যোগাযোগের তথ্য ছাড়া অর্ডার করা যাবে না।", "error");
      return;
    }

    // Save to localStorage for convenience
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fullName, phone, address, cityZone })
      );
    } catch {
      // ignore
    }

    onConfirm({
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      customerAddress: address.trim(),
      customerCity: cityZone === "dhaka" ? "Dhaka" : "Outside Dhaka",
      shippingFee,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-md p-6">
      <form onSubmit={handleConfirm} className="space-y-5">
        {/* Header */}
        <div className="space-y-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>ডেলিভারি ঠিকানা আবশ্যক</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-xs text-zinc-500">
            ঠিকানা ছাড়া কুরিয়ার ডেলিভারি সম্ভব নয়। অনুগ্রহ করে তথ্যগুলো সঠিকভাবে পূরণ করুন।
          </p>
        </div>

        {/* Product / Cart Brief Summary */}
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block">
            অর্ডারের আইটেম:
          </span>
          <p className="text-zinc-600 dark:text-zinc-400 truncate">{itemsSummary}</p>
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700 font-bold">
            <span className="text-zinc-500">মোট প্রদেয়:</span>
            <span className="text-sm font-black text-zinc-950 dark:text-white">
              {formatPrice(totalPayable)}
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3.5 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              আপনার পূর্ণ নাম *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                }}
                placeholder="যেমন: তানভীর আহমেদ"
                className={`pl-9 text-xs ${errors.fullName ? "border-rose-500 ring-1 ring-rose-500" : ""}`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Mobile Phone */}
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              মোবাইল নম্বর (সচল ফোন নম্বর) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="01XXXXXXXXX"
                type="tel"
                className={`pl-9 font-mono text-xs ${errors.phone ? "border-rose-500 ring-1 ring-rose-500" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Street Address */}
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/ফ্ল্যাট, রোড, এলাকা) *
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
              }}
              placeholder="যেমন: বাসা নং ১২, রোড নং ৫, ব্লক বি, বনানী"
              className={`w-full p-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-xs focus:outline-none transition-all ${
                errors.address
                  ? "border-rose-500 ring-1 ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-400"
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-rose-500 font-semibold mt-0.5">{errors.address}</p>
            )}
          </div>

          {/* City / Delivery Zone Selector */}
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
              ডেলিভারি এলাকা নির্বাচন করুন *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCityZone("dhaka")}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  cityZone === "dhaka"
                    ? "border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <div>ঢাকা সিটির ভেতর</div>
                <div className="text-[11px] font-normal text-zinc-500">
                  ডেলিভারি চার্জ: {freeShippingEligible ? "FREE" : "৳60"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCityZone("outside")}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  cityZone === "outside"
                    ? "border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <div>ঢাকার বাইরে / সারা দেশ</div>
                <div className="text-[11px] font-normal text-zinc-500">
                  ডেলিভারি চার্জ: {freeShippingEligible ? "FREE" : "৳120"}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Buttons */}
        <div className="pt-2 space-y-2">
          <Button
            type="submit"
            size="lg"
            variant="whatsapp"
            className="w-full text-xs font-bold gap-2 py-5 shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>ঠিকানা নিশ্চিত করুন ও হোয়াটসঅ্যাপে পাঠান</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full text-xs"
          >
            বাতিল করুন
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
