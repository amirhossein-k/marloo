// src/components/Cart.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CartItem, setAccessCart, setCartFromDB } from "@/store/orderSlice";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import {
  updateItemQuantity,
  removeItem,
  setCartOpen,
  clearCart,
} from "@/store/orderSlice";
// ✅ ایمپورت تابع نهایی‌سازی سفارش
import { finalizeOrder, updateCartItem } from "@/app/actions/order/order";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, FetchOrders } from "@/app/actions/order/order";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ColorDisplay from "../Colors/ColorDisplay";

// استایل‌های CSS برای کارت لودینگ
const loadingStyles = `
  .loading-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid #ccc;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CartSideBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ اتصال به state جدید Redux
  const { items, totalPrice, OpenCart } = useSelector(
    (state: RootState) => state.orderShop
  );

  // Mutation for updating cart on server
  const updateCartMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      toast.success("تغییرات سبد خرید با موفقیت اعمال شد.");
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error("خطا در به‌روزرسانی سبد خرید: " + (error as any)?.message);
    },
  });
  // Fetch cart from DB
  // برای فچ کردن داده‌های سبد خرید از سرور با استفاده از
  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => FetchOrders(),
    enabled: OpenCart && !!session, // فقط وقتی سبد بازه و کاربر لاگین کرده, // فقط وقتی سبد بازه
    refetchInterval: 5 * 60 * 1000, // هر ۵ دقیقه یکبار sync
    refetchOnWindowFocus: false, // بهتر است این آپشن را اضافه کنید تا بعد از اولین fetch موفق، دیگر خودکار اجرا نشود.
  });

  // وقتی isSuccess و data?.data وجود داشته باشد، داده‌های دریافت‌شده از
  // FetchOrders() به فرمت CartItem تبدیل شده و با setCartFromDB به Redux آپدیت می‌شود
  // اگر data خالی باشد یا خطایی رخ دهد، این بخش اجرا نمی‌شود.
  useEffect(() => {
    if (isSuccess && data?.data) {
      // map کردن محصولات از PurchaseOrderItem به CartItem
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cartItems: CartItem[] = data.data?.items?.map((item: any) => {
        const selectedColor = item.product?.colors?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c.id === item.colorsSelect
        );
        return {
          clientSideId: `${item.productId}-${item.colorsSelect}`,
          product: {
            id: item.product.id,
            title: item.product.title,
            priceWithProfit: item.product.priceWithProfit,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            image: item.product.productImage?.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (img: any) => img.defaultImage
            )?.childImage,
            priceOffer: item.product.priceOffer,
            colorSelected: selectedColor, // 👈 اضافه شد
          },
          quantity: item.quantity,
          colorsSelect: item.colorsSelect ?? "",
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        };
      });
      // فقط در صورتی که آیتم‌هایی از دیتابیس آمده باشد، Redux را آپدیت کن

      if (cartItems.length > 0) {
        dispatch(setCartFromDB(cartItems));
      }
    }
  }, [isSuccess, data, dispatch]);
  console.log(data, "data");
  // اگر session وجود نداشته باشد و OpenCart فعال باشد، سبد خرید خالی شده و پیام خطا نمایش داده می‌شود.
  useEffect(() => {
    if (!session && OpenCart) {
      dispatch(setCartFromDB([]));
      setErrorMessage("لطفا وارد حساب کاربر شوید");
    } else {
      // وقتی لاگین کرده یا سبد بسته شد، پیام خطا رو پاک کن
      setErrorMessage("");
    }
  }, [session, OpenCart, dispatch]);

  // 📌 نمایش خطاهای غیرمنتظره
  useEffect(() => {
    if (isError && error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.message || "خطا در بارگذاری سبد خرید");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrorMessage((error as any)?.message || "");
    }
  }, [isError, error]);

  // ✅ توابع جدید مستقیماً اکشن‌های Redux را dispatch می‌کنند
  const handleQuantityChange = (clientSideId: string, quantity: number) => {
    if (quantity < 1) return;
    const item = items.find((i) => i.clientSideId === clientSideId);
    if (item) {
      dispatch(updateItemQuantity({ clientSideId, quantity }));
      updateCartMutation.mutate({ clientSideId, quantity });
    }
  };

  const handleRemoveItem = async (clientSideId: string) => {
    try {
      // ابتدا در DB حذف شود
      await updateCartMutation.mutateAsync({ clientSideId, quantity: 0 });

      // بعد Redux را آپدیت کن
      dispatch(removeItem({ clientSideId }));

      // دوباره سبد خرید را از DB fetch کن تا sync شود
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success("آیتم با موفقیت حذف شد");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("حذف آیتم انجام نشد: " + error.message);
    }
  };

  const handleFinalizeOrder = () => {
    // بررسی ورود کاربر و خالی نبودن سبد خرید.
    if (!session) {
      toast.error("ابتدا وارد حساب کاربری شوید");
      return;
    }
    if (items.length === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }
    // 1️⃣ دسترسی را فعال می‌کنیم
    dispatch(setAccessCart(true));
    // 2️⃣ بستن سایدبار
    dispatch(setCartOpen(false));
    // dispatch(clearCart()); // پاک کردن سبد خرید در Redux
    // dispatch(setCartOpen(false));
    router.push(`/profile/cart`); // انتقال به صفحه سفارش
  };

  console.log(data, "data");

  // 👇 این محاسبه را اضافه کنید
  const totalSavings = items.reduce((acc, item) => {
    const originalItemPrice = item.product.priceWithProfit;
    // اگر تخفیفی وجود داشته باشد، مقدار سود این آیتم را محاسبه کن
    if (item.unitPrice < originalItemPrice) {
      return acc + (originalItemPrice - item.unitPrice) * item.quantity;
    }
    return acc;
  }, 0);

  // نمایش لودینگ
  if (isLoading) {
    return (
      <div className="w-full fixed top-0 z-50 md:w-96 bg-white shadow-lg rounded-xl flex flex-col h-full">
        <p className="p-4 text-center">در حال بارگذاری...</p>
      </div>
    );
  }
  return OpenCart ? (
    <div
      className="w-full fixed top-0 left-0 z-50 md:w-96 bg-white shadow-lg rounded-xl flex flex-col h-full"
      // dir="rtl"
    >
      <style>{loadingStyles}</style> {/* تزریق استایل‌ها */}
      {/* هدر */}
      <div className="flex relative justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Cart</h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500 hover:text-red-700"
        >
          Clear
        </button>
        <X
          className="absolute top-0 right-0 bg-red-300"
          onClick={() => dispatch(setCartOpen(false))}
        />
      </div>
      {/* نمایش پیام لودینگ هنگام به‌روزرسانی */}
      {updateCartMutation.isPending && (
        <div className="p-4 text-center text-yellow-600 bg-yellow-100">
          در حال به‌روزرسانی سبد خرید...
        </div>
      )}
      {/* لیست محصولات */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-gray-500 text-center">سبد خرید خالی است</p>
            <p>{errorMessage}</p>
            {errorMessage.length > 0 && (
              <Link
                href={"/login"}
                className="text-blue-600 hover:text-black "
                // onClick={() =>}
              >
                ورود سریع
              </Link>
            )}
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.clientSideId}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            {/* تصویر */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs">
                    بدون تصویر
                  </div>
                )}
              </div>
              <div className="price_color flex flex-col gap-2 ">
                <p className="font-medium text-sm" dir="rtl">
                  {item.product.title}
                </p>
                {/* بخش جدید نمایش قیمت */}
                <div className="price flex items-center gap-2 my-1 text-xs">
                  {item.product.priceOffer && item.product.priceOffer > 0 ? (
                    <>
                      {/* قیمت اصلی با خط خوردگی */}
                      <del className="text-gray-400 text-[13px]">
                        {item.product.priceWithProfit.toLocaleString()} تومان
                      </del>
                      {/* قیمت با تخفیف */}
                      <span className="text-green-600 font-bold text-[15px]">
                        {item.unitPrice.toLocaleString()} توما
                      </span>
                      {/* برچسب درصد تخفیف */}
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {item.product.priceOffer}%
                      </span>
                    </>
                  ) : (
                    // اگر تخفیف نبود، فقط قیمت اصلی
                    <span className="text-gray-500 font-bold">
                      {item.unitPrice.toLocaleString()} تومان
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  مجموع:{" "}
                  <span className="font-semibold">
                    {item.totalPrice.toLocaleString()} تومان
                  </span>
                </p>
                {/* <p className="text-xs text-gray-400">
             
                  رنگ: {item.product.colorSelected?.color} (
                  {item.product.colorSelected?.model})
                </p> */}
                <ColorDisplay
                  color={item.product.colorSelected?.color}
                  model={item.product.colorSelected?.model}
                />
              </div>
            </div>

            {/* کنترل تعداد */}
            <div className="flex items-center gap-2">
              <button
                className="p-1 bg-gray-200 rounded disabled:opacity-50"
                disabled={updateCartMutation.isPending} // ⛔ غیر فعال در حال پردازش
                onClick={() =>
                  handleQuantityChange(item.clientSideId, item.quantity - 1)
                }
              >
                <FaMinus size={12} />
              </button>
              <span className="px-2">{item.quantity}</span>
              <button
                className="p-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() =>
                  handleQuantityChange(item.clientSideId, item.quantity + 1)
                }
                disabled={updateCartMutation.isPending} // ⛔ غیر فعال در حال پردازش
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* حذف */}
            <button
              className="text-red-500 hover:text-red-700 disabled:opacity-50 mx-2"
              onClick={() => handleRemoveItem(item.clientSideId)}
              disabled={updateCartMutation.isPending} // ⛔ غیر فعال در حال پردازش
            >
              <MdDelete size={18} />
            </button>
          </div>
        ))}
      </div>
      {/* فوتر */}
      <div className="p-4 border-t space-y-3">
        {totalSavings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>مجموع سود شما از تخفیف‌ها</span>
            <span>{totalSavings.toLocaleString()} تومان</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg">
          <span>مبلغ نهایی قابل پرداخت</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>

        <button
          onClick={handleFinalizeOrder}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2"
        >
          ثبت نهایی خرید
        </button>
      </div>
    </div>
  ) : null;
};

export default CartSideBar;
