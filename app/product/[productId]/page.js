"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Info,
  ShoppingBag,
  XCircle,
  Loader2,
  ChevronRight,
  Tag,
  X,
  ExternalLink,
  Award,
  ArrowLeftRight,
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
    <div className="bg-[#f8f9fa] min-h-screen pb-20" dir="rtl">
      {isModalOpen && comparisonProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="relative p-8 text-center space-y-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-48 h-48 mx-auto bg-gray-50 rounded-3xl p-4 border border-gray-100">
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
                <h3 className="text-2xl font-black">
                  {comparisonProduct.name}
                </h3>
                <p className="text-gray-500 font-bold">
                  {Number(comparisonProduct.base_price).toLocaleString()} ج.م
                </p>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {comparisonProduct.description ||
                    "لا يوجد وصف مختصر متوفر حالياً لهذا المنتج."}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href={`/product/${comparisonProduct.id}`}
                  className="w-full py-4 bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                  عرض المنتج بالكامل <ExternalLink size={18} />
                </Link>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-xs font-bold text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">
            الرئيسية
          </Link>
          <ChevronRight size={12} className="rotate-180" />
          <span>{product.sub_categories?.name}</span>
          <ChevronRight size={12} className="rotate-180" />
          <span className="text-black truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* المعرض */}
          <div className="lg:col-span-5">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
              <ProductImageGallery images={images} productName={product.name} />
            </div>
          </div>

          {/* المعلومات الأساسية */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <span className="bg-grey-50 text-gray-600 px-3 py-1 rounded-md text-[12px] font-black">
                من منتجات {product.brands?.name || "Half Million"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50 text-sm font-bold">
                <span className="text-gray-500 flex items-center gap-2">
                  <Tag size={16} /> التصنيف
                </span>
                <span>{product.sub_categories?.name}</span>
              </div>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50 text-sm font-bold">
                <span className="text-gray-500 flex items-center gap-2">
                  <Award size={16} /> الماركة
                </span>
                <span>{product.brands?.name || "Half Million"}</span>
              </div>
            </div>

            {product.detailed_description && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h4 className="font-black text-sm mb-4 flex items-center gap-2">
                  <Info size={18} className="text-grey-600" /> عن المنتج:
                </h4>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.detailed_description}
                </div>
              </div>
            )}
          </div>

          {/* كارت السعر */}
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
              <button
                onClick={handleAddToCart}
                disabled={!product.is_available || adding}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                  product.is_available
                    ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {adding ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShoppingBag size={20} />
                )}
                {product.is_available ? "أضف للسلة" : "غير متوفر حالياً"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-12">
          {/* المكونات والفوائد */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {product.ingredients?.length > 0 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <FlaskConical size={28} className="text-grey-600" /> تركيبة
                  المنتج
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-grey-50/50 rounded-xl border border-grey-100/50"
                    >
                      <div className="w-2 h-2 bg-grey-400 rounded-full"></div>
                      <span className="text-sm font-bold text-grey-900">
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {product.benefits?.length > 0 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <CheckCircle2 size={28} className="text-green-600" /> النتائج
                  المتوقعة
                </h3>
                <div className="space-y-4">
                  {product.benefits.map((benefit, i) => (
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
            )}
          </div>

          {/* الاستخدام والتحذيرات */}
          {(product.usage_instructions?.length > 0 ||
            product.warnings?.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {product.usage_instructions?.length > 0 && (
                <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-8">
                    خطوات الاستخدام المثالية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.usage_instructions.map((step, i) => (
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
              )}
              {product.warnings?.length > 0 && (
                <div className="lg:col-span-4 bg-red-50 p-10 rounded-[2.5rem] border border-red-100">
                  <h3 className="text-xl font-black text-red-900 mb-6 flex items-center gap-2">
                    <AlertTriangle size={24} /> تنبيهات هامة
                  </h3>
                  <ul className="space-y-4">
                    {product.warnings.map((warn, i) => (
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
              )}
            </div>
          )}

          {/* المقارنة الذكية */}
          {comparisonProduct && (
            <div className="pt-20 border-t border-gray-100">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-black text-center mb-12 flex items-center justify-center gap-4">
                  مقارنة بين منتجين{" "}
                  <ArrowLeftRight size={32} className="text-gray-400" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  {/* المنتج الحالي */}
                  <div className="text-center space-y-4">
                    <div className="w-40 h-40 mx-auto bg-gray-50 rounded-3xl p-4 border border-gray-100">
                      <img
                        src={images[0]?.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-black text-lg">{product.name}</h4>
                  </div>

                  {/* وجه المقارنة */}
                  <div className="text-center space-y-4 px-6 border-x border-gray-100">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      Vs
                    </span>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-gray-600 font-bold leading-relaxed">
                        {product.comparison_text ||
                          "تم اختيار هذا المنتج كبديل أو مكمل ذكي لهذا المنتج."}
                      </p>
                    </div>
                  </div>

                  {/* المنتج المقارن به (قابل للضغط لفتح المودال) */}
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="text-center space-y-4 cursor-pointer group"
                  >
                    <div className="w-40 h-40 mx-auto bg-gray-50 rounded-3xl p-4 border border-gray-100 group-hover:border-black transition-all group-hover:shadow-lg relative overflow-hidden">
                      {/* تلميح للضغط */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Info className="text-black" />
                      </div>
                      <img
                        src={
                          comparisonProduct.product_images?.find(
                            (img) => img.is_main
                          )?.image_url ||
                          comparisonProduct.product_images?.[0]?.image_url
                        }
                        alt={comparisonProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-black text-lg group-hover:text-black transition-colors underline-offset-4 group-hover:underline">
                      {comparisonProduct.name}
                    </h4>
                    <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase">
                      انقر للتفاصيل
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* الفيديو */}
          {videoId && (
            <div className="pt-20 border-t border-gray-100 text-center">
              <h3 className="text-3xl font-black mb-10 text-gray-900">
                شاهد المنتج في العمل
              </h3>
              <div className="max-w-4xl mx-auto aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-black ring-[15px] ring-white">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* قد يعجبك أيضاً */}
          {relatedProducts.length > 0 && (
            <div className="pt-24 border-t border-gray-100">
              <h3 className="text-3xl font-black text-gray-900 mb-10">
                قد يعجبك أيضاً
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => {
                  const pImg =
                    p.product_images?.find((i) => i.is_main)?.image_url ||
                    p.product_images?.[0]?.image_url;
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:border-black transition-all"
                    >
                      <div className="aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden mb-4 p-4">
                        <img
                          src={pImg}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-black text-gray-900 line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-black font-black mt-2">
                        {Number(p.base_price).toLocaleString()} ج.م
                      </p>
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
