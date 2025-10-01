"use client";
import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Product } from "@/types";
import Image from "next/image";

export interface DashboardProduct {
  id: string;
  title: string;
  price: number;
  count: number;
  countproduct: number;
  priceOffer?: number | null;
  published: boolean;
}

interface TablesProductsProps {
  products: Product[];
  onView: (p: DashboardProduct) => void;
  onEdit: (p: DashboardProduct) => void;
  onDelete: (p: DashboardProduct) => void;
}

export default function TablesProducts({
  products,
  onView,
  onEdit,
  onDelete,
}: TablesProductsProps) {
  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      { accessorKey: "title", header: "عنوان" },
      {
        accessorKey: "price",
        header: "قیمت (تومان)",
        cell: (info) => (info.getValue() as number).toLocaleString(),
      },
      { accessorKey: "countproduct", header: "موجودی" },
      // {
      //   accessorKey: "priceOffer",
      //   header: "تخفیف",
      //   cell: (info) => {
      //     const val = info.getValue() as number;
      //     return val > 0 ? val.toLocaleString() : "-";
      //   },
      // },
      {
        accessorKey: "productImage",
        header: "عکس ",
        cell: (info) => {
          const product = info.row.original; // فقط ردیف جاری
          const defaultImg =
            product.productImage.find((item) => item.defaultImage) ||
            product.productImage[0];

          return (
            <div className="relative rounded-xl overflow-hidden bg-slate-100 h-[100px] w-full flex justify-center items-center">
              {defaultImg?.childImage && (
                <Image
                  src={defaultImg.childImage}
                  alt={product.title}
                  title={product.title}
                  quality={100}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "published",
        header: "وضعیت",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs ${
              info.getValue()
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {info.getValue() ? "منتشر" : "پیش‌نویس"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex gap-2">
              <button onClick={() => onView(product)}>👁️</button>
              <button onClick={() => onEdit(product)}>✏️</button>
              <button onClick={() => onDelete(product)}>🗑️</button>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onDelete]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-2 border">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2 border text-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
