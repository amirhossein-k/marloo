"use client";

import Upload from "@/app/(protected)/dashboard/addproduct/components/upload/Upload";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateTableHTML } from "@/utils/generateTableHTML";
import TagsInput from "@/app/(protected)/dashboard/addproduct/components/TagsInput";
import CategorySelector from "@/app/(protected)/dashboard/addproduct/components/CategorySelector";
import CustomEditor from "@/app/(protected)/dashboard/addproduct/components/CustomEditor";
import TableAdd from "@/app/(protected)/dashboard/addproduct/components/TableAdd";
import UploadSection from "@/app/(protected)/dashboard/addproduct/components/UploadSection";
import ProductInfoForm from "@/app/(protected)/dashboard/addproduct/components/ProductInfoForm";
import MultiBrandModelVariantSelect from "@/app/(protected)/dashboard/addproduct/components/BrandModelVariantSelect";

interface ImageEdit {
  defaultImage: boolean;
  childImage: string;
  fileKey: string;
  id: string;
}

interface ImageObject {
  key: string;
  url: string;
  id: string;
}

export default function ConfirmationModalDashboardList({
  isOpen,
  onCancel,
  products,
}: {
  isOpen: boolean;
  onCancel: () => void;
  products: Product[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

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
  const [imageDefult, setImageDefult] = useState("");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string[]>([""]);

  const [images, setImages] = useState<ImageEdit[]>();

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const p = products.find((prod) => prod.id === id);
    if (!p) return;

    setName(p.title);
    setPrice(String(p.price));
    setCount(p.count);
    setCountproduct(p.countproduct);
    setPriceOffer(p.priceOffer);
    setCheckbox(p.published ? "انتشار" : "عدم انتشار");
    setImages(
      p.productImage.map((img) => ({
        defaultImage: img.defaultImage,
        childImage: img.childImage,
        fileKey: img.fileKey || "",
        id: img.id,
      }))
    );
    setDetailImage(
      p.productImage.map((img) => ({
        key: img.fileKey ?? "",
        url: img.childImage,
        id: img.id,
      }))
    );
    setSelectedImageId(
      p.productImage.find((img) => img.defaultImage)?.id || null
    );
    setTags(p.tags || []);
    setSelectedCategories(p.categoryList?.map((cat) => cat.category) || []);
    setSelectedVariantId(p.productVariants?.map((v) => v.variantId) || []);
    setHtml(p.content || "");
  }, [id, products]);

  // / به‌روزرسانی tableData بر اساس تعداد ردیف‌ها و ستون‌ها
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
  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !price) {
      setError("لطفاً نام و قیمت محصول را وارد کنید");
      return;
    }

    // پاکسازی tableContent مشابه API Add

    const categoryArray = Array.from(selectedCategories);
    const tableHTML = generateTableHTML(tableData);

    // 1. ساخت HTML جدول از داده‌ها

    // 2. اگر جدول وجود دارد، فقط همین قسمت را نگه دار

    const fullContenttt = tableHTML ? `${html}<br>${tableHTML}` : html;

    const payload = {
      name,
      price: Number(price),
      count,
      countproduct,
      priceOffer,
      checkbox,
      detailImage,
      imageDefult: selectedImageId
        ? detailImage.find((img) => img.id === selectedImageId)?.url
        : "",
      selectedImageId,
      tags,
      category: categoryArray,
      selectedVariantId,
      html,
      tableContent: fullContenttt,
    };

    try {
      const res = await fetch(`/api/products/edit?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "خطا در ویرایش محصول");
        return;
      }

      router.refresh();
      onCancel();
    } catch (err) {
      console.log(err);
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-y-auto max-h-[90vh] p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">ویرایش محصول</h2>

        <form onSubmit={handleConfirm} className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* برند/مدل/رنگ */}
            <div className="col-span-1 md:col-span-2">
              <MultiBrandModelVariantSelect
                onSelectData={(data) => {
                  const variantIds = Object.values(data)
                    .flatMap((models) => Object.values(models))
                    .flat();
                  setSelectedVariantId(variantIds);
                }}
              />
            </div>

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
              checkbox={checkbox}
              setCheckbox={setCheckbox}
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

            {/* دسته‌بندی */}
            <CategorySelector
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            {/* ادیتور متن */}
            <CustomEditor html={html} setHtml={setHtml} />

            {/* جدول */}
            <TableAdd
              rows={rows}
              setRows={setRows}
              columns={columns}
              setColumns={setColumns}
              tableData={tableData}
              setTableData={setTableData}
            />
          </section>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              ذخیره
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 transition"
            >
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
