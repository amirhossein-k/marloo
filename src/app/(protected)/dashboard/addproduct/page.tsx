"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// کامپوننت‌ها
import { X } from "lucide-react";

import UploadSection from "./components/UploadSection";
import TagsInput from "./components/TagsInput";
import CategorySelector from "./components/CategorySelector";
import ProductInfoForm from "./components/ProductInfoForm";
import CustomEditor from "./components/CustomEditor";
import TableAdd from "./components/TableAdd";
import { generateTableHTML } from "@/utils/generateTableHTML";
import Bmv from "@/components/bmv/Bmv";
import BrandModelVariantSelect from "./components/BrandModelVariantSelect";
import MultiBrandModelVariantSelect from "./components/BrandModelVariantSelect";
import { useQuery } from "@tanstack/react-query";
import type { Colors } from "@prisma/client";
import ColorQuantityModelForm from "@/components/Colors/Colors";
import toast from "react-hot-toast";
interface ImageObject {
  key: string;
  url: string;
  id: string;
}

// {
//   [brandId]: {
//     [modelId]: [variantId1, variantId2, ...]
//   }
// }

export default function AddProduct() {
  const router = useRouter();

  // --- States ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [priceOffer, setPriceOffer] = useState(0);
  const [dateOffer, setDateOffer] = useState("");
  const [count, setCount] = useState(0);
  const [countproduct, setCountproduct] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [checkbox, setCheckbox] = useState("عدم انتشار");
  const [html, setHtml] = useState<string>("متن خود را اینجا وارد کنید...");
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [detailImage, setDetailImage] = useState<ImageObject[]>([
    { key: "", url: "", id: "" },
  ]);
  const [colors, setColors] = useState<Colors[]>([]);

  const [imageDefult, setImageDefult] = useState("");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string[]>([""]);

  const [OpenColor, setOpenColor] = useState(false);
  const [OpenMvb, setOpenMvb] = useState(false);

  const [error, setError] = useState("");

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

  // بعد از گرفتن لیست تامین‌کننده‌ها

  // استفاده از react-query برای گرفتن تامین‌کننده‌ها
  const {
    data: suppliers = [],
    isLoading: loadingSuppliers,
    isError,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      return data.suppliers; // چون API ما { suppliers: [...] } برمی‌گرداند
    },
  });
  // به‌روزرسانی tableData بر اساس تعداد ردیف‌ها و ستون‌ها
  useEffect(() => {
    if (rows > 0 && columns > 0) {
      const newTableData = Array.from({ length: rows }, () =>
        Array(columns).fill("")
      );
      setTableData(newTableData);
    } else {
      setTableData([]);
    }
  }, [rows, columns]);

  // --- ارسال به سرور ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      setError("لطفاً همه فیلدهای ضروری را پر کنید");
      return;
    }
    const categoryArray = Array.from(selectedCategories);
    const tableHTML = generateTableHTML(tableData);

    // 1. ساخت HTML جدول از داده‌ها

    // 2. اگر جدول وجود دارد، فقط همین قسمت را نگه دار

    const fullContenttt = tableHTML ? `${html}<br>${tableHTML}` : html;

    const payload = {
      name,
      price,
      priceOffer,
      dateOffer,
      count,
      countproduct,
      tableContent: fullContenttt,
      imageDefult,
      selectedImageId,
      category: categoryArray,
      checkbox,
      html,
      tags,
      selectedVariantId,
      // categories: selectedCategories,
      detailImage,
      supplierId: selectedSupplierId,
      colors,
    };
    console.log(payload, "payload");

    try {
      const res = await fetch("/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // این خیلی مهمه

        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/products/list");
      } else {
        const data = await res.json();
        setError(data.error || "خطایی رخ داده است");
      }
    } catch (err) {
      console.log(err);
      setError("ارتباط با سرور برقرار نشد");
    }
  };

  const handleRemoveColor = async (id: string) => {
    try {
      const newColors = colors.filter((color) => color.id !== id);
      setColors(newColors);
      toast.success("رنگ حذف شد");
    } catch (error) {
      console.log(error, "error in remove color");
      toast.error("خطا در پاک کردن رنگ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">افزودن محصول</h1>
      <h2
        className="bg-blue-400 rounded-md text-center py-3 my-4 cursor-pointer hover:text-white"
        onClick={() => setOpenMvb(!OpenColor)}
      >
        انتخاب برند / مدل / رنگ
      </h2>
      <section
        className={`${OpenMvb ? "block" : "hidden"}`}
        style={{ marginTop: "20px" }}
      >
        <Bmv
          onChange={({ brandId, modelId, variantId }) => {
            console.log("انتخاب شده‌ها:", { brandId, modelId, variantId });
          }}
          add={true}
        />
      </section>
      <h2
        className="bg-blue-400 rounded-md text-center py-3 my-4 cursor-pointer hover:text-white"
        onClick={() => setOpenColor(!OpenColor)}
      >
        رنگ{" "}
      </h2>
      <section
        className={`${OpenColor ? "block" : "hidden"}`}
        style={{ marginTop: "20px" }}
      >
        <ColorQuantityModelForm
          onAdd={(color, inventory, model) => {
            setColors((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                color,
                inventory,
                model,
                parentModel: null,
                productId: "",
              },
            ]);
          }}
        />

        {/* لیست رنگ‌ها */}
        {colors.length > 0 && (
          <ul className="m-4 space-y-2">
            {colors.map((c) => (
              <li
                key={c.id}
                className="p-2 border rounded bg-white shadow text-sm flex justify-between relative"
              >
                <span>
                  {c.color} - {c.model}
                </span>
                <span>{c.inventory} عدد</span>
                <X
                  onClick={() => handleRemoveColor(c.id)}
                  className="absolute -top-2 cursor-pointer text-white hover:bg-red-400 -right-3 bg-red-600 rounded-full  w-[17px] h-[17px]"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* کامپوننت انتخاب برند/مدل/رنگ */}
        <BrandModelVariantSelect
          onSelectData={(data) => {
            // Flatten nested variants
            const variantIds = Object.values(data)
              .flatMap((models) => Object.values(models))
              .flat();
            setSelectedVariantId(variantIds);
          }}
        />
        {/* اطلاعات محصول */}
        <ProductInfoForm
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          priceOffer={priceOffer}
          setPriceOffer={setPriceOffer}
          dateOffer={dateOffer}
          setDateOffer={setDateOffer}
          count={count}
          setCount={setCount}
          countproduct={countproduct}
          setCountproduct={setCountproduct}
          checkbox={checkbox} // اضافه شد
          setCheckbox={setCheckbox} // اضافه شد
        />

        {/* آپلود عکس */}
        <UploadSection
          detailImage={detailImage}
          setDetailImage={setDetailImage}
          imageDefult={imageDefult}
          setImageDefult={setImageDefult}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
        />

        {/* تگ‌ها */}
        <TagsInput tags={tags} setTags={setTags} />

        {/* دسته‌بندی‌ها */}
        <CategorySelector
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <CustomEditor html={html} setHtml={setHtml} />
        <TableAdd
          rows={rows}
          setRows={setRows}
          columns={columns}
          setColumns={setColumns}
          tableData={tableData}
          setTableData={setTableData}
        />
        {loadingSuppliers ? (
          <>تامین‌کننده در حال لودینگ است...</>
        ) : (
          <div>
            <label>انتخاب تامین‌کننده:</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">انتخاب کنید</option>
              {suppliers.map(
                (s: {
                  id: string;
                  name: string;
                  phone: string;
                  address?: string;
                }) => (
                  <option key={s.id} value={s.id}>
                    {s.phone} - {s.name} - {s?.address}
                  </option>
                )
              )}
            </select>
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          افزودن محصول
        </button>
      </form>
    </div>
  );
}
