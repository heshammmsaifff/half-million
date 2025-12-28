"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Plus,
} from "lucide-react";

export default function CheckoutPage() {
  // سحب البيانات بالأسماء الموحدة من الـ Context
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    city: "",
    state: "",
    address: "",
  });

  // حماية لمنع خطأ الـ Hydration في Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تأكد من وجود سلة ومنتجات
    if (!cart || cart.length === 0) {
      return toast.error("سلتك فارغة!");
    }

    setLoading(true);

    const orderData = {
      customer_name: formData.name,
      phone: formData.phone,
      secondary_phone: formData.phone2,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      total_price: getCartTotal(),
      items: cart, // سيتم تخزين المصفوفة كاملة في عمود JSONB
    };

    try {
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      toast.success("تم استلام طلبك بنجاح!");
      setOrderCompleted(true);
      clearCart(); // مسح السلة من الـ Context والـ LocalStorage
      setTimeout(() => router.push("/"), 5000);
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.");
      console.error("Supabase error:", error);
    } finally {
      setLoading(false);
    }
  };

  // شاشة تحميل بسيطة حتى يتم التعرف على الـ Client
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black mb-4" size={40} />
        <p className="font-bold text-gray-500">جاري تحميل بيانات السلة...</p>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6"
        dir="rtl"
      >
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={50} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter text-black">
          شكراً لثقتك بـ HALF MILLION
        </h1>
        <p className="text-gray-500 text-xl font-medium max-w-md">
          تم استلام طلبك بنجاح. سيتواصل معك فريق الشحن خلال 24 ساعة لتأكيد
          الطلب.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-10 text-black font-black border-b-2 border-black pb-1 hover:text-gray-500 transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" dir="rtl">
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* قسم النموذج */}
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl font-black mb-4 text-black italic underline decoration-gray-200 underline-offset-8">
              إتمام الشراء
            </h1>
            <p className="text-gray-500 font-bold text-lg">
              بيانات الشحن والتوصيل
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2 text-black">
                <User size={16} /> الاسم بالكامل
              </label>
              <input
                required
                type="text"
                // placeholder="مثال: أحمد محمد"
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:border-black transition-all font-bold text-black"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-black">
                  <Phone size={16} /> رقم الهاتف (أساسي)
                </label>
                <input
                  required
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left font-bold text-black"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-gray-400">
                  <Plus size={16} /> رقم هاتف إضافي (اختياري)
                </label>
                <input
                  type="tel"
                  placeholder="رقم بديل للوصول إليك"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl text-left font-bold text-black"
                  dir="ltr"
                  value={formData.phone2}
                  onChange={(e) =>
                    setFormData({ ...formData, phone2: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-black">
                  <MapPin size={16} /> المحافظة
                </label>
                <input
                  required
                  type="text"
                  // placeholder="مثال: القاهرة"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold text-black"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-black">
                  <MapPin size={16} /> المدينة / المنطقة
                </label>
                <input
                  required
                  type="text"
                  // placeholder="مثال: المعادي"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold text-black"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2 text-black">
                <MapPin size={16} /> العنوان بالتفصيل
              </label>
              <textarea
                required
                rows="3"
                placeholder="اسم الشارع، رقم العمارة، الطابق، علامة مميزة بجوارك..."
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold text-black focus:border-black outline-none transition-all"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>

            <button
              disabled={loading || cart.length === 0}
              className={`w-full py-7 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 ${
                loading
                  ? "bg-gray-800 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900 active:scale-95"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "إرسال الطلب الآن"
              )}
            </button>
          </form>
        </div>

        {/* قسم مراجعة الطلب */}
        <div className="lg:block">
          <div className="bg-[#0A0A0A] text-white p-8 md:p-12 rounded-[3rem] sticky top-10 border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 italic">
              <ShoppingBag size={24} className="text-white" /> ملخص الطلب
            </h3>

            <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar mb-10 pr-2">
              {cart && cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 group bg-white/5 p-4 rounded-2xl"
                  >
                    <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-bold text-sm text-white">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1 font-bold italic">
                        {item.quantity} قطعة × {item.price} ج.م
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 font-bold py-10">
                  السلة فارغة حالياً
                </p>
              )}
            </div>

            <div className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex justify-between font-bold text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{getCartTotal()} ج.م</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-4 border-t border-white/5 text-white">
                <span>الإجمالي النهائي</span>
                <span className="text-white underline decoration-white/20 underline-offset-4">
                  {getCartTotal()} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
