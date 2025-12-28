"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  X,
  ArrowLeft,
  ChevronLeft,
  Tag,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [openMobileCat, setOpenMobileCat] = useState(null);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);

  const { cart } = useCart();
  const searchRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setIsCartOpen(false);
    setIsMegaMenuOpen(false);
    setIsBrandsMenuOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase
        .from("main_categories")
        .select("id, name, sub_categories(id, name)");
      setCategories(catData || []);

      const { data: brandData } = await supabase
        .from("brands")
        .select("id, name, image_url")
        .limit(12);
      setBrands(brandData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        setShowDropdown(true);
        const { data } = await supabase
          .from("products")
          .select(`id, name, base_price, product_images(image_url)`)
          .eq("product_images.is_main", true)
          .ilike("name", `%${searchQuery}%`)
          .limit(5);
        setResults(data || []);
        setIsSearching(false);
      } else {
        setResults([]);
        setShowDropdown(false);
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setIsOpen(false); // إغلاق قائمة الموبايل إذا كانت مفتوحة
    }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-12 py-4"
        dir="rtl"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="h-10">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-full object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-gray-700">
              <div
                className="relative h-full py-2 group"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Link
                  href="/all-products"
                  className="flex items-center gap-1 hover:text-black"
                >
                  المتجر{" "}
                  <ChevronDown
                    size={14}
                    className={isMegaMenuOpen ? "rotate-180" : ""}
                  />
                </Link>
                {/* Mega Menu Content (Desktop) */}
                <div
                  className={`absolute top-full right-0 mt-0 w-[800px] bg-white shadow-2xl rounded-3xl border border-gray-50 p-8 transition-all duration-300 origin-top-right ${
                    isMegaMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="grid grid-cols-4 gap-8">
                    {categories.map((mainCat) => (
                      <div key={mainCat.id}>
                        <h3 className="text-black font-black text-sm border-r-4 border-black pr-3 mb-4">
                          {mainCat.name}
                        </h3>
                        <div className="flex flex-col gap-3 pr-4">
                          {mainCat.sub_categories?.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${mainCat.id}/${sub.id}`}
                              className="text-gray-500 hover:text-black text-xs font-bold transition-colors flex items-center justify-between group/item"
                            >
                              {sub.name}{" "}
                              <ChevronLeft
                                size={12}
                                className="opacity-0 group-hover/item:opacity-100 transition-all"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="relative h-full py-2 group"
                onMouseEnter={() => setIsBrandsMenuOpen(true)}
                onMouseLeave={() => setIsBrandsMenuOpen(false)}
              >
                <Link
                  href="/all-brands"
                  className="flex items-center gap-1 hover:text-black"
                >
                  الماركات{" "}
                  <ChevronDown
                    size={14}
                    className={isBrandsMenuOpen ? "rotate-180" : ""}
                  />
                </Link>
                <div
                  className={`absolute top-full right-0 mt-0 w-[600px] bg-white shadow-2xl rounded-3xl border border-gray-50 p-6 transition-all duration-300 origin-top-right ${
                    isBrandsMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-all"
                      >
                        <img
                          src={brand.image_url}
                          alt=""
                          className="w-8 h-8 rounded-full object-contain"
                        />
                        <span className="text-xs font-bold text-gray-600">
                          {brand.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/offers"
                className="hover:text-black text-red-600 bg-red-100 px-3 py-2 rounded-xl transition-colors"
              >
                العروض الحصرية
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex relative w-64"
              ref={searchRef}
            >
              <div className="w-full flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5 transition-all">
                <input
                  type="text"
                  placeholder="ابحث هنا..."
                  className="bg-transparent border-none w-full px-1 text-xs focus:outline-none font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-black"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full">
              <User size={20} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:bg-gray-50 rounded-full relative"
            >
              <ShoppingCart size={20} />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-full"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] ${isOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white transition-transform duration-300 p-6 flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          dir="rtl"
        >
          {/* Header Mobile Menu */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" onClick={() => setIsOpen(false)} className="h-8">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-full object-contain"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Bar in Mobile Menu */}
          <form onSubmit={handleSearchSubmit} className="mb-6 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="عن ماذا تبحث؟"
                className="w-full bg-gray-100 rounded-2xl py-3 px-4 pr-11 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* أيقونة البحث الثابتة على اليمين */}
              <Search className="absolute right-4 text-gray-400" size={18} />
              {/* زر البحث (التنفيذ) على اليسار */}
              <button
                type="submit"
                className="absolute left-2 bg-black text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
            </div>

            {/* قائمة نتائج البحث السريع في الموبايل */}
            {showDropdown && searchQuery.length > 1 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-[110]">
                {isSearching ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 size={20} className="animate-spin text-black" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        onClick={() => setIsOpen(false)} // إغلاق المنيو عند اختيار منتج
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <img
                          src={p.product_images?.[0]?.image_url}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-800 line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {p.base_price} ر.س
                          </span>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-xs font-black text-black bg-gray-50 hover:bg-gray-100"
                    >
                      عرض جميع النتائج
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs font-bold text-gray-400">
                    لا توجد نتائج لـ "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="space-y-3 overflow-y-auto flex-1 pb-10 custom-scrollbar">
            <Link
              href="/all-products"
              className="flex items-center justify-between font-black text-gray-800 p-4 bg-gray-50 rounded-2xl"
            >
              المتجر <ArrowLeft size={18} />
            </Link>
            <Link
              href="/offers"
              className="flex items-center justify-between font-black text-red-600 p-4 bg-red-50 rounded-2xl"
            >
              العروض الحصرية <Tag size={18} />
            </Link>

            <div className="h-px bg-gray-100 my-4" />

            {/* الأقسام Mobile */}
            <p className="text-[10px] font-black text-gray-400 uppercase px-4 mb-2">
              الأقسام
            </p>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center justify-between bg-white rounded-xl">
                  <Link
                    href={`/category/${cat.id}`}
                    className="flex-1 p-4 text-sm font-bold text-gray-700 text-right"
                  >
                    {cat.name}
                  </Link>
                  <button
                    onClick={() =>
                      setOpenMobileCat(openMobileCat === cat.id ? null : cat.id)
                    }
                    className={`p-4 border-r border-gray-50 transition-colors ${
                      openMobileCat === cat.id
                        ? "bg-black text-white"
                        : "text-gray-300"
                    }`}
                    title="افتح القائمة"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        openMobileCat === cat.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 bg-gray-50/50 ${
                    openMobileCat === cat.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {cat.sub_categories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${cat.id}/${sub.id}`}
                      className="text-xs font-bold text-gray-500 py-4 px-8 border-r-2 border-gray-200 hover:text-black flex transition-all"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="h-px bg-gray-100 my-4" />

            {/* الماركات Mobile */}
            <p className="text-[10px] font-black text-gray-400 uppercase px-4 mb-2">
              الماركات التجارية
            </p>
            <div className="border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between bg-white rounded-xl">
                <Link
                  href="/all-brands"
                  className="flex-1 p-4 text-sm font-bold text-gray-700 text-right italic"
                >
                  كل الماركات (عرض الكل)
                </Link>
                <button
                  onClick={() => setIsMobileBrandsOpen(!isMobileBrandsOpen)}
                  className={`p-4 border-r border-gray-50 transition-colors ${
                    isMobileBrandsOpen ? "bg-black text-white" : "text-gray-300"
                  }`}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      isMobileBrandsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 bg-gray-50/50 ${
                  isMobileBrandsOpen
                    ? "max-h-[500px] opacity-100 py-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-3 px-4">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brand/${brand.id}`}
                      className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all"
                    >
                      <img
                        src={brand.image_url}
                        className="w-10 h-10 rounded-full object-contain"
                        alt={brand.name}
                      />
                      <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">
                        {brand.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
