"use client";

import { sendOtpAction } from "@/app/actions/auth/send-otp";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";

const Loginpage = () => {
  const pathname = usePathname();
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const [phone, setPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  // valid phoneNumber
  const validPhone = (phone: string) => {
    const phoneReg = /^(\+98|0)?9\d{9}$/;
    return phoneReg.test(phone);
  };

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 500); // یه تأخیر کوچیک برای دیده شدن

    return () => clearTimeout(timeout);
  }, [pathname]);

  const sendOtpMutation = useMutation({
    onMutate: () => {
      NProgress.start();
    },
    mutationFn: async () => sendOtpAction(phone),

    onSuccess: () => {
      NProgress.done();

      setStep("otp");
    },
    onError: (error: Error) => {
      NProgress.done();

      toast.error(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      NProgress.start();

      const result = await signIn("phone-otp", {
        redirect: false,
        phone,
        otp,
        name: name || undefined,
        callbackUrl: "/dashboard",
      });
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      NProgress.done();

      window.location.href = "/dashboard";
    },
    onError: (error: Error) => {
      NProgress.done();

      toast.error(error.message);
    },
  });

  return (
    <div className="shadow my-2 bg-gray-200 p-2" dir="rtl">
      {step === "phone" && (
        <div className=" flex flex-col gap-3 px-2">
          <h2>ورود یا ثبت نام با شماره</h2>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="09xxxxxxxxx or +989xxxxxxxxx"
            className="border-2 p-2 w-full border-blue-400 rounded-md my-2"
          />
          <button
            onClick={() => sendOtpMutation.mutate()}
            disabled={sendOtpMutation.isPending}
            className="bg-blue-500 text-white px-4 py-2 w-full cursor-pointer hover:bg-blue-700"
          >
            {sendOtpMutation.isPending ? "در حال ارسال..." : "ارسال کد"}
          </button>
        </div>
      )}
      {step === "otp" && (
        <>
          <h2>کد دریافتی را وارد کنید</h2>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="کد..."
            className="border-2 p-2 w-full border-blue-400 rounded-md my-2  "
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام (فقط برای ثبت‌نام جدید)"
            className="border-2 p-2 w-full border-blue-400 rounded-md my-2"
          />
          <button
            onClick={() => loginMutation.mutate()}
            disabled={loginMutation.isPending}
            className="bg-green-500 text-white px-4 py-2 w-full"
          >
            {loginMutation.isPending ? "در حال ورود..." : "ورود"}
          </button>
          {loginMutation.error && (
            <p className="text-red-500 text-sm mt-2">
              {(loginMutation.error as Error).message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Loginpage;
