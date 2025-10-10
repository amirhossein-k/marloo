// src\app\(public)\rules\page.tsx
"use client";

import React from "react";

export default function RulesPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 md:px-10" dir="rtl">
      {/* عنوان صفحه */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          قوانین و مقررات فروشگاه
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          لطفاً قبل از استفاده از خدمات فروشگاه، این قوانین را با دقت مطالعه
          کنید.
        </p>
      </div>

      {/* محتوای کارت */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="space-y-8 leading-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۱. مقدمه
            </h2>
            <p>
              استفاده شما از این وب‌سایت به منزله پذیرش تمامی قوانین و مقررات
              زیر می‌باشد. لطفاً پیش از استفاده از خدمات، تمامی مفاد زیر را به
              دقت مطالعه فرمایید.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۲. ثبت سفارش و خرید
            </h2>
            <ul className="list-disc pr-5 space-y-2">
              <li>
                کاربران موظف هستند هنگام ثبت سفارش اطلاعات صحیح و کامل خود را
                وارد نمایند.
              </li>
              <li>
                در صورت بروز خطا در اطلاعات، فروشگاه مسئولیتی در قبال ارسال
                نادرست کالا نخواهد داشت.
              </li>
              <li>
                سفارش تنها پس از تأیید پرداخت و صدور فاکتور نهایی معتبر است.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۳. ارسال و تحویل کالا
            </h2>
            <p>
              زمان و نحوه ارسال سفارش‌ها بر اساس نوع محصول و مقصد متفاوت است.
              فروشگاه متعهد است کالاها را در کوتاه‌ترین زمان ممکن به دست مشتری
              برساند.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۴. بازگشت و تعویض کالا
            </h2>
            <p>
              در صورت وجود ایراد فنی یا مغایرت در کالای دریافتی، مشتری تا ۴۸
              ساعت پس از تحویل می‌تواند موضوع را به پشتیبانی اطلاع دهد تا مراحل
              بازگشت یا تعویض انجام شود.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۵. حقوق مالکیت معنوی
            </h2>
            <p>
              تمامی محتوا، تصاویر، لوگوها و طراحی‌های موجود در سایت متعلق به
              فروشگاه بوده و هرگونه استفاده‌ی غیرمجاز پیگرد قانونی دارد.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۶. تغییر در قوانین
            </h2>
            <p>
              فروشگاه مجاز است در هر زمان قوانین خود را تغییر دهد. نسخه‌ی
              به‌روزشده در همین صفحه منتشر خواهد شد و کاربران موظف به مطالعه‌ی
              آن هستند.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              ۷. ارتباط با ما
            </h2>
            <p>
              در صورت وجود هرگونه سؤال یا ابهام، می‌توانید از طریق صفحه{" "}
              <a
                href="/contact"
                className="text-blue-700 hover:text-blue-900 font-semibold"
              >
                تماس با ما
              </a>{" "}
              اقدام نمایید.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
