import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/95 z-[10000]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-blue-100 rounded-full"></div>
          <div className="h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="text-gray-600 text-base font-medium tracking-wide">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
}