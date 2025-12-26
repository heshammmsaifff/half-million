"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation"; // استيراد معرف المسار

export default function RootLayout({ children }) {
  const pathname = usePathname(); // الحصول على المسار الحالي

  // التحقق مما إذا كنا في الصفحة الرئيسية
  const isHomePage = pathname === "/";

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Half Million</title>
      </head>
      <body className="bg-gray-50/50 antialiased">
        <div className="flex min-h-screen">
          {/* عرض السايدبار في الشاشات الكبيرة فقط إذا كانت الصفحة هي الرئيسية */}
          {isHomePage && (
            <div className="hidden lg:block w-72 shrink-0 border-l border-gray-100 bg-white">
              <Sidebar />
            </div>
          )}

          <main className="flex-1 w-full relative overflow-x-hidden">
            <Navbar />
            <div className="p-0">{children}</div>
          </main>

          {/* السايدبار الخاص بالموبايل (القائمة الجانبية التي تفتح وتغلق) */}
          {/* نتركه هنا ليعمل زر المنيو في Navbar بجميع الصفحات، 
              أو يمكنك لفه بـ isHomePage أيضاً إذا أردت إخفاءه تماماً من الموبايل في الصفحات الأخرى */}
          <div className="lg:hidden">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
