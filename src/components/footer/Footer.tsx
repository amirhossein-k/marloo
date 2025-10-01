import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 pt-10 pb-6 px-4 md:px-20 rounded-tr-md rounded-tl-md" dir="rtl">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div>
      <h3 className="text-lg font-semibold mb-4">درباره ما</h3>
      <p className="text-sm leading-6">
        ما یک فروشگاه آنلاین با ارائه بهترین محصولات با کیفیت بالا هستیم.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">لینک‌های مفید</h3>
      <ul className="space-y-2 text-sm">
        <li><Link href="#" className="hover:text-blue-600">حساب کاربری</Link></li>
        <li><Link href="#" className="hover:text-blue-600">سفارشات من</Link></li>
        <li><Link href="#" className="hover:text-blue-600">قوانین و مقررات</Link></li>
        <li><Link href="#" className="hover:text-blue-600">سیاست حریم خصوصی</Link></li>
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">خدمات مشتریان</h3>
      <ul className="space-y-2 text-sm">
        <li><Link href="#" className="hover:text-blue-600">پرسش‌های متداول</Link></li>
        <li><Link href="#" className="hover:text-blue-600">تماس با ما</Link></li>
        <li><Link href="#" className="hover:text-blue-600">پیگیری سفارش</Link></li>
        <li><Link href="#" className="hover:text-blue-600">بازگشت کالا</Link></li>
      </ul>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">عضویت در خبرنامه</h3>
      <p className="text-sm mb-4">برای دریافت جدیدترین اخبار و تخفیف‌ها، ایمیل خود را وارد کنید:</p>
      <form className="flex flex-col sm:flex-row items-center">
        <input type="email" placeholder="ایمیل شما" className="w-full sm:w-auto flex-1 p-2 border border-gray-300 rounded mb-2 sm:mb-0 sm:mr-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">عضویت</button>
      </form>
    </div>
  </div>

  <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
    <p>© 2025 فروشگاه ما. تمامی حقوق محفوظ است.</p>
    <div className="flex space-x-4 mt-4 md:mt-0">
      <Link href="#" className="hover:text-blue-600"><i className="fab fa-facebook-f"></i></Link>
      <Link href="#" className="hover:text-blue-600"><i className="fab fa-instagram"></i></Link>
      <Link href="#" className="hover:text-blue-600"><i className="fab fa-twitter"></i></Link>
      <Link href="#" className="hover:text-blue-600"><i className="fab fa-telegram-plane"></i></Link>
    </div>
  </div>
</footer>

  );
};

export default Footer;
