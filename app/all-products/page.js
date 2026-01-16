"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ShoppingBag,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function AllProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const [selectedMainCat, setSelectedMainCat] = useState("all");
  const [selectedSubCat, setSelectedSubCat] = useState("all");
  const [minAvailablePrice, setMinAvailablePrice] = useState(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const { data: productsData } = await supabase
      .from("products")
      .select(
        `
        *,
        brands (name),
        product_images (image_url, is_main),
        sub_categories (id, name, category_id)
      `
      )
      .order("created_at", { ascending: false });

    const { data: mainCats } = await supabase
      .from("main_categories")
      .select("*");
    const { data: subCats } = await supabase.from("sub_categories").select("*");

    if (productsData && productsData.length > 0) {
      setProducts(productsData);
      const prices = productsData.map((p) => Number(p.base_price));
      const maxP = Math.max(...prices);
      const minP = Math.min(...prices);
      setMinAvailablePrice(minP);
      setMaxAvailablePrice(maxP);
      setPriceRange([minP, maxP]);
    }

    setCategories(mainCats || []);
    setSubCategories(subCats || []);
    setLoading(false);
  };

  // تصفية الفئات الفرعية بناءً على الفئة الرئيسية المختارة
  const filteredSubCategories = useMemo(() => {
    if (selectedMainCat === "all") return [];
    return subCategories.filter(
      (sub) => sub.category_id === parseInt(selectedMainCat)
    );
  }, [selectedMainCat, subCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchMainCat =
        selectedMainCat === "all" ||
        product.sub_categories?.category_id === parseInt(selectedMainCat);
      const matchSubCat =
        selectedSubCat === "all" ||
        product.subcategory_id === parseInt(selectedSubCat);
      const matchPrice = product.base_price <= priceRange[1];
      return matchMainCat && matchSubCat && matchPrice;
    });
  }, [products, selectedMainCat, selectedSubCat, priceRange]);

  const resetFilters = () => {
    setSelectedMainCat("all");
    setSelectedSubCat("all");
    setPriceRange([minAvailablePrice, maxAvailablePrice]);
  };

  const handleAddToCart = async (e, product, finalPrice, mainImg) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: mainImg,
    });

    toast.success(`${product.name} تمت إضافته للسلة`, {
      style: {
        borderRadius: "15px",
        background: "#2D3436",
        color: "#fff",
        fontWeight: "bold",
        direction: "rtl",
      },
    });
    setAddingId(null);
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-[#5F6F52]" />
        <span className="font-black text-[#5F6F52] animate-pulse text-lg">
          جاري التحميل...
        </span>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-12 text-right" dir="rtl">
      {/* الرأس */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#2D3436] mb-2">
            مجموعة المنتجات
          </h1>
          <p className="text-[#5F6F52] font-bold opacity-70">
            استكشفي أسرار جمالكِ من أفضل الماركات العالمية
          </p>
        </div>
        <div className="bg-[#F8F9F4] px-6 py-3 rounded-2xl border border-[#C3CBB9]/30">
          <span className="text-sm font-black text-[#2D3436]">
            النتائج:{" "}
            <span className="text-[#5F6F52]">{filteredProducts.length}</span>{" "}
            منتج
          </span>
        </div>
      </div>

      {/* الفلتر المطور */}
      <div className="mb-12 bg-white border border-[#C3CBB9]/20 rounded-[2.5rem] overflow-hidden shadow-sm">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-[#F8F9F4]/50 transition-colors"
        >
          <div className="flex items-center gap-3 font-black text-[#2D3436]">
            <div className="w-10 h-10 bg-[#5F6F52] text-white rounded-xl flex items-center justify-center">
              <Filter size={18} />
            </div>
            تخصيص البحث والتصفية
          </div>
          <div
            className={`transition-transform duration-300 ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="text-[#5F6F52]" />
          </div>
        </button>

        {isFilterOpen && (
          <div className="p-8 border-t border-[#C3CBB9]/10 bg-[#F8F9F4]/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* الفئة الرئيسية */}
              <div>
                <label className="block text-[11px] font-black text-[#5F6F52] uppercase mb-3 pr-2">
                  الفئة الرئيسية
                </label>
                <select
                  value={selectedMainCat}
                  onChange={(e) => {
                    setSelectedMainCat(e.target.value);
                    setSelectedSubCat("all"); // إعادة تعيين الفرعية عند تغيير الرئيسية
                  }}
                  className="w-full p-4 bg-white border border-[#C3CBB9]/30 rounded-2xl font-bold text-[#2D3436] focus:ring-4 focus:ring-[#5F6F52]/5 outline-none transition-all"
                >
                  <option value="all">كل الأقسام</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* الفئة الفرعية - تظهر فقط عند اختيار رئيسية */}
              <div>
                <label className="block text-[11px] font-black text-[#5F6F52] uppercase mb-3 pr-2">
                  الفئة الفرعية
                </label>
                <select
                  disabled={selectedMainCat === "all"}
                  value={selectedSubCat}
                  onChange={(e) => setSelectedSubCat(e.target.value)}
                  className={`w-full p-4 border rounded-2xl font-bold text-[#2D3436] focus:ring-4 focus:ring-[#5F6F52]/5 outline-none transition-all ${
                    selectedMainCat === "all"
                      ? "bg-gray-50 border-gray-200 text-gray-400 opacity-50"
                      : "bg-white border-[#C3CBB9]/30"
                  }`}
                >
                  <option value="all">الكل</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* نطاق السعر */}
              <div>
                <label className="block text-[11px] font-black text-[#5F6F52] uppercase mb-3 pr-2">
                  نطاق السعر
                </label>
                <input
                  type="range"
                  min={minAvailablePrice}
                  max={maxAvailablePrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([minAvailablePrice, parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-[#C3CBB9]/30 rounded-lg appearance-none cursor-pointer accent-[#5F6F52]"
                />
                <div className="text-sm font-black text-[#2D3436] mt-4 flex justify-between">
                  <span>{priceRange[1].toLocaleString()} ج.م</span>
                  <span className="text-gray-400 font-normal">كحد أقصى</span>
                </div>
              </div>

              {/* إعادة تعيين */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-sm font-black hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> مسح الفلاتر
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product) => {
          const mainImg =
            product.product_images?.find((img) => img.is_main)?.image_url ||
            product.product_images?.[0]?.image_url;
          const discount = Number(product.discount_value || 0);
          const finalPrice =
            product.discount_type === "percentage"
              ? product.base_price * (1 - discount / 100)
              : product.base_price - discount;
          const isAdding = addingId === product.id;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-[2.5rem] border border-[#C3CBB9]/20 overflow-hidden hover:shadow-[0_20px_50px_rgba(95,111,82,0.1)] transition-all duration-500 relative flex flex-col"
            >
              <Link href={`/product/${product.id}`} className="flex-1">
                <div className="aspect-[4/5] relative overflow-hidden bg-[#F8F9F4]">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {discount > 0 && (
                    <div className="absolute top-5 right-5 bg-[#E29595] text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg">
                      خصم {discount}
                      {product.discount_type === "percentage" ? "%" : " ج.م"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-8 text-center pb-28">
                  <span className="text-[10px] font-black text-[#5F6F52] uppercase tracking-[0.2em] mb-2 block opacity-60">
                    {product.brands?.name}
                  </span>
                  <h3 className="text-lg font-black text-[#2D3436] mb-3 line-clamp-1 group-hover:text-[#5F6F52] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-black text-[#2D3436]">
                      {finalPrice.toLocaleString()}{" "}
                      <small className="text-[10px] mr-1">ج.م</small>
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through font-bold">
                        {product.base_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="absolute bottom-8 left-0 w-full px-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <button
                  disabled={isAdding}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImg)
                  }
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                    isAdding
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#2D3436] text-white hover:bg-[#5F6F52] shadow-xl shadow-[#2D3436]/10 active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={18} /> أضف للسلة{" "}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
