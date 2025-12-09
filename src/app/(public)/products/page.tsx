// src\app\(public)\products\page.tsx

// noindex

import { getCategory } from "@/app/actions/product/GetCategory";
import CategoryLink from "@/components/CategoryLink/CategoryLink";

export const metadata = {
  title: "همه محصولات",
  description:
    "لیست همه محصولات با بهترین قیمت و تخفیف ویژه. جدیدترین محصولات را آنلاین بخرید.",
  robots: "noindex, follow",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "همه محصولات",
    description:
      "لیست همه محصولات با بهترین قیمت و تخفیف ویژه. جدیدترین محصولات را آنلاین بخرید.",
    url: "/products",
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
      <p className="mb-6 text-gray-600">یک دسته را از لیست زیر انتخاب کنید.</p>

      {/* 🔵 GRID - ریسپانسیو کامل */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CategoryLink category={category} />
      </div>

      <p className="mt-8 text-gray-500">
        برای مشاهده محصولات، یک دسته را انتخاب کنید.
      </p>
    </div>
  );
}
