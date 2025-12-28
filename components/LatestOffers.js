"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Tag, Sparkles, Plus, Loader2 } from "lucide-react";
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
    <section className="py-16 px-4 md:px-12 max-w-[1600px] mx-auto" dir="rtl">
      {/* رأس القسم */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <Sparkles size={18} />
            <span className="text-sm font-bold tracking-widest uppercase">
              فرص لا تعوّض
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            أحدث العروض الحصرية
          </h2>
        </div>

        <Link
          href="/offers"
          className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          عرض كل العروض
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* شبكة العروض */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {offers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.old_price - offer.new_price) / offer.old_price) * 100
          );
          const isAdding = addingId === offer.id;

          return (
            <div key={offer.id} className="group relative flex flex-col h-full">
              <Link
                href={`/offers/${offer.id}`}
                className="relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full pb-20"
              >
                {/* شارة الخصم */}
                <div className="absolute top-4 right-4 z-10 bg-black text-white px-3 py-1 rounded-full font-bold text-[11px]">
                  وفر {discountPercent}%
                </div>

                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={offer.image_url}
                    alt={offer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {offer.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-black">
                      {offer.new_price.toLocaleString()} ج.م
                    </span>
                    <span className="text-xs text-gray-400 line-through font-medium">
                      {offer.old_price.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </Link>

              {/* زر أضف للسلة مخصص للعروض */}
              <div className="absolute bottom-5 left-0 w-full px-5">
                <button
                  disabled={isAdding}
                  onClick={(e) => handleAddToCart(e, offer)}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdding
                      ? "bg-gray-300 cursor-not-allowed"
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

      {/* زر العرض للجوال */}
      <div className="md:hidden flex justify-center">
        <Link
          href="/offers"
          className="w-full text-center bg-gray-100 text-black py-4 rounded-2xl font-bold text-sm"
        >
          مشاهدة جميع العروض
        </Link>
      </div>
    </section>
  );
}
