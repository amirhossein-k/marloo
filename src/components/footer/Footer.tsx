import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-gray-200 text-gray-700 pt-8 pb-6 px-4 sm:px-6 lg:px-8 xl:px-20 rounded-tr-md rounded-tl-md relative z-20 w-full"
      dir="rtl"
    >
      {/* بخش اصلی فوتر */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* درباره ما */}

        <div className="text-center sm:text-right">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">درباره ما</h3>
          <p className="text-sm leading-6 text-justify sm:text-right">
            ما یک فروشگاه آنلاین با ارائه بهترین محصولات با کیفیت بالا هستیم.
          </p>
        </div>
        {/* لینک‌های مفید */}

        <div className="text-center sm:text-right">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">لینک‌های مفید</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/profile"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                حساب کاربری
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                سفارشات من
              </Link>
            </li>
            <li>
              <Link
                href="/rules"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                قوانین و مقررات
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                سیاست حریم خصوصی
              </Link>
            </li>
          </ul>
        </div>
        {/* خدمات مشتریان */}

        <div className="text-center sm:text-right">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">خدمات مشتریان</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/faq"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                پرسش‌های متداول
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                تماس با ما
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                پیگیری سفارش
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors duration-200 block py-1"
              >
                بازگشت کالا
              </Link>
            </li>
          </ul>
        </div>
        {/* خبرنامه */}

        <div className="text-center sm:text-right lg:col-span-1">
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            عضویت در خبرنامه
          </h3>
          <p className="text-sm mb-4 text-justify sm:text-right">
            برای دریافت جدیدترین اخبار و تخفیف‌ها، ایمیل خود را وارد کنید:
          </p>
          <form className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-2 sm:space-x-reverse">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap text-sm font-medium"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>
      {/* بخش پایینی فوتر */}

      <div className="border-t border-gray-300 mt-6 lg:mt-8 pt-6 flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center text-sm text-gray-500">
        <p className="text-center lg:text-right order-2 lg:order-1">
          © 2025 فروشگاه ما. تمامی حقوق محفوظ است.
        </p>{" "}
        <div className="flex justify-center space-x-4 lg:space-x-6 order-1 lg:order-2">
          <Link
            href="#"
            className="hover:text-blue-600 transition-colors duration-200 text-lg"
            aria-label="فیس‌بوک"
          >
            <i className="fab fa-facebook-f"></i>
          </Link>
          <Link
            href="#"
            className="hover:text-blue-600 transition-colors duration-200 text-lg"
            aria-label="اینستاگرام"
          >
            {" "}
            <i className="fab fa-instagram"></i>
          </Link>
          <Link
            href="#"
            className="hover:text-blue-600 transition-colors duration-200 text-lg"
            aria-label="توییتر"
          >
            <i className="fab fa-twitter"></i>
          </Link>
          <Link
            href="#"
            className="hover:text-blue-600 transition-colors duration-200 text-lg"
            aria-label="تلگرام"
          >
            <i className="fab fa-telegram-plane"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
