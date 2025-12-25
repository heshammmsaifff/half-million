"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ChevronDown,
  LayoutGrid,
  Package,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // التحكم في الظهور للموبايل
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null); // التحكم في القوائم المنسدلة

  useEffect(() => {
    fetchSidebarData();

    // --- الجزء الجديد: الاستماع لحدث فتح السايدبار من الخارج ---
    const handleExternalOpen = () => setIsOpen(true);
    window.addEventListener("open-sidebar", handleExternalOpen);

    // تنظيف المستمع عند مسح المكون من الذاكرة
    return () => {
      window.removeEventListener("open-sidebar", handleExternalOpen);
    };
  }, []);

  const fetchSidebarData = async () => {
    const { data, error } = await supabase.from("main_categories").select(`
        id, name,
        sub_categories (
          id, name,
          products (id, name)
        )
      `);
    if (!error) setCategories(data);
  };

  const toggleCategory = (id) => {
    setExpandedCat(expandedCat === id ? null : id);
  };

  return (
    <>
      {/* 1. زر الموبايل (موجود كاحتياط داخل السايدبار أيضاً) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* 2. الخلفية المظلمة (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. جسم السايدبار الرئيسي */}
      <aside
        className={`
          fixed top-0 right-0 h-full bg-white border-l border-gray-100 w-72 z-[70] 
          transition-transform duration-500 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        dir="rtl"
      >
        {/* الهيدر الخاص بالسايدبار */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
              <LayoutGrid size={20} />
            </div>
            <Link href="/">
              <span className="font-black text-xl text-gray-900 tracking-tight">
                Half Million
              </span>
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* محتوى القوائم */}
        <div className="overflow-y-auto h-[calc(100vh-80px)] p-4 space-y-2">
          <Link
            href="/all-products"
            onClick={() => setIsOpen(false)} // إغلاق السايدبار عند الضغط في الموبايل
            className="flex items-center gap-3 p-4 text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all border border-transparent hover:border-blue-100"
          >
            <Package size={20} />
            <span>جميع المنتجات</span>
          </Link>

          <div className="h-px bg-gray-100 my-4 mx-2" />

          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
            الأقسام الرئيسية
          </p>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              {/* الفئة الرئيسية */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  expandedCat === cat.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 font-bold">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      expandedCat === cat.id
                        ? "bg-white scale-150"
                        : "bg-gray-300"
                    }`}
                  />
                  {cat.name}
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    expandedCat === cat.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* الفئات الفرعية */}
              {expandedCat === cat.id && (
                <div className="pr-4 py-1 space-y-1 animate-in slide-in-from-right-2 duration-300">
                  {cat.sub_categories?.map((sub) => (
                    <div key={sub.id} className="relative">
                      <Link
                        href={`/category/${cat.id}/${sub.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-3 text-sm font-bold text-gray-500 hover:text-blue-600 rounded-xl hover:bg-blue-50/50 transition-all border-r-2 border-transparent hover:border-blue-600"
                      >
                        {sub.name}
                        <ChevronLeft
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
