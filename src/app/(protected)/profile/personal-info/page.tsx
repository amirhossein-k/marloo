// src\app\(protected)\profile\personal-info\page.tsx
"use client";
import DetailUser from "@/components/profile/detailUser/DetailUser";
import { useProfile } from "@/context/ProfileContext";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PersonalInfoPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { setPathnamee } = useProfile();
  const path = usePathname();
  useEffect(() => {
    setPathnamee(path);
  }, [path]);

  console.log(path, "path prosnal");
  useEffect(() => {
    // setPathnamee(path);
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  if (status === "loading") {
    return <div className="p-4 text-center">در حال بارگذاری اطلاعات...</div>;
  }
  // اگر session وجود ندارد
  if (!session?.user) return null;

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* ✅ نمایش جزئیات کاربر با استفاده از DetailUser */}
      <DetailUser user={session.user} />
    </div>
  );
};

export default PersonalInfoPage;
