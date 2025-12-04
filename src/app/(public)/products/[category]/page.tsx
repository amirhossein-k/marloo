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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: URLSearch;
}): Promise<Metadata> {
  const category = params?.category ?? "همه محصولات";
  const sort = searchParams?.sort ?? "";
  const page = searchParams?.page ?? "1";
  const min = searchParams?.minPrice ?? "";
  const max = searchParams?.maxPrice ?? "";
  const hasOffer = searchParams?.offer === "1";

  const isFiltered = Boolean(min || max || sort || hasOffer);
  const title = isFiltered
    ? `فیلتر شده: ${category} | صفحه ${page} | مرتب‌سازی: ${sort || "—"}`
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
    alternates: { canonical },
    openGraph: {
      title,
      description: `لیست ${category} با بهترین قیمت و تخفیف ویژه.`,
      url: canonical,
    },
  };
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: URLSearch;
}) {
  const category = params.category;
  const sort = searchParams?.sort ?? "";
  const page = searchParams?.page ?? "1";
  const minPrice = searchParams?.minPrice;
  const maxPrice = searchParams?.maxPrice;
  const count = searchParams?.count;
  const offer = searchParams?.offer;

  // validate sort option — اگر تابع شما boolean برمی‌گرداند این الگو درست است
  const validatedSort: SortOption = isValidSortOption(sort)
    ? (sort as SortOption)
    : "new";

  const currentPage = page ? parseInt(page, 10) : 1;
  const limit = 9;

  const minPriceNum = minPrice ? parseInt(minPrice, 10) : undefined;
  const maxPriceNum = maxPrice ? parseInt(maxPrice, 10) : undefined;
  const countNum = count ? parseInt(count, 10) : undefined;
  const countOffer = offer ? parseInt(offer, 10) : undefined;

  const p = {
    category,
    sort: validatedSort,
    page: currentPage,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    count: countNum,
    offer: countOffer,
  };
  console.log(p, "paramass get product");

  // نکته: اینجا حتما validatedSort را بفرستید، نه sortِ خام
  const { products = [], totalCount = 0 } = await GetProduct({
    category,
    sort: validatedSort,
    page: currentPage,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    count: countNum,
    offer: countOffer,
  } as GetProductParams);

  const totalPages = Math.ceil(totalCount / limit);

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
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <CurrentPath productId={""} cat={category || ""} />
      <h1 className="text-2xl font-bold mb-4">لیست {category || "محصولات"}</h1>
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

      <Script id="breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>

      <Script id="itemlist-jsonld" type="application/ld+json">
        {JSON.stringify(itemList)}
      </Script>
    </div>
  );
}
