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
  Loader2, // أيقونة التحميل
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast"; // استيراد الـ toast

export default function AllProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // حالة تتبع التحميل لكل زر إضافة بشكل منفصل
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
      setMinAvailablePrice(Math.min(...prices));
      setMaxAvailablePrice(Math.max(...prices));
      setPriceRange([0, Math.max(...prices)]);
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

  const handleAddToCart = async (e, product, finalPrice, mainImg) => {
    e.preventDefault();
    e.stopPropagation();

    // تشغيل حالة التحميل لهذا المنتج فقط
    setAddingId(product.id);

    // محاكاة تأخير بسيط لإعطاء انطباع بالمعالجة (اختياري)
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: mainImg,
    });

    // إظهار التنبيه
    toast.success(`${product.name} تمت إضافته للسلة`, {
      style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
        fontWeight: "bold",
        direction: "rtl",
      },
    });

    // إيقاف حالة التحميل
    setAddingId(null);
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold animate-pulse">
        جاري التحميل...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-right" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <ShoppingBag className="text-gray-600" size={32} /> جميع المنتجات
        </h1>
      </div>

      {/* الفلتر (كما هو) */}
      <div className="mb-10 bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-3 font-black text-gray-700">
            <Filter size={20} className="text-gray-600" /> تصفية المنتجات
          </div>
          {isFilterOpen ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isFilterOpen && (
          <div className="p-6 border-t grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2">
                الفئة الرئيسية
              </label>
              <select
                value={selectedMainCat}
                onChange={(e) => {
                  setSelectedMainCat(e.target.value);
                  setSelectedSubCat("all");
                }}
                className="w-full p-3 bg-gray-50 rounded-xl font-bold"
              >
                <option value="all">الكل</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2">
                السعر الأقصى
              </label>
              <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([minAvailablePrice, parseInt(e.target.value)])
                }
                className="w-full accent-gray-600"
              />
              <div className="text-sm font-bold mt-2">
                {priceRange[1].toLocaleString()} ج.م
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="text-red-500 text-sm font-bold flex items-center gap-2"
              >
                <RotateCcw size={14} /> إعادة تعيين
              </button>
            </div>
          </div>
        )}
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const mainImg =
            product.product_images?.find((img) => img.is_main)?.image_url ||
            product.product_images?.[0]?.image_url;
          const discount = Number(product.discount_value || 0);
          const finalPrice =
            product.discount_type === "percentage"
              ? product.base_price * (1 - discount / 100)
              : product.base_price - discount;

          // هل هذا المنتج قيد الإضافة حالياً؟
          const isAdding = addingId === product.id;

          return (
            <div
              key={product.id}
              className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all relative flex flex-col group"
            >
              <Link href={`/product/${product.id}`} className="flex-1">
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                      خصم {discount}
                      {product.discount_type === "percentage" ? "%" : " ج.م"}
                    </div>
                  )}
                </div>
                <div className="p-6 text-center pb-24">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    {product.brands?.name}
                  </p>
                  <div className="text-xl font-black text-gray-900">
                    {finalPrice.toLocaleString()} ج.م
                  </div>
                </div>
              </Link>

              <div className="absolute bottom-6 left-0 w-full px-6">
                <button
                  disabled={isAdding}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImg)
                  }
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdding
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-600 active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      أضف للسلة
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
