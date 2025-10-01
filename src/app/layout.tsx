// src\app\layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// ✅ ADD THESE THREE LINES HERE
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Providers from "./Providers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
// import NavbarComponents from "@/components/navbar/NavbarComponents";
import { LoadingProvider } from "@/context/LoadingContext";
import LoadingOverlay from "@/components/product/LoadingOverlay";
import NavbarButtom from "@/components/navbarButtom/NavbarButtom";
import CartSideBar from "@/components/cart/CartSideBar";
import CartWatcher from "@/components/cart/CartWatcher";
import Sidebar from "@/components/Sidebar/Sidebar";
import NavbarComponents from "@/components/navbar/NavbarComponents";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "فروشگاه آنلاین",
    template: "%s | فروشگاه آنلاین",
  },
  description: "بهترین تجربه خرید اینترنتی با قیمت مناسب",
  metadataBase: new URL("https://example.com"), // آدرس دامنه اصلی
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "فروشگاه آنلاین",
  },
};

const queryClient = new QueryClient();
const dehydratedState = dehydrate(queryClient);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          <LoadingProvider>
            <LoadingOverlay />
            <Toaster position="top-center" />
            <NavbarComponents />
            <CartSideBar />
            <div className="w-fit absolute right-0 top-0" dir="rtl">
              <Sidebar />
            </div>

            {/* تغییر اینجا 👇 */}
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
              <footer>
                <Footer />
              </footer>
            </div>

            <NavbarButtom />
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
