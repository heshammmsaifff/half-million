"use client";
import { useState } from "react";

export default function ProductImageGallery({ images, productName }) {
  // تحديد الصورة الأساسية (Main) كصورة افتراضية عند التحميل
  const mainImg =
    images.find((img) => img.is_main)?.image_url || images[0]?.image_url;
  const [activeImage, setActiveImage] = useState(mainImg || "/placeholder.png");

  return (
    <div className="space-y-6 sticky top-28">
      {/* عرض الصورة الكبيرة */}
      <div className="group relative aspect-[4/5] bg-white rounded-[3.5rem] overflow-hidden border border-[#C3CBB9]/30 shadow-2xl shadow-[#5F6F52]/5 transition-all duration-700">
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-110"
        />

        {/* طبقة حماية خفيفة (Overlay) تعطي فخامة */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />
      </div>

      {/* شريط الصور المصغرة (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex flex-wrap justify-center gap-4 px-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] overflow-hidden transition-all duration-300 transform active:scale-90
                ${
                  activeImage === img.image_url
                    ? "ring-2 ring-[#5F6F52] ring-offset-4 scale-105 shadow-lg shadow-[#5F6F52]/20"
                    : "ring-1 ring-[#C3CBB9]/40 opacity-60 hover:opacity-100 hover:ring-[#5F6F52]/50"
                }
              `}
            >
              <img
                src={img.image_url}
                className="w-full h-full object-cover"
                alt={`${productName} thumbnail`}
              />

              {/* مؤشر اختيار صغير */}
              {activeImage === img.image_url && (
                <div className="absolute inset-0 bg-[#5F6F52]/5 border-2 border-[#5F6F52] rounded-[1.5rem]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
