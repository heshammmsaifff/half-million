"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  PackageOpen,
  Plus,
  Loader2,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function BrandProductsPage({ params: paramsPromise }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBrandData = async () => {
      const params = await paramsPromise;
      const { id } = params;

      try {
        const { data, error } = await supabase
          .from("brands")
          .select(
            `
            name,
            description,
            image_url,
            products (
              id,
              name,
              base_price,
              discount_type,
              discount_value,
              is_available,
              product_images (image_url, is_main)
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setBrand(data);
      } catch (err) {
        console.error("Error fetching brand:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
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
          جاري تنسيق منتجات البراند...
        </p>
      </div>
    );

  if (!brand)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F4]">
        <div className="text-center p-10 bg-white rounded-[3rem] shadow-sm">
          <PackageOpen size={50} className="mx-auto text-gray-200 mb-4" />
          <p className="font-black text-[#2D3436]">
            هذا البراند غير متوفر حالياً
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-[#5F6F52] font-bold underline"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      {/* هيدر البراند - تصميم بانورامي */}
      <div className="relative bg-[#2D3436] pt-20 pb-28 px-6 overflow-hidden">
        {/* الدوائر الزخرفية في الخلفية */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5F6F52]/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E29595]/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* لوغو البراند */}
            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center p-6 border-4 border-[#F8F9F4]/10 transform hover:rotate-3 transition-transform duration-500">
              <img
                src={brand.image_url}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* تفاصيل البراند */}
            <div className="text-center md:text-right flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Star size={16} className="text-[#E29595] fill-[#E29595]" />
                <span className="text-[#C3CBB9] text-xs font-black tracking-widest uppercase">
                  براند معتمد
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                {brand.name}
              </h1>
              <p className="text-[#C3CBB9] text-lg max-w-2xl font-medium leading-relaxed">
                {brand.description ||
                  "اكتشفي التميز مع تشكيلة منتجاتنا الحصرية."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* عرض المنتجات */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {brand.products?.map((product) => {
            const mainImg =
              product.product_images?.find((img) => img.is_main)?.image_url ||
              product.product_images?.[0]?.image_url ||
              "/placeholder.jpg";

            const discount = Number(product.discount_value || 0);
            const finalPrice =
              product.discount_type === "percentage"
                ? product.base_price * (1 - discount / 100)
                : product.base_price - discount;

            return (
              <div key={product.id} className="group relative">
                <Link
                  href={`/product/${product.id}`}
                  className="block bg-white rounded-[2.5rem] border border-[#C3CBB9]/20 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#5F6F52]/10 transition-all duration-500 h-full"
                >
                  <div className="aspect-square bg-[#F8F9F4] relative overflow-hidden">
                    <img
                      src={mainImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {!product.is_available && (
                      <div className="absolute inset-0 bg-[#2D3436]/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="bg-white text-[#2D3436] px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                          نفدت الكمية
                        </span>
                      </div>
                    )}

                    {discount > 0 && product.is_available && (
                      <div className="absolute top-5 right-5 bg-[#E29595] text-white px-4 py-1.5 rounded-full font-black text-[10px] shadow-lg">
                        خصم {discount}
                        {product.discount_type === "percentage" ? "%" : " ج.م"}
                      </div>
                    )}
                  </div>

                  <div className="p-7 pb-24 text-right">
                    <h3 className="font-black text-[#2D3436] text-lg mb-4 line-clamp-1 group-hover:text-[#5F6F52] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-black text-[#2D3436]">
                        {finalPrice.toLocaleString()}{" "}
                        <small className="text-xs font-bold">ج.م</small>
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-[#C3CBB9] line-through font-bold">
                          {product.base_price.toLocaleString()} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* زر أضف للسلة */}
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
                      ? "جاري..."
                      : product.is_available
                      ? "أضف للسلة"
                      : "غير متوفر"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* الحالة الفارغة */}
      {brand.products?.length === 0 && (
        <div className="max-w-2xl mx-auto mt-20 text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-[#C3CBB9]/20 shadow-inner">
          <PackageOpen
            size={80}
            className="mx-auto text-[#C3CBB9] mb-6 opacity-40"
          />
          <h3 className="text-2xl font-black text-[#2D3436] mb-2">
            قريباً جداً!
          </h3>
          <p className="text-[#5F6F52] font-bold opacity-60">
            نحن بصدد إضافة أحدث منتجات {brand.name} إلى مجموعتنا.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 bg-[#2D3436] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#5F6F52] transition-all"
          >
            استكشفي براندات أخرى <ArrowRight size={18} className="rotate-180" />
          </Link>
        </div>
      )}
    </div>
  );
}
