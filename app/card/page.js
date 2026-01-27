"use client";

import React, { useState } from "react";
import { Globe, MapPin, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const MobileFullCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const googleMapsUrl =
    "https://www.google.com/maps/place/30%C2%B043'33.8%22N+31%C2%B047'18.2%22E/@30.7260492,31.7858226,600m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d30.7260492!4d31.7883975?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D";

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
      dir="rtl"
    >
      {/* منطقة الصور */}
      <div className="relative flex-grow w-full overflow-hidden bg-black">
        <div
          className="absolute inset-0 z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        >
          <img
            src="/skincare.jpg"
            alt="Skincare"
            className="w-full h-full object-cover scale-125"
            style={{ objectPosition: "60% 30%" }}
          />
        </div>

        <div
          className="absolute inset-0 z-0"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        >
          <img
            src="/vitamin.jpg"
            alt="Vitamin"
            className="w-full h-full object-cover scale-125"
            style={{ objectPosition: "40% 70%" }}
          />
        </div>

        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          preserveAspectRatio="none"
        >
          <line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke="white"
            strokeWidth="4"
          />
        </svg>

        {/* اللوجو */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 bg-white/30 rounded-full p-2 shadow-[0_0_30px_rgba(0,0,0,0.2)] border-4 border-emerald-600 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="h-28 bg-white flex justify-around items-center px-4 z-30 border-t border-gray-100 shadow-up">
        <a
          href="https://halfmillion1.com"
          target="_blank"
          className="flex flex-col items-center gap-1 text-emerald-800"
        >
          <div className="bg-emerald-50 p-3 rounded-2xl">
            <Globe size={26} />
          </div>
          <span className="text-xs font-bold">الموقع</span>
        </a>

        <a
          href={googleMapsUrl}
          target="_blank"
          className="flex flex-col items-center gap-1 text-emerald-800 group"
        >
          <div className="bg-emerald-600 p-4 rounded-full text-white shadow-lg -translate-y-4 border-4 border-white transition-transform active:scale-90">
            <MapPin size={28} />
          </div>
          <span className="text-xs font-black -translate-y-2">العنوان</span>
        </a>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-1 text-emerald-800"
        >
          <div className="bg-emerald-50 p-3 rounded-2xl">
            <Phone size={26} />
          </div>
          <span className="text-xs font-bold">تواصل</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-emerald-900">اتصل بنا</h3>
              <X
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 cursor-pointer"
              />
            </div>
            <div className="space-y-4 mb-6">
              <a
                href="tel:+201000000000"
                className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl font-mono text-lg text-emerald-700 active:bg-emerald-50 transition-colors"
              >
                <span dir="ltr">01000000000</span>
                <Phone size={18} />
              </a>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl font-mono text-lg text-emerald-700 active:bg-emerald-100 transition-colors"
              >
                <span dir="ltr">01000000000</span>
                <FaWhatsapp size={20} className="text-green-600" />
              </a>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFullCard;
