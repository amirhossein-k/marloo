import React from "react";
import ProductCard from "./ProductCard";

const IncredibleOffersPage = () => {
  // نمونه داده محصولات
  const products = [
    {
      id: "1",
      name: "گوشی موبایل سامسونگ گلکسی A55",
      price: 12000000,
      discountPrice: 8990000,
      image: "/images/product1.jpg",
      discountEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 روز دیگر
      discountDaysLeft: 2,
    },
    {
      id: "2",
      name: "لپ‌تاپ ایسوس ویووبوک",
      price: 25000000,
      discountPrice: 19900000,
      image: "/images/product2.jpg",
      discountEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 روز دیگر
      discountDaysLeft: 5,
    },
    // ... محصولات دیگر
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* هدر صفحه */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          شگفت‌انگیزهای رو به اتمام
        </h1>
        <p className="text-gray-600">
          فرصت را از دست ندهید! این پیشنهادات ویژه به زودی پایان می‌یابند
        </p>
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default IncredibleOffersPage;
