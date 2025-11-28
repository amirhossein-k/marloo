// components/SortBar.tsx
"use client";
// import Link from 'next/link';
import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SortOption } from "@/app/actions/product/GetProductListOrder";
import { useLoading } from "@/context/LoadingContext";

// import { useLoading } from '@/context/LoadingContext';
interface SortBarProps {
  selectedSort?: SortOption;
  selectedCategory?: string;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "جدید", value: "new" },
  { label: "قدیم", value: "old" },
  { label: "ارزان", value: "cheap" },
  { label: "گران", value: "expensive" },
];

const SortBar: React.FC<SortBarProps> = ({
  selectedSort,
  selectedCategory,
}) => {
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // وقتی عملیات تغییر مسیر به پایان رسید loading را خاموش می‌کنیم
  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending, setIsLoading]);

  const handleSort = (sort: SortOption) => {
    setIsLoading(true);
    startTransition(() => {
      router.push(`/products/${selectedCategory || ""}?sort=${sort}`);
    });
  };

  return (
    <div className="flex gap-3">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSort(option.value)}
          className={
            selectedSort === option.value
              ? "text-blue-600 font-semibold"
              : "cursor-pointer"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortBar;
