import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Hash, Tag, Check, AlertCircle } from "lucide-react";

// Responsive, elegant form with three fields: Color, Quantity, Model
// - Tailwind CSS for styling
// - Framer Motion for subtle animations
// - Form validation with inline hints
// - Color chips with keyboard support
// - Fully responsive (mobile → desktop)

const presetColors = [
  { name: "قرمز", value: "#ef4444" },
  { name: "آبی", value: "#3b82f6" },
  { name: "سبز", value: "#22c55e" },
  { name: "زرد", value: "#eab308" },
  { name: "مشکی", value: "#111827" },
  { name: "سفید", value: "#f3f4f6" },
];
interface ColorFormProps {
  onAdd: (color: string, inventory: number, model: string) => void;
}
export default function ColorQuantityModelForm({ onAdd }: ColorFormProps) {
  const [colorName, setColorName] = useState<string>("");
  const [colorHex, setColorHex] = useState<string>("");
  const [inventory, setInventory] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!colorName && !colorHex) e.color = "یک رنگ انتخاب یا وارد کنید";

    if (!inventory) e.quantity = "تعداد را وارد کنید";
    else if (!/^\d+$/.test(inventory)) e.quantity = "فقط عدد صحیح";
    else if (parseInt(inventory, 10) < 0) e.quantity = "عدد منفی مجاز نیست";

    if (!model) e.model = "نام مدل را وارد کنید";
    return e;
  }, [colorName, colorHex, inventory, model]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ color: true, quantity: true, model: true });
    if (!isValid) return;

    const payload = {
      color: colorName || colorHex,
      quantity: parseInt(inventory, 10),
      model,
    };
    onAdd(payload.color, payload.quantity, payload.model);

    // 🔁 Replace this with your API call
    console.log("Submitting:", payload);
    alert(
      `ثبت شد:\nرنگ: ${payload.color}\nتعداد: ${payload.quantity}\nمدل: ${payload.model}`
    );

    // Optional: reset form
    setColorName("");
    setColorHex("");
    setInventory("");
    setModel("");
    setSubmitted(false);
    setTouched({});
  };

  const ColorChip = ({ name, value }: { name: string; value: string }) => {
    const active = colorName === name;
    return (
      <button
        type="button"
        onClick={() => {
          setColorName(name);
          setColorHex(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setColorName(name);
            setColorHex(value);
          }
        }}
        aria-pressed={active}
        className={`group relative inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          active
            ? "border-blue-600 ring-0 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
      >
        <span
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: value, borderColor: "#e5e7eb" }}
        />
        <span className="font-medium">{name}</span>
        {active && <Check className="h-4 w-4 text-blue-600" />}
      </button>
    );
  };

  return (
    <div className="min-h-[60vh] w-full bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-800">
              ثبت رنگ، تعداد و مدل
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              فرم ریسپانسیو با طراحی مدرن
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Color field */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Palette className="h-4 w-4" /> رنگ
            </label>

            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <ColorChip key={c.name} name={c.name} value={c.value} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, color: true }))}
                  placeholder="مثال: قرمز یاقوتی"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    touched.color && errors.color
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <Tag className="h-4 w-4" />
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, color: true }))}
                  placeholder="#RRGGBB (اختیاری)"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    touched.color && errors.color
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <Palette className="h-4 w-4" />
                </span>
              </div>
            </div>
            {touched.color && errors.color && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-4 w-4" /> {errors.color}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Hash className="h-4 w-4" /> تعداد
            </label>
            <div className="relative max-w-xs">
              <input
                type="number"
                min={0}
                step={1}
                value={inventory}
                onChange={(e) =>
                  setInventory(e.target.value.replace(/[^\d]/g, ""))
                }
                onBlur={() => setTouched((t) => ({ ...t, quantity: true }))}
                placeholder="مثال: 12"
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                  touched.quantity && errors.quantity
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              />
            </div>
            {touched.quantity && errors.quantity && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-4 w-4" /> {errors.quantity}
              </div>
            )}
          </div>

          {/* Model */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Tag className="h-4 w-4" /> مدل
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, model: true }))}
              placeholder="مثال: عروسک / سایز ۱۲ / A56"
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                touched.model && errors.model
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />
            {touched.model && errors.model && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-4 w-4" /> {errors.model}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              با فشردن دکمه ثبت، اطلاعات شما جهت پردازش ارسال می‌شود.
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isValid && submitted}
            >
              ثبت اطلاعات
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
