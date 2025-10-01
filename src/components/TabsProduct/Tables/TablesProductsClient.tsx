// components/TabsProduct/Tables/TablesProductsClient.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TablesProducts, { DashboardProduct } from "./TablesProducts";

import type { Product } from "@/types";
import ConfirmationModalDashboardList from "./ConfirmationModalListDashboard";

interface Props {
  products: Product[];
  edit: boolean;
}

export default function TablesProductsClient({ products, edit }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  console.log(edit, "editmode");
  const handleView = (p: DashboardProduct) => {
    router.push(`/products/${p.id}`);
  };
  const handleEdit = (p: DashboardProduct) => {
    router.push(`/dashboard/list?id=${p.id}&edit=true`);
    setShowModal(true);
  };
  const handleDelete = async (p: DashboardProduct) => {
    if (!confirm("آیا مطمئنید می‌خواهید این محصول را حذف کنید؟")) return;
    await fetch(`/api/dashboard/products/${p.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <TablesProducts
        products={products.map((p) => ({ ...p, count: p.count || 0 }))}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ConfirmationModalDashboardList
        products={products}
        isOpen={showModal}
        // onConfirm={() => {
        //   setShowModal(false);
        //   // handleLogout()
        // }}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
