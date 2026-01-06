"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  PackageOpen,
  ArrowRight,
  Plus,
  Loader2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function SubCategoryPage({ params: paramsPromise }) {
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSubCategoryData = async () => {
      const params = await paramsPromise;
      const { subId } = params;

      if (!subId || subId === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("sub_categories")
          .select(
            `
            name,
            description,
            main_categories (name),
            products (
              id,
              name,
              base_price,
              discount_type,
              discount_value,
              is_available,
              brands (name),
              product_images (image_url, is_main)
            )
          `
          )
          .eq("id", parseInt(subId))
          .single();

        if (error) throw error;
        setSubCategory(data);
      } catch (err) {
        console.error("Error fetching subcategory:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategoryData();
  }, [paramsPromise]);

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

    toast.success(`${product.name} أضيف لجمالكِ`, {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9F4]">
        <Loader2 className="animate-spin text-[#5F6F52] mb-4" size={40} />
        <p className="text-[#5F6F52] font-black animate-pulse">
          نجهز لكِ أفضل المنتجات...
        </p>
      </div>
    );

  if (!subCategory) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#F8F9F4]"
        dir="rtl"
      >
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl">
          <h2 className="text-[#2D3436] font-black text-2xl mb-6">
            نعتذر، لم نجد هذا القسم
          </h2>
          <Link
            href="/"
            className="bg-[#5F6F52] text-white px-10 py-4 rounded-2xl font-bold inline-block hover:bg-[#2D3436] transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const products = subCategory.products || [];

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      {/* هيدر القسم - تصميم فاخر */}
      <div className="relative bg-[#2D3436] pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5F6F52]/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E29595]/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-right">
          <nav className="flex items-center gap-3 mb-8 text-[#C3CBB9] text-sm font-bold">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <ArrowRight size={14} className="rotate-180 opacity-40" />
            <span className="opacity-60">
              {subCategory.main_categories?.name}
            </span>
            <ArrowRight size={14} className="rotate-180 opacity-40" />
            <span className="text-white border-b-2 border-[#E29595] pb-1">
              {subCategory.name}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                {subCategory.name}
              </h1>
              <p className="text-[#C3CBB9] text-lg md:text-xl font-medium leading-relaxed">
                {subCategory.description ||
                  "اكتشفي تشكيلة فريدة تم اختيارها بعناية لتناسب ذوقكِ الرفيع."}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hidden md:block">
              <p className="text-white font-black text-3xl">
                {products.length}
              </p>
              <p className="text-[#C3CBB9] text-xs font-bold uppercase tracking-widest">
                منتج مميز
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* عرض المنتجات */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const basePrice = Number(product.base_price);
            const discount = Number(product.discount_value || 0);
            const finalPrice =
              product.discount_type === "percentage"
                ? basePrice - basePrice * (discount / 100)
                : basePrice - discount;

            const mainImg =
              product.product_images?.find((img) => img.is_main)?.image_url ||
              product.product_images?.[0]?.image_url ||
              "/placeholder.jpg";

            return (
              <div key={product.id} className="group relative">
                <Link
                  href={`/product/${product.id}`}
                  className="block bg-white rounded-[2.5rem] border border-[#C3CBB9]/20 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#5F6F52]/10 transition-all duration-500 h-full"
                >
                  {/* صورة المنتج */}
                  <div className="aspect-[1/1.2] relative overflow-hidden bg-[#F8F9F4]">
                    <img
                      src={mainImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* لواصق الحالة */}
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-[#2D3436]/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="bg-white text-[#2D3436] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
                          نفدت الكمية
                        </span>
                      </div>
                    )}

                    {discount > 0 && product.is_available && (
                      <div className="absolute top-5 right-5 bg-[#E29595] text-white px-4 py-1.5 rounded-full font-black text-[10px] shadow-lg flex items-center gap-1">
                        <Sparkles size={10} />
                        خصم {discount}
                        {product.discount_type === "percentage" ? "%" : " ج.م"}
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-7 pb-24 text-right">
                    <span className="text-[10px] text-[#5F6F52] font-black uppercase tracking-[0.2em] mb-2 block opacity-60">
                      {product.brands?.name || "Premium Brand"}
                    </span>
                    <h3 className="font-black text-[#2D3436] text-lg mb-4 line-clamp-2 leading-snug group-hover:text-[#5F6F52] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-[#2D3436]">
                        {finalPrice.toLocaleString()}{" "}
                        <small className="text-xs font-bold">ج.م</small>
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-[#C3CBB9] line-through font-bold">
                          {basePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* زر الإضافة للسلة - طائر فوق البطاقة */}
                <div className="absolute bottom-6 left-6 right-6">
                  <button
                    disabled={addingId === product.id || !product.is_available}
                    onClick={(e) =>
                      handleAddToCart(e, product, finalPrice, mainImg)
                    }
                    className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-lg ${
                      !product.is_available
                        ? "bg-[#F8F9F4] text-[#C3CBB9] cursor-not-allowed"
                        : addingId === product.id
                        ? "bg-[#2D3436] text-white animate-pulse"
                        : "bg-[#2D3436] text-white hover:bg-[#5F6F52] hover:-translate-y-1 active:scale-95 shadow-[#5F6F52]/20"
                    }`}
                  >
                    {addingId === product.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ShoppingBag size={16} />
                    )}
                    {addingId === product.id
                      ? "يتم التحضير..."
                      : product.is_available
                      ? "إضافة للسلة"
                      : "غير متوفر حالياً"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* الحالة الفارغة */}
      {products.length === 0 && (
        <div className="max-w-3xl mx-auto mt-20 text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-[#C3CBB9]/30 shadow-inner">
          <div className="w-24 h-24 bg-[#F8F9F4] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <PackageOpen size={40} className="text-[#C3CBB9]" />
          </div>
          <h3 className="text-2xl font-black text-[#2D3436] mb-4">
            نعمل على توفير منتجات جديدة
          </h3>
          <p className="text-[#5F6F52] font-bold opacity-60">
            تابعينا قريباً، هذا القسم سيمتلئ بكل ما هو جميل.
          </p>
        </div>
      )}
    </div>
  );
}
