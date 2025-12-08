// src/app/(public)/products/[category]/page.tsx

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
import { isValidSortOption, SortOption } from "@/types/shop";
import { Metadata } from "next";
import Script from "next/script";

type Params = { category: string };
type URLSearch = {
  sort?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  count?: string;
  offer?: string;
};

type Props = {
  params: Promise<Params>;
  searchParams: Promise<URLSearch>;
};
// --------------------------------------
// generateMetadata (بدون Promise)
// --------------------------------------
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { category = "همه محصولات" } = await params;
  const sp = await searchParams;

  const sort = sp.sort ?? "";
  const page = sp.page ?? "1";
  const min = sp.minPrice ?? "";
  const max = sp.maxPrice ?? "";
  const hasOffer = sp.offer === "1";

  const isFiltered = Boolean(min || max || sort || hasOffer);

  const title = isFiltered
    ? `فیلتر شده: ${category} | صفحه ${page} | مرتب‌سازی: ${sort || "—"}`
    : `خرید ${category}`;

  const canonicalBase = `https://marlooshop.vercel.app/products/${encodeURIComponent(
    category
  )}`;
  const canonical =
    page && page !== "1" ? `${canonicalBase}?page=${page}` : canonicalBase;

  return {
    title,
    description: `لیست ${category} با بهترین قیمت و تخفیف ویژه.`,
    robots: isFiltered ? "noindex, follow" : "index, follow",
    alternates: { canonical },
    openGraph: {
      title,
      description: `لیست ${category}.`,
      url: canonical,
    },
  };
}

// --------------------------------------
// ShopPage (کاملاً سازگار با Next.js)
// --------------------------------------
export default async function ShopPage({ params, searchParams }: Props) {
  const { category } = await params;
  const sp = await searchParams;

  const sort = sp.sort ?? "";
  const page = sp.page ?? "1";

  const validatedSort: SortOption = isValidSortOption(sort)
    ? (sort as SortOption)
    : "new";

  const currentPage = parseInt(page, 10);

  const minPriceNum = sp.minPrice ? parseInt(sp.minPrice, 10) : undefined;
  const maxPriceNum = sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined;
  const countNum = sp.count ? parseInt(sp.count, 10) : undefined;
  const offerNum = sp.offer ? parseInt(sp.offer, 10) : undefined;

  const { products = [], totalCount = 0 } = await GetProduct({
    category,
    sort: validatedSort,
    page: currentPage,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    count: countNum,
    offer: offerNum,
  } as GetProductParams);

  const limit = 9;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <CurrentPath productId="" cat={category} />

      <h1 className="text-2xl font-bold mb-4">لیست {category}</h1>

      {!products.length && <Spinners />}

      <SortBar selectedSort={validatedSort} selectedCategory={category} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
        <FilterSidebar
          selectedCategory={category}
          selectedSort={validatedSort}
        />

        <div className="col-span-3">
          <ProductGrid products={products} category={category} />

          <PaginationBar
            totalPages={totalPages}
            currentPage={currentPage}
            selectedCategory={category}
            selectedSort={validatedSort}
          />
        </div>
      </div>
    </div>
  );
}
