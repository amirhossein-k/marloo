"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenOrder } from "@/store/orderSlice";
import { RootState } from "@/store";

const CartWatcher = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { OpenCart } = useSelector((state: RootState) => state.orderShop);

  useEffect(() => {
    if (OpenCart) {
      // هر بار که مسیر عوض شد و سبد باز بود → ببندش
      dispatch(setOpenOrder(false));
    }
  }, [pathname, OpenCart, dispatch]);

  return null;
};

export default CartWatcher;
