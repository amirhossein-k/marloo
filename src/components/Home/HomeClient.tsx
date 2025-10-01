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
import { slides, slides2 } from "@/data/Slide";
import { useQuery } from "@tanstack/react-query";
import NewProduct from "./NewProduct";
import FeaturesSection from "./FeaturesSection";
import BannerTwo from "./BannerTwo";
import BannerSlider from "./BannerTwo";
import GIfHome from "./GIfHome";

// import HeroSlider from "@/components/Home/HeroSlider";
// ✅ Dynamically import HeroSlider with SSR turned off

export default function HomeClient({
  initialProducts,
  initialNewProducts,
}: {
  initialProducts: Product[];
  initialNewProducts: Product[];
}) {
  const { data: products } = useQuery({
    queryKey: ["product"],
    queryFn: async () => initialProducts,
    initialData: initialProducts,
  });
  const { data: newProducts } = useQuery({
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

  return (
    <div
      className={`flex-1  w-full ${
        openNav ? "" : "   md:w-[calc(100vw-269px)]"
      } `}
    >
      {/* 🔹 بخش اول (Hero Slider) */}

      {/* <div className="h-[500px] "> */}
      <SliderComponent Slide={slides} />
      {/* </div> */}

      {/* 🔹 ادامه محتوا */}
      <div className=" my-3 ">
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
      <section className="container mx-auto right-[2px] top-10 bg-red-300  relative">
        <h2 className="text-2xl font-bold mb-6 text-right">محصولات ویژه</h2>
        <p className="text-right">اینجا بقیه محتوا میاد ...</p>
      </section>
    </div>
  );
}
