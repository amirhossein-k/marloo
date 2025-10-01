"use client";
import { Colors } from "@prisma/client";
import React from "react";
interface ColorProps {
  colors: Colors[];
  selectedColor: string;
  onChange: (id: string) => void;
}

const SelectColor = ({ colors, selectedColor, onChange }: ColorProps) => {
  if (!colors || colors.length === 0) return null;

  console.log(colors, "colrs");
  return (
    <ul className="m-4 space-y-2">
      {colors.map((c) => (
        <li
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`p-2 border rounded cursor-pointer text-sm flex justify-between relative
            ${
              selectedColor === c.id ? "border-blue-500 bg-blue-50" : "bg-white"
            }
          `}
        >
          <span>
            {c.color} - {c.model}
          </span>
          <span>{c.inventory} عدد</span>
        </li>
      ))}
    </ul>
  );
};

export default SelectColor;
