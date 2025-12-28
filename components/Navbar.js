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
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);

  // تم التعديل هنا ليتوافق مع الـ Context المحدث
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
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-black"
            >
              <img
                src="/logo.svg"
                alt="Half Million"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            </Link>

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
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-gray-50 overflow-hidden z-[60]">
                  {isSearching ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin text-black" />
                    </div>
                  ) : results.length > 0 ? (
                    results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <img
                          src={p.product_images?.[0]?.image_url}
                          className="w-8 h-8 rounded-md object-cover"
                          alt=""
                        />
                        <span className="text-[10px] font-bold truncate">
                          {p.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] font-bold text-gray-400">
                      لا توجد نتائج
                    </div>
                  )}
                </div>
              )}
            </form>

            <button className="p-2 text-gray-700 hover:bg-gray-50 rounded-full">
              <User size={20} />
            </button>

            {/* زر السلة - تم تحديث المسمى والحماية هنا */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:bg-gray-50 rounded-full relative"
            >
              <ShoppingCart size={20} />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold animate-in zoom-in">
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
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-black"
            >
              <img
                src="/logo.svg"
                alt="Half Million"
                className="w-full h-full object-contain p-2"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto flex-1 pb-20 custom-scrollbar">
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
            <p className="text-[10px] font-black text-gray-400 uppercase px-4 mb-2">
              الأقسام
            </p>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="border-b border-gray-50 last:border-0"
              >
                <button
                  onClick={() =>
                    setOpenMobileCat(openMobileCat === cat.id ? null : cat.id)
                  }
                  className="w-full flex items-center justify-between p-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  {cat.name}{" "}
                  <ChevronDown
                    size={16}
                    className={
                      openMobileCat === cat.id
                        ? "rotate-180 text-black"
                        : "text-gray-300"
                    }
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openMobileCat === cat.id
                      ? "max-h-96 opacity-100 py-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {cat.sub_categories?.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${cat.id}/${sub.id}`}
                      className="text-xs font-bold text-gray-500 py-3 px-8 hover:text-black flex border-r-2 border-gray-100"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
