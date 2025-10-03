import React from "react";
import styles from "@/styles/checkBox/Checkbox.module.css";
import { handleChangeCheckbox } from "@/utils/handleChangeCheckbox";
interface Props {
  name: string;
  setName: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  priceOffer: number;
  setPriceOffer: (v: number) => void;
  dateOffer: string;
  setDateOffer: (v: string) => void;
  count: number;
  setCount: (v: number) => void;
  countproduct: number;
  setCountproduct: (v: number) => void;
  checkbox: string;
  setCheckbox: (v: string) => void;
  discountDaysLeft: number;
  setDiscountDaysLeft: (v: number) => void;
  discountEndDate: string;
  setDiscountEndDate: (v: string) => void;
}

const ProductInfoForm = ({
  name,
  setName,
  price,
  setPrice,
  priceOffer,
  setPriceOffer,
  dateOffer,
  setDateOffer,
  count,
  setCount,
  countproduct,
  setCountproduct,
  checkbox,
  setCheckbox,
  discountDaysLeft,
  setDiscountDaysLeft,
  discountEndDate,
  setDiscountEndDate,
}: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1">نام محصول:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">قیمت:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">تخفیف:</label>
        <input
          type="number"
          value={priceOffer}
          onChange={(e) => setPriceOffer(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* فیلدهای جدید برای تخفیف */}
      <div>
        <label className="block mb-1">تعداد روزهای تخفیف:</label>
        <input
          type="number"
          value={discountDaysLeft}
          onChange={(e) => setDiscountDaysLeft(Number(e.target.value))}
          className="w-full p-2 border rounded"
          min="1"
          max="365"
          placeholder="مثلاً 7 برای یک هفته"
        />
      </div>

      <div>
        <label className="block mb-1">تاریخ پایان تخفیف:</label>
        <input
          type="datetime-local"
          value={discountEndDate}
          onChange={(e) => setDiscountEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <small className="text-gray-500">
          تاریخ و زمان پایان دوره تخفیف را انتخاب کنید
        </small>
      </div>

      <div>
        <label className="block mb-1">وضعیت موجودی:</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">تعداد محصول:</label>
        <input
          type="number"
          value={countproduct}
          onChange={(e) => setCountproduct(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className={`${styles.checkbox_wrapper_8} `}>
        <input
          className={`${styles.tgl} ${styles.tgl_skewed}`}
          id="cb3-8"
          type="checkbox"
          //  value={checkbox}
          checked={checkbox === "انتشار"}
          onChange={(e) => handleChangeCheckbox(e, setCheckbox)}
        />
        <label
          className={`${styles.tgl_btn} `}
          data-tg-off="عدم انتشار"
          data-tg-on="انتشار"
          htmlFor="cb3-8"
        ></label>
        <p>مقدار انتشار: {checkbox}</p>
      </div>
      <div className="count">
        <label className={`mx-2`} htmlFor="available">
          وضعیت موجودی :
        </label>
        <input
          className="border-gray-400 border rounded-lg px-2 py-2 "
          id="available"
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ProductInfoForm;
