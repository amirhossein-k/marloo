// src\app\(public)\products\page.tsx

// noindex

import { getCategory } from "@/app/actions/product/GetCategory";
import CategoryLink from "@/components/CategoryLink/CategoryLink";

export const metadata = {
  title: "دسته‌بندی همه محصولات | فروشگاه آنلاین",
  description:
    "همه دسته‌بندی‌های محصولات شامل موبایل، لوازم خانه، لوازم دکوری و بیشتر. دسته مورد نظر خود را انتخاب کنید و آنلاین خرید کنید.",
  robots: "index, follow",
  alternates: {
    canonical: "https://marlooshop.vercel.app/products",
  },
  openGraph: {
    title: "دسته‌بندی همه محصولات",
    description:
      "همه دسته‌بندی‌های محصولات فروشگاه را در یک صفحه ببینید و دسته مورد نظر را انتخاب کنید.",
    url: "https://marlooshop.vercel.app/products",
  },
};

export default async function ProductPage() {
  const category = await getCategory();
  if (category.length === 0) {
    return (
      <div className="p-6">
        <h1>خطا در بارگذاری دسته‌ها</h1>
        <p>متاسفانه دسته‌ها قابل دسترسی نیستند. لطفاً بعداً تلاش کنید.</p>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">همه محصولات</h1>
      <p className="mb-6 text-gray-600">
        {" "}
        برای مشاهده محصولات، یک دسته را انتخاب کنید.
      </p>

      {/* 🔵 GRID - ریسپانسیو کامل */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CategoryLink category={category} />
      </div>
    </div>
  );
}
