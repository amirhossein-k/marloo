// src\app\(protected)\profile\orders\page.tsx
"use client";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const OrdersPage = () => {
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">تست تب‌ها</h1>
      <Tabs>
        <TabList>
          <Tab>جاری</Tab>
          <Tab>تحویل شده</Tab>
        </TabList>

        <TabPanel>
          <Link href={"#"}>
            <ul className="">
              <li className="">
                <div className="title"></div>
              </li>
            </ul>
          </Link>
        </TabPanel>
        <TabPanel>
          <Link href={"#"} className="shadow-custom3 w-full ">
            <ul className="shadow-custom3 w-full p-3 rounded-md hover:bg-blue-200 flex flex-col gap-2">
              <li className="flex flex-col gap-2 ">
                {/* name product */}
                <div className="title flex justify-between items-center ">
                  <div className="flex items-center gap-2 ">
                    <TiTick className="text-lg text-green-500" />

                    <span>تحویل شده</span>
                  </div>
                  <span>
                    <FaArrowLeft />
                  </span>
                </div>
                {/* id product cart */}
                <div className="flex gap-3">
                  <span className="text-gray-500 text-sm">کد سفارش</span>
                  <span className="text-sm">4444</span>
                </div>
                {/* تاریخ-قیمت */}
                <div className="flex justify-between items-center ">
                  <span className="text-gray-500 text-sm">2 شهریور</span>
                  <span>780</span>
                </div>
              </li>
            </ul>
          </Link>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
