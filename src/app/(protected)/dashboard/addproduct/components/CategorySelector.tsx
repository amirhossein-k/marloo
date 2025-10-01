import React from "react";

interface Props {
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
}

const categories = [
  { key: "lavazemKhane", label: "لوازم خانه" },
  { key: "mobile", label: "موبایل" },
  { key: "dekori", label: "لوازم دکوری" },
  { key: "qhab", label: "قاب ها" },
];

const CategorySelector = ({
  selectedCategories,
  setSelectedCategories,
}: Props) => {
  const toggleCategory = (key: string) => {
    setSelectedCategories(
      selectedCategories.includes(key)
        ? selectedCategories.filter((c) => c !== key)
        : [...selectedCategories, key]
    );
  };

  return (
    <div>
      <label className="block mb-1">دسته‌بندی‌ها:</label>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <label key={cat.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.key)}
              onChange={() => toggleCategory(cat.key)}
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
