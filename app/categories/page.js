"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Loader2, ArrowLeft, LayoutGrid } from "lucide-react";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("main_categories").select(`
            id, 
            name, 
            description, 
            image_url,
            sub_categories(id)
          `);

        if (error) throw error;
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F4]">
        <Loader2 className="animate-spin text-[#5F6F52]" size={40} />
      </div>
    );

  return (
    <div className=" min-h-screen pb-20" dir="rtl">
      {/* Header القسم - تصميم عصري وبسيط */}
      <div className="pt-20 pb-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-[#2D3436] mb-4">
          أقسام المتجر
        </h1>
        <p className="text-[#5F6F52] font-medium max-w-lg mx-auto opacity-80">
          تشكيلتنا المختارة بعناية من أرقى المنتجات العالمية والمحلية
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-14">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.id}`} className="group">
              <div className="flex flex-col items-center">
                {/* الحاوية الدائرية الكبيرة للصورة */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 mb-6">
                  {/* الدائرة الخلفية للتأثير الجمالي (Orbit Effect) */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5F6F52]/20 group-hover:rotate-45 group-hover:border-[#5F6F52]/50 transition-all duration-700"></div>

                  {/* حاوية الصورة الأساسية */}
                  <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-4 border-white group-hover:shadow-[0_20px_50px_rgba(95,111,82,0.2)] transition-all duration-500 z-10">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <img
                          src="/logo.svg"
                          alt="Logo"
                          className="w-1/2 h-1/2 object-contain opacity-50"
                        />
                      </div>
                    )}
                  </div>

                  {/* بادج عدد الأقسام الفرعية */}
                  <div className="absolute bottom-2 right-2 z-20 bg-[#2D3436] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
                    {cat.sub_categories?.length || 0} صنف
                  </div>
                </div>

                {/* النصوص بشكل عصري */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-[#2D3436] group-hover:text-[#5F6F52] transition-colors duration-300">
                    {cat.name}
                  </h3>

                  <div className="w-8 h-1 bg-[#E29595] mx-auto rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>

                  <p className="text-[#5F6F52]/60 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-1">
                    استكشفي الآن <ArrowLeft size={12} />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
