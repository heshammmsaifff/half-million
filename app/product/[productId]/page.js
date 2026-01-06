"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ChevronRight,
  ShoppingBag,
  Loader2,
  Tag,
  Award,
  Info,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  ExternalLink,
  X,
  Star,
  ShieldCheck,
} from "lucide-react";
import ProductImageGallery from "@/components/ProductImageGallery";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductDetailsPage({ params: paramsPromise }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comparisonProduct, setComparisonProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const { productId } = await paramsPromise;
      try {
        // 1. جلب بيانات المنتج الأساسي مع ربط جدول المقارنة والعلامة التجارية
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select(
            `
    *,
    brands!left (id, name), 
    product_images (id, image_url, is_main),
    sub_categories:subcategory_id (id, name, category_id),
    compared_with:comparison_product_id (
      id, 
      name, 
      description,
      base_price,
      product_images (image_url, is_main)
    )
  `
          )
          .eq("id", Number(productId))
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // تعيين منتج المقارنة إذا وجد
        if (productData.compared_with) {
          setComparisonProduct(productData.compared_with);
        }

        // 2. جلب منتجات متعلقة (4 منتجات كما في الكود الأول لتصميم الشبكة)
        if (productData?.subcategory_id) {
          const { data: relatedData } = await supabase
            .from("products")
            .select("*, product_images (image_url, is_main)")
            .eq("subcategory_id", productData.subcategory_id)
            .neq("id", productData.id)
            .limit(10);

          if (relatedData) {
            const shuffled = [...relatedData]
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
            setRelatedProducts(shuffled);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  // حسابات الأسعار
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
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      {isModalOpen && comparisonProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2D3436]/80 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-[#C3CBB9]/20">
            <div className="relative p-8 text-center space-y-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 p-2 hover:bg-[#F8F9F4] rounded-full transition-colors text-[#2D3436]"
              >
                <X size={24} />
              </button>

              <div className="w-48 h-48 mx-auto bg-[#F8F9F4] rounded-[2.5rem] p-6 border border-[#C3CBB9]/20 relative">
                <img
                  src={
                    comparisonProduct.product_images?.find((img) => img.is_main)
                      ?.image_url ||
                    comparisonProduct.product_images?.[0]?.image_url
                  }
                  alt={comparisonProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#2D3436]">
                  {comparisonProduct.name}
                </h3>
                <p className="text-[#5F6F52] font-black text-xl">
                  {Number(comparisonProduct.base_price).toLocaleString()} ج.م
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
                  {comparisonProduct.description ||
                    "لا يوجد وصف مختصر متوفر حالياً لهذا المنتج."}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href={`/product/${comparisonProduct.id}`}
                  className="w-full py-4 bg-[#2D3436] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#5F6F52] transition-all shadow-lg shadow-[#2D3436]/20"
                >
                  عرض المنتج بالكامل <ExternalLink size={18} />
                </Link>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-[#F8F9F4] text-[#2D3436] rounded-2xl font-bold hover:bg-[#E2E8D8] transition-all"
                >
                  العودة للمنتج الحالي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs - مسار التصفح */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-[#C3CBB9]/20">
        <nav className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-3 text-xs font-black text-[#C3CBB9]">
          <Link href="/" className="hover:text-[#5F6F52] transition-colors">
            الرئيسية
          </Link>
          <ChevronRight size={14} className="rotate-180" />
          <Link
            href={`/category/1/${product.sub_categories?.id}`}
            className="hover:text-[#5F6F52] transition-all"
          >
            {product.sub_categories?.name}
          </Link>
          <ChevronRight size={14} className="rotate-180" />
          <span className="text-[#2D3436] truncate max-w-[150px]">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* العمود الأول: معرض الصور */}
          <div className="lg:col-span-5">
            <ProductImageGallery images={images} productName={product.name} />
          </div>

          {/* العمود الثاني: معلومات المنتج */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#5F6F52]/10 text-[#5F6F52] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#5F6F52]/20">
                  {product.brands?.name || "Premium Collection"}
                </span>
                {product.is_available && (
                  <span className="flex items-center gap-1 text-[#5F6F52] text-[10px] font-bold">
                    <ShieldCheck size={14} /> أصلي 100%
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-[#2D3436] leading-tight tracking-tight">
                {product.name}
              </h1>

              <p className="text-gray-600 text-lg font-medium leading-relaxed italic">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 bg-white p-4 rounded-2xl border border-[#C3CBB9]/20">
                <span className="text-gray-400 text-[10px] font-black flex items-center gap-1 uppercase">
                  <Tag size={12} /> القسم
                </span>
                <span className="text-[#2D3436] font-bold text-sm">
                  {product.sub_categories?.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-white p-4 rounded-2xl border border-[#C3CBB9]/20">
                <span className="text-gray-400 text-[10px] font-black flex items-center gap-1 uppercase">
                  <Award size={12} /> البراند
                </span>
                <span className="text-[#2D3436] font-bold text-sm">
                  {product.brands?.name || "Half Million"}
                </span>
              </div>
            </div>

            {product.detailed_description && (
              <div className="bg-white p-8 rounded-[2rem] border border-[#C3CBB9]/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-[#5F6F52]" />
                <h4 className="font-black text-[#2D3436] mb-4 flex items-center gap-2">
                  <Info size={20} className="text-[#5F6F52]" /> التفاصيل الكاملة
                </h4>
                <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {product.detailed_description}
                </div>
              </div>
            )}
          </div>

          {/* العمود الثالث: كارت الشراء (Price Card) */}
          <div className="lg:col-span-3">
            <div className="bg-[#2D3436] p-8 rounded-[3rem] shadow-2xl shadow-[#2D3436]/20 sticky top-28 space-y-8 text-white">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">
                    {finalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-[#C3CBB9]">ج.م</span>
                </div>

                {discountValue > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-[#C3CBB9] line-through font-bold text-lg">
                      {basePrice.toLocaleString()} ج.م
                    </span>
                    <span className="bg-[#E29595] text-white px-3 py-1 rounded-lg text-xs font-black animate-pulse">
                      وفر {discountPercentage}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div
                  className={`flex items-center gap-2 font-bold p-3 rounded-2xl border ${
                    product.is_available
                      ? "border-[#5F6F52]/30 bg-[#5F6F52]/10 text-[#C3CBB9]"
                      : "border-red-900/30 bg-red-900/10 text-red-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.is_available
                        ? "bg-[#5F6F52] shadow-[0_0_10px_#5F6F52]"
                        : "bg-red-500"
                    }`}
                  />
                  {product.is_available
                    ? "متوفر في المخزن"
                    : "غير متوفر حالياً"}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_available || adding}
                  className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all duration-500 ${
                    product.is_available
                      ? "bg-white text-[#2D3436] hover:bg-[#F8F9F4] hover:scale-[1.02] shadow-xl"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {adding ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <ShoppingBag size={24} />
                  )}
                  {product.is_available ? "أضف للحقيبة" : "نفد من المخزن"}
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[10px] text-[#C3CBB9] font-bold">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  ضمان جودة من هاف مليون
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أقسام المعلومات الإضافية (المكونات والنتائج) */}
        <div className="mt-24 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {product.ingredients?.length > 0 && (
              <div className="bg-white p-12 rounded-[3.5rem] border border-[#C3CBB9]/20 shadow-sm relative overflow-hidden">
                <FlaskConical
                  className="absolute -bottom-10 -left-10 text-[#F8F9F4]"
                  size={200}
                />
                <h3 className="text-3xl font-black text-[#2D3436] mb-10 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-[#5F6F52]/10 rounded-2xl text-[#5F6F52]">
                    <FlaskConical size={32} />
                  </div>
                  المكونات السرية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  {product.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 bg-[#F8F9F4] rounded-[1.5rem] border border-[#C3CBB9]/10 hover:border-[#5F6F52]/30 transition-colors"
                    >
                      <div className="w-2 h-2 bg-[#5F6F52] rounded-full shadow-[0_0_8px_rgba(95,111,82,0.5)]"></div>
                      <span className="text-sm font-black text-[#2D3436]">
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.benefits?.length > 0 && (
              <div className="bg-[#5F6F52] p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden text-white">
                <Star
                  className="absolute top-10 right-10 text-white/5"
                  size={150}
                />
                <h3 className="text-3xl font-black mb-10 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/10 rounded-2xl text-white">
                    <CheckCircle2 size={32} />
                  </div>
                  النتائج المتوقعة
                </h3>
                <div className="space-y-4 relative z-10">
                  {product.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/5"
                    >
                      <CheckCircle2
                        size={20}
                        className="text-[#C3CBB9] shrink-0 mt-1"
                      />
                      <p className="font-bold text-[#F8F9F4] leading-relaxed italic">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* خطوات الاستخدام */}
          {product.usage_instructions?.length > 0 && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-[#C3CBB9]/20 shadow-sm">
              <h3 className="text-3xl font-black text-[#2D3436] mb-12 text-center italic">
                طقوس الاستخدام المثالية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {product.usage_instructions.map((step, i) => (
                  <div
                    key={i}
                    className="group relative p-8 bg-[#F8F9F4] rounded-[2.5rem] border border-transparent hover:border-[#5F6F52]/20 transition-all duration-500"
                  >
                    <span className="absolute -top-4 -right-4 w-12 h-12 bg-[#2D3436] text-white flex items-center justify-center rounded-2xl text-xl font-black shadow-lg group-hover:bg-[#5F6F52] transition-colors">
                      {i + 1}
                    </span>
                    <p className="text-[#2D3436] font-bold leading-relaxed pt-2">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* قسم التنبيهات الهامة - عرض كامل الشاشة */}
          {product.warnings?.length > 0 && (
            <div className="mt-16 w-full">
              <div className="bg-[#E29595]/5 p-8 md:p-12 rounded-[3.5rem] border border-[#E29595]/20 relative overflow-hidden group">
                {/* لمسة فنية: أيقونة خلفية ضخمة باهتة */}
                <AlertTriangle
                  className="absolute -bottom-10 -left-10 text-[#E29595]/10 rotate-12 transition-transform duration-700 group-hover:rotate-0"
                  size={250}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-[#E29595] text-white rounded-[1.2rem] shadow-lg shadow-[#E29595]/20">
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-[#2D3436]">
                        تنبيهات هامة
                      </h3>
                      <p className="text-[#E29595] text-xs font-black uppercase tracking-widest mt-1">
                        Safety & Precautions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {product.warnings.map((warn, i) => (
                      <div
                        key={i}
                        className="flex gap-4 items-start p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-[#E29595]/10 hover:border-[#E29595]/30 transition-all duration-300 shadow-sm"
                      >
                        <div className="w-2 h-2 bg-[#E29595] rounded-full mt-2 shrink-0 shadow-[0_0_10px_#E29595]"></div>
                        <p className="text-[#2D3436] text-sm md:text-base font-bold leading-relaxed">
                          {warn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* خط زخرفي علوي */}
                <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-[#E29595] to-transparent" />
              </div>
            </div>
          )}

          {/* المقارنة الذكية (Comparison) */}
          {comparisonProduct && (
            <div className="pt-20">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center mb-16 space-y-4">
                  <div className="bg-[#E29595]/10 text-[#E29595] px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-[#E29595]/20">
                    The Smart Choice
                  </div>
                  <h3 className="text-4xl font-black text-[#2D3436] text-center">
                    لماذا قد تفضلين هذا البديل؟
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 bg-white p-12 rounded-[4rem] border border-[#C3CBB9]/20 shadow-xl relative">
                  <div className="text-center group">
                    <div className="w-48 h-48 mx-auto bg-[#F8F9F4] rounded-[3rem] p-6 border border-[#C3CBB9]/10 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={images[0]?.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="mt-6 font-black text-[#2D3436]">
                      {product.name}
                    </h4>
                  </div>

                  <div className="text-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C3CBB9] to-transparent -translate-y-1/2 hidden md:block" />
                    <div className="relative z-10 bg-[#2D3436] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto font-black shadow-xl rotate-12">
                      VS
                    </div>
                    <div className="mt-8 bg-[#F8F9F4] p-6 rounded-[2rem] border border-[#C3CBB9]/20">
                      <p className="text-[#5F6F52] font-bold leading-relaxed text-sm italic">
                        {product.comparison_text ||
                          "تم اختيار هذا المنتج كبديل أو مكمل ذكي لهذا المنتج بناءً على تركيبته المتميزة."}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="text-center cursor-pointer group"
                  >
                    <div className="w-48 h-48 mx-auto bg-[#F8F9F4] rounded-[3rem] p-6 border border-[#C3CBB9]/10 group-hover:border-[#E29595] group-hover:shadow-2xl transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-[#E29595]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] flex items-center justify-center">
                        <span className="bg-white text-[#2D3436] px-4 py-2 rounded-full font-black text-[10px] shadow-sm">
                          اكتشفي الآن
                        </span>
                      </div>
                      <img
                        src={
                          comparisonProduct.product_images?.find(
                            (img) => img.is_main
                          )?.image_url ||
                          comparisonProduct.product_images?.[0]?.image_url
                        }
                        alt={comparisonProduct.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="mt-6 font-black text-[#2D3436] group-hover:text-[#E29595] transition-colors underline-offset-8 group-hover:underline">
                      {comparisonProduct.name}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* فيديو اليوتيوب */}
          {videoId && (
            <div className="pt-24 text-center">
              <h3 className="text-4xl font-black mb-12 text-[#2D3436] tracking-tight italic underline decoration-[#5F6F52] decoration-4 underline-offset-8">
                سر الجمال في خطوات..
              </h3>
              <div className="max-w-5xl mx-auto aspect-video rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(45,52,54,0.3)] bg-black ring-[1px] ring-white/10 relative group">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* المنتجات ذات الصلة */}
          {relatedProducts.length > 0 && (
            <div className="pt-32">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-4xl font-black text-[#2D3436]">
                  قد تعشقين أيضاً..
                </h3>
                <Link
                  href="/all-products"
                  className="text-[#5F6F52] font-black border-b-2 border-[#5F6F52] hover:text-[#2D3436] transition-all pb-1"
                >
                  عرض الكل
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => {
                  const pImg =
                    p.product_images?.find((i) => i.is_main)?.image_url ||
                    p.product_images?.[0]?.image_url;
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="group bg-white p-6 rounded-[3rem] border border-[#C3CBB9]/20 hover:border-[#5F6F52] transition-all duration-500"
                    >
                      <div className="aspect-[4/5] bg-[#F8F9F4] rounded-[2rem] overflow-hidden mb-6 relative">
                        <img
                          src={pImg}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <h4 className="font-black text-[#2D3436] line-clamp-1 group-hover:text-[#5F6F52] transition-colors tracking-tight text-lg">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-[#2D3436] font-black">
                          {Number(p.base_price).toLocaleString()}{" "}
                          <span className="text-[10px]">ج.م</span>
                        </p>
                        <div className="w-10 h-10 bg-[#F8F9F4] rounded-full flex items-center justify-center group-hover:bg-[#2D3436] group-hover:text-white transition-all">
                          <ShoppingBag size={18} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
