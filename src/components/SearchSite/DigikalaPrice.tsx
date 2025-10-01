"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type DigiProduct = {
  name: string;
  price: string | null;
  link: string | null;
  image: string | null;
};

export default function DigikalaPrice({
  productName,
}: {
  productName: string;
}) {
  const [products, setProducts] = useState<DigiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("/api/searchSite/checkMultipleProductPrices", {
          method: "POST",
          body: JSON.stringify({ productName, maxResults: 3 }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setProducts(data.products || []); // آرایه محصولات
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPrice();
  }, [productName]);

  if (loading) return <span>در حال بررسی قیمت...</span>;
  if (!products.length)
    return <p className="text-gray-500">محصول در دیجی‌کالا یافت نشد</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200 flex flex-col items-center"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={128} // برابر با کلاس w-32
              height={128} // برابر با کلاس h-32
              className="object-contain mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-4">
              تصویر موجود نیست
            </div>
          )}
          <h3 className="text-md font-semibold text-center mb-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold mb-2">
            {product.price ?? "ناموجود"} تومان
          </p>
          {product.link && (
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-auto"
            >
              مشاهده در دیجی‌کالا
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
