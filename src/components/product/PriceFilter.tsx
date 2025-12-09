"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider"; // shadcn slider
import { usePathname, useRouter } from "next/navigation";
import FilterParent from "../Filter/FilterParent";
import { useLoading } from "@/context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setMax, setMin, setPage } from "@/store/urlFilterSlice";

interface PriceFilterProps {
  selectedCategory?: string;
  selectedSort?: string;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  selectedCategory,
  selectedSort,
}) => {
  const { category, max, min, page, sort, count, offer } = useSelector(
    (state: RootState) => state.filter
  );
  const dispatch = useDispatch();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    min || 0,
    max || 10000000000,
  ]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  // همگام‌سازی محلی با Redux هنگام mount
  useEffect(() => {
    setPriceRange([min || 0, max || 10000000000]);
  }, [min, max]);

  // --- استخراج پارامترها فقط در سمت کلاینت ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const min = Number(params.get("minPrice")) || 0;
      const max = Number(params.get("maxPrice")) || 10000000000;
      setPriceRange([min, max]);
    }
  }, []);
  // وقتی isPending false شود، loading را خاموش می‌کنیم
  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending, setIsLoading]);
  // ساخت URL با پارامترهای فعلی
  const buildUrl = (range?: [number, number]) => {
    const selected = range ?? priceRange; // از priceRange فعلی استفاده کن

    return `/products/${category}?minPrice=${selected[0]}&maxPrice=${selected[1]}&sort=${sort}&page=${page}&count=${count}&offer=${offer}`;
  };
  // ---------------------------------------------------
  // حذف فیلتر قیمت
  // ---------------------------------------------------
  const handlePriceFilterDelete = () => {
    setIsLoading(true);
    dispatch(setMin(0));
    dispatch(setMax(100000000));
    dispatch(setPage(1)); // Reset page
    startTransition(() => {
      router.push(
        `/products/${selectedCategory || ""}?sort=${
          selectedSort || "new"
        }&minPrice=0&maxPrice=100000000`
      );
    });
  };
  // ---------------------------------------------------
  // اعمال فیلتر قیمت
  // ---------------------------------------------------
  const handleApplyFilter = () => {
    setIsLoading(true);
    dispatch(setMin(priceRange[0]));
    dispatch(setMax(priceRange[1]));
    dispatch(setPage(1)); // Reset page

    startTransition(() => {
      router.push(buildUrl(priceRange));
    });
  };

  return (
    <div className="mt-4 parent-filter group">
      <FilterParent title_Filter="فیلتر قیمت" />

      <div className="subtitle group-hover:flex flex-col hidden p-2">
        {/* --- Shadcn Slider --- */}
        <Slider
          min={0}
          max={100000000}
          step={10000}
          value={priceRange}
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
            onClick={handleApplyFilter}
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
