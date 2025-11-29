"use client";
import React, { memo, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCount } from "@/store/urlFilterSlice";

interface CheckBoxSoldProps {
  namecheckbox: string;
  isChecked: boolean;
  setChecked: (value: boolean) => void;
  inStock: boolean;
  outOfStock: boolean;
  selectedCategory?: string;
  selectedSort?: string;
}

const CheckBoxSold: React.FC<CheckBoxSoldProps> = ({
  namecheckbox,
  isChecked,
  setChecked,
  inStock,
  outOfStock,
  selectedCategory,
  selectedSort,
}) => {
  const { setIsLoading } = useLoading();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { category, max, min, page, sort, offer, count } = useSelector(
    (state: RootState) => state.filter
  );

  // -------------------------------------------------------
  // تابع ساخت URL از روی Redux
  // -------------------------------------------------------
  const buildUrl = (newCount: number) => {
    // const count = newSoldOut ? 1 : 0;
    const cat = selectedCategory || category || "";
    const sortParam = selectedSort || sort || "new";
    return `/products/${cat}?minPrice=${min}&maxPrice=${max}&sort=${sortParam}&page=${page}&count=${newCount}&offer=${offer}`;
  };

  // تعریف متغیرهای مورد نیاز قبل از تعریف handleChange
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // -------------------------------
  // تغییر وضعیت چک‌باکس
  // -------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const newValue = !isChecked;
    setChecked(newValue);

    // محاسبه مقدار count طبق انتخاب‌ها:
    let countValue = 2; // پیش‌فرض: نمایش همه

    if (newValue && namecheckbox === "موجود" && !outOfStock)
      countValue = 1; // فقط موجود
    else if (newValue && namecheckbox === "ناموجود" && !inStock)
      countValue = 0; // فقط ناموجود
    else if (!newValue) {
      // در حال خاموش کردن
      if (namecheckbox === "موجود" && outOfStock) countValue = 0; // فقط ناموجود
      else if (namecheckbox === "ناموجود" && inStock) countValue = 1; // فقط موجود
    }

    dispatch(setCount(countValue));
    setIsLoading(true);
    startTransition(() => {
      router.push(buildUrl(countValue));
    });
  };
  console.log(isChecked, "ischexk");

  return (
    <div className="flex items-center gap-2  w-full ">
      <input
        className="w-5 rounded-xl border-3"
        type="checkbox"
        onChange={handleChange}
        // name={namecheckbox}
        // value={namecheckbox}
        checked={isChecked}

        // checked={isAvailable ? soldOut : !soldOut}
      />
      <label>{namecheckbox}</label>
    </div>
  );
};

export default memo(CheckBoxSold);
