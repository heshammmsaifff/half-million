"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowRight, Layers, Sparkles } from "lucide-react";

export default function CategorySubsPage() {
  const { categoryId } = useParams();
  const [mainCategory, setMainCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const { data, error } = await supabase
          .from("main_categories")
          .select(
            `
            name, 
            sub_categories (
              id, 
              name, 
              description
            )
          `,
          )
          .eq("id", categoryId)
          .single();

        if (error) throw error;
        setMainCategory(data);
      } catch (err) {
        console.error("Error fetching sub-categories:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, [categoryId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F4]">
        <Loader2 className="animate-spin text-[#5F6F52]" size={40} />
      </div>
    );

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-12 text-[#5F6F52] font-bold text-sm">
          <Link
            href="/"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            الرئيسية
          </Link>
          <ArrowRight size={14} className="rotate-180 opacity-40" />
          <Link
            href="/categories"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            الأقسام
          </Link>
          <ArrowRight size={14} className="rotate-180 opacity-40" />
          <span className="text-[#2D3436] border-b-2 border-[#E29595]">
            {mainCategory?.name}
          </span>
        </nav>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="text-[#E29595]" size={24} />
            <h2 className="text-[#5F6F52] font-black tracking-widest uppercase text-sm">
              الأقسام الفرعية
            </h2>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#2D3436]">
            {mainCategory?.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainCategory?.sub_categories.map((sub) => (
            <Link key={sub.id} href={`/category/${categoryId}/${sub.id}`}>
              <div className="bg-white p-8 rounded-[2.5rem] border border-[#C3CBB9]/20 shadow-sm hover:shadow-xl hover:border-[#5F6F52]/30 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#F8F9F4] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="text-[#5F6F52]" size={24} />
                  </div>
                  <ArrowRight
                    size={20}
                    className="rotate-180 text-[#C3CBB9] group-hover:text-[#2D3436] transition-colors"
                  />
                </div>
                <h3 className="text-2xl font-black text-[#2D3436] mb-2">
                  {sub.name}
                </h3>
                <p className="text-[#5F6F52]/60 text-sm font-medium line-clamp-2">
                  {sub.description ||
                    "تصفحي مجموعة المنتجات المتاحة في هذا القسم."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
