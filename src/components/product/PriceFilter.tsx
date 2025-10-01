"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider"; // shadcn slider
import { useRouter } from "next/navigation";
import FilterParent from "../Filter/FilterParent";
import { useLoading } from "@/context/LoadingContext";

interface PriceFilterProps {
  selectedCategory?: string;
  selectedSort?: string;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  selectedCategory,
  selectedSort,
}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 5000000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();

  // وقتی isPending false شود، loading را خاموش می‌کنیم
  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending, setIsLoading]);

  const handlePriceFilterDelete = () => {
    setIsLoading(true);

    startTransition(() => {
      router.push(`/products/list`);
    });
  };

  const handleNavigation = (url: string) => {
    setIsLoading(true);

    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <div className="mt-4 parent-filter group">
      <FilterParent title_Filter="فیلتر قیمت" />

      <div className="subtitle group-hover:flex flex-col hidden p-2">
        {/* --- Shadcn Slider --- */}
        <Slider
          min={0}
          max={5000000}
          step={10000}
          defaultValue={priceRange}
          onValueChange={(value: number[]) => {
            setPriceRange([value[0], value[1]]);
          }}
          className="w-full"
        />

        <div className="mt-2 text-sm">
          قیمت از {priceRange[0].toLocaleString()} تا{" "}
          {priceRange[1].toLocaleString()} تومان
        </div>

        {/* --- دکمه‌ها --- */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              handleNavigation(
                `/products/list?category=${selectedCategory || ""}&sort=${
                  selectedSort || "new"
                }&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
              )
            }
            disabled={isPending}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-60"
          >
            {isPending ? "در حال اعمال..." : "اعمال فیلتر قیمت"}
          </button>

          <button
            onClick={handlePriceFilterDelete}
            disabled={isPending}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-60"
          >
            {isPending ? "در حال حذف..." : "حذف تغییرات"}
          </button>
        </div>

        {/* پیام لودینگ */}
        {/* {isPending && (
          <p className="text-blue-600 mt-2 text-sm">🔄 در حال بارگذاری...</p>
        )} */}
      </div>
    </div>
  );
};

export default PriceFilter;
