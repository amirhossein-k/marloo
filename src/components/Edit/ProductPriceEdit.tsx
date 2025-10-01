"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  productId: string;
  currentPrice: number;
  currentPriceOffer: number;
  //   onUpdated: (price: number, priceOffer: number) => void;
}

async function updateProductPrice(
  productId: string,
  price: number,
  priceOffer: number
) {
  const res = await fetch(`/api/products/${productId}/price`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price, priceOffer }),
  });

  if (!res.ok) throw new Error("خطا در بروزرسانی قیمت");
  return res.json();
}

const ProductPriceEdit = ({
  currentPrice,
  currentPriceOffer,
  //   onUpdated,
  productId,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [price, setPrice] = useState(currentPrice);
  const [priceOffer, setPriceOffer] = useState(currentPriceOffer);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => updateProductPrice(productId, price, priceOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("با موفقیت اپدیت شد");
    },
    onError: () => toast.error("خطا"),
  });

  return (
    <div className="border p-3 rounded-md mt-2">
      {mutation.isPending && (
        <p className="text-blue-500 mb-2">در حال بروزرسانی اطلاعات...</p>
      )}

      <div className="flex flex-col gap-2">
        <label className="px-2 text-blue-500">قیمت:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border rounded px-2 py-1"
          placeholder="قیمت"
        />
        <label className="px-2  text-blue-500">تخفیف:</label>
        <input
          type="number"
          value={priceOffer}
          onChange={(e) => setPriceOffer(Number(e.target.value))}
          className="border rounded px-2 py-1"
          placeholder="تخفیف"
        />
        <button
          onClick={() => mutation.mutate()}
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
        {mutation.isError && (
          <p className="text-red-500 text-sm">خطا در ذخیره سازی</p>
        )}
        {mutation.isSuccess && (
          <p className="text-green-500 text-sm">ذخیره شد ✅</p>
        )}
      </div>
    </div>
  );
};

export default ProductPriceEdit;
