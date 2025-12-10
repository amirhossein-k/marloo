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
    default: "فروشگاه آنلاین | خرید با بهترین قیمت",
    template: "%s | فروشگاه آنلاین",
  },
  description:
    "خرید آنلاین محصولات با بهترین قیمت و تخفیف ویژه. موبایل، لوازم خانه، لوازم دکوری و بیشتر.",
  metadataBase: new URL("https://marlooshop.vercel.app"), // آدرس دامنه اصلی
  // Faviconها
  icons: {
    icon: "/favicon.ico", // همه مرورگرها
    shortcut: "/favicon-16x16.png", // مرورگرهای قدیمی
    apple: "/apple-touch-icon.png", // iOS Home Screen
  },
  // Robots اصلی
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "فروشگاه آنلاین",
    title: {
      default: "فروشگاه آنلاین | خرید با بهترین قیمت",
      template: "%s | فروشگاه آنلاین",
    },
    description: "خرید آنلاین محصولات با بهترین قیمت و تخفیف ویژه.",
    images: [
      {
        url: "/og-image.jpg", // تصویر OG اصلی (1200x630)
        width: 1200,
        height: 630,
        alt: "فروشگاه آنلاین مارلو شاپ - خرید آنلاین",
      },
    ],
    emails: ["info@marlooshop.com"], // ایمیل تماس
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
    <html lang="fa" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  overflow-x-hidden`}
      >
        <Providers>
          <LoadingProvider>
            <LoadingOverlay />
            <Toaster position="top-center" />

            {/* ساختار اصلی */}
            <div className="flex flex-col min-h-screen w-full  overflow-x-hidden">
              {/* هدر و ناوبری */}
              <NavbarComponents />
              <NavbarButtom /> {/* انتقال به اینجا */}
              {/* محتوای اصلی */}
              {/* <div className="flex flex-1 relative">
                <div className="w-fit absolute right-0 top-0 z-30" dir="rtl">
                  <Sidebar />
                </div> */}
              <div className="flex flex-1 w-full">
                {/* محتوای صفحه */}
                <main className="flex-1 w-full  max-w-full overflow-x-hidden overflow-y-hidden">
                  {children}
                </main>
                {/* سایدبار */}
                <div className="hidden lg:block flex-shrink-0">
                  <Sidebar mobile={false} />
                </div>
              </div>
              {/* کارت سایدبار */}
              <CartSideBar />
              {/* فوتر */}
              <footer className="mt-auto w-full  relative z-10">
                <Footer />
              </footer>
            </div>
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
