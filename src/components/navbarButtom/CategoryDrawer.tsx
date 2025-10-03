// Drawer دسته‌بندی با زیرمجموعه
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

const categories: Category[] = [
  {
    id: 1,
    name: "موبایل",
    children: [
      { id: 11, name: "گوشی سامسونگ" },
      { id: 12, name: "گوشی اپل" },
      { id: 13, name: "گوشی شیائومی" },
    ],
  },
  {
    id: 2,
    name: "لپتاپ",
    children: [
      { id: 21, name: "لپتاپ ایسوس" },
      { id: 22, name: "لپتاپ لنوو" },
      { id: 23, name: "لپتاپ اپل" },
    ],
  },
  {
    id: 3,
    name: "پوشاک",
    children: [
      { id: 31, name: "مردانه" },
      { id: 32, name: "زنانه" },
      { id: 33, name: "بچگانه" },
    ],
  },
];

export function CategoryDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* پس‌زمینه */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* کشو */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-80 max-w-[90%] h-full bg-white z-50 shadow-xl p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">دسته‌بندی‌ها</h2>
              <button onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className="flex justify-between w-full text-right font-medium hover:text-purple-600"
                    onClick={() =>
                      setExpanded(expanded === cat.id ? null : cat.id)
                    }
                  >
                    {cat.name}
                    {cat.children && (
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          expanded === cat.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* زیر مجموعه */}
                  <AnimatePresence>
                    {expanded === cat.id && cat.children && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 pr-2 mt-2 space-y-2 text-gray-600 text-sm"
                      >
                        {cat.children.map((child) => (
                          <li
                            key={child.id}
                            className="cursor-pointer hover:text-purple-500"
                          >
                            {child.name}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
