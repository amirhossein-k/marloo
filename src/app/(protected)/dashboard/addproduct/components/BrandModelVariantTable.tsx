"use client";

import Bmv from "@/components/bmv/Bmv";
import { useState } from "react";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export default function BrandModelVariantTable() {
  const [showMbv, setShowMbv] = useState(false);
  return (
    <div className="w-full">
      <section style={{ marginTop: "20px" }}>
        <h2
          className="relative bg-blue-400 px-3 py-3 text-center text-lg font-bold cursor-pointer"
          onClick={() => setShowMbv(!showMbv)}
        >
          انتخاب برند / مدل / رنگ
          <span className="absolute top-[17px] text-white text-xl -translate-x-[204px]">
            {showMbv ? (
              <IoIosArrowDropupCircle />
            ) : (
              <IoIosArrowDropdownCircle />
            )}
          </span>
        </h2>
        {showMbv && (
          <Bmv
            onChange={({ brandId, modelId, variantId }) => {
              console.log("انتخاب شده‌ها:", { brandId, modelId, variantId });
            }}
            add={true}
          />
        )}
      </section>
    </div>
  );
}
