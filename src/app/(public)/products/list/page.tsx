// src\app\(public)\products\list\page.tsx
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
// 🟢 ساخت متادیتا داینامیک بر اساس دسته و مرتب‌سازی
// 🟢 درست شده
export async function generateMetadata(props: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams; // 👈 باید await بشه

  const category = searchParams?.category || "همه محصولات";
  const title = `خرید ${category} | فروشگاه`;
  const description = `لیست ${category} با بهترین قیمت و تخفیف ویژه. جدیدترین محصولات را آنلاین بخرید.`;
  const sort = searchParams?.sort || "";
  const page = searchParams?.page || "1";

  return {
    title,
    description,
    alternates: {
      canonical: `/products/list?category=${category}&sort=${sort}&page=${page}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/list`,
    },
  };
}

export default async function ShopPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // اضافه کردن await برای حل مشکل "sync-dynamic-apis"
  const searchParams = await searchParamsPromise;

  const { category, sort, page, minPrice, maxPrice, count, offer } =
    searchParams;
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
          <ProductGrid products={products} />
          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            selectedCategory={category}
            selectedSort={sort}
          />
        </div>
      </div>
      {/* JSON-LD برای Breadcrumb */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "خانه",
                item: "https://yourdomain.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "محصولات",
                item: "https://yourdomain.com/products/list",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: category || "همه محصولات",
                item: `https://yourdomain.com/products/list?category=${
                  category || ""
                }`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
