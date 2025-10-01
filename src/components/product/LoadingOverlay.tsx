"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="text-gray-700 font-medium">لطفاً کمی صبر کنید...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
