"use client";

import { Truck, Headphones, RotateCcw, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10 text-blue-600" />,
    title: "ارسال رایگان",
    desc: "ارسال رایگان برای تمام سفارش‌های داخل ایران یا سفارش‌های بالای ۲ میلیون تومان",
  },
  {
    icon: <Headphones className="w-10 h-10 text-blue-600" />,
    title: "پشتیبانی ۲۴ ساعته",
    desc: "ارتباط با ما به صورت شبانه‌روزی، ۷ روز هفته",
  },
  {
    icon: <RotateCcw className="w-10 h-10 text-blue-600" />,
    title: "بازگشت ۳۰ روزه",
    desc: "امکان بازگشت کالا تا ۳۰ روز برای تعویض یا استرداد",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
    title: "پرداخت امن",
    desc: "پرداخت آنلاین امن و مطمئن با پشتیبانی ۲۴ ساعته",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
