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
        <article
          key={cat.id}
          className="bg-white rounded-xl shadow hover:shadow-xl transition p-3"
          aria-labelledby={`cat-title-${cat.id}`}
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <Link
            // onClick={() => handleCategoryClick(cat.titleCategotyEn)}
            key={cat.id}
            prefetch={true}
            href={`/products/${encodeURIComponent(cat.titleCategotyEn)}`}
            className="block"
            aria-label={`مشاهده محصولات دسته ${cat.titleCategotyPer} در فروشگاه`}
            aria-describedby={`cat-desc-${cat.id}`}
            title={`خرید محصولات ${cat.titleCategotyPer} با بهترین قیمت`}
            rel="nofollow" // برای صفحات دسته‌بندی، nofollow بهتر است تا لینک juice به صفحات غیرضروری منتقل نشود
          >
            {/* Schema.org structured data */}
            <meta itemProp="position" content={cat.id} />
            <meta itemProp="name" content={cat.titleCategotyPer} />
            <div className="overflow-hidden rounded-xl">
              <Image
                src={cat.urlPic}
                alt={`${cat.titleCategotyPer} - دسته‌بندی محصولات`}
                width={400}
                height={300}
                className="w-full h-40 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* عنوان */}

            <h3
              id={`cat-title-${cat.id}`}
              className="text-center mt-3 font-medium text-lg text-gray-900"
              itemProp="name"
            >
              {cat.titleCategotyPer}
            </h3>
            {/* توضیح کوتاه */}

            <p
              className="mt-2 text-center text-sm text-gray-600 line-clamp-2"
              itemProp="description"
            >
              {cat.shortDesc || "بدون توضیحات"}{" "}
            </p>
          </Link>
        </article>
      ))}
    </>
  );
};

export default CategoryLink;
