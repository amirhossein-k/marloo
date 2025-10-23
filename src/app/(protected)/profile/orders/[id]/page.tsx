// src\app\(protected)\profile\orders\[id]
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DeliveredPage = () => {
  const router = useRouter();
  const { selectedOrder } = useSelector((state: RootState) => state.orderShop);

  if (!selectedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <p>اطلاعات سفارش یافت نشد 😔</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => router.push("/profile/orders")}
        >
          بازگشت به سفارش‌ها
        </button>
      </div>
    );
  }

  const { id, product, quantity, totalPrice } = selectedOrder;

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-xl font-bold mb-4 text-gray-800">جزئیات سفارش</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* تصویر */}
        <div className="relative w-32 h-32">
          <Image
            src={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              product.productImage?.find((img: any) => img.defaultImage)
                ?.childImage ?? "/no-image.png"
            }
            alt={product.title}
            fill
            className="object-cover rounded-md"
          />
        </div>

        {/* اطلاعات */}
        <div className="flex flex-col justify-between">
          <p className="text-lg font-semibold">{product.title}</p>
          <p className="text-gray-600">تعداد: {quantity}</p>
          <p className="text-gray-800 font-bold">
            مبلغ کل: {totalPrice.toLocaleString()} تومان
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveredPage;
