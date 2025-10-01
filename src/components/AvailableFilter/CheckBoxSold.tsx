"use client";
import React, { memo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

interface CheckBoxSoldProps {
  namecheckbox: string;
  soldOut: boolean;
  setSoldOut: (value: boolean) => void;
  selectedCategory?: string;
  selectedSort?: string;
}

const CheckBoxSold: React.FC<CheckBoxSoldProps> = ({
  namecheckbox,
  soldOut,
  setSoldOut,
  selectedCategory,
  selectedSort,
}) => {
  const { setIsLoading } = useLoading();

  const isAvailable = namecheckbox === "موجود";
  const searchParams = useSearchParams();
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "500000";

  // تعریف متغیرهای مورد نیاز قبل از تعریف handleChange
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log(checked, "dfdfdfdfdf");
    // اگر چک‌باکس "موجود" باشد، newValue برابر checked است؛ در غیر این صورت برعکس checked
    const newValue = isAvailable ? checked : !checked;
    console.log(newValue, "newe");
    setSoldOut(newValue);
    setIsLoading(true);
    startTransition(() => {
      router.push(
        `/products/list?category=${selectedCategory || ""}&sort=${
          selectedSort || "new"
        }&minPrice=${minPriceParam}&maxPrice=${maxPriceParam}&count=${
          newValue === true ? 1 : 0
        }`
      );
    });
  };

  return (
    <div className="flex items-center gap-2  w-full ">
      <input
        className="w-5 rounded-xl border-3"
        type="checkbox"
        onChange={handleChange}
        name={namecheckbox}
        value={namecheckbox}
        checked={isAvailable ? soldOut : !soldOut}
      />
      <label>{namecheckbox}</label>
    </div>
  );
};

export default memo(CheckBoxSold);
