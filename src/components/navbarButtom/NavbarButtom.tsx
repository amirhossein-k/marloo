"use client";

import { useLoading } from "@/context/LoadingContext";
import { RootState } from "@/store";
import { pathGenerateToName } from "@/utils/pathGenerateToName";
import { Home, ShoppingCart, Activity, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartOpen } from "@/store/orderSlice";

export default function NavbarButtom() {
  const [active, setActive] = useState("current");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // const {OpenCart} = useSelector((state:RootState)=>state.orderShop)
  const dispath = useDispatch();

  const { pathnamee, isLoading, setIsLoading } = useLoading();
  console.log(pathnamee, "path");
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
    { id: "history", label: "History", icon: <Clock size={22} /> },
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
    <div className="fixed bottom-0 left-0 right-0 md:-translate-x-32 flex justify-center pb-3 z-50">
      <div className="bg-black text-gray-400 rounded-3xl px-6 py-2 flex gap-6 items-center shadow-lg">
        {items.map((item) => (
          <button
            // href={item.path ?? ""}
            key={item.id}
            onClick={async () => {
              setActive(item.id);
              handlePush(item.path ?? "");
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
  );
}
