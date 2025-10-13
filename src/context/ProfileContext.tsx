"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface LoadingContextType {
  //   isLoading: boolean;
  setPathnamee: (value: string) => void;

  pathnamee: string;
}

const ProfileContext = createContext<LoadingContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //   const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const path = usePathname(); // 👈 مسیر فعلی را از Next بگیر
  const [pathnamee, setPathnamee] = useState<string>(path || ""); // 👈 مقدار اولیه از path

  useEffect(() => {
    // هر زمان مسیر تغییر کند، مقدار context را به‌روز کن
    setPathnamee(path);
  }, [path]);

  return (
    <ProfileContext.Provider
      value={{
        // isLoadingProduct,
        // setIsLoadingProduct,
        pathnamee,
        setPathnamee,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useLoading باید داخل ProfileProvider استفاده شود");
  }
  return context;
};
