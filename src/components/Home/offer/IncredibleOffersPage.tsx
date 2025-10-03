"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface IncredibleOffersPageProps {
  products: Product[];
  serverTime: Date;
}

const IncredibleOffersPage: React.FC<IncredibleOffersPageProps> = ({
  products,
  serverTime,
}) => {
  const [loading, setLoading] = useState(true);
  // اضافه کردن useEffect برای مدیریت loading state
  useEffect(() => {
    // اگر محصولات موجود هستند، loading را غیرفعال کن
    if (products && products.length >= 0) {
      // تاخیر کوچک برای نمایش بهتر loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [products]);

  // اگر محصولی نداریم، loading نمایش دهید
  if (!loading && (!products || products.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">هیچ محصول تخفیف‌داری موجود نیست.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg h-80 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* هدر صفحه */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          شگفت‌انگیزهای رو به اتمام
        </h1>
        <p className="text-gray-600">
          فرصت را از دست ندهید! این پیشنهادات ویژه به زودی پایان می‌یابند
        </p>
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            serverTime={serverTime}
          />
        ))}
      </div>
    </div>
  );
};

export default IncredibleOffersPage;
