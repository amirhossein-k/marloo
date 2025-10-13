// src\components\profile\navLocation\navLocation.tsx
"use client";
import { useLoading } from "@/context/LoadingContext";
import { useProfile } from "@/context/ProfileContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const NavLocation = () => {
  const router = useRouter();

  const { pathnamee } = useProfile();

  console.log(pathnamee, "path nav loaca");
  const cleanPathNum = pathnamee.indexOf("/", 1);
  console.log(cleanPathNum, "cleannum");
  const cleanPath = pathnamee.slice(cleanPathNum + 1);
  const { setIsLoading } = useLoading();

  let namePath = "";
  switch (cleanPath) {
    case "personal-info":
      namePath += "ddاطلاعات کاربری";
    default:
      namePath += "";
  }
  console.log(cleanPath, "cleanPath");
  const handlePush = (url: string) => {
    setIsLoading(true); // 👈 قبل از ناوبری
    startTransition(() => {
      router.push(url);
    });
  };
  return (
    <div
      className={`${
        cleanPath === "/profile" ? "hidden " : "flex"
      } items-center  gap-3 h-full `}
    >
      <h1 className="text-2xl font-bold  flex justify-center px-1  text-cente">
        {namePath}
      </h1>
      <Link
        className="text-3xl relative top-1 text-center px-1 flex justify-center hover:text-blue-300 "
        href={"/profile"}
        onClick={() => handlePush("/profile/personal-info")}
      >
        <FaArrowRightLong />
      </Link>
    </div>
  );
};

export default NavLocation;
