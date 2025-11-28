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
  const [soldOut, setSoldOut] = useState(true);

  return (
    <div className="parent-filter group ">
      <FilterParent title_Filter="فیلتر وصعیت موجودی " />
      <div className="subtitle  group-hover:flex flex-col hidden p-2">
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            soldOut={soldOut}
            namecheckbox="ناموجود"
            setSoldOut={setSoldOut}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
        <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxSold
            soldOut={soldOut}
            namecheckbox="موجود"
            setSoldOut={setSoldOut}
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableFilter;
