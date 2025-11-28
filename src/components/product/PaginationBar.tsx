// src\components\product\PaginationBar.tsx
"use client";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/LoadingContext";

interface PaginationBarProps {
  totalPages: number;
  currentPage: number;
  selectedCategory?: string;
  selectedSort?: string;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  totalPages,
  currentPage,
  selectedCategory,
  selectedSort,
}) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  if (!selectedCategory) return null; // اگر دسته مشخص نیست، نداشته باش

  const goToPage = (page: number) => {
    setIsLoading(true); // 🔹 فعال کردن لودینگ
    const params = new URLSearchParams();
    if (selectedSort) params.set("sort", selectedSort);
    if (page && page > 1) params.set("page", String(page));
    const q = params.toString();
    startTransition(() => {
      router.push(
        `/products/${encodeURIComponent(selectedCategory)}${q ? `?${q}` : ""}`
      );
    });
  };

  // ❌ وقتی محصولی نیست اصلاً صفحه‌بندی نشون نده
  if (totalPages === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* دکمه قبلی */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        قبلی
      </Button>

      {/* شماره صفحات */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => goToPage(page)}
        >
          {page}
        </Button>
      ))}

      {/* دکمه بعدی */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        بعدی
      </Button>
    </div>
  );
};

export default PaginationBar;
