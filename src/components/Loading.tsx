"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-spinner text-primary w-12 h-12"></span>
      <p className="ml-3">در حال بارگذاری...</p>
    </div>
  );
}
