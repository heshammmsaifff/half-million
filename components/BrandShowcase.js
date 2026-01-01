"use client";

import React from "react";
import Image from "next/image";

export default function BrandShowcase() {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* الحاوية الرئيسية - العرض كامل */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {/* عرض الشعار (Logo) */}
          <div className="relative group w-full max-w-[200px] md:max-w-[300px]">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </div>

          {/* خط فاصل جمالي يظهر في الشاشات الكبيرة فقط */}
          <div className="hidden md:block h-32 w-[2px] bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

          {/* عرض النص (Text SVG) */}
          <div className="relative group w-full max-w-[300px] md:max-w-[500px]">
            <Image
              src="/text.svg"
              alt="Brand Text"
              width={500}
              height={150}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </div>

      {/* لمسة ديكورية في الخلفية (اختياري) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30 blur-[120px] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gray-200 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gray-100 rounded-full" />
      </div>
    </section>
  );
}
