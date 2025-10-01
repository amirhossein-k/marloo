"use client";
import { useLoading } from "@/context/LoadingContext";
import { Loader2 } from "lucide-react";
// import { useLoading } from "@/context/LoadingContext";
// import { UserContext } from "@/context/UserContext2";

import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";

const Spinners = () => {
  // const { user, refreshUser } = useContext(UserContext);

  const { data: session } = useSession();
  const user = session?.user;
  const { setIsLoadingProduct, isLoadingProduct } = useLoading();
  // دریافت خودکار اطلاعات کاربر هنگام ورود به صفحه
  // useEffect(() => {
  //   refreshUser();
  // }, [refreshUser]);
  // const {isLoadingNavId} = useLoading()
  console.log(user, "ii");
  return (
    <div
      className={`loading ${
        isLoadingProduct ? "flex" : "hidden"
      }   gap-4 text-center rounded-lg z-50 absolute w-[300px] h-[50px] flex justify-center items-center  top-2 right-2   bg-gray-400`}
    >
      {/* <ToastProvider placement={placement} toastOffset={placement.includes("top") ? 60 : 0} /> */}

      {user ? (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="text-gray-700 font-medium mt-2">ff</span>

          <span className="font-bold">{user?.name}</span>
          <span>جان لطفا کمی صبر کن </span>
        </>
      ) : (
        <span>لطفا کمی صبر کنید</span>
      )}
    </div>
  );
};

export default Spinners;
