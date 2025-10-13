"use client";
import NavLocation from "@/components/profile/navLocation/navLocation";
import { ProfileProvider } from "@/context/ProfileContext";
import { useWindowSizeProfile } from "@/hooks/sizeProfile";
import React, { useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { width } = useWindowSizeProfile();
  const isMobile = width && width < 1024;
  const [mobile, setMobile] = useState(false);

  return (
    <ProfileProvider>
      <div className="p-4" dir="rtl">
        {!isMobile ? (
          // desktop
          <>ee</>
        ) : (
          <>
            <NavLocation />
            {children}
          </>
        )}
      </div>
    </ProfileProvider>
  );
};

export default ProfileLayout;
