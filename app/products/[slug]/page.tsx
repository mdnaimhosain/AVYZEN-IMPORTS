import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/db/store";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, Truck, ShieldCheck, RotateCcw, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — Avyzen",
    };
  }

  const ogImage = product.images?.[0]?.image_url || siteConfig.ogImage;

  return {
    title: `${product.name} — Avyzen Imports`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Avyzen Imports`,
      description: product.description,
      images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  // SEO JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.image_url) || [],
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 5.0,
      reviewCount: product.review_count || 12,
    },
  };

  return (
    <div className="py-8 sm:py-12 bg-white dark:bg-zinc-950 min-h-screen">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-800 dark:text-zinc-200 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Showcase: Gallery + Action Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery (Left Col) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Details & Actions (Right Col) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category?.name || "Imported Gear"}</Badge>
                {product.is_best_seller && <Badge variant="warning">Best Seller</Badge>}
                {product.is_new_arrival && <Badge variant="success">New Release</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                {product.name}
              </h1>

              {/* Rating and SKU */}
              <div className="flex items-center justify-between text-xs mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {product.rating || "5.0"}
                  </span>
                  <span className="text-zinc-400">
                    ({product.review_count || 12} reviews)
                  </span>
                </div>
                <span className="text-zinc-400 font-mono">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Client Interactive Actions (Variants, Pricing, Add to Cart, Buy Now, WhatsApp Order) */}
            <ProductActions product={product} />

            {/* Description Tab Box */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Delivery & Warranty Guide */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Fast Delivery Nationwide:</strong>
                  <span className="text-zinc-500">Inside Dhaka 24-48h (৳70), Outside Dhaka 2-4 days (৳130). Free over ৳5,000.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">7-Day Replacement Warranty:</strong>
                  <span className="text-zinc-500">Full exchange support for factory or hardware defects.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 block">Cash on Delivery:</strong>
                  <span className="text-zinc-500">Pay cash only upon receiving and inspecting the package.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                You May Also Like
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
