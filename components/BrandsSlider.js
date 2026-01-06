"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function BrandsMarquee() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from("brands")
        .select("id, image_url, name");
      setBrands(data || []);
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  const displayItems = [...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <div className="brands-marquee-container shadow-inner group">
      <div className="marquee-track" dir="ltr">
        {displayItems.map((brand, index) => (
          <Link
            key={`${brand.id}-${index}`}
            href={`/brand/${brand.id}`}
            className="brand-item"
          >
            <img
              src={brand.image_url}
              alt={brand.name}
              /* Added grayscale filter to unify logos, turns to full color on hover */
              className="brand-img rounded-2xl grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 ease-in-out"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
