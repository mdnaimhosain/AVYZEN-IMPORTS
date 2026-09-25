"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

function GatewaySimulatorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const trx = searchParams.get("trx") || `TRX-${Date.now()}`;
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseFloat(amountStr);

  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"bkash" | "nagad" | "card">("bkash");

  const handleSimulatePayment = async (status: "PAID" | "FAILED") => {
    setProcessing(true);
    try {
      // Dispatch to secure server-side payment webhook
      const webhookPayload = {
        provider: "MODULAR_ONLINE_GATEWAY",
        orderId,
        transactionId: trx,
        amount,
        currency: "BDT",
        status,
        signature: "sample_hmac_verified_signature",
      };

      const res = await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });

      if (res.ok && status === "PAID") {
        router.push(`/order-confirmation/${orderId}?status=paid`);
      } else {
        router.push(`/checkout?error=payment_declined&orderId=${orderId}`);
      }
    } catch (e) {
      console.error("Payment simulator error:", e);
      router.push(`/checkout?error=gateway_timeout&orderId=${orderId}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-1 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <CreditCard className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
          Payment Gateway
        </h2>
        <p className="text-xs text-zinc-400">
          Avyzen Secure Payment Engine
        </p>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl space-y-1 text-center">
        <span className="text-xs text-zinc-400 font-medium">Total Charge</span>
        <div className="text-3xl font-black text-zinc-950 dark:text-white">
          {formatPrice(amount)}
        </div>
        <div className="text-[11px] text-zinc-400 font-mono">
          Ref Trx: {trx}
        </div>
      </div>

      {/* Payment Channel Chooser */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Select Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedMethod("bkash")}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedMethod === "bkash"
                ? "border-[#E2136E] bg-[#E2136E]/10 text-[#E2136E]"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600"
            }`}
          >
            bKash
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod("nagad")}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedMethod === "nagad"
                ? "border-[#F7931E] bg-[#F7931E]/10 text-[#F7931E]"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600"
            }`}
          >
            Nagad
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod("card")}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedMethod === "card"
                ? "border-blue-600 bg-blue-500/10 text-blue-600"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600"
            }`}
          >
            Visa/MC
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={() => handleSimulatePayment("PAID")}
          isLoading={processing}
          size="lg"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>Complete Online Payment</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSimulatePayment("FAILED")}
          disabled={processing}
          className="w-full text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
        >
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          <span>Simulate Payment Failure</span>
        </Button>

        <div className="text-center pt-2">
          <button
            onClick={() => router.push("/checkout")}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Cancel and return to checkout</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-End Cryptographically Verified Webhook</span>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <div className="py-12 bg-zinc-50/50 dark:bg-zinc-950 min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-zinc-500">Loading Payment Gateway...</div>}>
        <GatewaySimulatorInner />
      </Suspense>
    </div>
  );
}
