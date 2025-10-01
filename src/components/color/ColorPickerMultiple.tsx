import ColorPicker from "@rc-component/color-picker";
import React, { useState } from "react";
import { Color } from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";
interface colorProps {
  onColorsChange: (colors: string[], primaryColor: string | null) => void;
  initialColor?: string[];
  initialPrimaryColor?: string | null;
}

const ColorPickerMultiple = ({
  onColorsChange,
  initialColor = [],
  initialPrimaryColor = null,
}: colorProps) => {
  const [colors, setColors] = useState<string[]>(initialColor);
  const [currentColor, setCurrentColor] = useState<string>("#ffff");
  const [primaryColor, setPrimaryColor] = useState<string | null>(
    initialPrimaryColor
  );

  const handleColorChange = (color: Color) => {
    setCurrentColor(color.toHexString());
  };

  const removedColor = (colorPicked: string) => {
    const newColor = colors.filter((color) => color !== colorPicked);
    const newPrimaryColor = primaryColor === colorPicked ? null : primaryColor;

    setColors(newColor);
    onColorsChange(newColor, newPrimaryColor);
  };
  const addColor = () => {
    if (!colors.includes(currentColor)) {
      const newColor = [...colors, currentColor];
      setColors(newColor);
      onColorsChange(newColor, primaryColor);
    }
  };
  const setAsPrimary = (color: string) => {
    setPrimaryColor(color);
    onColorsChange(colors, color);
  };

  return (
    <div className="p-4 justify-center items-center">
      <div className="mb-4 bg-gray-200 flex items-center flex-col">
        <label htmlFor="" className="block mb-2">
          انتخاب رنگ
        </label>
        <ColorPicker onChange={handleColorChange} value={currentColor} />
        <button
          type="button"
          onClick={addColor}
          className="bg-blue-500 h-fit px-2 py-3 rounded-md my-2 cursor-pointer hover:bg-blue-300 text-white"
        >
          افزودن رنگ
        </button>
      </div>
      <div className="">
        <h3 className="text-lg font-semibold">رنگ‌های انتخاب‌شده:</h3>
        <div className="flex gap-3">
          {colors.map((color) => (
            <div className="flex items-center gap-2" key={color}>
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />

              <span> {color}</span>
              <button
                type="button"
                className="bg-red-300 px-2 py-3 rounded-md mx-2"
                onClick={() => removedColor(color)}
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => setAsPrimary(color)}
                className={`ml-2 px-2 py-1 rounded ${
                  color === primaryColor
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                اصلی
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPickerMultiple;
