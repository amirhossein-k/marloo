"use client";

import { useState } from "react";
import Upload from "./upload/Upload";
import Image from "next/image";

interface ImageObject {
  key: string;
  url: string;
  id: string;
}

interface props {
  imageDefult: string;
  detailImage: ImageObject[];
  setImageDefult: (v: string) => void;
  selectedImageId: string | null;
  setSelectedImageId: (v: string | null) => void;
  setDetailImage: React.Dispatch<React.SetStateAction<ImageObject[]>>;
}

const UploadSection = ({
  imageDefult,
  setImageDefult,
  selectedImageId,
  setSelectedImageId,
  setDetailImage,
  detailImage,
}: props) => {
  const handleDefultImage = (img: ImageObject) => {
    const match = img.url.match(/uploads%2F(.*?)(?=&|$)/);

    const r = match ? decodeURIComponent(match[1]) : "";
    const p = `uploads/${r}`;

    console.log(r, "r");
    setImageDefult(p);
    setSelectedImageId(img.id); // ذخیره id تصویر انتخاب‌شده

    console.log(img, "scr");
  };
  const handleDelete = async (key: string) => {
    try {
      const response = await fetch("/api/upload", {
        // تغییر به /api/delete
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در حذف فایل");
      }

      const result = await response.json();
      console.log(result.message);

      // حذف تصویر از state
      setDetailImage((prev) => prev.filter((img) => img.key !== key));
    } catch (error) {
      console.error("خطا:", error);
      alert("خطا در حذف تصویر");
    }
  };
  return (
    <div
      className="
        overflow-hidden
        rounded-md
        box3
      "
    >
      <Upload
        detailImage={detailImage}
        setDetailImage={setDetailImage}
        edit={false}
      />
      <h2 className="w-full bg-red-300 px-2 py-3 text-center ">
        :یکی را به عنوان تصویر اصلی انتخاب کنید
      </h2>
      {detailImage.length > 0 && (
        <div
          dir="rtl"
          className="
            grid grid-cols-3
            mt-4
            gap-2
            p-2
          "
        >
          {detailImage
            .filter((img) => img.url)
            .map((img) => (
              <div key={img.id}>
                <button
                  onClick={() => handleDelete(img.key)}
                  className="bg-red-500 text-white p-2 mt-2"
                >
                  حذف تصویر
                </button>
                <Image
                  src={img.url}
                  alt="آپلود شده"
                  width={100}
                  height={100}
                  onClick={() => handleDefultImage(img)}
                  className={`
                    object-cover
                    w-full h-24
                    rounded-lg border
                    ${
                      selectedImageId === img.id
                        ? "border-4 border-blue-500"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
