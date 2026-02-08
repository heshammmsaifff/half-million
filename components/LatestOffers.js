"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Sparkles, ArrowLeft, Loader2, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function LatestOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // حالة تتبع التحميل لكل عرض بشكل مستقل
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchLatestOffers = async () => {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setOffers(data || []);
      } catch (error) {
        console.error("Error fetching offers:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOffers();
  }, []);

  // دالة الإضافة للسلة
  const handleAddToCart = async (e, offer) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingId(offer.id);

    // محاكاة معالجة بسيطة
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: `offer-${offer.id}`, // تمييزه كعرض
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

  if (loading) return null;
  if (offers.length === 0) return null;

  return (
    <section
      className="py-20 px-4 md:px-12 max-w-[1600px] mx-auto bg-transparent"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3 text-[#5F6F52]">
            <Sparkles size={20} className="animate-pulse" />
            <span className="text-xs font-black tracking-[0.2em] uppercase">
              فرص لا تعوّض
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#2D3436]">
            أحدث العروض الحصرية
          </h2>
        </div>

        <Link
          href="/offers"
          className="group flex items-center gap-3 text-sm font-black text-[#5F6F52] hover:text-[#2D3436] transition-all"
        >
          عرض كل العروض
          <div className="p-2 rounded-full border border-[#C3CBB9] group-hover:bg-[#C3CBB9] transition-all">
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </div>
        </Link>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {offers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.old_price - offer.new_price) / offer.old_price) * 100,
          );
          const isAdding = addingId === offer.id;

          return (
            <div key={offer.id} className="group relative flex flex-col h-full">
              <Link
                href={`/offers/${offer.id}`}
                /* تقليل الـ rounded من 2.5rem لـ 1.5rem وتقليل الـ pb من 24 لـ 20 */
                className="relative bg-white/60 backdrop-blur-md rounded-[1.5rem] border border-white overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full pb-20 hover:-translate-y-2"
              >
                {/* Exclusive Discount Badge - تصغير الحجم والخط */}
                <div className="absolute top-3 right-3 z-10 bg-[#E29595] text-white px-3 py-1.5 rounded-full font-black text-[10px] shadow-lg">
                  وفر {discountPercent}%
                </div>

                {/* تقليل نسبة العرض للارتفاع لتصغير مساحة الصورة */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={offer.image_url}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                  />
                </div>

                {/* تقليل الـ padding من p-8 لـ p-5 */}
                <div className="p-5">
                  <h3 className="text-lg font-black text-[#2D3436] mb-2 group-hover:text-[#5F6F52] transition-colors leading-tight line-clamp-1">
                    {offer.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-[#2D3436]">
                      {offer.new_price.toLocaleString()}{" "}
                      <span className="text-[10px]">ج.م</span>
                    </span>
                    <span className="text-xs text-gray-400 line-through font-bold">
                      {offer.old_price.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </Link>

              {/* Premium Add to Cart Button - تصغير المسافات والـ padding */}
              <div className="absolute bottom-4 left-0 w-full px-5">
                <button
                  disabled={isAdding}
                  onClick={(e) => handleAddToCart(e, offer)}
                  className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isAdding
                      ? "bg-gray-100 text-gray-400"
                      : "bg-[#2D3436] text-white hover:bg-[#5F6F52] active:scale-95 shadow-[#2d3436]/20"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري...
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

      {/* Mobile View All Button */}
      <div className="md:hidden flex justify-center mt-4">
        <Link
          href="/offers"
          className="w-full text-center bg-[#C3CBB9]/20 text-[#5F6F52] py-5 rounded-3xl font-black text-sm border border-[#C3CBB9]/30"
        >
          مشاهدة جميع العروض
        </Link>
      </div>
    </section>
  );
}
