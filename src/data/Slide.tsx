// src\data\Slide.ts
import { Slide } from "@/types";
import Image from "next/image";

export const slides: Slide[] = [
  {
    id: "s1",
    title: "Fashion sale for Children's",
    subtitle: "Wear the change. Fashion that feels good.",
    cta: "Shop Now",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757264069596-vfsrf.jpg", // جایگزین کن یا آدرس اینترنتی قرار بده
    align: "left",
    content: (
      <div className="container  mx-auto px-6 flex flex-col md:flex-row items-center justify-center  ">
        <div className="md:w-1/2 text-white md:text-right text-center relative  lg:pr-36 xl:pb-[200px] lg:pb-[110px]">
          <h2 className="xl:text-4xl   lg:text-2xl  md:text-2xl   sm:text-md  text-[17px] font-bold mb-4">
            کالکشن جدید رسید 🎉
          </h2>
          <p className="mb-6 xl:text-2xl   lg:text-xl  md:text-lg hidden  sm:block  sm:text-md  text-[14px]">
            شیک‌ترین محصولات برای استایل شما
          </p>
          <button className="lg:absolute -bottom-10 -left-56 px-2 py-3 text-[12px] md:text-[14px] lg:text-[16px] bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100">
            مشاهده محصولات
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "s2",
    title: "Best deals this week",
    subtitle: "New collection just dropped.",
    cta: "View Products",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
    align: "right",
    content: (
      <div className="container  mx-auto px-6 flex flex-col md:flex-row items-center justify-center  ">
        <div className="md:w-1/2 text-white md:text-right text-center relative  lg:pr-36 xl:pb-[200px] lg:pb-[110px]">
          <h2 className="xl:text-4xl   lg:text-2xl  md:text-2xl   sm:text-md  text-[17px] font-bold mb-4">
            بهترین پیشنهادات روز
          </h2>
          <p className="mb-6 xl:text-2xl   lg:text-xl  md:text-lg hidden  sm:block  sm:text-md  text-[14px]">
            تخفیف ویژه روی جدیدترین محصولات
          </p>
          <button className="lg:absolute xl:-bottom-10 mt-10  lg:-bottom-4 xl:-left-56 lg:-left-44 px-1 py-2 text-[12px] md:text-[14px] lg:text-[16px] bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100">
            همین حالا خرید کنید
          </button>
        </div>
      </div>
    ),
  },
];
export const slides2: Slide[] = [
  {
    id: "s1",
    title: "Fashion sale for Children's",
    subtitle: "Wear the change. Fashion that feels good.",
    cta: "Shop Now",
    img: "", // جایگزین کن یا آدرس اینترنتی قرار بده
    align: "left",
    styleParent: "bg-[#e1e5e9] rounded-md",

    content: (
      <div className="w-full mx-auto  flex flex-col md:flex-row items-center justify-center  h-full py-2 px-2">
        <div className="flex flex-col gal-2  w-full h-full">
          <div className="top   relative  left-0 h-[50px]">
            <Image
              className="absolute left-0"
              alt=""
              src={
                "https://c589564.parspack.net/c589564/uploads/qhab/1757358416871-sdcdsc%20copy.png"
              }
              width={"100"}
              height={"100"}
              quality={100}
            />
            <span className=" text-white font-bold px-4 py-1  left-0.5 absolute top-2.5 ">
              35 %
            </span>
          </div>
          <div className="center h-[95px]  flex flex-col gap-3 justify-center ">
            <span className="text-lg font-bold"> دکوری </span>
            <span className="text-sm"> 22 محصول</span>
          </div>
          <div className="bottom flex gap-2 px-2 h-fit py-2">
            {/** 🔹 نمایش داینامیک عکس‌ها */}
            {(
              [
                "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
                "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
              ] as string[]
            ).map((img, index) => (
              <span
                key={index}
                className="flex-1 h-[80px] rounded-md border block overflow-hidden bg-red-400 relative"
              >
                <Image
                  src={img}
                  alt={`item-${index}`}
                  // width={200}
                  // height={300}
                  quality={100}
                  fill
                  className="w-full h-[80px] object-cover  absolute"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "s2",
    title: "Best deals this week",
    subtitle: "New collection just dropped.",
    cta: "View Products",
    img: "",
    align: "right",
    styleParent: "bg-[#e1e5e9] rounded-md",

    content: (
      <div className="w-full mx-auto  flex flex-col md:flex-row items-center justify-center  h-full py-2 px-2 rounded-md overflow-hidden">
        <div className="flex flex-col gal-2  w-full h-full">
          <div className="top   relative  left-0 h-[50px]">
            <Image
              className="absolute left-0"
              alt=""
              src={
                "https://c589564.parspack.net/c589564/uploads/qhab/1757358416871-sdcdsc%20copy.png"
              }
              width={"100"}
              height={"100"}
              quality={100}
            />
            <span className=" text-white font-bold px-4 py-1  left-0.5 absolute top-2.5 ">
              35 %
            </span>
          </div>
          <div className="center h-[95px]  flex flex-col gap-3 justify-center ">
            <span className="text-lg font-bold"> دکوری </span>
            <span className="text-sm"> 22 محصول </span>
          </div>
          <div className="bottom flex gap-2 px-2 h-fit py-2">
            {/** 🔹 نمایش داینامیک عکس‌ها */}
            {(
              [
                "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
                "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
              ] as string[]
            ).map((img, index) => (
              <span
                key={index}
                className="flex-1 h-[80px] rounded-md border block overflow-hidden bg-red-400 relative"
              >
                <Image
                  src={img}
                  alt={`item-${index}`}
                  // width={200}
                  // height={300}
                  quality={100}
                  fill
                  className="w-full h-[80px] object-cover  absolute"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export const slidetwo: Slide[] = [
  {
    id: "s1",
    title: "Fashion sale for Children's",
    subtitle: "Wear the change. Fashion that feels good.",
    cta: "Shop Now",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757518693999-baner%20copy.webp", // جایگزین کن یا آدرس اینترنتی قرار بده
    align: "left",
    content: (
      <div className="container  mx-auto px-6 flex flex-col md:flex-row items-center justify-center  ">
        <div className="md:w-1/2 text-white md:text-right text-center relative  lg:pr-36 xl:pb-[200px] lg:pb-[110px]">
          <h2 className="xl:text-4xl   lg:text-2xl  md:text-2xl   sm:text-md  text-[17px] font-bold mb-4">
            کالکشن جدید رسید 🎉
          </h2>
          <p className="mb-6 xl:text-2xl   lg:text-xl  md:text-lg hidden  sm:block  sm:text-md  text-[14px]">
            شیک‌ترین محصولات برای استایل شما
          </p>
          <button className="lg:absolute -bottom-10 -left-56 px-2 py-3 text-[12px] md:text-[14px] lg:text-[16px] bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100">
            مشاهده محصولات
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "s2",
    title: "Best deals this week",
    subtitle: "New collection just dropped.",
    cta: "View Products",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/1757252027539-baner_site2.webp",
    align: "right",
    content: (
      <div className="container  mx-auto px-6 flex flex-col md:flex-row items-center justify-center  ">
        <div className="md:w-1/2 text-white md:text-right text-center relative  lg:pr-36 xl:pb-[200px] lg:pb-[110px]">
          <h2 className="xl:text-4xl   lg:text-2xl  md:text-2xl   sm:text-md  text-[17px] font-bold mb-4">
            بهترین پیشنهادات روز
          </h2>
          <p className="mb-6 xl:text-2xl   lg:text-xl  md:text-lg hidden  sm:block  sm:text-md  text-[14px]">
            تخفیف ویژه روی جدیدترین محصولات
          </p>
          <button className="lg:absolute xl:-bottom-10 mt-10  lg:-bottom-4 xl:-left-56 lg:-left-44 px-1 py-2 text-[12px] md:text-[14px] lg:text-[16px] bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100">
            همین حالا خرید کنید
          </button>
        </div>
      </div>
    ),
  },
];
export const slideThree = [
  {
    id: "s1",
    title: "Fashion sale for Children's",
    img: "https://c589564.parspack.net/c589564/uploads/qhab/4b62628ad33e6b39d6f0094e47f11923a618268b_1755584575.gif", // جایگزین کن یا آدرس اینترنتی قرار بده
    align: "left",
  },
];
