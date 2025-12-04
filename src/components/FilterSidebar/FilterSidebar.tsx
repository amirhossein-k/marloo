// components/FilterSidebar.tsx
"use client";
// import Link from 'next/link';
import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Menu } from "lucide-react";
import AvailableFilter from "../AvailableFilter/AvailableFilter";
import FilterParent from "../Filter/FilterParent";
import OfferFilter from "../offerFilter/OfferFilter";
import { SortOption } from "@/app/actions/product/GetProductListOrder";
import PriceFilter from "../product/PriceFilter";
import { useLoading } from "@/context/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import {
  hydrateFromUrl,
  initialState,
  setCategory,
  setPage,
} from "@/store/urlFilterSlice";
import { RootState } from "@/store";

interface FilterSidebarProps {
  selectedCategory?: string;
  selectedSort?: SortOption | string;
}

const categories = [
  { key: "lavazemKhane", label: "لوازم خانه" },
  { key: "mobile", label: "موبایل" },
  { key: "dekori", label: "لوازم دکوری" },
  { key: "qhab", label: "قاب ها" },
];
// const categories: string[] = ['lavazemKhane', 'mobile', 'dekori', 'qhab'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  selectedSort,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const dispatch = useDispatch();

  const { max, min, page, sort, count, offer } = useSelector(
    (state: RootState) => state.filter
  );

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const pathname = usePathname();

  // -------------------------------------------------------
  // 1) Hydrate Redux from URL on first load
  // -------------------------------------------------------
  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1280); // xl breakpoint در Tailwind: 1280px
    };
    checkWidth();
    const params = new URLSearchParams(window.location.search);

    dispatch(
      hydrateFromUrl({
        min: Number(params.get("minPrice")) || 0,
        max: Number(params.get("maxPrice")) || 100000000,
        sort: params.get("sort") || "new",
        category:
          pathname.includes("/products/") && pathname.split("/")[2]
            ? pathname.split("/")[2]
            : "",
        page: Number(params.get("page")) || 1,
        count: Number(params.get("count")) || 1,
        offer: Number(params.get("offer")) || 1,
      })
    );
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // -------------------------------------------------------
  // تابع ساخت URL از روی Redux
  // -------------------------------------------------------
  const buildUrl = (category?: string) => {
    const selected = category ?? category;

    return `/products/${selected}?minPrice=${min}&maxPrice=${max}&sort=${sort}&page=${page}&count=${count}&offer=${offer}`;
  };

  const handleCategoryClick = (categorySelect: string) => {
    setIsLoading(true); // 👈 قبل از ناوبری
    dispatch(setCategory(categorySelect));
    dispatch(setPage(1)); // هنگام تغییر دسته، صفحه باید 1 شود

    startTransition(() => {
      router.push(buildUrl(categorySelect));
    });
  };

  return (
    <>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-blue-600 text-white px-6 py-3 rounded-b-lg shadow-lg">
              منتظر بمانید...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* در حالت موبایل، دکمه نمایش فیلتر */}
      {!isDesktop && (
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md mb-4"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
          فیلتر محصولات
        </button>
      )}

      {/* حالت موبایل: نمایش کشویی فیلتر */}
      {!isDesktop && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: isOpen ? "0%" : "-100%", opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50"
        >
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-md mb-4"
            onClick={() => setIsOpen(false)}
          >
            بستن
          </button>
          <h3 className="mb-2 font-bold text-lg">دسته‌بندی محصولات</h3>
          <ul className="mb-4 parent-filter group ">
            <FilterParent title_Filter="فیلتر  دسته بندی محصولات " />
            <div className="subtitle  group-hover:flex flex-col hidden p-2">
              {categories.map((cat) => (
                <li key={cat.key} className="mb-2">
                  <div className="category  text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
                    {/* <Link href={`/products/list?category=${cat}&sort=${selectedSort || 'new'}`}>
                  <span className={selectedCategory === cat ? 'text-blue-600 font-semibold' : 'cursor-pointer'}>
                    {cat}
                  </span>
                </Link> */}
                    <button
                      onClick={() => handleCategoryClick(cat.key)}
                      className={
                        selectedCategory === cat.key
                          ? "text-blue-600 font-semibold"
                          : "cursor-pointer w-full"
                      }
                    >
                      {cat.label}
                    </button>
                  </div>
                </li>
              ))}
            </div>
          </ul>

          <PriceFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />

          <AvailableFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </motion.div>
      )}

      {/* حالت دسکتاپ: نمایش ثابت فیلتر */}
      {isDesktop && (
        <div className="bg-white shadow-lg p-4">
          <ul className="mb-4 parent-filter group">
            <FilterParent title_Filter="فیلتر  دسته بندی محصولات " />
            <div className="subtitle  group-hover:flex flex-col hidden p-2 w-full">
              {categories.map((cat) => (
                <li key={cat.key} className="mb-2 w-full ">
                  <div className="category  w-full text-black flex gap-4 p-3 text-lg bg-[#f3f2f2a1] rounded-md">
                    {/* <Link href={`/products/list?category=${cat}&sort=${selectedSort || 'new'}`}>
                  <span className={selectedCategory === cat ? 'text-blue-600 font-semibold' : 'cursor-pointer'}>
                    {cat}
                  </span>
                </Link> */}
                    <button
                      onClick={() => handleCategoryClick(cat.key)}
                      className={
                        selectedCategory === cat.key
                          ? "text-blue-600 font-semibold"
                          : "cursor-pointer w-full"
                      }
                    >
                      {cat.label}
                    </button>
                  </div>
                </li>
              ))}
            </div>
          </ul>
          <PriceFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
          <AvailableFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
          <OfferFilter
            selectedCategory={selectedCategory}
            selectedSort={selectedSort?.toString()}
          />
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
