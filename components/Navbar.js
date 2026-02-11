"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  ChevronLeft,
  ArrowLeft,
  Loader2,
  Tag,
  Sparkles,
  PhoneCall,
  LayoutGrid,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // تم حذف useRef من هنا
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
  const [user, setUser] = useState(null);

  const [openMobileCat, setOpenMobileCat] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);

  const { cart } = useCart();
  const searchRef = useRef(null);
  const wrapperRef = useRef(null); // تعريف wrapperRef بشكل صحيح
  const router = useRouter();
  const pathname = usePathname();

  // مصفوفة النتائج المصغرة للبحث
  const previewResults = results.slice(0, 2);

  // إغلاق كل القوائم عند تغيير الصفحة
  useEffect(() => {
    setIsOpen(false);
    setIsCartOpen(false);
    setIsMegaMenuOpen(false);
    setIsBrandsMenuOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
  }, [pathname]);

  // جلب البيانات الأساسية
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

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // منطق البحث التلقائي
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

  // تعريف دالة البحث مرة واحدة فقط
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#C3CBB9]/30 px-4 md:px-12 py-4"
        dir="rtl"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-10 flex-shrink-0">
            <Link href="/" className="h-10 group">
              <img
                src="/logo.svg"
                alt="Half Million Logo"
                className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 text-[13px] font-black text-[#2D3436]">
              {/* المتجر مع Mega Menu المطور */}
              <div
                className="relative h-full py-2 group"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Link
                  href="/all-products"
                  className="flex items-center gap-1.5 hover:text-[#5F6F52] transition-colors"
                >
                  المتجر
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      isMegaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {/* القائمة الكبيرة - Mega Menu */}
                <div
                  className={`absolute top-[100%] right-0 mt-2 w-[850px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-[#C3CBB9]/20 p-10 transition-all duration-500 origin-top-right z-50 ${
                    isMegaMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-4"
                  }`}
                >
                  {/* Container مرن مع خاصية التمرير إذا زاد الطول عن حجم الشاشة */}
                  <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-wrap gap-x-12 gap-y-10">
                      {categories.map((mainCat) => (
                        <div
                          key={mainCat.id}
                          className="space-y-5 min-w-[160px] flex-1"
                        >
                          <h3 className="text-[#5F6F52] font-black text-[14px] border-r-4 border-[#5F6F52] pr-3 sticky top-0 bg-white py-1">
                            {mainCat.name}
                          </h3>
                          <div className="flex flex-col gap-3.5 pr-4">
                            {mainCat.sub_categories?.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/category/${mainCat.id}/${sub.id}`}
                                className="text-gray-500 hover:text-black text-xs font-bold transition-all flex items-center justify-between group/item"
                              >
                                {sub.name}
                                <ArrowLeft
                                  size={12}
                                  className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#5F6F52]"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* الأقسام الرئيسية  Mega Menu */}
              <div
                className="relative h-full py-2 group"
                onMouseEnter={() => setIsCategoriesMenuOpen(true)}
                onMouseLeave={() => setIsCategoriesMenuOpen(false)}
              >
                <Link
                  href="/categories"
                  className="flex items-center gap-1.5 hover:text-[#5F6F52] transition-colors"
                >
                  الأقسام الرئيسية
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      isCategoriesMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {/* القائمة الكبيرة - Mega Menu (مطابق تماماً للمتجر في العرض والتصميم) */}
                <div
                  className={`absolute top-[100%] right-0 mt-2 w-[850px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-[#C3CBB9]/20 p-10 transition-all duration-500 origin-top-right z-50 ${
                    isCategoriesMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-4"
                  }`}
                >
                  <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* عرض الأقسام بشكل عرضي مريح للعين */}
                    <div className="flex flex-wrap gap-x-8 gap-y-8">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.id}`}
                          className="group/cat min-w-[220px] flex-1 bg-[#F8F9F4]/50 p-5 rounded-[2rem] border border-transparent hover:border-[#5F6F52]/20 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center gap-4"
                        >
                          {/* حاوية الصورة الدائرية */}
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-sm group-hover/cat:shadow-md transition-all duration-300 flex items-center justify-center">
                              {cat.image_url ? (
                                <img
                                  src={cat.image_url}
                                  alt={cat.name}
                                  className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                /* الشعار الافتراضي من public */
                                <img
                                  src="/logo.svg"
                                  alt="Logo"
                                  className="w-2/3 h-2/3 object-contain opacity-20 group-hover/cat:opacity-40 transition-opacity"
                                />
                              )}
                            </div>
                          </div>

                          {/* نصوص القسم */}
                          <div className="flex-1 overflow-hidden text-right">
                            <h3 className="text-[#2D3436] font-black text-[14px] mb-0.5 group-hover/cat:text-[#5F6F52] transition-colors truncate">
                              {cat.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              <p className="text-[#5F6F52]/60 text-[10px] font-bold line-clamp-1">
                                استكشفي الآن
                              </p>
                              <ArrowLeft
                                size={12}
                                className="opacity-0 -translate-x-1 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 transition-all text-[#E29595]"
                              />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* زر سفلي للذهاب لصفحة كل الأقسام */}
                    <div className="mt-10 pt-6 border-t border-[#C3CBB9]/20 text-center">
                      <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-[#5F6F52] font-black text-xs hover:gap-4 transition-all"
                      >
                        عرض كافة التصنيفات الرئيسية <ArrowLeft size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* الماركات القائمة المنسدلة - مع تحسين التمرير */}
              <div
                className="relative h-full py-2 group"
                onMouseEnter={() => setIsBrandsMenuOpen(true)}
                onMouseLeave={() => setIsBrandsMenuOpen(false)}
              >
                <Link
                  href="/all-brands"
                  className="flex items-center gap-1.5 hover:text-[#5F6F52] transition-colors"
                >
                  الماركات
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      isBrandsMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                <div
                  className={`absolute top-[100%] right-0 mt-2 w-[650px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] border border-[#C3CBB9]/20 p-8 transition-all duration-500 origin-top-right z-50 ${
                    isBrandsMenuOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-4"
                  }`}
                >
                  <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4">
                      {brands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/brand/${brand.id}`}
                          className="flex items-center gap-3 p-3.5 hover:bg-[#F8F9F4] rounded-[1.2rem] transition-all border border-transparent hover:border-[#C3CBB9]/20"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-black text-[#2D3436]">
                            {brand.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-center bg-white sticky bottom-0">
                    <Link
                      href="/all-brands"
                      className="text-[11px] font-black text-[#5F6F52] hover:underline"
                    >
                      عرض جميع العلامات التجارية
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/offers"
                className="text-white bg-[#E29595] hover:bg-[#d88484] px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-[#E29595]/20 font-black whitespace-nowrap"
              >
                العروض الحصرية
              </Link>
              <Link
                href="/cart"
                className="hover:text-[#5F6F52] text-[#2D3436] font-black transition-colors whitespace-nowrap"
              >
                سلة التسوق
              </Link>
              <Link
                href="/contact"
                className="hover:text-[#5F6F52] text-[#2D3436] font-black transition-colors whitespace-nowrap"
              >
                تواصل معنا
              </Link>
            </div>
          </div>

          {/* Search Bar - Premium Style */}
          <div
            className="hidden md:flex flex-grow max-w-[500px] relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="w-full flex items-center bg-[#F8F9F4] rounded-2xl px-5 py-3 border border-[#C3CBB9]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#5F6F52]/5 focus-within:border-[#5F6F52] transition-all duration-300">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className="bg-transparent border-none w-full px-1 text-sm focus:outline-none font-bold text-gray-700 placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="text-[#5F6F52] hover:scale-110 transition-transform"
                >
                  <Search size={20} />
                </button>
              </div>

              {showDropdown && searchQuery.trim().length > 1 && (
                <div className="absolute top-full mt-4 w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-[2rem] border border-[#C3CBB9]/20 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                  {isSearching ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-4">
                      <Loader2
                        size={28}
                        className="animate-spin text-[#5F6F52]"
                      />
                      <span className="text-xs font-black text-gray-400 tracking-widest">
                        جاري البحث...
                      </span>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="flex flex-col">
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          className="flex items-center gap-5 p-5 hover:bg-[#F8F9F4] border-b border-gray-50 last:border-0 transition-all group"
                        >
                          <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-[#C3CBB9]/20">
                            <img
                              src={p.product_images?.[0]?.image_url}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt={p.name}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-black text-[#2D3436] line-clamp-1">
                              {p.name}
                            </span>
                            <span className="text-xs font-black text-[#5F6F52]">
                              {p.base_price.toLocaleString()} ج.م
                            </span>
                          </div>
                          <div className="ms-auto w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                            <ArrowLeft size={14} className="text-[#5F6F52]" />
                          </div>
                        </Link>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="p-5 bg-[#5F6F52] text-center text-xs font-black text-white hover:bg-[#2D3436] transition-colors"
                      >
                        عرض جميع النتائج لـ "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-[#F8F9F4] rounded-full flex items-center justify-center">
                        <Search size={24} className="text-[#C3CBB9]" />
                      </div>
                      <p className="text-sm font-bold text-gray-400">
                        لم نجد أي نتائج تطابق "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href={user ? "/profile" : "/login"}
              className="p-3 text-[#2D3436] hover:bg-[#F8F9F4] rounded-2xl relative transition-all border border-transparent hover:border-[#C3CBB9]/30"
            >
              <User size={22} />
              {user && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#5F6F52] rounded-full border-2 border-white"></span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-3 text-[#2D3436] hover:bg-[#F8F9F4] rounded-2xl relative transition-all border border-transparent hover:border-[#C3CBB9]/30"
            >
              <ShoppingCart size={22} />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#2D3436] text-white text-[10px] flex items-center justify-center rounded-full font-black px-1 border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-3 text-[#2D3436] bg-[#F8F9F4] rounded-2xl border border-[#C3CBB9]/30"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-[100] ${isOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-[#1A1C17]/60 backdrop-blur-md transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-sm:w-full max-w-sm bg-white transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          dir="rtl"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <Link href="/" onClick={() => setIsOpen(false)} className="h-8">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-full object-contain"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 bg-[#F8F9F4] text-[#2D3436] rounded-2xl hover:rotate-90 transition-transform duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
            {/* Search Mobile */}
            <div className="relative w-full" ref={wrapperRef} dir="rtl">
              {/* حقل الإدخال وزر البحث */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex gap-2 items-center"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ابحثِ عن منتج..."
                    className="w-full bg-[#F8F9F4] border border-[#C3CBB9]/30 rounded-2xl py-4 px-5 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-[#5F6F52]/5 font-black placeholder:text-[#C3CBB9]"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(e.target.value.length > 0);
                    }}
                    onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
                  />
                  <Search
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C3CBB9]"
                    size={20}
                  />
                </div>

                {/* زر البحث الجانبي */}
                <button
                  type="submit"
                  className="bg-[#5F6F52] text-white p-4 rounded-2xl shadow-lg shadow-[#5F6F52]/20 active:scale-95 transition-all"
                >
                  <Search size={20} />
                </button>
              </form>

              {/* القائمة المنسدلة للنتائج السريعة */}
              {previewResults.length > 0 ? (
                <>
                  {previewResults.map((product) => {
                    // الوصول للصورة الأولى في المصفوفة
                    const displayImage =
                      product.product_images?.[0]?.image_url ||
                      "/placeholder-image.png";

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-3 hover:bg-[#F8F9F4] rounded-xl transition-all group"
                      >
                        <div className="w-14 h-14 bg-white rounded-lg border border-[#C3CBB9]/10 overflow-hidden shrink-0 p-1">
                          <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            // إضافة fallback في حال فشل تحميل الرابط
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png";
                            }}
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-black text-[#2D3436] truncate">
                            {product.name}
                          </span>
                          <span className="text-xs font-bold text-[#5F6F52]">
                            {product.base_price} ج.م
                          </span>
                        </div>
                        <ArrowLeft
                          size={16}
                          className="text-[#C3CBB9] group-hover:text-[#5F6F52] transition-colors"
                        />
                      </Link>
                    );
                  })}

                  {/* زر عرض كل النتائج */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearchSubmit(e);
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 py-4 bg-[#2D3436] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#5F6F52] transition-colors"
                  >
                    عرض كافة النتائج <Search size={14} />
                  </button>
                </>
              ) : (
                <div className="p-0 text-center"></div>
              )}
            </div>

            {/* Essential Links - Mobile */}
            <div className="grid grid-cols-1 gap-3">
              {/* رابط حسابي */}
              <Link
                href={user ? "/profile" : "/login"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between font-black text-[#2D3436] p-5 bg-[#F8F9F4] rounded-[1.5rem] border border-transparent hover:border-[#C3CBB9]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <User
                    size={20}
                    className={user ? "text-[#5F6F52]" : "text-gray-400"}
                  />
                  <span>
                    {user ? "حسابي الشخصي" : "تسجيل الدخول / عضوية جديدة"}
                  </span>
                </div>
                <ChevronLeft size={16} className="text-gray-300" />
              </Link>

              {/* رابط سلة التسوق */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex items-center justify-between font-black text-[#2D3436] p-5 bg-[#F8F9F4] rounded-[1.5rem] border border-transparent hover:border-[#C3CBB9]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} className="text-[#5F6F52]" />
                  <span>سلة التسوق</span>
                </div>
                {cart?.length > 0 && (
                  <span className="bg-[#2D3436] text-white text-[10px] px-2 py-1 rounded-lg">
                    {cart.length} منتجات
                  </span>
                )}
              </button>

              {/* رابط العروض */}
              <Link
                href="/offers"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between font-black text-white p-5 bg-[#E29595] rounded-[1.5rem] shadow-lg shadow-[#E29595]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Tag size={20} />
                  <span>العروض الحصرية</span>
                </div>
                <Sparkles size={16} className="animate-pulse" />
              </Link>

              {/* رابط تواصل معنا */}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between font-black text-[#2D3436] p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:border-[#5F6F52]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <PhoneCall size={20} className="text-[#5F6F52]" />
                  <span>تواصل معنا</span>
                </div>
                <ChevronLeft size={16} className="text-gray-300" />
              </Link>

              <Link
                href="/categories"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between font-black text-[#2D3436] p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:border-[#5F6F52]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span>الأقسام الرئيسية</span>
                </div>
                <ChevronLeft size={16} className="text-gray-300" />
              </Link>
            </div>

            {/* Categories Mobile Accordion */}
            <div className="space-y-4 pt-4">
              {categories.map((cat) => (
                <div key={cat.id} className="group">
                  <div
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${
                      openMobileCat === cat.id
                        ? "bg-[#5F6F52] text-white"
                        : "bg-white border border-gray-100 text-[#2D3436]"
                    }`}
                    onClick={() =>
                      setOpenMobileCat(openMobileCat === cat.id ? null : cat.id)
                    }
                  >
                    <span className="text-[14px] font-black">{cat.name}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        openMobileCat === cat.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openMobileCat === cat.id
                        ? "max-h-[500px] mt-2 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col gap-1 pr-4 border-r-2 border-[#C3CBB9]/30 mr-2">
                      {cat.sub_categories?.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.id}/${sub.id}`}
                          onClick={() => setIsOpen(false)}
                          className="py-3 px-4 text-xs font-bold text-gray-500 hover:text-[#5F6F52] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Brands Mobile */}
            <div className="space-y-4 pt-4 pb-10">
              <p className="text-[11px] font-black text-[#5F6F52] uppercase tracking-[0.2em] px-2">
                أشهر الماركات
              </p>
              <div className="grid grid-cols-2 gap-3">
                {brands.slice(0, 6).map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center gap-3 p-4 bg-[#F8F9F4] rounded-[1.5rem] border border-transparent hover:border-[#C3CBB9]/30 transition-all"
                  >
                    <img
                      src={brand.image_url}
                      className="w-12 h-12 rounded-full object-contain bg-white p-1 border border-gray-100"
                      alt={brand.name}
                    />
                    <span className="text-[10px] font-black text-[#2D3436]">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/all-brands"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center p-4 w-full text-[12px] font-black text-[#5F6F52] border-2 border-dashed border-[#C3CBB9] rounded-2xl"
              >
                مشاهدة جميع الماركات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
