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
import Sidebar from "@/components/Sidebar/Sidebar";

interface props {
  mobile: boolean;
  metr: number;
}

const NavbarMobileTwoComponents = ({ metr, mobile }: props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openNav } = useSelector((state: RootState) => state.navbar);

  const navigate = (path: string) => {
    router.push(path);
    dispatch(setOpenNav(false)); // بستن منو پس از کلیک
  };

  const navOPEN = () => {
    dispatch(setOpenNav(!openNav));
  };
  return (
    <div className="w-full h-full bg-[#f5f5f5a4] flex flex-col" dir="rtl">
      {/* هدر منوی موبایل */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">منو</h2>
        <button
          onClick={navOPEN}
          className="text-2xl text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoClose />
        </button>
      </div>

      {/* محتوای منو */}
      <div className="flex-1 overflow-y-auto">
        <Sidebar mobile={true} />
      </div>
    </div>
  );
};

export default NavbarMobileTwoComponents;
