// src\components\profile\detailUser\DetailUser.tsx
"use client";

import Link from "next/link";
import React from "react";
import { Session } from "next-auth";

interface DetailUserProps {
  user: Session["user"];
}

const DetailUser = ({ user }: DetailUserProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
      <h1 className="text-2xl font-bold mb-3">پروفایل کاربر</h1>
      <p className="text-gray-700">آیدی: {user?.id || "-"}</p>
      <p className="text-gray-700">ایمیل: {user?.email || "-"}</p>
      <p className="text-gray-700 mb-2">نام: {user?.name || "-"}</p>

      <div className="flex gap-3 mt-2">
        <Link
          href={`/profile/${user?.id}/address`}
          className="text-blue-600 hover:text-blue-800"
        >
          مشاهده آدرس‌ها
        </Link>
      </div>
    </div>
  );
};

export default DetailUser;
