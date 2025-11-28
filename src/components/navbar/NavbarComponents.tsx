// src/components/navbar/NavbarComponents.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setLoadingNav, setOpenNav } from "@/store/navbarSlice";
import { TiThMenu } from "react-icons/ti";
import { FaAngleLeft } from "react-icons/fa";
import NavbarMobileComponents from "./NavbarMobileComponents";
import NavbarDesktopComponents from "./NavbarDesktopComponents";
import { startTransition, useEffect, useState } from "react";
import useWindowSize from "@/hooks/size";
import Link from "next/link";
import NavbarMobileTwoComponents from "./NavbarMobileTwoComponents";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function NavbarComponents() {
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [metr] = useState(768);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setIsLoading } = useLoading();

  const router = useRouter();
  const openNav = useSelector((state: RootState) => state.navbar.openNav);
  useEffect(() => {
    if (width) {
      setMobile(width <= metr);
    }
  }, [width, metr]);
  const toggleNav = () => {
    dispatch(setOpenNav(!openNav));
  };

  const handlePush = (url: string) => {
    setIsLoading(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <nav
      className={`nav flex justify-between items-center py-4 px-3 bg-gray-100 ${
        openNav ? "" : "   lg:w-[calc(100vw-269px)]"
      } `}
    >
      <div className={`${width && width > metr ? "bg-red-400" : "p-2"}`}>
        <button
          onClick={toggleNav}
          className={`text-3xl lg:text-4xl md:text-3xl ${
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
      {openNav && mobile && (
        <div className="fixed inset-0 z-50 " dir="rtl">
          {/* <NavbarMobileComponents metr={metr} mobile={mobile} /> */}
          <NavbarMobileTwoComponents metr={metr} mobile={mobile} />
        </div>
      )}
      {width && width < metr ? (
        <div className="  flex w-full" dir="rtl">
          <div
            className="flex items-center gap-4 justify-around  w-full p-4 h-[50px] bg-gray-100 shadow"
            dir="rtl"
          >
            <Link
              href="/"
              onClick={() => handlePush("/")}
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              خانه
            </Link>
            <Link
              href="/contact"
              onClick={() => handlePush("/contact")}
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              درباره ما
            </Link>
            <Link
              onClick={() => handlePush("/products")}
              href="/products"
              className=" font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              محصولات
            </Link>
          </div>
          <NavbarDesktopComponents />
        </div>
      ) : (
        <div className="  flex w-full" dir="rtl">
          <div className="flex items-center gap-4 justify-around bg-gray-100 shadow w-full">
            <Link
              href="/"
              onClick={() => handlePush("/")}
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              خانه
            </Link>
            <Link
              href="/contact"
              onClick={() => handlePush("/contact")}
              className="font-bold text-lg rounded-md hover:bg-[#b4a1db] h-[50px] justify-center flex items-center flex-1 "
            >
              درباره ما
            </Link>
            <Link
              onClick={() => handlePush("/products")}
              href="/products"
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
