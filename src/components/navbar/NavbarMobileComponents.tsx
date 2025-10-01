"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setOpenNav } from "@/store/navbarSlice";
import { RootState } from "@/store";

interface props {
  mobile: boolean;
  metr: number;
}

const NavbarMobileComponents = ({ metr, mobile }: props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openNav } = useSelector((state: RootState) => state.navbar);

  const navigate = (path: string) => {
    router.push(path);
  };

  const navOPEN = () => {
    dispatch(setOpenNav(!openNav));
  };
  return (
    <div
      style={mobile ? { width: "100%" } : { width: `${metr - 300}px` }}
      className="bg-blue-300 h-full z-50 p-4"
    >
      <button
        onClick={navOPEN}
        className="text-2xl rounded-md m-3 bg-gray-200 p-3"
      >
        <IoClose />
      </button>

      <div className="top">
        <div className="title flex gap-4 items-center my-4 mx-8">
          <Image
            className="rounded-lg"
            width={80}
            height={80}
            quality={100}
            src={"https://c589564.parspack.net/c589564//Starbucks.png"}
            alt=""
          />
          <h2 className="text-2xl">کافه کناری</h2>
        </div>

        <div className="des flex flex-col gap-4 my-4 mx-8">
          <span>اسکن کنید، سفارش دهید و لذت ببرید</span>
          <span>برای تجربه سریعترین سفارش و دسترسی به حساب خود وارد شوید.</span>
        </div>
      </div>

      <div className="bottom">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl">حریم خصوصی</AccordionTrigger>
            <AccordionContent>
              <button
                onClick={() => navigate("/privacyPolicy")}
                className="block w-full text-right"
              >
                برو به صفحه حریم خصوصی
              </button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl">شرایط</AccordionTrigger>
            <AccordionContent>
              <span>اینجا می‌تونی توضیحات شرایط رو بذاری</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl">ثبت شکایت</AccordionTrigger>
            <AccordionContent>
              <span>فرم ثبت شکایت اینجا نمایش داده میشه</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl">درباره ما</AccordionTrigger>
            <AccordionContent>
              <button
                onClick={() => navigate("/about")}
                className="block w-full text-right"
              >
                برو به صفحه درباره ما
              </button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default NavbarMobileComponents;
