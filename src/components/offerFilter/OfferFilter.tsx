// src/components/AvailableFilter/AvailableFilter.tsx
'use client';
import React, { useState } from 'react';
import CheckBoxOffer from './CheckBoxOffer';
import FilterParent from '../Filter/FilterParent';

interface AvailableFilterProps {
  selectedCategory?: string;
  selectedSort?: string;
}
const OfferFilter: React.FC<AvailableFilterProps> = ({ selectedCategory, selectedSort }) => {


  const [offerCheck, setOfferCheck] = useState(true);

  return (
    <div className="parent-filter group ">
      <FilterParent title_Filter="فیلتر تخفیف  " />
      <div className="subtitle  group-hover:flex flex-col hidden p-2">
        <div className="category bg-blue-200 text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxOffer offerCheck={offerCheck} namecheckbox="تخفیف دار" setOfferCheck={setOfferCheck} selectedCategory={selectedCategory} selectedSort={selectedSort?.toString()} />
        </div>
        <div className="category bg-blue-200 text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
          <CheckBoxOffer offerCheck={offerCheck} namecheckbox="بدون تخفیف" setOfferCheck={setOfferCheck} selectedCategory={selectedCategory} selectedSort={selectedSort?.toString()} />
        </div>
      </div>
    </div>
  );
};

export default OfferFilter;
