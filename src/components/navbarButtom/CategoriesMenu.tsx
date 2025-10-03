// components/CategoriesMenu.tsx
"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 122.88 122.54"
    width={22}
    height={22}
  >
    <title>search-categories</title>
    <path
      d="M4.69,0H46.22a4.71,4.71,0,0,1,4.69,4.69V46a4.69,4.69,0,0,1-4.69,4.69H4.69a4.65,4.65,0,0,1-3.31-1.38l-.09-.09A4.67,4.67,0,0,1,0,46V4.69A4.71,4.71,0,0,1,4.69,0ZM89.44,61.94a26.56,26.56,0,0,1,10.18,2l.07,0a26.61,26.61,0,0,1,15.25,32.16,26.18,26.18,0,0,1-2.7,6.11l10.3,11.24a1.27,1.27,0,0,1-.07,1.8l-7.57,6.9a1.27,1.27,0,0,1-1.79-.07l-9.86-10.85a26.36,26.36,0,0,1-6.1,2.74,26.87,26.87,0,0,1-7.71,1.13,26.51,26.51,0,0,1-10.17-2l-.07,0A26.64,26.64,0,0,1,64.85,78.37l0-.07A26.6,26.6,0,0,1,89.44,61.94Zm15,11.59a21.38,21.38,0,0,0-6.89-4.61l-.06,0a21.22,21.22,0,0,0-23.07,4.64l-.07.07a21.25,21.25,0,0,0-4.54,6.83l0,.06a21.32,21.32,0,0,0-1.58,8.06,21.26,21.26,0,0,0,29.35,19.62,21.54,21.54,0,0,0,6.89-4.61l.07-.07a21.09,21.09,0,0,0,4.54-6.83l0-.06a21.35,21.35,0,0,0,0-16.17,21.34,21.34,0,0,0-4.62-6.9ZM4.69,63.2H46.22a4.71,4.71,0,0,1,4.69,4.7v41.34a4.68,4.68,0,0,1-4.69,4.69H4.69A4.69,4.69,0,0,1,0,109.24V67.9a4.71,4.71,0,0,1,4.69-4.7ZM68.78,0h41.53A4.71,4.71,0,0,1,115,4.69V46a4.71,4.71,0,0,1-4.69,4.69H68.78A4.71,4.71,0,0,1,64.09,46V4.69a4.69,4.69,0,0,1,1.37-3.31l.1-.09A4.67,4.67,0,0,1,68.78,0Z"
      fill="currentColor" // این باعث می‌شود رنگ آیکون مطابق با رنگ متن باشد
    />
  </svg>
);
// نمونه داده‌های دسته‌بندی‌ها (می‌توانید از API دریافت کنید)
const categories = [
  {
    id: "1",
    name: "لوازم الکترونیکی",
    subcategories: [
      {
        id: "1-1",
        name: "موبایل و تبلت",
        items: [
          { id: "1-1-1", name: "گوشی موبایل", slug: "/products/mobile" },
          { id: "1-1-2", name: "تبلت", slug: "/products/tablet" },
          { id: "1-1-3", name: "قاب و محافظ", slug: "/products/phone-case" },
        ],
      },
      {
        id: "1-2",
        name: "لپ‌تاپ و کامپیوتر",
        items: [
          { id: "1-2-1", name: "لپ‌تاپ", slug: "/products/laptop" },
          { id: "1-2-2", name: "کامپیوتر رومیزی", slug: "/products/desktop" },
          { id: "1-2-3", name: "مانیتور", slug: "/products/monitor" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "پوشاک",
    subcategories: [
      {
        id: "2-1",
        name: "مردانه",
        items: [
          { id: "2-1-1", name: "تیشرت", slug: "/products/men-tshirt" },
          { id: "2-1-2", name: "شلوار", slug: "/products/men-pants" },
          { id: "2-1-3", name: "کفش", slug: "/products/men-shoes" },
        ],
      },
      {
        id: "2-2",
        name: "زنانه",
        items: [
          { id: "2-2-1", name: "لباس", slug: "/products/women-dress" },
          { id: "2-2-2", name: "کفش زنانه", slug: "/products/women-shoes" },
          { id: "2-2-3", name: "اکسسوری", slug: "/products/women-accessories" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "خانه و آشپزخانه",
    subcategories: [
      {
        id: "3-1",
        name: "لوازم آشپزخانه",
        items: [
          { id: "3-1-1", name: "ظروف", slug: "/products/kitchen-ware" },
          {
            id: "3-1-2",
            name: "وسایل برقی",
            slug: "/products/kitchen-appliances",
          },
        ],
      },
    ],
  },
];

interface CategoriesMenuProps {
  isActive: boolean;
}

export default function CategoriesMenu({ isActive }: CategoriesMenuProps) {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(slug);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${
          isActive ? "bg-purple-600 text-white" : "hover:text-white"
        }`}
      >
        <CategoryIcon />
        {isActive && <span className="text-sm font-medium">دسته‌بندی‌ها</span>}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <Menu.Items className="absolute bottom-full left-0 mb-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              همه دسته‌بندی‌ها
            </h3>

            <div className="space-y-2">
              {categories.map((category) => (
                <Menu.Item key={category.id}>
                  {({ active }) => (
                    <div className="relative group">
                      <button
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-right transition-colors ${
                          active
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <ChevronLeft size={16} className="text-gray-400" />
                      </button>

                      {/* زیرمنو */}
                      <div className="absolute right-full top-0 mr-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="p-4">
                          <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">
                            {category.name}
                          </h4>
                          <div className="grid gap-2">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="mb-3">
                                <h5 className="font-semibold text-gray-700 mb-2 text-sm">
                                  {subcategory.name}
                                </h5>
                                <div className="space-y-1">
                                  {subcategory.items.map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() =>
                                        handleCategoryClick(item.slug)
                                      }
                                      className="block w-full text-right p-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors"
                                    >
                                      {item.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
