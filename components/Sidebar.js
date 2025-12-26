"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ShoppingBag,
  Home,
  Search,
  Loader2,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchSidebarData();

    const handleExternalOpen = () => setIsOpen(true);
    window.addEventListener("open-sidebar", handleExternalOpen);

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("open-sidebar", handleExternalOpen);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowSearchDropdown(true);

        try {
          const { data, error } = await supabase
            .from("products")
            .select(`id, name, base_price, product_images(image_url)`)
            .eq("product_images.is_main", true)
            .ilike("name", `%${searchQuery}%`)
            .limit(5);

          if (!error) setSearchResults(data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchSidebarData = async () => {
    const { data, error } = await supabase.from("main_categories").select(`
        id, name,
        sub_categories ( id, name )
      `);
    if (!error) setCategories(data);
  };

  const handleFullSearch = () => {
    if (searchQuery.trim()) {
      setIsOpen(false);
      setShowSearchDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&cat=all`);
    }
  };

  const toggleCategory = (id) => {
    setExpandedCat(expandedCat === id ? null : id);
  };

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full bg-white w-70 z-[70] 
          transition-transform duration-500 ease-in-out border-l border-gray-100
          lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        dir="rtl"
      >
        {/* الهيدر المعدل: اللوجو يختفي في الشاشات الكبيرة lg:hidden */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-3 lg:hidden">
            {" "}
            {/* أضفنا lg:hidden هنا */}
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <ShoppingBag size={20} />
            </div>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="font-black text-xl text-gray-900 tracking-tight">
                Half Million
              </span>
            </Link>
          </div>

          {/* زر الإغلاق يظهر فقط في الموبايل */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full mr-auto"
          >
            <X size={24} />
          </button>

          {/* نص بديل يظهر في الـ PC لإعطاء مساحة جمالية علوية (اختياري) */}
          <div className="hidden lg:block h-4"></div>
        </div>

        {/* قسم البحث (يظهر في الموبايل فقط كما طلبت سابقاً) */}
        <div
          className="lg:hidden px-4 py-4 border-b border-gray-50 relative z-10"
          ref={searchRef}
        >
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFullSearch()}
              placeholder="ابحث عن منتج..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-medium"
            />
            <div className="absolute left-3 top-3">
              {isSearching ? (
                <Loader2 size={18} className="animate-spin text-blue-600" />
              ) : (
                <Search className="text-gray-400" size={18} />
              )}
            </div>
          </div>

          {showSearchDropdown && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50 text-right">
              {searchResults.length > 0 ? (
                <>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setIsOpen(false);
                          setShowSearchDropdown(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        <img
                          src={
                            product.product_images?.[0]?.image_url ||
                            "/placeholder.png"
                          }
                          className="w-10 h-10 rounded-md object-cover border border-gray-100"
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-blue-600 font-black">
                            {product.base_price} ج.م
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={handleFullSearch}
                    className="w-full p-3 bg-gray-50 text-[11px] font-bold text-blue-600 border-t border-gray-100"
                  >
                    عرض جميع النتائج
                  </button>
                </>
              ) : (
                !isSearching &&
                searchQuery.length > 1 && (
                  <div className="p-4 text-center text-xs text-gray-400">
                    لا توجد نتائج
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="overflow-y-auto h-[calc(100vh-160px)] lg:h-[calc(100vh-85px)] p-4 space-y-2 custom-scrollbar">
          {/* <SidebarLink
            href="/"
            icon={<Home size={20} />}
            label="الرئيسية"
            onClick={() => setIsOpen(false)}
          /> */}
          <SidebarLink
            href="/all-products"
            icon={<Package size={20} />}
            label="جميع المنتجات"
            onClick={() => setIsOpen(false)}
          />

          <div className="h-px bg-gray-100 my-4 mx-2" />

          <p className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
            الأقسام
          </p>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  expandedCat === cat.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 font-bold">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      expandedCat === cat.id ? "bg-white" : "bg-gray-300"
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

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  expandedCat === cat.id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pr-4 py-2 space-y-1">
                  {cat.sub_categories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${cat.id}/${sub.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 text-sm font-bold text-gray-500 hover:text-blue-600 rounded-xl hover:bg-blue-50/50 transition-all border-r-2 border-transparent hover:border-blue-600"
                    >
                      {sub.name}
                      <ChevronLeft size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 p-4 text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all border border-transparent hover:border-blue-100"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
