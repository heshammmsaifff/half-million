"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { PackageOpen, ArrowRight, Plus, Loader2 } from "lucide-react";
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

    toast.success(`${product.name} أضيف للسلة`, {
      style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
        fontWeight: "bold",
        direction: "rtl",
      },
    });

    setAddingId(null);
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold animate-pulse">
        جاري تحميل القسم...
      </div>
    );

  if (!subCategory) {
    return (
      <div className="p-20 text-center" dir="rtl">
        <h2 className="text-gray-900 font-black text-2xl mb-4">
          حدث خطأ في تحميل البيانات
        </h2>
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-full inline-block"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const products = subCategory.products || [];

  return (
    <div className="max-w-7xl mx-auto p-6 text-right" dir="rtl">
      {/* هيدر القسم - تصميم Monochrome */}
      <div className="mb-12 p-10 bg-black rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <ArrowRight size={14} className="rotate-180 opacity-50" />
            <span className="opacity-80">
              {subCategory.main_categories?.name || "قسم عام"}
            </span>
            <ArrowRight size={14} className="rotate-180 opacity-50" />
            <span className="font-bold text-white">{subCategory.name}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            {subCategory.name}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            {subCategory.description ||
              "استعرض مجموعة مختارة من أفضل المنتجات في هذا القسم."}
          </p>
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* عرض المنتجات */}
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

          const isAdding = addingId === product.id;

          return (
            <div
              key={product.id}
              className="relative group flex flex-col h-full"
            >
              <Link
                href={`/product/${product.id}`}
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full pb-24"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="bg-black text-white px-4 py-2 rounded-xl font-bold text-xs">
                        نفدت الكمية
                      </span>
                    </div>
                  )}
                  {discount > 0 && product.is_available && (
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full font-black text-[10px]">
                      خصم {discount}
                      {product.discount_type === "percentage" ? "%" : " ج.م"}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
                    {product.brands?.name || "ماركة أصلية"}
                  </p>
                  <h3 className="font-bold text-gray-800 mb-4 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-black">
                      {finalPrice.toLocaleString()}{" "}
                      <small className="text-[10px]">ج.م</small>
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-400 line-through font-bold">
                        {basePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* زر الإضافة للسلة */}
              <div className="absolute bottom-6 left-0 w-full px-6">
                <button
                  disabled={isAdding || !product.is_available}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImg)
                  }
                  className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    !product.is_available
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isAdding
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-600 active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : !product.is_available ? (
                    "غير متوفر"
                  ) : (
                    <>
                      <Plus size={16} />
                      أضف للسلة
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <PackageOpen size={80} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-black text-gray-400">
            هذا القسم فارغ حالياً
          </h3>
        </div>
      )}
    </div>
  );
}
