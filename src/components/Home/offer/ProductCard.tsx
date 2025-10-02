import React from "react";
import DiscountTimer from "./DiscountTimer";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number;
    discountPercent?: number;
    image: string;
    discountEndDate: Date;
    discountDaysLeft: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const calculateDiscountPercent = () => {
    const discount =
      ((product.price - product.discountPrice) / product.price) * 100;
    return Math.round(discount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* تصویر محصول */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          {calculateDiscountPercent()}%
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* قیمت‌ها */}
        <div className="flex items-center space-x-2 space-x-reverse mb-3">
          <span className="text-lg font-bold text-gray-800">
            {product.discountPrice.toLocaleString()} تومان
          </span>
          <span className="text-sm text-gray-500 line-through">
            {product.price.toLocaleString()}
          </span>
        </div>

        {/* تایمر تخفیف */}
        <DiscountTimer
          endDate={product.discountEndDate}
          daysLeft={product.discountDaysLeft}
        />
      </div>
    </div>
  );
};

export default ProductCard;
