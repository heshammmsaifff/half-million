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
} from "lucide-react";
import { useCart } from "@/context/CartContext"; // تأكد من المسار الصحيح
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
      // محاكاة تأخير بسيط لشكل التحميل
      await new Promise((resolve) => setTimeout(resolve, 600));

      addToCart({
        id: offer.id,
        name: offer.name,
        price: offer.new_price,
        image: offer.image_url,
      });

      toast.success(`تم إضافة ${offer.name} إلى السلة`, {
        style: {
          borderRadius: "15px",
          background: "#000",
          color: "#fff",
          fontFamily: "inherit",
          fontWeight: "bold",
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  if (!offer) {
    return <div className="p-20 text-center font-bold">العرض غير موجود</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 my-10" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* قسم الصورة - تصميم Half Million */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl z-10 shadow-xl rotate-12 border-4 border-white">
            {Math.round(
              ((offer.old_price - offer.new_price) / offer.old_price) * 100
            )}
            %
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-gray-50 bg-gray-100">
            <img
              src={offer.image_url}
              alt={offer.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* قسم البيانات */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <Link
              href="/offers"
              className="text-gray-400 font-bold flex items-center gap-2 mb-6 hover:text-black transition-all group"
            >
              <ArrowRight size={18} className="group-hover:translate-x-1" />{" "}
              العودة لجميع العروض
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-black mb-6 leading-[1.1] tracking-tighter">
              {offer.name}
            </h1>
            <p className="text-gray-500 text-xl leading-relaxed font-medium">
              {offer.description}
            </p>
          </div>

          {/* بوكس السعر الاحترافي */}
          <div className="bg-black p-10 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
            {/* زخرفة خلفية */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-bold mb-2">
                السعر الحصري الآن
              </p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {offer.new_price} <span className="text-lg">ج.م</span>
                </span>
                <span className="text-xl text-gray-500 line-through decoration-red-600/50">
                  {offer.old_price} ج.م
                </span>
              </div>
            </div>

            <ShoppingBag size={40} className="text-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Clock className="text-black" size={20} />
              </div>
              <span className="text-sm font-black text-black">
                عرض لفترة محدودة
              </span>
            </div>
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="text-green-600" size={20} />
              </div>
              <span className="text-sm font-black text-black">
                منتج أصلي 100%
              </span>
            </div>
          </div>

          {/* زر الإضافة للسلة مع حالة التحميل */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-7 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 ${
              isAdding
                ? "bg-gray-800 cursor-not-allowed"
                : "bg-black text-white hover:bg-red-600 active:scale-95"
            }`}
          >
            {isAdding ? (
              <>
                <Loader2 className="animate-spin" />
                جاري التجهيز...
              </>
            ) : (
              <>
                <ShoppingBag size={24} />
                أضف للسلة الآن
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
