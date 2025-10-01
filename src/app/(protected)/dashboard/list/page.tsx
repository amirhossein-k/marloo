// src\app\(protected)\dashboard\list\page.tsx
"use server";
import React from "react";

import TablesProductsClient from "@/components/TabsProduct/Tables/TablesProductsClient";
import {
  GetProductDashboard,
  GetProductParams,
} from "@/app/actions/dashboard/GetProductListDashboard";
import type { Product } from "@/types";

interface SearchParams {
  page?: string;
  edit?: boolean;
}
export default async function Listpage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, edit } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const limit = 9;

  const { products, totalCount } = await GetProductDashboard({
    page: currentPage,
  } as GetProductParams);
  const totalPages = Math.ceil(totalCount / limit);
  console.log(totalPages);
  return (
    <div className="flex flex-col">
      <div className="title py-2 w-full font-bold text-lg text-center shadow-md">
        لیست محصولات
      </div>
      <div className="body w-full">
        <TablesProductsClient
          products={products as Product[]}
          edit={edit || false}
        />
      </div>
    </div>
  );
}
