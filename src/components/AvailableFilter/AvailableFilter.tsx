// src/components/AvailableFilter/AvailableFilter.tsx
"use client";
import React, { useState } from "react";
import FilterParent from "../Filter/FilterParent";
import CheckBoxSold from "./CheckBoxSold";

interface AvailableFilterProps {
  selectedCategory?: string;
  selectedSort?: string;
}
const AvailableFilter: React.FC<AvailableFilterProps> = ({
  selectedCategory,
  selectedSort,
}) => {
  const [inStock, setInStock] = useState(false); // موجود
  const [outOfStock, setOutOfStock] = useState(false); // ناموجود

  return (
    <div className="parent-filter group ">
      <FilterParent title_Filter="فیلتر وصعیت موجودی " />
      <div className="subtitle  group-hover:flex flex-col hidden p-2">
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            inStock={inStock}
            outOfStock={outOfStock}
            namecheckbox="ناموجود"
            isChecked={outOfStock}
            setChecked={setOutOfStock}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            isChecked={inStock}
            setChecked={setInStock}
            inStock={inStock}
            outOfStock={outOfStock}
            namecheckbox="موجود"
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableFilter;
