"use client";
import { useLoading } from "@/context/LoadingContext";
import { CategotyProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";

interface CategoryLinkProps {
  category: CategotyProduct[];
}
const CategoryLink = ({ category }: CategoryLinkProps) => {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleCategoryClick = (titleCategotyEn: string) => {
    console.log(`دسته انتخاب شده: ${titleCategotyEn}`);
    setIsLoading(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(`/products/${encodeURIComponent(titleCategotyEn)}`);
    });
  };

  return (
    <>
      {category.map((cat) => (
        <Link
          onClick={() => handleCategoryClick(cat.titleCategotyEn)}
          key={cat.id}
          href={`/products/${encodeURIComponent(cat.titleCategotyEn)}`}
          className="bg-white rounded-xl shadow hover:shadow-xl transition p-3"
        >
          <Image
            src={cat.urlPic}
            alt={cat.titleCategotyPer}
            width={400}
            height={300}
            className="w-full h-40 object-cover rounded-xl"
          />
          <p className="text-center mt-3 font-medium text-lg">
            {cat.titleCategotyPer}
          </p>
        </Link>
      ))}
    </>
  );
};

export default CategoryLink;
