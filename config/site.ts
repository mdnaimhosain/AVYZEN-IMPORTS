export const siteConfig = {
  name: "Avyzen Imports",
  shortName: "Avyzen",
  description: "Premium curated tech, gadgets, lifestyle accessories & imported luxury products with nationwide authentic delivery across Bangladesh.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://avyzenimports.com",
  ogImage: "/og-image.jpg",
  business: {
    name: "Avyzen Imports Ltd.",
    legalName: "Avyzen Imports Bangladesh",
    address: "House 42, Road 11, Banani, Dhaka 1213, Bangladesh",
    email: "support@avyzenimports.com",
    phone: "+8801939846312",
    whatsappNumber: "8801939846312", // Clean international format for wa.me
    whatsappDisplay: "+880 1939-846312",
    operatingHours: "Saturday - Thursday: 10:00 AM - 9:00 PM (BST)",
  },
  currency: {
    code: "BDT",
    symbol: "৳",
    position: "left" as const,
  },
  shipping: {
    insideDhaka: {
      name: "Inside Dhaka (Standard 24-48 hrs)",
      rate: 70,
    },
    outsideDhaka: {
      name: "Outside Dhaka (Standard 2-4 days)",
      rate: 130,
    },
    freeShippingThreshold: 5000, // Orders over ৳5,000 get free standard shipping
  },
  nav: [
    { title: "Home", href: "/" },
    { title: "Shop All", href: "/shop" },
    { title: "Electronics", href: "/shop?category=electronics" },
    { title: "Audio & Sound", href: "/shop?category=audio" },
    { title: "Smart Gadgets", href: "/shop?category=smart-gadgets" },
    { title: "Lifestyle & Luxury", href: "/shop?category=lifestyle" },
    { title: "Track Order", href: "/track-order" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  footerLinks: {
    customerCare: [
      { title: "Track Your Order", href: "/track-order" },
      { title: "Order via WhatsApp", href: `https://wa.me/8801939846312?text=Hello%20Avyzen%20Imports%2C%20I%20would%20like%20to%20inquire%20about%20ordering.` },
      { title: "Shipping & Delivery Policy", href: "/shipping-policy" },
      { title: "Return & Refund Policy", href: "/return-policy" },
      { title: "Contact Support", href: "/contact" },
    ],
    company: [
      { title: "About Us", href: "/about" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms & Conditions", href: "/terms" },
      { title: "Admin Portal", href: "/admin" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
