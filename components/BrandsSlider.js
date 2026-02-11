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

  // تكرار مرتين فقط ليتماشى مع translateX(-50%)
  const displayItems = [...brands, ...brands];

  return (
    <div className="brands-marquee-container" dir="ltr">
      <div className="marquee-track">
        {displayItems.map((brand, index) => (
          <Link
            key={`${brand.id}-${index}`}
            href={`/brand/${brand.id}`}
            className="brand-item"
          >
            <img
              src={brand.image_url}
              alt={brand.name}
              className="brand-img rounded-4xl"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
