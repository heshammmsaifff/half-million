"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Info,
  ShoppingBag,
  Youtube,
  XCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import ProductImageGallery from "@/components/ProductImageGallery";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductDetailsPage({ params: paramsPromise }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { productId } = await paramsPromise;
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            brands!left (name), 
            product_images (id, image_url, is_main),
            sub_categories!left (
              id, 
              name, 
              category_id 
            ),
            comparison_product:comparison_product_id (id, name, base_price)
          `
          )
          .eq("id", Number(productId))
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Supabase Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [paramsPromise]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold animate-pulse text-gray-400">
        جاري تحميل تفاصيل المنتج...
      </div>
    );

  if (!product)
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-white"
        dir="rtl"
      >
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          المنتج غير موجود
        </h2>
        <Link
          href="/"
          className="mt-8 px-10 py-4 bg-black text-white rounded-full font-bold shadow-lg"
        >
          العودة للمتجر
        </Link>
      </div>
    );

  // منطق حساب السعر والخصم
  const basePrice = Number(product.base_price);
  const discountValue = Number(product.discount_value || 0);
  const finalPrice =
    product.discount_type === "percentage"
      ? basePrice - basePrice * (discountValue / 100)
      : basePrice - discountValue;

  // ترتيب الصور لتكون الصورة الرئيسية هي الأولى
  const images = [...(product.product_images || [])].sort(
    (a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)
  );

  const handleAddToCart = async () => {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 600));

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: images[0]?.image_url,
    });

    toast.success("تمت الإضافة للسلة بنجاح", {
      style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
        direction: "rtl",
        fontWeight: "bold",
      },
    });
    setAdding(false);
  };

  const videoId = product.youtube_link?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/
  )?.[1];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-16 pb-32" dir="rtl">
      {/* Breadcrumbs - روابط التتبع العلوية */}
      <nav className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">
          الرئيسية
        </Link>
        <ChevronRight size={14} className="rotate-180" />
        <Link
          href={`/category/${product.sub_categories?.category_id}/${product.sub_categories?.id}`}
          className="hover:text-black transition-colors"
        >
          {product.sub_categories?.name}
        </Link>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-black truncate max-w-[200px] md:max-w-none">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* معرض الصور */}
        <div className="sticky top-8">
          <ProductImageGallery images={images} productName={product.name} />
        </div>

        {/* تفاصيل المنتج الأساسية */}
        <div className="flex flex-col space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-black text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.brands?.name || "ماركة أصلية"}
              </span>
              {product.is_available ? (
                <span className="flex items-center gap-1.5 text-green-600 font-black text-[11px] bg-green-50 px-4 py-1.5 rounded-full">
                  <CheckCircle2 size={14} /> متوفر حالياً
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-gray-400 font-black text-[11px] bg-gray-100 px-4 py-1.5 rounded-full">
                  <XCircle size={14} /> نفدت الكمية
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">
              {product.name}
            </h1>
            <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          {/* بوكس السعر والشراء */}
          <div className="bg-gray-50 p-10 rounded-[3rem] space-y-8 border border-gray-100 shadow-sm">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-black tracking-tighter">
                {finalPrice.toLocaleString()}{" "}
                <small className="text-xl font-bold mr-2">ج.م</small>
              </span>
              {discountValue > 0 && (
                <span className="text-gray-300 line-through text-2xl font-bold italic">
                  {basePrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.is_available || adding}
              className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all
                ${
                  product.is_available
                    ? "bg-black text-white hover:bg-gray-800 shadow-2xl shadow-black/20 active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {adding ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <ShoppingBag size={24} />
              )}
              {product.is_available
                ? adding
                  ? "جاري الإضافة..."
                  : "إضافة إلى السلة"
                : "نفدت الكمية"}
            </button>
          </div>

          {/* الوصف التفصيلي */}
          {product.detailed_description && (
            <div className="bg-white border-r-4 border-black p-8 rounded-2xl shadow-sm">
              <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                <Info size={22} /> تفاصيل المنتج:
              </h4>
              <p className="text-gray-600 leading-loose text-lg font-medium whitespace-pre-line">
                {product.detailed_description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* قسم المكونات والفوائد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="bg-black text-white p-12 rounded-[4rem]">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
              <FlaskConical className="text-gray-400" size={30} /> المكونات
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl font-bold text-sm border border-white/10"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.benefits && product.benefits.length > 0 && (
          <div className="bg-gray-100 p-12 rounded-[4rem]">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-4 text-gray-900">
              <CheckCircle2 className="text-black" size={30} /> الفوائد
            </h3>
            <ul className="grid grid-cols-1 gap-5 font-bold text-gray-700">
              {product.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-center bg-white p-5 rounded-2xl shadow-sm"
                >
                  <span className="w-2 h-2 bg-black rounded-full shrink-0" />{" "}
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* طريقة الاستخدام والتحذيرات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {product.usage_instructions &&
          product.usage_instructions.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-3xl font-black flex items-center gap-4">
                طريقة الاستخدام
              </h3>
              <div className="space-y-4">
                {product.usage_instructions.map((step, i) => (
                  <div
                    key={i}
                    className="group flex gap-6 p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-black transition-all"
                  >
                    <span className="text-5xl font-black text-gray-200 group-hover:text-black transition-colors">
                      0{i + 1}
                    </span>
                    <p className="text-gray-600 font-black text-lg self-center leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {product.warnings && product.warnings.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-3xl font-black flex items-center gap-4 text-red-600">
              تحذيرات هامة
            </h3>
            <div className="bg-red-50 p-10 rounded-[3rem] border-2 border-dashed border-red-200">
              {product.warnings.map((warn, i) => (
                <p
                  key={i}
                  className="mb-4 last:mb-0 text-red-900 font-black text-lg flex items-start gap-3"
                >
                  <AlertTriangle className="shrink-0 mt-1" size={20} /> {warn}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* فيديو اليوتيوب */}
      {videoId && (
        <div className="py-24 border-t border-gray-100 text-center">
          <div className="inline-flex items-center gap-3 bg-red-50 px-6 py-2 rounded-full mb-8 text-red-600 font-black text-sm">
            <Youtube size={20} /> مراجعة المنتج بالفيديو
          </div>
          <div className="max-w-5xl mx-auto aspect-video rounded-[4rem] overflow-hidden shadow-3xl bg-black border-[12px] border-white ring-1 ring-gray-100">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`}
              title="YouTube product video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
