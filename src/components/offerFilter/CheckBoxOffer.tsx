"use client";
import React, { memo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CheckBoxOfferProps {
  namecheckbox: string;
  offerCheck: boolean;
  setOfferCheck: (value: boolean) => void;
  selectedCategory?: string;
  selectedSort?: string;
}

const CheckBoxOffer: React.FC<CheckBoxOfferProps> = ({
  namecheckbox,
  offerCheck,
  setOfferCheck,
  selectedCategory,
  selectedSort,
}) => {
  const isAvailable = namecheckbox === "تخفیف دار";
  const searchParams = useSearchParams();
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "500000";
  const count = searchParams.get("count") || "1";

  // تعریف متغیرهای مورد نیاز قبل از تعریف handleChange
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    console.log(checked,'dfdfdfdfdf')
    // اگر چک‌باکس "موجود" باشد، newValue برابر checked است؛ در غیر این صورت برعکس checked
    const newValue = isAvailable ? checked : !checked;
    console.log(newValue, "newe");
    setOfferCheck(newValue);
    startTransition(() => {
      router.push(
        `/products/list?category=${selectedCategory || ""}&sort=${
          selectedSort || "new"
        }&minPrice=${minPriceParam}&maxPrice=${maxPriceParam}&offer=${newValue===true ? 1: 0}&count=${count}`
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
        checked={isAvailable ? offerCheck : !offerCheck}
      />
      <label>{namecheckbox}</label>
    </div>
  );
};

export default memo(CheckBoxOffer);
