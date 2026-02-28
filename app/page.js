"use client";
import React from "react";
import HeroSection from "@/components/Hero";
import BrandsSlider from "@/components/BrandsSlider";
import LatestProducts from "@/components/LatestProducts";
import LatestOffers from "@/components/LatestOffers";
import BrandStory from "@/components/BrandStory";
import BrandShowcase from "@/components/BrandShowcase";
// import TempLoop from "@/components/TempLoop";

export default function Page() {
  return (
    <div className="relative">
      {/* <TempLoop /> */}
      <HeroSection />
      <BrandsSlider />
      <BrandShowcase />
      <LatestProducts />
      <LatestOffers />
      <BrandStory />
    </div>
  );
}
