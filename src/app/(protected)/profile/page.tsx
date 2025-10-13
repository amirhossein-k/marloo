// src\app\(protected)\profile\page.tsx
"use client";

import LogOutComponent from "@/components/login/LogOutComponent";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { IoArrowBackOutline } from "react-icons/io5";
import { useWindowSizeProfile } from "@/hooks/sizeProfile";
import NavLocation from "@/components/profile/navLocation/navLocation";

const Profilepage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setIsLoading } = useLoading();

  // 2️⃣ اگر کاربر لاگین نکرده → ریدایرکت به لاگین
  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);
  // 1️⃣ حالت لودینگ
  if (status === "loading") {
    return <div className="p-4">در حال بارگذاری...</div>;
  }

  if (!session?.user) return null;

  const user = session.user;
  if (!user) return null;

  const handlePush = (url: string) => {
    setIsLoading(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(url);
    });
  };
  return (
    <div className="p-6 flex flex-col gap-3" dir="rtl">
      <Link
        className="flex justify-between  items-center hover:text-blue-500"
        href={"/profile/personal-info"}
        onClick={() => handlePush("/profile/personal-info")}
      >
        اطلاعات کاربر
        <IoArrowBackOutline />
      </Link>
      <Link
        className="flex justify-between  items-center hover:text-blue-500"
        href={"/profile/orders"}
        onClick={() => handlePush("/profile/orders")}
      >
        تاریخچه سفارشات
        <IoArrowBackOutline />
      </Link>

      <div className="flex  gap-3">
        <Link
          href={`/profile/${user.id}/address`}
          className="text-lg text-red-500"
        >
          ادرس
        </Link>
        {user.admin && (
          <Link href={`/dashboard`} className="text-lg text-red-500">
            {" "}
            داشبورد مدیریت
          </Link>
        )}
      </div>
      <LogOutComponent />
    </div>
  );
};

export default Profilepage;
