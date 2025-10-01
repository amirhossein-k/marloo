import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Product } from "@/types";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
import NftCard from "./CardGrid";
const NewProduct = ({ newproduct }: { newproduct: Product[] }) => {
  const openNav = useSelector((state: RootState) => state.navbar.openNav);
  const defaultBreakpoints: SwiperOptions["breakpoints"] = {
    320: { slidesPerView: 2, spaceBetween: 15 },
    940: { slidesPerView: 3, spaceBetween: 15 },
    1124: { slidesPerView: 4, spaceBetween: 15 },
    1424: { slidesPerView: 5, spaceBetween: 15 },
  };
  return (
    <div
      className={`  ${
        openNav ? "" : "   md:w-[calc(100vw-269px)]"
      }  rounded-md overflow-hidden px-2  `}
    >
      <div className="container mx-auto  h-full  rounded-md ">
        <div className="flex flex-wrap -mx-2 ">
          {/* بخش اسلایدر */}
          <div className={`w-full     px-2 rounded-md overflow-hidden `}>
            <Swiper
              dir="rtl"
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              breakpoints={defaultBreakpoints}
              className="swiper-container w-full   overflow-visible pb-12 "

              //   className="swiper-container overflow-visible pb-8 lg:pb-12"
            >
              {newproduct.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative w-full h-full shadow-custom3  rounded-md">
                    <div className={`absolute inset-0 bg-cover bg-center `} />

                    <div className="relative z-10 flex items-center w-full h-[400px]  flex-col py-1">
                      <div className="absolute -top-1 right-0 z-50 h-[70px] w-[55px]">
                        <Image
                          alt=""
                          fill
                          className="absolute object-fill rounded-md p-1  overflow-hidden  "
                          quality={100}
                          src={
                            "https://c589564.parspack.net/c589564/uploads/qhab/1757442027457-Layer%205.png"
                          }
                        />
                      </div>
                      <div className="top relative h-[270px] w-[80%]  rounded-md overflow-hidden ">
                        <Image
                          alt=""
                          fill
                          className="absolute object-fill rounded-md p-1 w-full  overflow-hidden bg-gray-200 "
                          quality={100}
                          src={
                            item.productImage.filter(
                              (item) => item.defaultImage === true
                            )[0].childImage
                          }
                        />
                      </div>
                      <div
                        className="body flex flex-col gap-3 w-full px-2"
                        dir="rtl"
                      >
                        <span>{item.title}</span>
                        {item.priceOffer && item.priceOffer > 0 ? (
                          <div className="flex gap-2">
                            {/* قیمت اصلی با خط خوردگی */}
                            <del className="text-gray-400 text-[13px]">
                              {item.priceWithProfit?.toLocaleString()} تومان
                            </del>
                            {/* قیمت با تخفیف */}
                            <span className="text-green-600 font-bold text-[15px]">
                              {item.priceOffer?.toLocaleString()} تومان
                            </span>
                            {/* برچسب درصد تخفیف */}
                            <span className="relative inline-flex items-center justify-center text-white text-[10px] h-[45px] w-[45px] ">
                              <span className="relative z-20 font-bold -top-2.5 text-[12px]">
                                {item.priceOffer}%
                              </span>

                              <div className="absolute -top-3 right-0 h-[50px] w-[50px]">
                                <Image
                                  alt=""
                                  fill
                                  className="absolute object-fill rounded-md p-1 z-10 overflow-hidden  "
                                  quality={100}
                                  src={
                                    "https://c589564.parspack.net/c589564/uploads/qhab/1757443211101-photo_2025-09-09_22-07-03%20copy.webp"
                                  }
                                />
                              </div>
                            </span>
                          </div>
                        ) : (
                          // اگر تخفیف نبود، فقط قیمت اصلی
                          <span className="text-gray-500 font-bold">
                            {item.priceWithProfit?.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                      <div className="buttom  w-full px-2">رنگ</div>
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

export default NewProduct;
