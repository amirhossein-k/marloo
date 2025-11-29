// src\app\(public)\products\[category]\page.tsx
"use server";
import {
  GetProduct,
  GetProductParams,
} from "@/app/actions/product/GetProductListOrder";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import CurrentPath from "@/components/path/CurrentPath";
import PaginationBar from "@/components/product/PaginationBar";
import ProductGrid from "@/components/product/ProductGrid";
import SortBar from "@/components/product/SortBar";
import Spinners from "@/components/product/Spinner";
// import ProductCard from '@/components/products/ProductCard';
// import { POSTTYPE } from '@/utils/types';
import { Metadata } from "next";
import Script from "next/script";

interface SearchParams {
  category?: string;
  sort?: "new" | "old" | "cheap" | "expensive";
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  count?: string;
  offer?: string;
}
type Props = {
  searchParams?: {
    category?: string;
    sort?: string;
    page?: string;
  };
};
// fhthtr
// 🟢 ساخت متادیتا داینامیک بر اساس دسته و مرتب‌سازی
// 🟢 درست شده
export async function generateMetadata(props: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams; // 👈 باید await بشه
  console.log("category");
  const category = searchParams?.category || "همه محصولات";
  const description = `لیست ${category} با بهترین قیمت و تخفیف ویژه. جدیدترین محصولات را آنلاین بخرید.`;
  const sort = searchParams?.sort || "";
  const page = searchParams?.page || "1";
  const min = searchParams.minPrice || "";
  const max = searchParams.maxPrice || "";
  const isFiltered = Boolean(min || max);
  const title = isFiltered
    ? `نتایج ${category} - نتایج فیلتر شده`
    : page && page !== "1"
    ? `خرید ${category} - صفحه ${page}`
    : `خرید ${category}`;

  const canonicalBase = `https://marlooshop.vercel.app/products/${encodeURIComponent(
    category
  )}`;
  const canonical =
    page && page !== "1" ? `${canonicalBase}?page=${page}` : canonicalBase;

  return {
    title,
    description: `لیست ${category} با بهترین قیمت و تخفیف ویژه. مشاهده محصولات ${category}.`,
    robots: isFiltered ? "noindex, follow" : "index, follow",
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: `لیست ${category} با بهترین قیمت و تخفیف ویژه.`,
      url: canonical,
    },
  };
}

export default async function ShopPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: { category: string };
  searchParams: Promise<SearchParams>;
}) {
  // اضافه کردن await برای حل مشکل "sync-dynamic-apis"
  const searchParams = await searchParamsPromise;
  const { category } = params;
  const { sort, page, minPrice, maxPrice, count, offer } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const limit = 9;

  // تبدیل مقادیر قیمت به عدد در صورت وجود
  const minPriceNum = minPrice ? Number(minPrice) : undefined;
  const maxPriceNum = maxPrice ? Number(maxPrice) : undefined;
  // / تبدیل مقدار count به عدد. اگر count در URL موجود نباشد، undefined است.
  const countNum = count !== undefined ? Number(count) : undefined;
  const countOffer = offer !== undefined ? Number(offer) : undefined;
  // دریافت محصولات و تعداد کل موارد بر اساس فیلترها
  const p = {
    category,
    sort,
    page: currentPage,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    count: countNum, // ارسال به صورت عددی,
    offer: countOffer, // ارسال به صورت عددی,
  };
  console.log(p, "paramass get product");
  const { products, totalCount } = await GetProduct({
    category,
    sort,
    page: currentPage,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    count: countNum, // ارسال به صورت عددی,
    offer: countOffer, // ارسال به صورت عددی,
  } as GetProductParams);
  const totalPages = Math.ceil(totalCount / limit);

  console.log(products, "[rprpict");

  // JSON-LD for Breadcrumb and ItemList
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://marlooshop.vercel.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "محصولات",
        item: "https://marlooshop.vercel.app/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `https://marlooshop.vercel.app/products/${encodeURIComponent(
          category ?? ""
        )}`,
      },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemListElement: products.map((p: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1 + (currentPage - 1) * limit,
      url: `https://marlooshop.vercel.app/products/${p.id}`,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8 " dir="rtl">
      {/* صفحه ای که هستی را نشان میدهد */}
      <CurrentPath productId={""} cat={category || ""} />
      {/* loading  در بخش بالای صفحه در صورت کلیک روی محصول یا دکمه ها به نمایش در می اورد */}
      {/* <Spinners /> */}
      <h1 className="text-2xl font-bold mb-4">لیست {category || "محصولات"}</h1>
      {/* Spinner در حالت بارگذاری */}
      {!products.length && <Spinners />}
      {/* نوار مرتب‌سازی */}
      <SortBar selectedSort={sort} selectedCategory={category} />

      {/* ساختار دو ستونه: در حالت xl به بالا صفحه دو ستونه نمایش داده می‌شود */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
        {/* ستون اول: FilterSidebar - در حالت rtl اولین ستون در سمت راست قرار می‌گیرد */}
        {/* <div> */}
        <FilterSidebar selectedCategory={category} selectedSort={sort} />
        {/* </div> */}

        {/* ستون دوم: لیست محصولات */}
        <div className="col-span-3">
          <ProductGrid products={products} category={category} />
          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            selectedCategory={category}
            selectedSort={sort}
          />
        </div>
      </div>

      <Script id="breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>

      <Script id="itemlist-jsonld" type="application/ld+json">
        {JSON.stringify(itemList)}
      </Script>
    </div>
  );
}
