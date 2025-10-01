// src\components\product\ProductLoadingOverlay.tsx
"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

const ProductLoadingOverlay = () => {
  const { isLoadingProduct } = useLoading(); // 👈 مخصوص فیلتر

  if (!isLoadingProduct) return null;

  return (
    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50 rounded-lg">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      <span className="text-gray-700 font-medium mt-2">
        در حال فیلتر کردن محصولات...
      </span>
    </div>
  );
};

export default ProductLoadingOverlay;
