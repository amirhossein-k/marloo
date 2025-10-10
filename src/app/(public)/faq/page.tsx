// src\app\(public)\faq\page.tsx
"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "چطور می‌توانم سفارشم را ثبت کنم؟",
    answer:
      "برای ثبت سفارش، ابتدا محصول مورد نظر خود را انتخاب کرده و آن را به سبد خرید اضافه کنید. سپس وارد صفحه پرداخت شده و اطلاعات خود را تکمیل نمایید.",
  },
  {
    question: "زمان تحویل سفارش چقدر است؟",
    answer:
      "سفارش‌ها معمولاً بین ۲ تا ۵ روز کاری بسته به شهر مقصد ارسال می‌شوند. برای شهرستان‌ها ممکن است زمان بیشتری نیاز باشد.",
  },
  {
    question: "آیا می‌توانم کالای خریداری شده را مرجوع کنم؟",
    answer:
      "بله، در صورت وجود ایراد فنی یا مغایرت با مشخصات، تا ۷ روز پس از دریافت می‌توانید کالا را بازگردانید. لطفاً با پشتیبانی تماس بگیرید.",
  },
  {
    question: "روش‌های پرداخت در فروشگاه چگونه است؟",
    answer:
      "شما می‌توانید از طریق درگاه امن بانکی و یا پرداخت در محل (در برخی شهرها) هزینه سفارش خود را پرداخت نمایید.",
  },
  {
    question: "چگونه از وضعیت سفارش خود مطلع شوم؟",
    answer:
      "پس از ثبت سفارش، یک پیامک و ایمیل حاوی کد پیگیری برای شما ارسال می‌شود. همچنین می‌توانید در بخش «سفارشات من» وضعیت سفارش خود را مشاهده کنید.",
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 md:px-10" dir="rtl">
      {/* 🔹 عنوان صفحه */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          پرسش‌های متداول
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          در این بخش پاسخ متداول‌ترین پرسش‌های شما درباره خدمات و خرید آورده شده
          است.
        </p>
      </div>

      {/* 🔹 لیست پرسش‌ها */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="divide-y divide-gray-200">
          {faqData.map((item, index) => (
            <div key={index} className="py-4">
              {/* عنوان آکاردئون */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center text-right focus:outline-none"
              >
                <span className="text-gray-800 font-medium text-base md:text-lg">
                  {item.question}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* محتوای آکاردئون */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  activeIndex === index ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 text-sm md:text-base leading-7 pr-2">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
