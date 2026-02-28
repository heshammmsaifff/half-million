"use client";
import React, { useEffect, useState } from "react";

export default function PromoMarquee() {
  const [mounted, setMounted] = useState(false);
  const promoText = "استخدم برومو كود RAMADAN واحصل على خصم 10% الآن! 🌙";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="bg-black py-4 border-y border-white/10 h-[68px]"></div>
    );

  // نكرر النص مرتين فقط بمجموعات كبيرة لضمان الاتصال السلس
  const items = Array(15).fill(promoText);

  return (
    <div className="bg-black py-4 overflow-hidden border-y border-white/10 w-full">
      <div
        className="flex whitespace-nowrap w-max"
        style={{
          // استخدمنا marquee-rtl للتحكم الأدق
          animation: "marquee-rtl 40s linear infinite",
        }}
      >
        {items.map((text, index) => (
          <span
            key={index}
            className="text-white text-2xl md:text-3xl font-black tracking-normal mx-10 block"
            style={{ direction: "rtl" }} // نطبق RTL على النص نفسه فقط
          >
            {text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
