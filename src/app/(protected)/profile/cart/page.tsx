"use client";
import { provinces, cities } from "iran-regions";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { num2persian } from "@/utils/num2persian";
import { debugPersist, getDecryptedOrderShop } from "@/utils/sessionHelpers";
// import { FullPurchaseOrderRedux } from "@/types";
import ProvinceCitySelect from "@/components/ProvinceCitySelect/ProvinceCitySelect";
import InputField from "@/components/Input/InputField";
import { useMutation } from "@tanstack/react-query";
import { finalizeOrder } from "@/app/actions/order/order";
import { useDispatch, useSelector } from "react-redux";
import { CartItem, setAccessCart, setCartOpen } from "@/store/orderSlice";
import { useSession } from "next-auth/react";
import { RootState } from "@/store";
import { useInvoice } from "@/app/lib/useInvoice";
// import { orderedProduct } from "@/types/types";
// import { useInvoice } from "@/lib/useInvoice";
// import { createInvoiceAndRedirect } from "../../../../../actions/createInvoice";
interface DecryptedOrderShop {
  items: CartItem[];
  totalPrice?: number; // اختیاری، در صورت وجود در آینده
  OpenCart?: boolean; // اختیاری، در صورت وجود در آینده
  accessCart?: boolean; // اختیاری، در صورت وجود در آینده
}

const Cartpage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  // const [accessCart, setAccessCart] = useState<boolean>(false);

  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<{
    name: string;
    city: string;
    address: string;
    zipCode: string;
    des: string;
  }>({
    name: "",
    city: "",
    address: "",
    zipCode: "",
    des: "",
  });

  const { data: session } = useSession();

  // ✅ اتصال به state جدید Redux
  // items ==> PurchaseOrderItem  => one product
  const { items, accessCart, totalPrice } = useSelector(
    (state: RootState) => state.orderShop
  );

  // valid phoneNumber
  const validPhone = (phone: string) => {
    const phoneReg = /^(\+98|0)?9\d{9}$/;
    return phoneReg.test(phone);
  };

  const handleRegionChange = useCallback(
    (value: {
      name: string;
      city: string;
      address: string;
      zipCode: string;
      des: string;
    }) => {
      setAddress((prev) =>
        prev.name === value.name &&
        prev.city === value.city &&
        prev.address === value.address &&
        prev.zipCode === value.zipCode &&
        prev.des === value.des
          ? prev
          : value
      );
    },
    []
  );

  useEffect(() => {
    // const { items, accessCart } = getDecryptedOrderShop();
    if (!items || items.length === 0) {
      toast.error("سبد خرید خالی است. دسترسی به این صفحه امکان‌پذیر نیست.");
      router.push("/products/list");
      return;
    }
    // setCart(items);

    if (!accessCart) {
      toast.error("شما دسترسی لازم برای مشاهده این صفحه را ندارید.");
      router.push("/products/list");
      return;
    }
  }, [router, accessCart, items]);

  // 🧮 محاسبه قیمت کل
  // const totalPrice = cart.reduce(
  //   (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 1),
  //   0
  // );
  console.log(totalPrice, "totatl");
  // ✅ فقط یک useMutation برای مرحله نهایی‌سازی سفارش
  const finalizeOrderMutation = useMutation({
    mutationFn: () => finalizeOrder({ items: cart, totalPrice }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        // dispatch(setAccessCart(true));
        // dispatch(clearCart()); // پاک کردن سبد خرید در Redux
        dispatch(setCartOpen(false));
        router.push(`/profile/cart`); // انتقال به صفحه پرداخت
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => toast.error(err.message || "خطا در ارتباط با سرور"),
  });

  const handleFinalizeOrder = () => {
    if (!session) {
      toast.error("ابتدا وارد حساب کاربری شوید");
      return;
    }
    if (cart.length === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }
    finalizeOrderMutation.mutate();
  };

  console.log(items, "itemss");
  const { data, error, isLoading } = useInvoice(items, totalPrice);

  if (isLoading) return <p>در حال محاسبه ...</p>;
  if (error)
    return toast.error(
      <div>
        خطا در محاسبه پیش فاکتور
        <span className="text-red-400">{error.message}</span>
      </div>
    );

  // const handleSubmit = async () => {
  // if (!data) return;
  // const result = await createInvoiceAndRedirect(data);
  // if (result?.success) {
  //   router.push(`/profile/${result.userId}`);
  // } else {
  //   toast.error("ثبت سفارش با خطا مواجه شد.");
  // }
  // };

  // بررسی دسترسی
  // انتقال به صفحه دیگر اگر دسترسی نباشد

  if (!accessCart) return null;

  return (
    <div className="mt-2 p-2 flex flex-col gap-4 w-full mb-[60px]" dir="rtl">
      {/* Tabs */}
      <Tabs defaultValue="pickup">
        <TabsList className="grid grid-cols-1 w-full">
          <TabsTrigger value="pickup">ادرس تحویل </TabsTrigger>
        </TabsList>

        <TabsContent value="pickup">
          <Card>
            <CardContent>
              <ProvinceCitySelect onChange={handleRegionChange} />
              <InputField
                label="شماره تلفن تحویل گیرنده"
                id="phone"
                placeholder={{
                  title: "09xxxxxxxxx or +989xxxxxxxxx",
                  active: true,
                }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {/* <Select onValueChange={(val) => setSelectedDesk(val)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="انتخاب میز" />
                </SelectTrigger>
                <SelectContent>
                  {desks.map((desk) => (
                    <SelectItem key={desk.key} value={desk.key}>
                      {desk.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* فاکتور */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="payment">
          <AccordionTrigger>جزئیات پرداخت</AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col bg-slate-100 gap-3 p-3 rounded-lg">
              {items?.map((product: CartItem) => (
                <Accordion type="single" collapsible key={product.clientSideId}>
                  <AccordionItem value={product.product.title}>
                    <AccordionTrigger>{product.product.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between">
                        <span>تعداد: {product.quantity}</span>
                        <span>
                          {(
                            product.unitPrice * product.quantity
                          ).toLocaleString()}{" "}
                          تومان
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          رنگ: {product.product.colorSelected?.color} (
                          {product.product.colorSelected?.model})
                        </span>
                      </div>
                      {/* <div className="text-sm text-gray-600">
                        {product.items?.map((item) => (
                          <div key={item.id}>+ {item.label}</div>
                        ))}
                        {product.addOns?.map((addon) => (
                          <div key={addon.id}>
                            + {addon.label} × {addon.quantity}
                          </div>
                        ))}
                      </div> */}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}

              <li className="flex justify-between">
                <span>جمع محصولات:</span>
                <span>{data?.data.totalReq.toLocaleString()} تومان</span>
              </li>
              <li className="flex justify-between">
                <span>بسته‌بندی:</span>
                <span>{data?.data.packaging.toLocaleString()} تومان</span>
              </li>
              <li className="flex justify-between">
                <span>مالیات:</span>
                <span>{data?.data.tax.toLocaleString()} تومان</span>
              </li>

              <li className="flex justify-between">
                <span>ارسال:</span>
                <span>{data?.data.posting.toLocaleString()} تومان</span>
              </li>

              <li className="flex justify-between font-bold">
                <span>مبلغ نهایی:</span>
                <span>{data?.data.total.toLocaleString()} تومان</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* توضیحات */}
      {/* <Input placeholder="توضیحات" /> */}

      {/* سابمیت */}
      <div className="flex justify-between items-center p-2 h-[80px] bg-red-400 mb-4">
        <Button
          disabled={isPending}
          onClick={() => startTransition(handleFinalizeOrder)}
          className=" flex-1 h-[90%] "
        >
          {isPending ? "در حال ثبت ..." : "ثبت سفارش"}
        </Button>
        <div className="flex flex-col w-[40%] h-full justify-center text-center">
          <span>قیمت کل</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>
      </div>
    </div>
  );
};

export default Cartpage;
