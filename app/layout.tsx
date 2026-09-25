import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Premium Imported Tech & Lifestyle`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Avyzen Imports",
    "Bangladesh tech store",
    "audiophile headphones Bangladesh",
    "mechanical keyboards Dhaka",
    "GaN chargers Bangladesh",
    "Cash on delivery gadgets",
    "imported watches Dhaka",
    "WhatsApp shopping Bangladesh",
  ],
  authors: [{ name: siteConfig.business.name }],
  creator: siteConfig.business.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <ToastProvider>
          <CartProvider>
            <StoreLayoutWrapper>
              {children}
            </StoreLayoutWrapper>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
