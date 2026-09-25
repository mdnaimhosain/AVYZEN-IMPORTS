import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Tag } from "lucide-react";

export default function AdminCouponsPage() {
  const coupons = [
    {
      code: "AVYZEN10",
      type: "PERCENTAGE",
      value: "10% OFF",
      minOrder: 2000,
      maxDiscount: 1000,
      usage: "14 / 500",
      status: "Active",
    },
    {
      code: "WELCOME200",
      type: "FIXED",
      value: "৳200 Flat OFF",
      minOrder: 1500,
      maxDiscount: 200,
      usage: "48 / 1000",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Coupons & Promotional Discounts
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Active coupon codes validated strictly on the server during checkout.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 uppercase font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-6">Promo Code</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Discount Value</th>
                <th className="py-3 px-6">Minimum Order</th>
                <th className="py-3 px-6">Max Discount</th>
                <th className="py-3 px-6">Redemptions</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{c.code}</span>
                  </td>
                  <td className="py-4 px-6 text-zinc-500 font-semibold">{c.type}</td>
                  <td className="py-4 px-6 font-black text-zinc-950 dark:text-white">{c.value}</td>
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300">{formatPrice(c.minOrder)}</td>
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300">{formatPrice(c.maxDiscount)}</td>
                  <td className="py-4 px-6 font-mono text-zinc-500">{c.usage}</td>
                  <td className="py-4 px-6">
                    <Badge variant="success">{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
