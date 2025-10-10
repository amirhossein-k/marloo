"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("خطا در ارسال");

      setStatus("success");
      setFormData({ phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-10" dir="rtl">
      {/* 🔹 عنوان صفحه */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          تماس با ما
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          برای پرسش، پیشنهاد یا انتقاد خود می‌توانید از فرم زیر استفاده کنید یا
          از راه‌های ارتباطی زیر با ما در تماس باشید.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 🔹 اطلاعات تماس */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            اطلاعات تماس
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <span>info@yourstore.ir</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              <span>تهران، خیابان ولیعصر، نرسیده به پارک ساعی، پلاک ۲۵</span>
            </li>
          </ul>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              ما را در شبکه‌های اجتماعی دنبال کنید:
            </h3>
            <div className="flex gap-4 text-2xl text-gray-500">
              <a href="#" className="hover:text-pink-600">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaTelegramPlane />
              </a>
              <a href="#" className="hover:text-green-500">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* 🔹 نماد اعتماد */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              نماد اعتماد الکترونیکی:
            </h3>
            <div className="bg-gray-100 p-3 rounded-md w-fit shadow-inner">
              <div className="relative w-[100px] h-[100px]">
                <Image
                  src="https://c589564.parspack.net/c589564/uploads/qhab/download%20%281%29.jpg"
                  alt="نماد اعتماد"
                  fill
                  sizes="100px"
                  className="rounded-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 فرم تماس */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            فرم تماس با ما
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                شماره تماس
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="مثلاً 09123456789"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                متن درخواست یا پیام شما
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="درخواست یا پرسش خود را بنویسید..."
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full font-semibold py-2.5 rounded-md transition duration-200 text-white ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {status === "loading"
                ? "در حال ارسال..."
                : status === "success"
                ? "ارسال شد ✅"
                : "ارسال پیام"}
            </button>

            {status === "error" && (
              <p className="text-red-600 text-sm text-center">
                خطا در ارسال پیام. لطفاً دوباره تلاش کنید.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
