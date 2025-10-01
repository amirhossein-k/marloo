/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { sidebarData } from "./sidebar-data";

const Sidebar = () => {
  const pathname = usePathname();
  // State برای مدیریت باز و بسته بودن منوهای آکاردئونی
  const [openCategories, setOpenCategories] = useState<string[]>(["cake"]); // کیک به صورت پیش‌فرض باز است

  // تابعی برای باز و بسته کردن هر دسته بندی
  const handleToggleCategory = (categoryId: string) => {
    setOpenCategories(
      (prevOpen) =>
        prevOpen.includes(categoryId)
          ? prevOpen.filter((id) => id !== categoryId) // اگر باز بود، ببند
          : [...prevOpen, categoryId] // اگر بسته بود، باز کن
    );
  };

  const isLinkActive = (href: string) => {
    // اگر مسیر دقیقاً یکی بود یا زیرمجموعه آن بود، فعال در نظر بگیر
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className="hidden md:flex w-64 min-h-screen h-screen bg-gray-800 text-gray-300 flex-col fixed"
      dir="rtl"
    >
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white text-center">Your Logo</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {sidebarData.map((group: any) => (
          <div key={group.title} className="py-4">
            <h2 className="px-4 mb-2 text-xs font-bold uppercase text-gray-500">
              {group.title}
            </h2>
            <ul>
              {group.categories.map((category: any) => {
                const isActive = isLinkActive(category.href);
                const isOpen = openCategories.includes(category.id);

                if (!category.subCategories) {
                  return (
                    // آیتم‌های بدون زیرمجموعه
                    <li key={category.id}>
                      <Link
                        href={category.href}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 ${
                          isActive
                            ? "bg-gray-700 text-white border-r-4 border-blue-500"
                            : "hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  );
                }

                return (
                  // آیتم‌های دارای زیرمجموعه (آکاردئون)
                  <li key={category.id}>
                    <button
                      onClick={() => handleToggleCategory(category.id)}
                      className={`w-full flex justify-between items-center gap-3 px-4 py-2.5 transition-colors duration-200 ${
                        isActive
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {/* بخش زیرمجموعه‌ها */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-screen" : "max-h-0"
                      }`}
                    >
                      <ul className="py-1 pl-8 pr-4 mx-2 w-full bg-gray-900/50">
                        {category.subCategories.map((sub: any) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className={`flex gap-3 hover:bg-gray-400 items-center rounded-md  py-2 text-sm transition-colors duration-200 ${
                                  isSubActive
                                    ? "text-blue-400 font-semibold"
                                    : "hover:text-white"
                                }`}
                              >
                                {sub.icon && <sub.icon className="w-4 h-4" />}
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
