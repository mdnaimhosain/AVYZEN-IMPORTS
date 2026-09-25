"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/context/toast-context";
import { generateCustomerSupportUrl } from "@/services/whatsapp";
import { MessageCircle, Mail, MapPin, Phone, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast("Thank you! Your message has been received.", "success");
    }, 800);
  };

  return (
    <div className="py-12 sm:py-16 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50">
            Contact & Customer Support
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Our team is available Saturday through Thursday to assist with product inquiries, wholesale questions, and order updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Priority Card */}
            <div className="p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Direct WhatsApp Support</h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {siteConfig.business.whatsappDisplay}
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Connect directly with our customer concierge for real-time stock checks, custom orders, or courier tracking assistance.
              </p>
              <Button
                variant="whatsapp"
                className="w-full font-bold gap-2 text-xs"
                onClick={() => window.open(generateCustomerSupportUrl(), "_blank")}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Start WhatsApp Chat Now</span>
              </Button>
            </div>

            {/* Business Details */}
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Fulfillment Office:</strong>
                  <span className="text-zinc-500">{siteConfig.business.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Official Email:</strong>
                  <a href={`mailto:${siteConfig.business.email}`} className="text-zinc-500 hover:underline">
                    {siteConfig.business.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Customer Hotline:</strong>
                  <a href={`tel:${siteConfig.business.phone}`} className="text-zinc-500 font-mono hover:underline">
                    {siteConfig.business.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Operating Hours:</strong>
                  <span className="text-zinc-500">{siteConfig.business.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Thank you for contacting Avyzen Imports. Our representative will reply to your email or phone within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Your Name *
                    </label>
                    <Input required placeholder="Mahmudul Hasan" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Phone Number *
                    </label>
                    <Input required placeholder="01XXXXXXXXX" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                    Email Address *
                  </label>
                  <Input type="email" required placeholder="name@example.com" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                    Order Reference ID (Optional)
                  </label>
                  <Input placeholder="ORD-2026-XXXXXX" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <Button type="submit" isLoading={loading} className="w-full font-bold">
                  <Send className="w-4 h-4 mr-2" />
                  <span>Submit Message</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
