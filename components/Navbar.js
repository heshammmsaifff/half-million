"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation"; // استيراد موجه الصفحات

export default function Navbar() {
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // 1. جلب الفئات الفرعية
  useEffect(() => {
    const fetchSubCats = async () => {
      const { data } = await supabase.from("sub_categories").select("id, name");
      if (data) setSubCategories(data);
    };
    fetchSubCats();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. منطق البحث الحي (Debounced Search)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowDropdown(true);

        try {
          let query = supabase
            .from("products")
            .select(
              `
              id, 
              name, 
              base_price, 
              subcategory_id,
              product_images(image_url) 
            `
            )
            .eq("product_images.is_main", true)
            .ilike("name", `%${searchQuery}%`);

          if (selectedSubCat !== "all") {
            query = query.eq("subcategory_id", selectedSubCat);
          }

          const { data, error } = await query.limit(5);

          if (error) {
            console.error("Supabase Error:", error);
            setResults([]);
          } else {
            setResults(data || []);
          }
        } catch (err) {
          console.error("Search Error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedSubCat]);

  // دالة التوجيه لصفحة البحث الكاملة
  const handleViewAll = () => {
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedSubCat}`
      );
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 lg:px-8 py-3"
      dir="rtl"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
        {/* اللوجو */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new Event("open-sidebar"))}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-md shadow-blue-200">
              H
            </div>
            <span className="font-black text-xl hidden sm:block tracking-tighter text-gray-900">
              Half Million
            </span>
          </Link>
        </div>

        {/* شريط البحث */}
        <div
          className="hidden lg:flex flex-1 max-w-2xl relative"
          ref={searchRef}
        >
          <div className="w-full flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white focus-within:border-blue-200 transition-all">
            <div className="relative border-l border-gray-200 ml-2">
              <select
                value={selectedSubCat}
                onChange={(e) => setSelectedSubCat(e.target.value)}
                className="appearance-none bg-transparent py-2 pl-8 pr-4 text-sm font-bold text-gray-600 cursor-pointer focus:outline-none min-w-[150px]"
              >
                <option value="all">جميع الأصناف</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute left-2 top-2.5 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleViewAll()}
              placeholder="ابحث عن منتجك المفضل..."
              className="flex-1 bg-transparent border-none py-2 px-4 text-sm focus:outline-none text-gray-700 font-medium"
            />

            <div className="flex items-center pr-2 gap-2">
              {isSearching ? (
                <Loader2 className="animate-spin text-blue-600" size={18} />
              ) : (
                <Search className="text-gray-400" size={18} />
              )}
              <button
                onClick={handleViewAll}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-md shadow-blue-100"
              >
                بحث
              </button>
            </div>
          </div>

          {/* قائمة النتائج المنسدلة */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
              {results.length > 0 ? (
                <>
                  <div className="p-2">
                    {results.map((product) => {
                      const mainImage = product.product_images?.[0]?.image_url;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl transition-all group"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="w-14 h-14 relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <img
                              src={
                                mainImage ||
                                "https://via.placeholder.com/150?text=No+Image"
                              }
                              alt={product.name}
                              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-blue-600 font-black mt-1">
                              {product.base_price} ج.م
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  {/* زر عرض جميع النتائج */}
                  <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                    <button
                      onClick={handleViewAll}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      عرض جميع النتائج لـ "{searchQuery}"
                    </button>
                  </div>
                </>
              ) : (
                !isSearching &&
                searchQuery.length > 1 && (
                  <div className="p-10 text-center text-gray-400 text-sm font-medium">
                    لا توجد منتجات مطابقة لهذا البحث
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* الأيقونات */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all relative">
            <ShoppingCart size={22} />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
              0
            </span>
          </button>
          <button className="hidden sm:flex items-center gap-2 p-2.5 px-6 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">
            <User size={18} />
            دخول
          </button>
        </div>
      </div>
    </nav>
  );
}
