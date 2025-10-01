// app/shop/layout.tsx
"use client";

import SpinnerLyout from "@/components/spinner/SpinnerLyout";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SpinnerLyout />
      {children}
    </>
  );
}
