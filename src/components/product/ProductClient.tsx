"use client";

import {
  Category,
  FormattedPostType,
  PHOTO,
  Product,
  ProductVariant,
  Review,
  Variant,
} from "@/types";
import React, { useEffect } from "react";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import Tabs from "../TabsProduct/Tabs";
import ProductPriceEdit from "../Edit/ProductPriceEdit";
import { calculatePercentage } from "@/utils/OfferMade";
import { Rating, ThinStar } from "@smastrom/react-rating";
import ImagesProduct from "../imageShow/ImagesProductID";
import CurrentPath from "../path/CurrentPath";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SelectColor from "./SelectColor";
import AddToCartButtonActions from "./AddToCartButtonAction";

interface Props {
  product: FormattedPostType; // نوع محصول
  isAdmin: boolean;
}

const ProductClient = ({ product: initialData, isAdmin }: Props) => {
  const currectPath = "product";

  const {
    data: product,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["product", initialData.id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${initialData.id}`);
      if (!res.ok) throw new Error("خطا در دریافت محصول");
      return res.json();
    },
    initialData, // این باعث می‌شود React Query هم cache داشته باشد
    staleTime: 1000, // مثلا 1 ثانیه، داده تازه می‌ماند و flicker کمتر می‌شود
  });
  console.log(product, "product");

  const [selectedColor, setSelectedColor] = React.useState(
    product.colors[0]?.id
  );

  // مدیریت toast
  useEffect(() => {
    if (isFetching) {
      toast.loading("در حال بارگذاری اطلاعات...", { id: "loading-product" });
    } else {
      toast.dismiss("loading-product");
    }
  }, [isFetching]);

  useEffect(() => {
    if (isError) toast.error("خطا در دریافت محصول");
  }, [isError]);
  // تصاویر امن
  const safeImages: PHOTO[] = product.productImage?.length
    ? product.productImage
    : [
        {
          id: "default",
          childImage: "/default-image.jpg",
          defaultImage: true,
          fileKey: "",
          ownerId: "",
        },
      ];
  // const variantsForSelector: Variant[] = (product.productVariants ?? [])
  //   .map((v: ProductVariant) => v.variant)
  //   .filter((v: Variant | null | undefined): v is Variant => v != null);

  return (
    <>
      <div className="nav">
        <CurrentPath
          productId={product.id}
          cat={product.categoryList[0].category || ""}
        />
      </div>
      <div className="top flex xl:flex-row flex-col gap-3">
        {/* تصاویر */}

        <div className="images xl:w-[40%] w-full h-full flex justify-center items-center md:my-0">
          <ImagesProduct
            images={safeImages.map((img) => ({
              ...img,
              alt: `خرید ${product.title} | ${product.categoryList[0]?.category}`,
            }))}
          />
        </div>
        {/* بدنه محصول */}
        <div className="body p-2 w-full xl:w-[60%] flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          {/* انتخاب variantsForSelector */}
          {/* {variantsForSelector.length > 0 && (
            <ModelAndColorSelector product={product} />
          )} */}

          {/* انتخاب رنگ */}
          <SelectColor
            colors={product.colors}
            selectedColor={selectedColor}
            onChange={(id: string) => setSelectedColor(id)}
          />
          {/* امتیاز */}

          <div className="score flex flex-row gap-4">
            {product.review && product.review.length > 0 && (
              <span className="mr-2">
                <Rating
                  style={{ maxWidth: 100 }}
                  value={
                    product.review.reduce(
                      (sum: number, review: Review) => sum + review.rating,
                      0
                    ) / product.review.length
                  }
                  readOnly
                  itemStyles={{
                    itemStrokeWidth: 2,
                    activeFillColor: "#f1a545",
                    activeStrokeColor: "#d3d3d3",
                    itemShapes: ThinStar,
                  }}
                />
              </span>
            )}
            <div className="count">{product.review.length} نظر</div>
          </div>
          {/* مقایسه قیمت */}

          <div className="compare-price mt-4 p-4 border-t border-gray-300">
            {/* <DigikalaPrice productName={product.title} /> */}
          </div>
          {/* قیمت */}

          <div className="buy_text">
            <p className="mt-2 text-lg font-semibold">
              {product.priceOffer !== 0 ? (
                <>
                  <span className="relative mx-2 w-fit">
                    {product.price?.toLocaleString() ?? "."}
                    <span className="diagonal-line w-[80%] h-[2px] absolute bg-red-600 rotate-[0deg] right-[7px] top-[13px] inline-block"></span>
                  </span>
                  {calculatePercentage(
                    product.priceOffer,
                    product.priceWithProfit.toString()
                  ).toLocaleString()}
                </>
              ) : (
                <>{product.priceWithProfit?.toLocaleString() ?? "."}</>
              )}{" "}
              تومان
            </p>
            {isAdmin && (
              <ProductPriceEdit
                productId={product.id}
                currentPrice={product.price}
                currentPriceOffer={product.priceOffer}
              />
            )}
          </div>
          {/* ویژگی‌ها */}

          <ul className="property my-2 border-t-1 border-t-[#000] py-2 list-disc px-3">
            <h2 className="font-semibold text-sm mb-2">ویژگی‌ها:</h2>

            {product.tags.map((tag: string, index: number) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
          {/* دسته‌بندی */}

          <div className="my-4">
            <h2 className="font-semibold text-sm mb-2">دسته بندی:</h2>
            <div className="flex flex-wrap gap-2">
              {product.categoryList.map((cat: Category) => (
                <Link
                  href={`/products/list?category=${cat.category}&sort=new`}
                  key={cat.id}
                >
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                    {cat.category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* دکمه خرید */}

          <div className="buy">
            <AddToCartButtonActions
              productId={product.id}
              colorsSelect={selectedColor} // یا رنگ انتخابی کاربر
              quantity={1}
              title={product.title}
            />
            {/* <AddToCartButton productId={product.id} currectPath={currectPath} /> */}
          </div>
          <p className="text-gray-700">
            {product.published ? "منتشر شده" : "منتشر نشده"}
          </p>

          <Link
            href="/products"
            className="text-blue-500 mt-4 block hover:underline"
          >
            بازگشت به لیست محصولات
          </Link>
        </div>
      </div>
      {/* توضیحات پایین */}

      <div className="botom ">
        <Tabs
          description={product.content ?? ""}
          id={product.id}
          tableContent={product.tableContent ?? ""}
        />
      </div>
    </>
  );
};

export default ProductClient;
