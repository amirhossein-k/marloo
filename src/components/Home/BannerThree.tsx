"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SwiperOptions } from "swiper/types";

interface propsSlider {
  Slide: { id: string; img: string; title?: string }[];
  mobileHeight?: string; // مثال: "h-[200px]"
  tabletHeight?: string; // یعنی sm:…
  desktopHeight?: string; // md:…
  objectFitMobile?: "cover" | "contain";
  objectFitDesktop?: "cover" | "contain";
}

const BannerThree: React.FC<propsSlider> = ({
  Slide,
  mobileHeight = "h-[200px]",
  tabletHeight = "sm:h-[300px]",
  desktopHeight = "lg:h-[500px]",
  objectFitMobile = "cover",
  objectFitDesktop = "cover",
}) => {
  const openNav = useSelector((state: RootState) => state.navbar.openNav);

  const breakpoints: SwiperOptions["breakpoints"] = {
    320: { slidesPerView: 1, spaceBetween: 5 },
    640: { slidesPerView: 1, spaceBetween: 5 },
    1024: { slidesPerView: 1, spaceBetween: 10 },
  };

  // ترکیب کلاس ارتفاع پاسخگرا
  const heightClass = `${mobileHeight} ${tabletHeight} ${desktopHeight}`;

  // کلاس object-fit برای تصاویر
  const mobileObj = objectFitMobile === "cover" ? "object-cover" : "";
  const desktopObj =
    objectFitDesktop === "cover" ? "md:object-cover" : "md:object-contain";
  const imgClass = `${mobileObj} ${desktopObj} w-full h-full `;

  return (
    <div
      className={`${
        openNav ? "" : "lg:w-[calc(100vw-269px)]"
      } overflow-hidden  rounded-md px-2 `}
    >
      <div className=" mx-auto">
        <div
          className={`wrelative w-full ${heightClass} overflow-hidden rounded-md`}
        >
          <Swiper
            dir="rtl"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            modules={[Autoplay, Navigation]}
            breakpoints={breakpoints}
            className="w-full h-full"
          >
            {Slide.map((item) => (
              <SwiperSlide key={item.id} className="p-0">
                <div className="relative w-full h-[350px]">
                  <Image
                    src={item.img}
                    alt={item.title || "اسلاید"}
                    fill
                    className={`object-fill`}
                    sizes="100vw"
                    quality={100}
                    priority={item.id === Slide[0].id}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BannerThree;
