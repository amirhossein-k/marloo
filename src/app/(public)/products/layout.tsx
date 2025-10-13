// app/shop/layout.tsx
"use client";

import SpinnerLyout from "@/components/spinner/SpinnerLyout";
import { useLoading } from "@/context/LoadingContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useLoading();
  // اگر هنوز width مقدار نگرفته (مثلاً در SSR)، چیزی رندر نکن
  if (width === null || width === undefined) return null;

  return (
    <>
      {width < 768 ? (
        <>
          <SpinnerLyout />
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
