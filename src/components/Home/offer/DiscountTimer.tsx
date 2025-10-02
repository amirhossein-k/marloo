"use client";
import React, { useState, useEffect } from "react";

interface DiscountTimerProps {
  endDate: Date; // تاریخ پایان تخفیف
  daysLeft: number; // تعداد روزهای باقیمانده
  className?: string;
}

const DiscountTimer: React.FC<DiscountTimerProps> = ({
  endDate,
  daysLeft,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });

        // محاسبه پیشرفت
        const totalDuration = daysLeft * 24 * 60 * 60 * 1000;
        const elapsed = totalDuration - difference;
        const progressPercentage = (elapsed / totalDuration) * 100;
        setProgress(Math.min(progressPercentage, 100));
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, daysLeft]);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 50) return "bg-green-500";
    if (progress < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      {/* عنوان */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          شگفت‌انگیزهای رو به اتمام
        </span>
        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
          {daysLeft} روز باقیمانده
        </span>
      </div>

      {/* نوار پیشرفت */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>شروع</span>
          <span>پایان</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
              progress
            )}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* تایمر */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className="text-center">
          <div className="bg-gray-100 rounded-md px-2 py-1 min-w-[40px]">
            <span className="text-lg font-bold text-gray-800">
              {formatTime(timeLeft.hours)}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">ساعت</span>
        </div>

        <span className="text-lg font-bold text-gray-400">:</span>

        <div className="text-center">
          <div className="bg-gray-100 rounded-md px-2 py-1 min-w-[40px]">
            <span className="text-lg font-bold text-gray-800">
              {formatTime(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">دقیقه</span>
        </div>

        <span className="text-lg font-bold text-gray-400">:</span>

        <div className="text-center">
          <div className="bg-gray-100 rounded-md px-2 py-1 min-w-[40px]">
            <span className="text-lg font-bold text-gray-800">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">ثانیه</span>
        </div>
      </div>
    </div>
  );
};

export default DiscountTimer;
