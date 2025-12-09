import { CategotyProduct } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryLinkProps {
  category: CategotyProduct[];
}
const CategoryLink = ({ category }: CategoryLinkProps) => {
  return (
    <>
      {category.map((cat) => (
        <Link
          // onClick={() => handleCategoryClick(cat.titleCategotyEn)}
          key={cat.id}
          prefetch={true}
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
