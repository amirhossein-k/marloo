"use client";
import { RootState } from "@/store";
import { usePathname, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartOpen } from "@/store/orderSlice";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isLoadingProduct: boolean;
  setIsLoadingProduct: (value: boolean) => void;
  pathnamee: string;
}

// اینترفیس تغییر می‌کند تا تابع startTransition را شامل شود
// interface LoadingContextType {
//   isLoadingProduct: boolean;
//   startLoadingTransition: (callback: () => void) => void; // تابع جدید برای شروع ناوبری
//   isLoading: boolean;
//   pathnamee: string;
// }

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [pathnamee, setPathnamee] = useState<string>("");
  const { OpenCart } = useSelector((state: RootState) => state.orderShop);
  const dispatch = useDispatch();
  const searchParams = useSearchParams(); // 👈 قلاب جدید برای خواندن پارامترها

  // const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  // useEffect(() => {
  //   setPathnamee(pathname);
  // }, [pathname]);

  useEffect(() => {
    setPathnamee(pathname);
    // 👇=============== راه‌حل اینجاست ===============👇
    // هر زمان که مسیر URL تغییر کرد، یعنی صفحه جدید با موفقیت لود شده است.
    // پس لودینگ را خاموش می‌کنیم.
    setIsLoadingProduct(false);
    // 👆============================================👆

    // این منطق هم برای بستن سبد خرید هنگام تغییر صفحه، درست است و باقی می‌ماند
    if (OpenCart) {
      dispatch(setCartOpen(false));
    }
  }, [pathname, dispatch, searchParams]);

  // const value = {
  //   isLoadingProduct: isPending, // 👈 وضعیت لودینگ مستقیماً از isPending گرفته می‌شود
  //   startLoadingTransition: startTransition, // 👈 تابع startTransition را به اشتراک می‌گذاریم
  //   pathnamee,
  //   isLoading: isPending,
  // };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLoadingProduct,
        setIsLoadingProduct,
        pathnamee,
      }}
      // value={value}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading باید داخل LoadingProvider استفاده شود");
  }
  return context;
};
