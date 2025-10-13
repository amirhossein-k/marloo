"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
const slides = [
  {
    id: "1",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757520572865-baner%20copy%202.jpg", // تصاویر خود را قرار دهید
    title: "فروش بزرگ تابستانه",
    subtitle: "تخفیف‌های ویژه تا ۵۰٪",
    cta: "همین حالا خرید کن",
  },
  {
    id: "2",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757518693999-baner%20copy.webp",
    title: "محصولات جدید آمدند",
    subtitle: "ترندهای جدید مد امسال",
    cta: "مشاهده جزئیات",
  },
];

export default function BannerSlider() {
  const openNav = useSelector((state: RootState) => state.navbar.openNav);

  return (
    <div
      className={`  ${
        openNav ? "" : "   lg:w-[calc(100vw-269px)]"
      }  rounded-md overflow-hidden px-2  `}
    >
      <div className="relative w-full h-[70vh] md:h-[60vh] lg:h-[500px] overflow-hidden rounded-md">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full p-1 rounded-md overflow-hidden m-1">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  quality={100}
                  className="object-cover h-full w-full rounded-md overflow-hidden"
                  priority
                />
                <div className="absolute inset-0  flex flex-col justify-center items-center text-center px-4 rounded-md overflow-hidden">
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-white text-lg md:text-xl mb-4">
                    {slide.subtitle}
                  </p>
                  <button className="bg-white text-black px-6 py-3 font-semibold rounded-lg hover:bg-gray-200 transition">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
