// src/components/AvailableFilter/AvailableFilter.tsx
"use client";
import React, { useState } from "react";
import FilterParent from "../Filter/FilterParent";
import CheckBoxSold from "./CheckBoxSold";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AvailableFilterProps {
  selectedCategory?: string;
  selectedSort?: string;
}
const AvailableFilter: React.FC<AvailableFilterProps> = ({
  selectedCategory,
  selectedSort,
}) => {
  // const [inStock, setInStock] = useState(false); // موجود
  // const [outOfStock, setOutOfStock] = useState(false); // ناموجود
  const { count } = useSelector((state: RootState) => state.filter);

  // محاسبه وضعیت چک‌باکس‌ها از روی count Redux
  const inStockChecked = count === 1;
  const outOfStockChecked = count === 0;

  return (
    <div className="parent-filter group ">
      <FilterParent title_Filter="فیلتر وصعیت موجودی " />
      <div className="subtitle  group-hover:flex flex-col hidden p-2">
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            inStock={inStockChecked}
            outOfStock={outOfStockChecked}
            namecheckbox="ناموجود"
            isChecked={outOfStockChecked}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            namecheckbox="موجود"
            isChecked={inStockChecked}
            inStock={inStockChecked}
            outOfStock={outOfStockChecked}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableFilter;
