"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Half Million</title>
      </head>
      <body className="bg-gray-50/50 antialiased">
        <div className="flex min-h-screen">
          {/* السايدبار للشاشات الكبيرة */}
          <div className="hidden lg:block w-72 shrink-0 border-l border-gray-100 bg-white">
            <Sidebar />
          </div>

          {/* المحتوى الرئيسي */}
          <main className="flex-1 w-full relative overflow-x-hidden">
            {/* تم حذف الهيدر والزر من هنا */}
            <div className="p-0">{children}</div>
          </main>

          {/* السايدبار للموبايل (هو من يحتوي على الزر الآن) */}
          <div className="lg:hidden">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
