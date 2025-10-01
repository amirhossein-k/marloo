// ProductsPage.tsx
"use client";

import SearchSite from "@/components/SearchSite/SearchSite";
import { makeDigikalaSearchUrl } from "@/utils/Other";
import { useState } from "react";

export default function ProductsPage() {
  const [site, setSite] = useState("");
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <label>آدرس سایت:</label>
        <input
          placeholder="ادرس سایت ..."
          value={query}
          onChange={(e) => {
            const q = e.target.value;
            setQuery(q);
            setSite(makeDigikalaSearchUrl(q));
          }}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>کلمه کلیدی فیلتر اسم:</label>
        <input
          placeholder="کلمه..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <SearchSite site={site} filterItem={filter} />
    </div>
  );
}
