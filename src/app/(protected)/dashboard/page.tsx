"use client";

import { cleanExpiredOtps } from "@/app/actions/auth/cleanExpiredOtps";
import LoginComponent from "@/components/login/LoginComponent";
import LogOutComponent from "@/components/login/LogOutComponent";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

const Dashboardpage = () => {
  const DeleteOtpMutation = useMutation({
    mutationFn: cleanExpiredOtps,
    mutationKey: ["otp"],
    onSuccess: () => {
      toast.success(" حذف شد");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="flex  flex-col gap-2" dir="rtl">
      <h1 className="text-center shadow-lg py-2 text-lg font-bold">
        صفحه مدیریت
      </h1>
      <div className="flex flex-row justify-around gap-3">
        <Link
          href={"/"}
          className="border w-full rounded-md py-2 text-center shadow-md hover:bg-sky-300"
        >
          صفحه اصلی
        </Link>
        <Link
          href={"/dashboard/addproduct"}
          className="border w-full rounded-md py-2 text-center shadow-md hover:bg-sky-300"
        >
          اضافه کردن محصول
        </Link>
        <Link
          href={"/dashboard/list"}
          className="border w-full rounded-md py-2 text-center shadow-md hover:bg-sky-300"
        >
          لیست محصولات
        </Link>
        <Link
          href={"/dashboard/searchSiteing"}
          className="border w-full rounded-md py-2 text-center shadow-md hover:bg-sky-300"
        >
          سرچ
        </Link>
      </div>
      <LoginComponent />
      <button
        className="bg-red-400 hover:bg-red-600 px-2 py-3 rounded-md"
        onClick={() => DeleteOtpMutation.mutate()}
        disabled={DeleteOtpMutation.isPending}
      >
        delete otp
      </button>
      <LogOutComponent />
    </div>
  );
};

export default Dashboardpage;
