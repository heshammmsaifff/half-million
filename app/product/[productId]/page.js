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
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Tag,
  Award,
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
            brands!left (id, name), 
            product_images (id, image_url, is_main),
            sub_categories!left (id, name, category_id),
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-black" size={40} />
        <p className="font-bold text-gray-500">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );

  if (!product)
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-white"
        dir="rtl"
      >
        <XCircle size={80} className="text-gray-200 mb-6" />
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          المنتج غير متوفر حالياً
        </h2>
        <Link
          href="/"
          className="mt-8 px-10 py-4 bg-black text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all"
        >
          العودة للمتجر
        </Link>
      </div>
    );

  const basePrice = Number(product.base_price);
  const discountValue = Number(product.discount_value || 0);
  const finalPrice =
    product.discount_type === "percentage"
      ? basePrice - basePrice * (discountValue / 100)
      : basePrice - discountValue;

  const discountPercentage =
    product.discount_type === "percentage"
      ? discountValue
      : Math.round((discountValue / basePrice) * 100);

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
    <div className="bg-[#f8f9fa] min-h-screen pb-20" dir="rtl">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-xs font-bold text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">
            الرئيسية
          </Link>
          <ChevronRight size={12} className="rotate-180" />
          <Link
            href={`/category/${product.sub_categories?.category_id}/${product.sub_categories?.id}`}
            className="hover:text-black transition-colors"
          >
            {product.sub_categories?.name}
          </Link>
          <ChevronRight size={12} className="rotate-180" />
          <span className="text-black truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* العمود الأول: الصور */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
              <ProductImageGallery images={images} productName={product.name} />
            </div>
          </div>

          {/* العمود الثاني: معلومات المنتج */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-black">
                  <span className="text-black">من منتجات</span>{" "}
                  {product.brands?.name || "Half Million"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* قسم التصنيف والعلامة التجارية */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <Tag size={16} />
                  <span>التصنيف:</span>
                </div>
                <Link
                  href={`/category/${product.sub_categories?.category_id}/${product.sub_categories?.id}`}
                  className="text-sm font-black text-black hover:underline"
                >
                  {product.sub_categories?.name}
                </Link>
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <Award size={16} />
                  <span>العلامة التجارية:</span>
                </div>
                <Link
                  href={`/brand/${product.brands?.id}`}
                  className="text-sm font-black text-black hover:underline"
                >
                  {product.brands?.name || "Half Million"}
                </Link>
              </div>
            </div>

            {/* الوصف المفصل */}
            {product.detailed_description && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h4 className="font-black text-sm mb-4 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" /> عن المنتج:
                </h4>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.detailed_description}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h4 className="font-black text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" /> ضمان
                الجودة:
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                هذا المنتج أصلي 100% وتم فحصه مخبرياً لضمان أعلى معايير السلامة
                والجودة العالمية.
              </p>
            </div>
          </div>

          {/* العمود الثالث: بوكس الشراء */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-xl shadow-black/5 sticky top-8 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-black">
                    {finalPrice.toLocaleString()}{" "}
                    <small className="text-sm">ج.م</small>
                  </span>
                  {discountValue > 0 && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-black">
                      خصم {discountPercentage}%
                    </span>
                  )}
                </div>
                {discountValue > 0 && (
                  <p className="text-gray-400 line-through font-bold text-sm">
                    {basePrice.toLocaleString()} ج.م
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.is_available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  {product.is_available ? "متوفر - اطلب الآن" : "غير متوفر"}
                </div>
                <div className="text-xs text-gray-500 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Truck size={14} /> توصيل سريع خلال 2-4 أيام
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.is_available || adding}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all
                  ${
                    product.is_available
                      ? "bg-black text-white hover:bg-gray-600 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {adding ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShoppingBag size={20} />
                )}
                {product.is_available
                  ? adding
                    ? "جاري الإضافة..."
                    : "أضف للسلة"
                  : "غير متوفر حالياً"}
              </button>
            </div>
          </div>
        </div>

        {/* أقسام المعلومات التفصيلية */}
        <div className="mt-20 space-y-12">
          {/* فوائد ومكونات بتصميم Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <FlaskConical size={28} className="text-blue-600" /> تركيبة
                المنتج
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.ingredients?.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-bold text-blue-900">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <CheckCircle2 size={28} className="text-green-600" /> النتائج
                المتوقعة
              </h3>
              <div className="space-y-4">
                {product.benefits?.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 bg-green-50/50 rounded-2xl"
                  >
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle2 size={14} className="text-green-600" />
                    </div>
                    <p className="font-bold text-green-900 text-sm leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* طريقة الاستخدام والتحذيرات */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black mb-8">
                خطوات الاستخدام المثالية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.usage_instructions?.map((step, i) => (
                  <div
                    key={i}
                    className="relative p-6 bg-gray-50 rounded-2xl border-r-4 border-black"
                  >
                    <span className="absolute left-6 top-6 text-4xl font-black text-gray-200/50 italic">
                      0{i + 1}
                    </span>
                    <p className="text-gray-700 font-bold relative z-10 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-red-50 p-10 rounded-[2.5rem] border border-red-100">
              <h3 className="text-xl font-black text-red-900 mb-6 flex items-center gap-2">
                <AlertTriangle size={24} /> تنبيهات هامة
              </h3>
              <ul className="space-y-4">
                {product.warnings?.map((warn, i) => (
                  <li
                    key={i}
                    className="text-red-800 text-sm font-bold flex gap-3 leading-relaxed"
                  >
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></div>
                    {warn}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* فيديو اليوتيوب */}
          {videoId && (
            <div className="pt-20 border-t border-gray-100">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center">
                  <h3 className="text-3xl font-black mb-2 text-gray-900">
                    شاهد المنتج في العمل
                  </h3>
                  <p className="text-gray-500 font-medium">
                    مراجعة تفصيلية تشرح مميزات المنتج وطريقة استخدامه الصحيحة
                  </p>
                </div>
                <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-black ring-[15px] ring-white">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="Product Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
