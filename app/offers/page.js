"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Tag,
  ArrowLeft,
  Percent,
  Plus,
  Loader2,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOffers(data || []);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAddToCart = async (e, offer) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingId(offer.id);
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: `offer-${offer.id}`,
      name: offer.name,
      price: offer.new_price,
      image: offer.image_url,
    });

    toast.success(`${offer.name} أضيف للسلة`, {
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-[#5F6F52]" />
        <span className="font-black text-[#5F6F52] animate-pulse">
          جاري جلب أفضل العروض...
        </span>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-12 text-right" dir="rtl">
      {/* رأس الصفحة المطور */}
      <div className="mb-16 p-8 md:p-16 bg-[#2D3436] rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6 bg-[#E29595] w-fit px-5 py-1.5 rounded-full shadow-lg">
            <Sparkles size={16} className="text-white animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">
              فرص لا تعوض
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            عروض <span className="text-[#E29595]">الجمال</span> الحصرية
          </h1>
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            خصومات تصل إلى 50% على تشكيلة مختارة من أرقى منتجات العناية
            والتجميل.
          </p>
        </div>

        {/* أيقونات خلفية جمالية */}
        <Percent className="absolute -bottom-10 -left-10 text-white/5 w-80 h-80 rotate-12" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5F6F52]/20 rounded-full blur-[100px] -mr-20 -mt-20" />
      </div>

      {/* شبكة العروض */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {offers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.old_price - offer.new_price) / offer.old_price) * 100
          );
          const isAdding = addingId === offer.id;

          return (
            <div key={offer.id} className="relative group flex flex-col">
              <Link
                href={`/offers/${offer.id}`}
                className="bg-white rounded-[3rem] border border-[#C3CBB9]/20 overflow-hidden hover:shadow-[0_30px_60px_rgba(45,52,54,0.12)] transition-all duration-700 flex flex-col h-full pb-28"
              >
                {/* صورة العرض */}
                <div className="aspect-[16/10] relative overflow-hidden bg-[#F8F9F4]">
                  <img
                    src={offer.image_url}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 right-6 bg-[#E29595] text-white px-5 py-2 rounded-2xl font-black text-sm shadow-xl border border-white/20">
                    وفر {discountPercent}%
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D3436]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* محتوى العرض */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3 text-[#5F6F52]">
                    <Tag size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      عرض محدود
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#2D3436] mb-4 group-hover:text-[#5F6F52] transition-colors">
                    {offer.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between bg-[#F8F9F4] p-5 rounded-[2rem] border border-[#C3CBB9]/10">
                    <div className="flex flex-col text-right">
                      <span className="text-gray-400 text-xs line-through font-bold mb-1">
                        {offer.old_price.toLocaleString()} ج.م
                      </span>
                      <span className="text-2xl font-black text-[#2D3436]">
                        {offer.new_price.toLocaleString()}{" "}
                        <small className="text-xs font-black">ج.م</small>
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2D3436] shadow-sm group-hover:bg-[#5F6F52] group-hover:text-white transition-all duration-300">
                      <ArrowLeft size={20} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* زر الإضافة للسلة المطور */}
              <div className="absolute bottom-8 left-0 w-full px-10">
                <button
                  disabled={isAdding}
                  onClick={(e) => handleAddToCart(e, offer)}
                  className={`w-full py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                    isAdding
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#2D3436] text-white hover:bg-[#5F6F52] shadow-[#2D3436]/20"
                  }`}
                >
                  {isAdding ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      اغتنمي العرض الآن
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-40 bg-[#F8F9F4] rounded-[4rem] border-2 border-dashed border-[#C3CBB9]/30">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Tag size={32} className="text-[#C3CBB9]" />
          </div>
          <h3 className="text-2xl font-black text-[#2D3436] mb-2">
            لا توجد عروض حالياً
          </h3>
          <p className="text-[#5F6F52] font-bold">
            انتظرونا قريباً مع مفاجآت جديدة!
          </p>
        </div>
      )}
    </div>
  );
}
