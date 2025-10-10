"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchProductNav({
  user,
}: {
  user?: { id: string; name?: string | null };
}) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<
    { id: string; title: string; price: number }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim().length > 1) {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search)}`);
      setShowDropdown(false);
    }
  };
  // فقط در صفحات اصلی و لیست محصولات نمایش بده
  // const shouldShow = pathname === "/" || pathname.startsWith("/products");
  // if (!shouldShow) return null;
  ////////
  // const hideOn = ["/login", "/register", "/cart"];
  // const shouldShow = !hideOn.includes(pathname);
  // if (!shouldShow) return null;
  return (
    <nav
      className="relative w-full flex items-center justify-between p-4 bg-gray-100 shadow"
      dir="rtl"
    >
      {/* سرچ */}
      <div className="relative w-64">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </form>

        {showDropdown && (
          <ul className="absolute top-10 left-0 right-0 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.id}`}
                    className="block px-3 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    {p.title} - {p.price.toLocaleString()} تومان
                  </Link>
                </li>
              ))
            ) : (
              // وقتی سرچ شده ولی نتیجه‌ای نیست
              <li className="px-3 py-2 text-gray-500">یافت نشد</li>
            )}
          </ul>
        )}
      </div>

      {/* سمت راست */}
      <div>
        {user ? (
          <span className="font-medium">سلام، {user.name || "کاربر"}</span>
        ) : (
          <Link
            href="/login"
            className="text-black hover:text-blue-700 hover:underline"
          >
            ورود
          </Link>
        )}
      </div>
    </nav>
  );
}
