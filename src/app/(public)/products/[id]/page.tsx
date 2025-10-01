// src\app\(public)\products\[id]\page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

import Tabs from "@/components/TabsProduct/Tabs";
import CurrentPath from "@/components/path/CurrentPath";
import { calculatePercentage } from "@/utils/OfferMade";
import { Rating, ThinStar } from "@smastrom/react-rating";
import { FormattedPostType, PHOTO } from "@/types";
import { GetProduct } from "@/app/actions/product/GetProductList";
import ImagesProduct from "@/components/imageShow/ImagesProductID";
import AddToCartButton from "@/components/product/AddToCartButton";
import ColorSelector from "@/components/ModelAndColorSelector";
import { Variant } from "@/types";
import ModelAndColorSelector from "@/components/ModelAndColorSelector";
import DigikalaPrice from "@/components/SearchSite/DigikalaPrice";
import { Metadata } from "next";
import Script from "next/script";
import ProductPriceEdit from "@/components/Edit/ProductPriceEdit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductClient from "@/components/product/ProductClient";

// دریافت محصول بر اساس `slug`
import type { Colors } from "@prisma/client";
// ----------------------
// دریافت اطلاعات محصول
// ----------------------
async function getProduct(id: string): Promise<FormattedPostType | null> {
  try {
    const response = await GetProduct();
    if (!response) throw new Error("خطا در دریافت اطلاعات محصول");

    const products: FormattedPostType[] = response;
    return products.find((p) => p.id === id) ?? null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
// ----------------------
// SEO Metadata
// ----------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  return {
    title: `${product.title} | فروشگاه`,
    description: product.content ?? product.title,
    alternates: {
      canonical: `https://your-domain.com/products/${product.id}`,
    },
    openGraph: {
      title: product.title,
      description: product.content ?? product.title,
      images: [product.productImage[0]?.childImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.admin === true;

  const safeImages: PHOTO[] = product.productImage?.length
    ? product.productImage
    : [
        {
          id: "default",
          childImage: "/default-image.jpg",
          defaultImage: true,
          fileKey: "",
          ownerId: "",
        },
      ];

  // ----------------------
  // Schema.org Product JSON-LD
  // ----------------------
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: safeImages.map((img) => img.childImage),
    description: product.content ?? product.title,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "فروشگاه شما",
    },
    offers: {
      "@type": "Offer",
      url: `https://your-domain.com/products/${product.id}`,
      priceCurrency: "IRR",
      price: product.priceOffer !== 0 ? product.priceOffer : product.price,
      availability:
        product.count > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.review && product.review.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue:
              product.review.reduce((sum, r) => sum + r.rating, 0) /
              product.review.length,
            reviewCount: product.review.length,
          }
        : undefined,
  };
  //
  // فرض بر این است که product.variants شامل آرایه‌ای از ProductVariant است
  // تبدیل ProductWithRelations.productVariants به یک آرایه Variant امن
  // تبدیل ایمن productVariants به چیزی که ColorSelector می‌تواند استفاده کند

  // Breadcrumb JSON-LD
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://your-domain.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "محصولات",
        item: "https://your-domain.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://your-domain.com/products/${product.id}`,
      },
    ],
  };

  console.log(product, "product");

  return (
    <div className="p-6 " dir="rtl">
      {/* JSON-LD */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {/* مسیر ناوبری */}
      <ProductClient isAdmin={isAdmin} product={product} />
    </div>
  );
}
