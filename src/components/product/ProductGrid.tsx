// components/products/ProductGrid.tsx
"use client";
import React, { useEffect, useTransition } from "react";
import ProductCard from "./ProductCard";
// import { useLoading } from '@/context/LoadingContext';
import { FormattedPostType } from "@/types";
import SkeletonCard from "./SkeletonCard";
import { useLoading } from "@/context/LoadingContext";
import { useRouter } from "next/navigation";
interface ProductGridProps {
  products: FormattedPostType[];
  category: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, category }) => {
  // const { isLoading,isLoadingFilter } = useLoading();
  const { isLoading, setIsLoading } = useLoading();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  useEffect(() => {
    // هر وقت products تغییر کرد => لودینگ خاموش کن
    setIsLoading(false);
  }, [products, setIsLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const handlepush = () => {
    startTransition(() => {
      setIsLoading(true);
      router.push("/products");
    });
  };
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-[60vh]">
        {/* آیکون بزرگ */}
        <div className="text-6xl mb-6">😔</div>

        {/* پیام اصلی */}
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">
          هیچ محصولی یافت نشد
        </h2>

        {/* پیام توضیحی */}
        <p className="text-gray-500 text-center max-w-sm">
          متأسفیم، محصولی مطابق فیلترهای انتخابی شما وجود ندارد. لطفاً فیلترها
          را تغییر دهید یا دوباره جستجو کنید.
        </p>

        {/* دکمه برگشت یا حذف فیلتر */}
        <button
          onClick={handlepush} // یا می‌تونی ریدایرکت به صفحه محصولات بذاری
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          مشاهده همه محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} category={category} />
      ))}
    </div>
  );
};

export default ProductGrid;
