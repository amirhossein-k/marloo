"use client";

import React, { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOrder } from "@/app/actions/order/order";
import Link from "next/link";
import { addItem } from "@/store/orderSlice";
import { useDispatch } from "react-redux";

// این import اکشن server شماست

interface Props {
  productId: string;
  colorsSelect: string;
  quantity: number;
  title: string;
}

const AddToCartButtonActions = ({
  productId,
  colorsSelect,
  quantity = 1,
  title,
}: Props) => {
  const quantityRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (quantity: number) => {
      return await createOrder({ productId, colorsSelect, quantity });
    },
    onSuccess: (res) => {
      if (res.success && res.data) {
        const item = res.data;
        const product = {
          id: item.product.id,
          priceWithProfit: item.unitPrice,
          title: item.product.title,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          image: item.product.productImage?.find((img: any) => img.defaultImage)
            ?.childImage,
          priceOffer: item.product.priceOffer,
        };

        queryClient.invalidateQueries({ queryKey: ["cart"] });
        dispatch(
          addItem({
            product,
            colorsSelect: item.colorsSelect ?? "",
            quantity: item.quantity,
          })
        ); // 👉 Redux فوری آپدیت
        toast.success(`"${res.data.product.title}" با موفقیت اضافه شد!`);
      } else if (res.error) {
        toast.error(
          <div dir="rtl">
            {res.message || "خطا در ثبت سفارش"}
            <br />

            {res.message.endsWith("!") && (
              <Link href="/login" className="text-blue-500 hover:text-black">
                ورود سریع
              </Link>
            )}
          </div>
        );
      }
    },
    onError: () => {
      toast.error("خطا در ثبت سفارش");
    },
  });

  const handleAddToCart = () => {
    const quantityValue = quantityRef.current?.value;
    const quantity = quantityValue ? parseInt(quantityValue, 10) : 1;
    mutation.mutate(quantity);
  };

  return (
    <>
      <input
        type="number"
        min="1"
        defaultValue="1"
        ref={quantityRef}
        className="p-2 border rounded w-20 text-center text-red-500"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={handleAddToCart}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "در حال ثبت سفارش..." : "افزودن به سبد"}
      </button>
    </>
  );
};

export default AddToCartButtonActions;
