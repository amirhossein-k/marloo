// components/Tabs.tsx
"use client";
import React, { useState } from "react";
import Tables from "./Tables/Tables";
import Reviews from "./Reviews/Reviews";

const Tabs = ({description,id,tableContent}: {description:string | null,id:string,tableContent:string }) => {
  const [activeTab, setActiveTab] = useState("توضیحات");

  return (
    <div>
      <ul className="list w-full flex-row flex gap-7 border border-t-0 border-l-0 border-r-0 border-b-2 border-gray-300">
        <li 
          onClick={() => setActiveTab("توضیحات")}
          className={`px-3 py-2 text-lg cursor-pointer ${activeTab === "توضیحات" ? "border-b-2 border-red-300" : ""}`}
        >
          توضیحات
        </li>
        <li 
          onClick={() => setActiveTab("اطلاعات تکمیلی")}
          className={`px-3 py-2 text-lg cursor-pointer ${activeTab === "اطلاعات تکمیلی" ? "border-b-2 border-red-300" : ""}`}
        >
          اطلاعات تکمیلی
        </li>
        <li 
          onClick={() => setActiveTab("نظرات")}
          className={`px-3 py-2 text-lg cursor-pointer ${activeTab === "نظرات" ? "border-b-2 border-red-300" : ""}`}
        >
          نظرات
        </li>
      </ul>

      <div className="mt-4">
        {activeTab === "توضیحات" && (
          <div className="p-4 border border-gray-300">
           <div className="mt-4 p-4 border bg-gray-100">
          <h2 className="font-semibold mb-2">معرفی محصول:</h2>
          {description && (
            <div
              className="preview-content space-y-2 text-black"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
          </div>
        )}
        {activeTab === "اطلاعات تکمیلی" && (
          <div className="p-4 border border-gray-300">
          <Tables tableContent={tableContent ?? ""}/>
          </div>
        )}
        {activeTab === "نظرات" && (
          <div className="p-4 border border-gray-300">
          <Reviews id={id}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
