"use client";
import { useState } from "react";

export default function ProductImageGallery({ images, productName }) {
  const [activeImage, setActiveImage] = useState(
    images[0]?.image_url || "/placeholder.png"
  );

  return (
    <div className="space-y-6 sticky top-8">
      {/* الصورة الكبيرة المعروضة */}
      <div className="aspect-square bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl">
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out"
        />
      </div>

      {/* الصور المصغرة القابلة للضغط */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all cursor-pointer shadow-sm
                ${
                  activeImage === img.image_url
                    ? "border-blue-600 scale-95"
                    : "border-transparent hover:border-blue-200"
                }
              `}
            >
              <img
                src={img.image_url}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
