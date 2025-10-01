// SearchSite.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

type Product = {
  name: string | null;
  price: string | null;
};

function parsePersianPrice(price: string | null) {
  if (!price) return 0;
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let result = "";
  for (const char of price) {
    const index = persianNumbers.indexOf(char);
    result += index >= 0 ? englishNumbers[index] : char;
  }
  return Number(result.replace(/,/g, "")) || 0;
}

interface SearchSiteProps {
  site: string;
  filterItem: string;
}

export default function SearchSite({ site, filterItem }: SearchSiteProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  console.log(site, "sie");
  // Fetch محصولات هر بار که site تغییر کند
  useEffect(() => {
    if (!site) return;

    setLoading(true);
    async function fetchProducts() {
      try {
        const res = await fetch("/api/searchSite/scrape-digikala", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site }),
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [site]);

  // فیلتر reactive
  useEffect(() => {
    setColumnFilters(filterItem ? [{ id: "name", value: filterItem }] : []);
  }, [filterItem]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: "نام محصول",
        accessorKey: "name",
        cell: (info) => info.getValue() || "نامشخص",
      },
      {
        header: "قیمت",
        accessorKey: "price",
        cell: (info) => info.getValue() || "قیمت نامشخص",
        sortingFn: (rowA, rowB, columnId) => {
          const numA = parsePersianPrice(
            rowA.getValue(columnId)?.toString() || ""
          );
          const numB = parsePersianPrice(
            rowB.getValue(columnId)?.toString() || ""
          );
          return numA - numB;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading)
    return <p className="text-center mt-10">در حال بارگذاری محصولات...</p>;
  if (!products.length)
    return <p className="text-center mt-10">هیچ محصولی یافت نشد.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">محصولات</h1>
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: "🔼",
                        desc: "🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
