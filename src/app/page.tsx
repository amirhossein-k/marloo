// src\app\page.tsx
"use server";
import dynamic from "next/dynamic";

import { RootState } from "@/store";
// import "@rc-component/color-picker/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNav } from "@/store/navbarSlice";
import { TiThMenu } from "react-icons/ti";
import { FaAngleLeft } from "react-icons/fa";
import EmblaCarousel from "@/components/Home/Simple";
import { EmblaOptionsType } from "embla-carousel";
import SliderComponent from "@/components/Home/Simple";
import { Slide } from "@/types";
import { SwiperOptions } from "swiper/types";
import Image from "next/image";
import { slides, slides2 } from "@/data/Slide";
import HomeClient from "@/components/Home/HomeClient";
import {
  GetNewProducts,
  GetProductList,
} from "./actions/product/GetProductList";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// import HeroSlider from "@/components/Home/HeroSlider";
// ✅ Dynamically import HeroSlider with SSR turned off

export default async function Home() {
  const queryClient = new QueryClient();

  const [allProducts, newProducts] = await Promise.all([
    GetProductList(), // کل محصولات
    GetNewProducts(), // محصولات جدید
  ]);

  // زمان سرور را اینجا بگیرید
  const serverTime = new Date();

  await queryClient.prefetchQuery({
    queryKey: ["product"],
    queryFn: async () => allProducts,
    staleTime: 1000 * 60 * 5, // ۵ دقیقه معتبر باشه
  });

  await queryClient.prefetchQuery({
    queryKey: ["new-products"],
    queryFn: async () => newProducts,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClient
        initialProducts={allProducts}
        initialNewProducts={newProducts}
        serverTime={serverTime} // پاس دادن زمان سرور
      />
    </HydrationBoundary>
  );
}
