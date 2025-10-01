// src/components/navbar/NavbarComponents.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setOpenNav } from "@/store/navbarSlice";
import { TiThMenu } from "react-icons/ti";
import { FaAngleLeft } from "react-icons/fa";
import NavbarMobileComponents from "./NavbarMobileComponents";
import NavbarDesktopComponents from "./NavbarDesktopComponents";
import { useEffect, useState } from "react";
import useWindowSize from "@/hooks/size";
import Link from "next/link";

export default function NavbarComponents() {
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [metr] = useState(768);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openNav = useSelector((state: RootState) => state.navbar.openNav);
  useEffect(() => {
    if (width) {
      setMobile(width <= metr);
    }
  }, [width, metr]);
  const toggleNav = () => {
    dispatch(setOpenNav(!openNav));
  };

  return (
    <nav
      className={`nav flex justify-between items-center py-4 px-3 bg-gray-100 ${
        openNav ? "" : "   md:w-[calc(100vw-269px)]"
      } `}
    >
      <div
        className={`${width && width > metr ? "bg-red-400" : "bg-blue-400"}`}
      >
        <button
          onClick={toggleNav}
          className={`text-2xl lg:text-4xl md:text-3xl ${
            width && width > metr ? "hidden" : "block"
          }`}
        >
          <TiThMenu />
        </button>
      </div>

      {/* <div className="text-2xl lg:text-4xl md:text-3xl">
        <FaAngleLeft />
      </div> */}

      {/* مثال ساده: منو وقتی باز است */}
      {openNav && (
        <div className="w-full absolute top-0 right-0 h-full z-50" dir="rtl">
          <NavbarMobileComponents metr={metr} mobile={mobile} />
        </div>
      )}
      {width && width < metr ? (
        <div
          className="flex items-center gap-4 justify-around  w-full p-4 h-[50px] bg-gray-100 shadow"
          dir="rtl"
        >
          <Link
            href="/"
            className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
          >
            خانه
          </Link>
          <Link
            href="/about"
            className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
          >
            درباره ما
          </Link>
          <Link
            href="/products/list"
            className=" font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
          >
            محصولات
          </Link>
        </div>
      ) : (
        <div className="  flex w-full" dir="rtl">
          <div className="flex items-center gap-4 justify-around bg-gray-100 shadow w-full">
            <Link
              href="/"
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              خانه
            </Link>
            <Link
              href="/about"
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              درباره ما
            </Link>
            <Link
              href="/products/list"
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              محصولات
            </Link>
          </div>
          <NavbarDesktopComponents />
        </div>
      )}
    </nav>
  );
}
