"use client";
import React, { memo, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCount } from "@/store/urlFilterSlice";

interface CheckBoxSoldProps {
  namecheckbox: string;
  isChecked: boolean; // از parent میاد (computed از Redux)
  inStock: boolean; // وضعیت "موجود" از parent
  outOfStock: boolean; // وضعیت "ناموجود" از parent
  selectedCategory?: string;
  selectedSort?: string;
}

const CheckBoxSold: React.FC<CheckBoxSoldProps> = ({
  namecheckbox,
  isChecked,
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
    // محاسبه count جدید بر اساس وضعیت فعلی
    let newCount: number;
    const newValue = !isChecked;

    // محاسبه مقدار count طبق انتخاب‌ها:
    // let countValue = 2; // پیش‌فرض: نمایش همه

    // if (newValue && namecheckbox === "موجود" && !outOfStock)
    //   countValue = 1; // فقط موجود
    // else if (newValue && namecheckbox === "ناموجود" && !inStock)
    //   countValue = 0; // فقط ناموجود
    // else if (!newValue) {
    //   // در حال خاموش کردن
    //   if (namecheckbox === "موجود" && outOfStock) countValue = 0; // فقط ناموجود
    //   else if (namecheckbox === "ناموجود" && inStock) countValue = 1; // فقط موجود
    // }
    if (namecheckbox === "موجود") {
      newCount = inStock ? 2 : 1; // اگه موجود تیک بود → همه، وگرنه فقط موجود
    } else {
      newCount = outOfStock ? 2 : 0; // اگه ناموجود تیک بود → همه، وگرنه فقط ناموجود
    }

    dispatch(setCount(newCount));
    setIsLoading(true);
    startTransition(() => {
      router.push(buildUrl(newCount));
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
