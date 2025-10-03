"use client";
import React, { useState, useEffect } from "react";

interface DiscountTimerProps {
  endDate?: Date | null;
  daysLeft?: number | null;
  className?: string;
  serverTime: Date; // الزامی شده
}

const DiscountTimer: React.FC<DiscountTimerProps> = ({
  endDate,
  daysLeft,
  className = "",
  serverTime,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!endDate || !daysLeft) return; // اگر داده نداریم، تایمر رو فعال نکن

      // محاسبه زمان فعلی بر اساس زمان سرور
      const now = new Date(
        serverTime.getTime() + (Date.now() - serverTime.getTime())
      );
      const end = endDate.getTime();
      const difference = end - now.getTime();

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24);
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          hours: days * 24 + hours,
          minutes,
          seconds,
          isExpired: false,
        });

        const totalDuration = daysLeft * 24 * 60 * 60 * 1000;
        const elapsed = totalDuration - difference;
        const progressPercentage = (elapsed / totalDuration) * 100;
        setProgress(Math.min(progressPercentage, 100));
      } else {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        setProgress(100);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, daysLeft, serverTime]);

  // بقیه کد بدون تغییر...
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 50) return "bg-green-500";
    if (progress < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (timeLeft.isExpired) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
      >
        <div className="text-center py-2">
          <span className="text-red-600 font-medium text-sm">
            ⏰ زمان تخفیف به پایان رسیده است
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          شگفت‌انگیزهای رو به اتمام
        </span>
        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
          {daysLeft} روز باقیمانده
        </span>
      </div>

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
