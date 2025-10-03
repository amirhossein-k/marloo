"use client";
import dynamic from "next/dynamic";

import { RootState } from "@/store";
import "@rc-component/color-picker/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNav } from "@/store/navbarSlice";
import { TiThMenu } from "react-icons/ti";
import { FaAngleLeft } from "react-icons/fa";
import EmblaCarousel from "@/components/Home/Simple";
import { EmblaOptionsType } from "embla-carousel";
import SliderComponent from "@/components/Home/Simple";
import { Product, Slide } from "@/types";
import { SwiperOptions } from "swiper/types";
import Image from "next/image";
import { slides, slides2, slideThree } from "@/data/Slide";
import { useQuery } from "@tanstack/react-query";
import NewProduct from "./NewProduct";
import FeaturesSection from "./FeaturesSection";
import BannerTwo from "./BannerTwo";
import BannerSlider from "./BannerTwo";
import GIfHome from "./GIfHome";
import IncredibleOffersPage from "./offer/IncredibleOffersPage";
import { Suspense } from "react"; // اضافه کردن Suspense
import BannerThree from "./BannerThree";
// import HeroSlider from "@/components/Home/HeroSlider";
// ✅ Dynamically import HeroSlider with SSR turned off

export default function HomeClient({
  initialProducts,
  initialNewProducts,
  serverTime, // دریافت serverTime
}: {
  initialProducts: Product[];
  initialNewProducts: Product[];
  serverTime: Date;
}) {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["product"],
    queryFn: async () => initialProducts,
    initialData: initialProducts,
  });
  const { data: newProducts, isLoading: newProductsLoading } = useQuery({
    queryKey: ["new-products"],
    queryFn: async () => initialNewProducts,
    initialData: initialNewProducts,
  });
  const openNav = useSelector((state: RootState) => state.navbar.openNav);

  const breakpoints: SwiperOptions["breakpoints"] = {
    320: { slidesPerView: 2, spaceBetween: 15 },
    980: { slidesPerView: 3, spaceBetween: 15 },
    1204: { slidesPerView: 4, spaceBetween: 15 },
    1400: { slidesPerView: 5, spaceBetween: 15 },
  };

  // فیلتر کردن محصولات دارای تخفیف
  // اضافه کردن این خط برای دیباگ
  // دیباگ بیشتر
  console.log("initialProducts:", initialProducts);
  console.log("initialNewProducts:", initialNewProducts);
  console.log("products from query:", products);

  // استفاده از products به جای newProducts
  const discountedProducts =
    products?.filter((product) => {
      const hasDiscount = product.priceOffer && product.priceOffer > 0;
      const isDiscountValid =
        product.priceOffer && product.priceOffer < product.price;
      const hasDiscountInfo =
        product.discountDaysLeft && product.discountEndDate;
      const isDiscountActive =
        product.discountEndDate &&
        new Date(product.discountEndDate) > new Date();

      return (
        hasDiscount && isDiscountValid && hasDiscountInfo && isDiscountActive
      );
    }) || [];

  // نمایش loading عمومی اگر داده‌ها در حال بارگذاری هستند
  if (productsLoading || newProductsLoading) {
    return (
      <div className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-hidden h-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-lg h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1  w-full max-w-full  overflow-x-hidden overflow-y-hidden h-full ${
        openNav ? "" : "   md:w-[calc(100vw-269px)]"
      } `}
    >
      {/* 🔹 بخش اول (Hero Slider) */}

      <div className="w-full max-w-full overflow-hidden">
        <SliderComponent Slide={slides} />
      </div>

      {/* 🔹 ادامه محتوا */}
      <div className=" my-3 w-full max-w-full overflow-hidden">
        <SliderComponent
          Slide={slides2}
          height="h-[260px]"
          heightLg="lg:h-[260px]"
          heightMD="md:h-[240px]"
          heightSM="sm:h-[250px]"
          SwiperBreakpoints={breakpoints}
        />
        <GIfHome />
        <NewProduct newproduct={newProducts} />
        <FeaturesSection />
        {/* <BannerTwo /> */}
        <BannerSlider />
        <NewProduct newproduct={newProducts} />
      </div>
      <section className="container mx-auto px-4 w-full max-w-full mb-8">
        {/* <h2 className="text-2xl font-bold mb-6 text-right">محصولات ویژه</h2>
        <p className="text-right">اینجا بقیه محتوا میاد ...</p> */}
        {/* Wrap async component در Suspense */}
        {/* <Suspense
          fallback={
            <div className="text-center py-8">
              در حال بارگذاری شگفت‌انگیزها...
            </div>
          }
        > */}
        <IncredibleOffersPage
          products={discountedProducts}
          serverTime={serverTime}
        />
        {/* </Suspense> */}

        <div className="w-full max-w-full overflow-hidden">
          <BannerThree
            Slide={slideThree}
            mobileHeight="h-[300px]"
            tabletHeight="sm:h-[400px]" // بهتر است از sm یا md استفاده کنید
            desktopHeight="lg:h-[420px]" // بهتر است از lg استفاده کنید
            objectFitMobile="contain" // ✅ این خط اصلاح شد
            objectFitDesktop="contain"
          />
        </div>
      </section>
    </div>
  );
}
