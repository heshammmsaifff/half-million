"use client";

import React from "react";
import Image from "next/image";

export default function BrandShowcase() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Brand Logo */}
          <div className="relative group w-full max-w-[180px] md:max-w-[260px]">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              priority
            />
          </div>

          {/* Elegant Vertical Divider */}
          <div className="hidden md:block h-28 w-[1px] bg-gradient-to-b from-transparent via-[#d1d5db] to-transparent opacity-50" />

          {/* Brand Typography SVG */}
          <div className="relative group w-full max-w-[280px] md:max-w-[450px]">
            <Image
              src="/text.svg"
              alt="Brand Text"
              width={500}
              height={150}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:translate-x-2"
              priority
            />
          </div>
        </div>
      </div>

      {/* Decorative Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-40 blur-[100px] pointer-events-none">
        {/* Sage Green Orb - Represents Health/Vitamins */}
        <div className="absolute top-10 left-1/3 w-72 h-72 bg-[#C3CBB9] rounded-full mix-blend-multiply" />
        {/* Warm Peach Orb - Represents Skin/Cosmetics */}
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-[#F5E6D3] rounded-full mix-blend-multiply" />
      </div>
    </section>
  );
}
