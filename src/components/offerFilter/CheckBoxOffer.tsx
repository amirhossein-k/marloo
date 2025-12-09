"use client";
import React, { memo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setOffer } from "@/store/urlFilterSlice";

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
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { category, max, min, page, sort, offer, count } = useSelector(
    (state: RootState) => state.filter
  );
  // -------------------------------------------------------
  // تابع ساخت URL از روی Redux
  // -------------------------------------------------------
  const buildUrl = (newSoldOut?: boolean) => {
    const offers = newSoldOut ? 1 : 0;
    const cat = selectedCategory || category || "";
    const sortParam = selectedSort || sort || "new";
    return `/products/${cat}?minPrice=${min}&maxPrice=${max}&sort=${sortParam}&page=${page}&count=${count}&offer=${offers}`;
  };

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
    setOfferCheck(newValue);
    dispatch(setOffer(newValue ? 1 : 0));

    startTransition(() => {
      router.push(buildUrl(newValue));
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
