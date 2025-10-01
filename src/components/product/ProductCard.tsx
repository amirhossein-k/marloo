// components/products/ProductCard.tsx
"use client";
import { useLoading } from "@/context/LoadingContext";
import { FormattedPostType, PHOTO, Product } from "@/types";
import { renderCountStatus } from "@/utils/CountStatus";
import { calculatePercentage } from "@/utils/OfferMade";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function ProductCard({
  product,
}: {
  product: FormattedPostType;
}) {
  console.log(product, "prodict");

  const [isPending, startTransition] = useTransition();
  const { setIsLoadingProduct } = useLoading();

  const router = useRouter();

  const defaultImage =
    product.productImage.find((item: PHOTO) => item.defaultImage) ??
    product.productImage[0];

  const handlePush = () => {
    setIsLoadingProduct(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(`/products/${product.id}`);
    });
  };

  const finalPrice = product.priceOffer || product.price;
  const discount = product.priceOffer ? product.price - product.priceOffer : 0;

  return (
    <article
      className="text-black border flex flex-col justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative"
      dir="rtl"
      itemScope
      itemType="https://schema.org/Product"
    >
      {product.count === 0 && (
        <div className="soldout flex justify-center items-center bg-[#2ec8d379] w-full absolute h-full left-0 top-0 z-10 rounded-lg">
          <span className="text-2xl text-[#000000]">ناموجود</span>
        </div>
      )}

      <Image
        src={defaultImage?.childImage || "/fallback.png"}
        alt={product.title}
        title={product.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover mb-4 rounded-md"
        loading="lazy"
        itemProp="image"
      />

      <div className="body">
        <h2 className="text-xl truncate" itemProp="name">
          {product.title}
        </h2>

        {product.count !== 0 &&
          renderCountStatus(product.countproduct.toString())}

        <p
          className="text-gray-600 flex gap-2 relative"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <span className="text-lg flex gap-4">
            <span itemProp="priceCurrency" content="IRR">
              تومان
            </span>
            <span itemProp="price"> {product.price.toLocaleString()} </span>
            {product.priceOffer !== 0 && (
              <>
                <span className="diagonal-line w-[45px] h-[2px] absolute bg-red-600 rotate-[0deg] right-2 top-[13px] inline-block"></span>
                {product.priceOffer &&
                  calculatePercentage(
                    product.priceOffer,
                    product.price.toString()
                  ).toLocaleString()}
              </>
            )}
          </span>
          <Image
            quality={100}
            width={25}
            height={30}
            src="https://c961427.parspack.net/c961427/uploads/dollar2%20%281%29%201.jpg"
            alt="currency"
          />
        </p>

        <div className="star-point p-1 w-fit">
          <span className="flex gap-2 text-sm">
            <span>4.2</span>
            <i className="bi bi-star-fill text-yellow-500"></i>
          </span>
        </div>
      </div>

      <div className="buttom z-40 my-1 bg-slate-100 border flex justify-center group">
        <Link
          href={`/products/${product.id}`}
          onClick={handlePush}
          className="sm:w-[50%] z-40 group-hover:scale-105 bg-slate-100 block px-1 py-2 text-center cursor-pointer group-hover:bg-blue-200 group-hover:duration-500 group-hover:animate-pulse group-hover:w-full"
        >
          مشاهده
        </Link>
      </div>

      <meta itemProp="sku" content={product.id} />
      <meta itemProp="description" content={product.content || product.title} />
      <meta
        itemProp="availability"
        content={
          product.count === 0
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock"
        }
      />
    </article>
  );
}
