"use client";

export default function SkeletonCard() {
  return (
    <div
      className="animate-pulse border flex flex-col justify-between rounded-lg p-4 shadow-sm"
      dir="rtl"
    >
      {/* تصویر */}
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>

      {/* عنوان */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* قیمت */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>

      {/* ستاره‌ها */}
      <div className="flex gap-2 mb-3">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
      </div>

      {/* دکمه */}
      <div className="mt-4 h-8 bg-gray-300 rounded"></div>
    </div>
  );
}
