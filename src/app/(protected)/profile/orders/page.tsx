// src\app\(protected)\profile\orders\page.tsx
"use client";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React, { startTransition, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";
import { useRouter } from "next/navigation";
import { setAccessCart } from "@/store/orderSlice";
import { FetchOrders } from "@/app/actions/order/order";
import { useQuery } from "@tanstack/react-query";
import SkeletonCard from "@/components/product/SkeletonCard";
import { setSelectedOrder } from "@/store/orderSlice";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState(0); // 👈 تب جاری (۰ = جاری، ۱ = تحویل‌شده)
  const [isTabLoading, setIsTabLoading] = useState(false); // 👈 وضعیت لودینگ مخصوص تب

  // ✅ اتصال به state جدید Redux
  const { items, totalPrice, OpenCart } = useSelector(
    (state: RootState) => state.orderShop
  );
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const dispatch = useDispatch();
  const handlePush = (url: string) => {
    // 1️⃣ دسترسی را فعال می‌کنیم
    dispatch(setAccessCart(true));
    setIsLoading(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(url);
    });
  };
  console.log(items, "items ordes");

  // برای فچ کردن داده‌های سبد خرید از سرور با استفاده از
  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => FetchOrders(),
    refetchInterval: 5 * 60 * 1000, // هر ۵ دقیقه یکبار sync
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // 👇 کنترل تب
  const handleTabSelect = (index: number) => {
    setActiveTab(index);
    setIsTabLoading(true); // شروع لودینگ برای تب
    // شبیه‌سازی لودینگ شبکه (در پروژه واقعی، ممکنه دیتا جدا فچ بشه)
    setTimeout(() => {
      setIsTabLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6" dir="rtl">
      <Tabs selectedIndex={activeTab} onSelect={handleTabSelect}>
        <TabList>
          <Tab>جاری</Tab>
          <Tab>تحویل شده</Tab>
        </TabList>
        {/* 🟢 تب جاری */}
        <TabPanel>
          {isLoading || (activeTab === 0 && isTabLoading) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <Link
              href={"/profile/cart"}
              onClick={() => handlePush("/profile/cart")}
              className="flex items-center flex-col gap-2 group"
            >
              <ul className="flex flex-col gap-2 shadow-custom3 w-full hover:bg-blue-200">
                {data?.data?.items.map((order) => (
                  <li
                    className=" p-3 rounded-md hover:bg-blue-200 flex flex-col gap-2 border-b-2 border-[#af08af]"
                    key={order.id}
                  >
                    {/* name product */}
                    <div className="flex flex-row justify-between">
                      <div className="title flex justify-between items-center ">
                        <div className="flex items-center gap-2 ">
                          {order.product.title}
                          <span> تعداد: {order.quantity}</span>
                        </div>
                      </div>
                      {/* image */}
                      <div className="w-12 h-12 relative">
                        <Image
                          src={
                            order.product.productImage.find(
                              (item) => item.defaultImage === true
                            )?.childImage ?? ""
                          }
                          alt=""
                          fill
                          quality={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    </div>
                    {/* تاریخ-قیمت */}
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <span className="text-lg font-bold text-gray-800">
                        {/* {order.product.priceOffer?.toLocaleString()
                        ? (
                            ((order.product.priceWithProfit ?? 0 / 100) * 90) /
                            100
                          ).toLocaleString()
                        : order.product.priceWithProfit?.toLocaleString()} */}
                        {order.totalPrice}
                        تومان
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {(
                          order.product.priceWithProfit ?? 0 * order.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="bg-blue-400 rounded-md px-3 py-2 text-md group-hover:bg-blue-500 group-hover:text-white">
                مشاهده و پرداخت
              </button>
            </Link>
          )}
        </TabPanel>
        {/* 🟢 تب تحویل‌شده */}

        <TabPanel>
          {activeTab === 1 && isTabLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <Link
              href={"#"}
              className="shadow-custom3 w-full "
              //          onClick={() => {
              //   dispatch(setSelectedOrder(order)); // 👈 سفارش انتخاب‌شده را ذخیره کن
              //   router.push(`/profile/orders/${order.id}`); // 👈 برو به صفحه جزئیات
              // }}
            >
              <ul className="shadow-custom3 w-full p-3 rounded-md hover:bg-blue-200 flex flex-col gap-2">
                <li className="flex flex-col gap-2 ">
                  <div className="title flex justify-between items-center ">
                    <div className="flex items-center gap-2 ">
                      <TiTick className="text-lg text-green-500" />
                      <span>تحویل شده</span>
                    </div>
                    <span>
                      <FaArrowLeft />
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gray-500 text-sm">کد سفارش</span>
                    <span className="text-sm">4444</span>
                  </div>
                  <div className="flex justify-between items-center ">
                    <span className="text-gray-500 text-sm">2 شهریور</span>
                    <span>780</span>
                  </div>
                </li>
              </ul>
            </Link>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
