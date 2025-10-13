"use client";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { SwiperOptions } from "swiper/types";
type Slide = {
  id: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  img: string;
  styleParent?: string;
  align?: "left" | "right"; // محل قرارگیری متن روی تصویر
  content: React.ReactNode; // 👈 محتوای اختصاصی برای هر اسلاید
};

interface propsSlider {
  Slide: Slide[];
  height?: string;
  heightSM?: string;
  heightLg?: string;
  heightMD?: string;
  SwiperBreakpoints?: SwiperOptions["breakpoints"]; // 👈 مستقیم از SwiperOptions
}

const SliderComponent = ({
  Slide,
  SwiperBreakpoints,
  height,
  heightLg,
  heightMD,
  heightSM,
}: propsSlider) => {
  const defaultBreakpoints: SwiperOptions["breakpoints"] = {
    320: { slidesPerView: 1, spaceBetween: 15 },
    640: { slidesPerView: 1, spaceBetween: 15 },
    1024: { slidesPerView: 1, spaceBetween: 15 },
  };

  const openNav = useSelector((state: RootState) => state.navbar.openNav);

  return (
    <div
      className={`  ${
        openNav ? "" : "   lg:w-[calc(100vw-269px)]"
      }  rounded-md overflow-hidden px-2 `}
    >
      <div className=" mx-auto  h-full  rounded-md ">
        <div className="flex flex-wrap -mx-2 ">
          {/* بخش اسلایدر */}
          <div
            className={`w-full ${height ? height : "h-[250px]"} ${
              heightSM ? heightSM : "sm:h-[300px]"
            } ${heightMD ? heightMD : "md:h-[350px]"}  ${
              heightLg ? heightLg : "lg:h-[600px]"
            }     px-2 rounded-md overflow-hidden `}
          >
            <Swiper
              dir="rtl"
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              breakpoints={SwiperBreakpoints || defaultBreakpoints}
              className="swiper-container w-full   overflow-visible pb-12"

              //   className="swiper-container overflow-visible pb-8 lg:pb-12"
            >
              {Slide.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative w-full h-full">
                    <div
                      className={`absolute inset-0 bg-cover bg-center   w-full h-full ${
                        item.styleParent || ""
                      }`}
                      style={{
                        backgroundImage: item.img ? `url(${item.img})` : "none",
                      }}
                    />

                    <div className="relative z-10 h-full flex items-center w-full  ">
                      {item.content}
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

export default SliderComponent;
