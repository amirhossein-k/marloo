"use client";
import { useLoading } from "@/context/LoadingContext";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const SpinnerLayout = () => {
  const { isLoadingProduct } = useLoading();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div
      dir="rtl"
      className={`${
        isLoadingProduct ? "flex" : "hidden"
      } fixed top-4 right-4 z-50 items-center px-6 py-4 
      rounded-2xl shadow-lg backdrop-blur-md 
      bg-white/80 border border-gray-200 animate-fadeIn`}
    >
      {/* آیکون چرخشی */}
      <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />

      {/* متن */}
      <div className="flex flex-col text-sm text-gray-700">
        {user ? (
          <>
            <span className="font-semibold text-gray-900">
              {user?.name} جان ✨
            </span>
            <span className="text-gray-600">لطفا کمی صبر کن...</span>
          </>
        ) : (
          <span className="text-gray-800 font-medium">
            لطفا کمی صبر کنید...
          </span>
        )}
      </div>
    </div>
  );
};

export default SpinnerLayout;
