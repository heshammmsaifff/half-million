"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Loader2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast, Toaster } from "react-hot-toast";

export default function OfferDetailsPage({ params: paramsPromise }) {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const [offerId, setOfferId] = useState(null);

  // فك تشفير البرامز
  useEffect(() => {
    paramsPromise.then((res) => setOfferId(res.offerId));
  }, [paramsPromise]);

  // جلب البيانات
  useEffect(() => {
    if (!offerId) return;

    async function fetchOffer() {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setOffer(data);
      }
      setLoading(false);
    }

    fetchOffer();
  }, [offerId]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      addToCart({
        id: `offer-${offer.id}`,
        name: offer.name,
        price: offer.new_price,
        image: offer.image_url,
      });

      toast.success(`تم إضافة ${offer.name} إلى السلة`, {
        style: {
          borderRadius: "15px",
          background: "#2D3436",
          color: "#fff",
          fontWeight: "bold",
          direction: "rtl",
        },
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#5F6F52]" size={40} />
        <span className="font-black text-[#5F6F52] animate-pulse">
          نحضر لكِ تفاصيل الجمال...
        </span>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-20 text-center font-black text-[#2D3436]">
        العرض غير موجود حالياً
      </div>
    );
  }

  const discountPercent = Math.round(
    ((offer.old_price - offer.new_price) / offer.old_price) * 100
  );

  return (
    <div className="max-w-[1300px] mx-auto p-6 md:p-12 my-10" dir="rtl">
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* زر العودة */}
      <Link
        href="/offers"
        className="inline-flex items-center gap-2 text-[#5F6F52] font-black mb-10 hover:gap-4 transition-all group"
      >
        <ArrowRight size={20} />
        تصفح باقي العروض الحصرية
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        {/* قسم الصورة - برواز فاخر */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute top-6 right-6 bg-[#E29595] text-white w-20 h-20 rounded-full flex flex-col items-center justify-center font-black z-10 shadow-2xl border-4 border-white rotate-12">
            <span className="text-xl leading-none">{discountPercent}%</span>
            <span className="text-[10px] uppercase">خصم</span>
          </div>

          <div className="rounded-[4rem] overflow-hidden shadow-[0_40px_80px_rgba(95,111,82,0.15)] border-[16px] border-[#F8F9F4] bg-white relative">
            <img
              src={offer.image_url}
              alt={offer.name}
              className="w-full aspect-[4/5] object-cover transform hover:scale-110 transition-transform duration-1000"
            />
          </div>

          {/* لمسة ديكورية خلف الصورة */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C3CBB9]/20 rounded-full -z-10 blur-2xl" />
        </div>

        {/* قسم البيانات */}
        <div className="w-full lg:w-1/2 space-y-10 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#E29595] font-black text-sm tracking-widest uppercase">
              <Sparkles size={18} />
              <span>قطعة مختارة بعناية</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2D3436] leading-[1.1]">
              {offer.name}
            </h1>
            <p className="text-[#5F6F52]/70 text-xl leading-relaxed font-medium">
              {offer.description}
            </p>
          </div>

          {/* كارت السعر الجديد */}
          <div className="bg-[#2D3436] p-8 md:p-10 rounded-[3.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            {/* زخرفة هندسية خلفية */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#5F6F52]/20 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <p className="text-gray-400 text-xs font-black mb-3 uppercase tracking-tighter">
                السعر الحصري الآن
              </p>
              <div className="flex items-end gap-4">
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  {offer.new_price.toLocaleString()}{" "}
                  <span className="text-lg font-bold">ج.م</span>
                </span>
                <span className="text-xl text-gray-400 line-through mb-2 opacity-60">
                  {offer.old_price.toLocaleString()}
                </span>
              </div>
            </div>

            <ShoppingBag size={50} className="text-white/10 hidden md:block" />
          </div>

          {/* المميزات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-6 bg-[#F8F9F4] rounded-[2.5rem] border border-[#C3CBB9]/20">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Clock className="text-[#5F6F52]" size={20} />
              </div>
              <span className="text-sm font-black text-[#2D3436]">
                شحن سريع لكل المحافظات
              </span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-[#F8F9F4] rounded-[2.5rem] border border-[#C3CBB9]/20">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="text-[#E29595]" size={20} />
              </div>
              <span className="text-sm font-black text-[#2D3436]">
                أصلي ومضمون 100%
              </span>
            </div>
          </div>

          {/* زر الشراء الرئيسي */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-8 rounded-[2.5rem] font-black text-2xl shadow-[0_25px_50px_rgba(45,52,54,0.2)] transition-all flex items-center justify-center gap-4 ${
              isAdding
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#2D3436] text-white hover:bg-[#5F6F52] active:scale-95"
            }`}
          >
            {isAdding ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                جاري الإضافة...
              </>
            ) : (
              <>
                <Plus size={24} className="bg-[#E29595] rounded-full p-0.5" />
                أضيفي لجمالكِ الآن
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// أيقونة Plus لتعويض المفقودة من import
function Plus({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
