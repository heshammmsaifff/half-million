"use client";
import React from "react";
import HeroSection from "@/components/Hero";
import BrandsSlider from "@/components/BrandsSlider";
import LatestProducts from "@/components/LatestProducts";
import LatestOffers from "@/components/LatestOffers";
import BrandStory from "@/components/BrandStory";

export default function Page() {
  return (
    <div className="relative">
      <HeroSection />
      <BrandsSlider />
      <LatestProducts />
      <LatestOffers />
      <BrandStory />
    </div>
  );
}
