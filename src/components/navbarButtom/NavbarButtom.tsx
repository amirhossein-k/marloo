"use client";

import { useLoading } from "@/context/LoadingContext";
import { RootState } from "@/store";
import { pathGenerateToName } from "@/utils/pathGenerateToName";
import { Home, ShoppingCart, Activity, Clock, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartOpen } from "@/store/orderSlice";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryDrawer } from "./CategoryDrawer";

const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 122.88 122.54"
    width={22}
    height={22}
  >
    <title>search-categories</title>
    <path
      d="M4.69,0H46.22a4.71,4.71,0,0,1,4.69,4.69V46a4.69,4.69,0,0,1-4.69,4.69H4.69a4.65,4.65,0,0,1-3.31-1.38l-.09-.09A4.67,4.67,0,0,1,0,46V4.69A4.71,4.71,0,0,1,4.69,0ZM89.44,61.94a26.56,26.56,0,0,1,10.18,2l.07,0a26.61,26.61,0,0,1,15.25,32.16,26.18,26.18,0,0,1-2.7,6.11l10.3,11.24a1.27,1.27,0,0,1-.07,1.8l-7.57,6.9a1.27,1.27,0,0,1-1.79-.07l-9.86-10.85a26.36,26.36,0,0,1-6.1,2.74,26.87,26.87,0,0,1-7.71,1.13,26.51,26.51,0,0,1-10.17-2l-.07,0A26.64,26.64,0,0,1,64.85,78.37l0-.07A26.6,26.6,0,0,1,89.44,61.94Zm15,11.59a21.38,21.38,0,0,0-6.89-4.61l-.06,0a21.22,21.22,0,0,0-23.07,4.64l-.07.07a21.25,21.25,0,0,0-4.54,6.83l0,.06a21.32,21.32,0,0,0-1.58,8.06,21.26,21.26,0,0,0,29.35,19.62,21.54,21.54,0,0,0,6.89-4.61l.07-.07a21.09,21.09,0,0,0,4.54-6.83l0-.06a21.35,21.35,0,0,0,0-16.17,21.34,21.34,0,0,0-4.62-6.9ZM4.69,63.2H46.22a4.71,4.71,0,0,1,4.69,4.7v41.34a4.68,4.68,0,0,1-4.69,4.69H4.69A4.69,4.69,0,0,1,0,109.24V67.9a4.71,4.71,0,0,1,4.69-4.7ZM68.78,0h41.53A4.71,4.71,0,0,1,115,4.69V46a4.71,4.71,0,0,1-4.69,4.69H68.78A4.71,4.71,0,0,1,64.09,46V4.69a4.69,4.69,0,0,1,1.37-3.31l.1-.09A4.67,4.67,0,0,1,68.78,0Z"
      fill="currentColor" // این باعث می‌شود رنگ آیکون مطابق با رنگ متن باشد
    />
  </svg>
);

export default function NavbarButtom() {
  const [active, setActive] = useState("current");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // const {OpenCart} = useSelector((state:RootState)=>state.orderShop)
  const dispath = useDispatch();
  const [showCategories, setShowCategories] = useState(false); // state جدید

  const { pathnamee, isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (pathnamee !== "/") {
      setActive("current");
    } else if (pathnamee === "/") {
      setActive("home");
    }
  }, [pathnamee]);

  const handleClick = async () => {
    dispath(setCartOpen(true));
  };

  //   const handleClickDefulat = async()=>{}
  const items = [
    { id: "home", label: "خانه", icon: <Home size={22} />, path: "/" },
    {
      id: "cart",
      label: "سبد خرید",
      icon: <ShoppingCart size={22} />,
      handleClick: handleClick,
    },
    {
      id: "current",
      label: pathGenerateToName(pathnamee),
      icon: <Activity size={22} />,
      path: pathnamee,
    },
    {
      id: "category",
      label: "دسته بندی",
      icon: <CategoryIcon />, // استفاده از کامپوننت SVG
    },
    {
      id: "profile",
      label: "پروفایل",
      icon: <User size={22} />,
      path: "/profile",
    },
  ];
  const handlePush = async (url: string) => {
    setIsLoading(true);
    startTransition(() => {
      router.push(`${url}`);
    });
  };

  // وقتی مسیر تغییر کرد و لودینگ تموم شد، isLoading رو غیرفعال می‌کنیم
  useEffect(() => {
    if (!isPending && pathnamee) {
      setIsLoading(false); // وقتی انتقال تموم شد و مسیر آپدیت شد، لودینگ رو خاموش کن
    }
  }, [isPending, pathnamee, setIsLoading]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 md:-translate-x-40 flex justify-center pb-3 z-50">
        <div className="bg-black text-gray-400 rounded-3xl px-6 py-2 flex gap-6 items-center shadow-lg">
          {items.map((item) => (
            <button
              // href={item.path ?? ""}
              key={item.id}
              onClick={async () => {
                setActive(item.id);
                if (item.id === "category") {
                  setShowCategories(true);
                } else {
                  handlePush(item.path ?? "");
                }
                if (item.handleClick) item.handleClick();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${
                active === item.id
                  ? "bg-purple-600 text-white"
                  : "hover:text-white"
              }`}
            >
              {item.icon}
              {active === item.id && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* منوی دسته بندی - موبایل (Drawer) */}
      {/* Drawer دسته‌بندی‌ها با Framer Motion */}
      <CategoryDrawer
        open={showCategories}
        onClose={() => setShowCategories(false)}
      />
    </>
  );
}
