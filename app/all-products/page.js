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
} from "lucide-react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // حالات الفلاتر
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
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      setMinAvailablePrice(minP);
      setMaxAvailablePrice(maxP);
      setPriceRange([minP, maxP]);
    }

    setCategories(mainCats || []);
    setSubCategories(subCats || []);
    setLoading(false);
  };

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

  if (loading)
    return (
      <div className="p-20 text-center font-bold animate-pulse" dir="rtl">
        جاري تحميل المنتجات...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-right" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-blue-600" size={32} /> المتجر الكامل
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            استكشف {filteredProducts.length} منتجاً متاحاً
          </p>
        </div>
      </div>

      {/* --- فلتر البحث المنسدل --- */}
      <div className="mb-10 bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 font-black text-gray-700">
            <Filter size={20} className="text-blue-600" />
            تصفية المنتجات حسب اختيارك
          </div>
          {isFilterOpen ? (
            <ChevronUp className="text-gray-400" />
          ) : (
            <ChevronDown className="text-gray-400" />
          )}
        </button>

        {isFilterOpen && (
          <div className="p-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white">
            {/* الفئة الرئيسية */}
            <div>
              <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">
                الفئة الرئيسية
              </label>
              <select
                value={selectedMainCat}
                onChange={(e) => {
                  setSelectedMainCat(e.target.value);
                  setSelectedSubCat("all");
                }}
                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* الفئة الفرعية */}
            <div>
              <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-wider">
                الفئة الفرعية
              </label>
              <select
                value={selectedSubCat}
                onChange={(e) => setSelectedSubCat(e.target.value)}
                disabled={selectedMainCat === "all"}
                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="all">الكل</option>
                {subCategories
                  .filter(
                    (sub) =>
                      selectedMainCat === "all" ||
                      sub.category_id === parseInt(selectedMainCat)
                  )
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* فلتر السعر */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                  الحد الأقصى للسعر
                </label>
                <span className="text-sm font-black text-blue-600">
                  {priceRange[1].toLocaleString()} ج.م
                </span>
              </div>
              <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([minAvailablePrice, parseInt(e.target.value)])
                }
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                <span>{minAvailablePrice} ج.م</span>
                <span>{maxAvailablePrice} ج.م</span>
              </div>
            </div>

            <div className="md:col-span-3 pt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm font-bold text-red-500 flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
              >
                <RotateCcw size={14} /> إعادة تعيين الفلاتر
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- شبكة المنتجات (Grid Responsive) --- */}
      <main>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const mainImg =
                product.product_images?.find((img) => img.is_main)?.image_url ||
                product.product_images?.[0]?.image_url;
              const discount = Number(product.discount_value || 0);
              const finalPrice =
                product.discount_type === "percentage"
                  ? product.base_price - product.base_price * (discount / 100)
                  : product.base_price - discount;

              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    {mainImg && (
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    {discount > 0 && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                        {product.discount_type === "percentage"
                          ? `خصم ${discount}%`
                          : `خصم ${discount} ج.م`}
                      </div>
                    )}
                  </div>

                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* البراند تحت الاسم */}
                    <p className="text-xs text-gray-400 font-medium mb-5">
                      من منتجات {product.brands?.name || "متجرنا"}
                    </p>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-2xl font-black text-gray-900">
                        {finalPrice.toLocaleString()}{" "}
                        <small className="text-xs font-normal">ج.م</small>
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-300 line-through font-bold">
                          {product.base_price.toLocaleString()} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black text-xl">
              لا توجد منتجات تطابق اختياراتك
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 text-blue-600 font-bold underline"
            >
              إظهار كل المنتجات
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
