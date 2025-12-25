"use client";
import React from "react";
import HeroSection from "@/components/Hero";

export default function Page() {
  return (
    <div className="relative">
      {/* تم حذف أزرار الموبايل من هنا لأنها انتقلت للـ Layout العام */}
      <HeroSection />
    </div>
  );
}
