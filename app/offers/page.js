"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Tag, ArrowLeft, Percent, Plus, Loader2 } from "lucide-react";
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
        جاري تحميل العروض...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      {/* رأس الصفحة - تصميم Monochrome بالأسود والرمادي */}
      <div className="mb-12 p-10 bg-black rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-4 py-1 rounded-full backdrop-blur-md border border-white/20">
            <Tag size={16} />
            <span className="text-sm font-bold">عروض حصرية لفترة محدودة</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">أقوى العروض</h1>
          <p className="text-gray-400 text-lg font-medium">
            وفر الكثير مع خصوماتنا اليومية على أفضل المنتجات المختارة بعناية.
          </p>
        </div>
        <Percent className="absolute -bottom-10 -left-10 text-white/5 w-64 h-64 rotate-12" />
      </div>

      {/* شبكة العروض */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.old_price - offer.new_price) / offer.old_price) * 100
          );
          const isAdding = addingId === offer.id;

          return (
            <div key={offer.id} className="relative group flex flex-col">
              <Link
                href={`/offers/${offer.id}`}
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full pb-24"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-50">
                  <img
                    src={offer.image_url}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black text-white px-4 py-1.5 rounded-full font-black text-xs shadow-lg">
                    وفر {discountPercent}%
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-black text-gray-800 mb-3 transition-colors">
                    {offer.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-col text-right">
                      <span className="text-gray-400 text-xs line-through font-bold">
                        {offer.old_price.toLocaleString()} ج.م
                      </span>
                      <span className="text-2xl font-black text-black">
                        {offer.new_price.toLocaleString()} ج.م
                      </span>
                    </div>
                    <div className="text-gray-400 group-hover:text-black transition-colors">
                      <ArrowLeft size={24} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* زر أضف للسلة - متموضع فوق الكارت باللون الأسود ورمادي عند التحويم */}
              <div className="absolute bottom-6 left-0 w-full px-8">
                <button
                  disabled={isAdding}
                  onClick={(e) => handleAddToCart(e, offer)}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdding
                      ? "bg-gray-200 cursor-not-allowed text-gray-500"
                      : "bg-black text-white hover:bg-gray-600 active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      أضف للسلة
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <h3 className="text-2xl font-black text-gray-400">
            لا توجد عروض حالياً، انتظرونا قريباً!
          </h3>
        </div>
      )}
    </div>
  );
}
