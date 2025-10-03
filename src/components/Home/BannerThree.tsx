"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { SwiperOptions } from "swiper/types";
import React from "react";

interface propsSlider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Slide: any[];
  mobileHeight?: string; // e.g. "h-[300px]"
  tabletHeight?: string; // e.g. "h-[350px]" (will be applied with `sm:`)
  desktopHeight?: string; // e.g. "h-[550px]" (will be applied with `lg:`)
  objectFitMobile?: "cover" | "contain"; // applied on base (mobile)
  objectFitDesktop?: "cover" | "contain"; // applied at md/desktop
}

const BannerThree: React.FC<propsSlider> = ({
  Slide,
  mobileHeight = "h-[300px]",
  tabletHeight = "h-[350px]",
  desktopHeight = "h-[550px]",
  objectFitMobile = "contain",
  objectFitDesktop = "cover",
}) => {
  const defaultBreakpoints: SwiperOptions["breakpoints"] = {
    320: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 1, spaceBetween: 10 },
    1024: { slidesPerView: 1, spaceBetween: 15 },
  };

  const openNav = useSelector((state: RootState) => state.navbar.openNav);

  // Build responsive height classes: base / sm: / lg:
  const baseHeightClass = mobileHeight || "h-[300px]";
  const smHeightClass = tabletHeight ? `sm:${tabletHeight}` : "";
  const lgHeightClass = desktopHeight ? `lg:${desktopHeight}` : "";
  const heightClasses =
    `${baseHeightClass} ${smHeightClass} ${lgHeightClass}`.trim();

  // Object-fit classes (explicit so Tailwind picks them up)
  const mobileObjectClass =
    objectFitMobile === "cover" ? "object-cover" : "object-contain";
  const desktopObjectClass =
    objectFitDesktop === "cover" ? "md:object-cover" : "md:object-contain";
  const imageObjectClass = `${mobileObjectClass} ${desktopObjectClass} w-full h-full`;

  return (
    <div
      className={`${
        openNav ? "" : "md:w-[calc(100vw-269px)]"
      } rounded-md overflow-hidden px-2`}
    >
      <div className="container mx-auto h-full rounded-md">
        <div className="flex flex-wrap -mx-2">
          <div
            className={`w-full px-2 rounded-md overflow-hidden ${heightClasses}`}
          >
            <Swiper
              dir="rtl"
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation
              modules={[Autoplay, Pagination, Navigation]}
              breakpoints={defaultBreakpoints}
              className="swiper-container w-full h-full"
            >
              {Slide.map((item, idx) => (
                <SwiperSlide key={item?.id ?? idx}>
                  {/* parent must have position:relative and a definite height for `Image fill` to work */}
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.img}
                        alt={item.title || "اسلاید"}
                        fill
                        className={imageObjectClass}
                        sizes="100vw"
                        priority={idx === 0}
                        // fallback on error
                        onError={(e) => {
                          // Next/Image doesn't expose src setter directly; if you need a fallback
                          // consider using the `next/image` loader or wrapper <img> as a last resort.
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerThree;
