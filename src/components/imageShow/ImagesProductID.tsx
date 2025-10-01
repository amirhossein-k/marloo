"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import styles from "@/features/styles/ImagesProduct.module.css";
import { PHOTO } from "@/types";
import useWindowSize from "@/hooks/size";

const ImagesProduct = ({ images }: { images: PHOTO[] }) => {
  // انتخاب تصویر پیش‌فرض با استفاده از find، در صورت عدم وجود مقدار مناسب، از اولین تصویر استفاده می‌شود
  const defaultImgObj = images.find((item) => item.defaultImage) || images[0];
  const [defaultImage, setDefaultImage] = useState<string>(
    defaultImgObj.childImage
  );
  const [childImage, setChildImage] = useState<PHOTO[]>(images);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const ITEM_WIDTH = 130;

  // هندلر تغییر تصویر: تصویر کلیک‌شده مستقیماً به عنوان آرگومان دریافت می‌شود
  const handleChangeImage = (image: string) => {
    setChildImage((prev) =>
      prev.map((item) =>
        item.childImage === image ? { ...item, imageUrl: defaultImage } : item
      )
    );
    setDefaultImage(image);
  };

  // اسکرول به سمت چپ یا بالا
  const scrollPrev = () => {
    if (containerRef.current) {
      if (width && width > 768) {
        containerRef.current.scrollTop -= ITEM_WIDTH;
      } else {
        containerRef.current.scrollLeft -= ITEM_WIDTH;
      }
    }
  };

  // اسکرول به سمت راست یا پایین
  const scrollNext = () => {
    if (containerRef.current) {
      if (width && width > 768) {
        containerRef.current.scrollTop += ITEM_WIDTH;
      } else {
        containerRef.current.scrollLeft += ITEM_WIDTH;
      }
    }
  };

  return (
    <div className="flex md:flex-row-reverse flex-col w-full bg-slate-100">
      <div className="relative right_side rounded-xl overflow-hidden bg-slate-100 md:w-[70%] h-[324px] w-full">
        <Image
          quality={100}
          className="object-contain rounded-xl overflow-hidden"
          fill
          src={defaultImage}
          alt=""
        />
      </div>
      <div
        className={`left_side relative md:w-[30%] w-full h-[150px] md:h-[324px] scroll-smooth flex md:flex-col flex-row md:overflow-y-scroll overflow-x-scroll ${styles.a}`}
        ref={containerRef}
      >
        <span
          className="text-3xl font-bold cursor-pointer text-black shadow-card2 sticky w-fit flex justify-center items-center h-fit md:top-6 top-16 z-50 left-10 lg:left-[50%] md:left-[50%]"
          onClick={scrollPrev}
        >
          {width && width < 768 ? (
            <i className="bi bi-caret-left-fill relative  arrow-my"></i>
          ) : (
            <i className="bi bi-caret-up-fill relative -top-2 -left-[4rem] arrow-my"></i>
          )}
        </span>

        {childImage.map((child) => (
          <div
            className="min-h-[120px] md:w-full w-[150px] min-w-[100px] bg-slate-100 rounded flex gap-3 relative p-2 text-white hover:text-purple-300 overflow-hidden cursor-pointer"
            key={child.id}
            onClick={() => handleChangeImage(child.childImage)}
          >
            <div className="child_image relative rounded-xl md:w-full w-full h-full min-h-full bg-red-300">
              <Image
                quality={100}
                className="bg-cover border cursor-pointer overflow-hidden rounded-xl"
                fill
                src={child.childImage}
                alt=""
              />
            </div>
          </div>
        ))}
        <span
          className="flex text-3xl font-bold text-black cursor-pointer justify-center items-center w-fit h-fit sticky md:bottom-0 bottom-12 top-14 z-50 md:left-10 lg:left-[47%] right-8"
          onClick={scrollNext}
        >
          {width && width < 768 ? (
            <i className="bi bi-caret-right-fill arrow-my "></i>
          ) : (
            <i className="bi bi-caret-down-fill arrow-my -left-[2rem] relative"></i>
          )}
        </span>
      </div>
    </div>
  );
};

export default ImagesProduct;
