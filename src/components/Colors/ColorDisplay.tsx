// src/components/ColorDisplay.tsx
"use client";

import { isHexColor } from "@/app/lib/colorDetect";
import React from "react";

// تابع کمکی که در قدم ۱ ساختیم را اینجا قرار می‌دهیم

interface ColorDisplayProps {
  color?: string;
  model?: string;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ color, model }) => {
  if (!color) return null;

  return (
    <div
      className="flex items-center gap-2 text-xs text-gray-500  w-full  shadow-custom1  "
      dir="rtl"
    >
      <span>رنگ:</span>
      {isHexColor(color) ? (
        // اگر کد هگزادسیمال بود، دایره رنگی را نمایش بده
        <span
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
          title={color} // نام رنگ در هاور نمایش داده شود
        />
      ) : (
        // در غیر این صورت، نام رنگ را به صورت متنی نمایش بده
        <span className="font-semibold">{color}</span>
      )}
      {model && <span>({model})</span>}
    </div>
  );
};

export default ColorDisplay;
