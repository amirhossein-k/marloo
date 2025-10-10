"use client";

import React from "react";
import DiscountTimer from "./DiscountTimer";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  serverTime: Date; // دریافت serverTime از parent
}

const ProductCard: React.FC<ProductCardProps> = ({ product, serverTime }) => {
  const calculateDiscountPercent = () => {
    const effectivePriceOffer = product.priceOffer ?? product.price;
    const discount =
      ((product.price - effectivePriceOffer) / product.price) * 100;
    return Math.round(discount);
  };
  // پیدا کردن تصویر پیش‌فرض با fallback به placeholder
  const defaultImage =
    product.productImage?.find((img) => img.defaultImage)?.childImage ??
    "/images/placeholder.jpg";

  // بررسی وجود داده‌های لازم برای تایمر
  const hasTimerData =
    product.discountEndDate ||
    (product.discountDaysLeft !== null &&
      product.discountDaysLeft !== undefined);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* تصویر محصول */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={defaultImage}
          alt={product.title}
          width={300}
          height={192}
          className="w-full h-full object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            // فال‌بک برای تصاویر شکسته
            e.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          {calculateDiscountPercent()}%
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* قیمت‌ها */}
        <div className="flex items-center space-x-2 space-x-reverse mb-3">
          <span className="text-lg font-bold text-gray-800">
            {product.priceOffer?.toLocaleString()
              ? (
                  ((product.priceWithProfit ?? 0 / 100) * 90) /
                  100
                ).toLocaleString()
              : product.priceWithProfit?.toLocaleString()}
            تومان
          </span>
          <span className="text-sm text-gray-500 line-through">
            {product.price.toLocaleString()}
          </span>
        </div>

        {/* تایمر تخفیف - فقط اگر داده داشته باشد نمایش داده شود */}
        {hasTimerData && (
          <DiscountTimer
            endDate={product.discountEndDate || undefined}
            daysLeft={product.discountDaysLeft || undefined}
            serverTime={serverTime}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
