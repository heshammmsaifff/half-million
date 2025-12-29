"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
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
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    city: "",
    state: "",
    address: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Swal.fire({
          icon: "warning",
          title: "تسجيل الدخول مطلوب",
          text: "يرجى تسجيل الدخول أولاً لإتمام عملية الشراء وحفظ طلباتك",
          confirmButtonText: "تسجيل الدخول",
          confirmButtonColor: "#000",
        }).then(() => {
          router.push("/login");
        });
      } else {
        setCurrentUser(user);
        setIsClient(true);
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return toast.error("سلتك فارغة!");

    setLoading(true);

    const orderData = {
      customer_name: formData.name,
      phone: formData.phone,
      secondary_phone: formData.phone2,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      total_price: getCartTotal(),
      items: cart,
      user_id: currentUser.id, // ربط الطلب بالمستخدم المسجل
    };

    try {
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      toast.success("تم استلام طلبك بنجاح!");
      setOrderCompleted(true);
      clearCart();
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center p-6"
        dir="rtl"
      >
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={50} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">
          شكراً لثقتك بنا
        </h1>
        <p className="text-gray-500 text-xl max-w-md font-bold">
          تم استلام طلبك بنجاح. يمكنك متابعة حالته من ملفك الشخصي.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-10 bg-black text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform"
        >
          عرض طلباتي
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" dir="rtl">
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-10">
          <h1 className="text-4xl font-black italic underline decoration-gray-200 underline-offset-8">
            إتمام الشراء
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2">
                <User size={16} /> الاسم بالكامل
              </label>
              <input
                required
                type="text"
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <Phone size={16} /> رقم الهاتف
                </label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-gray-400">
                  <Plus size={16} /> هاتف إضافي
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                  value={formData.phone2}
                  onChange={(e) =>
                    setFormData({ ...formData, phone2: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <MapPin size={16} /> المحافظة
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <MapPin size={16} /> المدينة
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2">
                <MapPin size={16} /> العنوان بالتفصيل
              </label>
              <textarea
                required
                rows="3"
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl font-bold"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>
            <button
              disabled={loading}
              className="w-full py-7 rounded-[2rem] font-black text-2xl bg-black text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "إرسال الطلب الآن"
              )}
            </button>
          </form>
        </div>
        <div className="bg-[#0A0A0A] text-white p-8 md:p-12 rounded-[3rem] sticky top-10 border border-white/5 shadow-2xl">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-3 italic">
            <ShoppingBag size={24} /> ملخص الطلب
          </h3>
          <div className="space-y-6 max-h-[350px] overflow-y-auto mb-10 pr-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 object-cover rounded-xl"
                  alt={item.name}
                />
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-gray-400 text-xs font-bold italic">
                    {item.quantity} قطعة × {item.price} ج.م
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-2xl font-black pt-8 border-t border-white/10">
            <span>الإجمالي النهائي</span>
            <span className="underline underline-offset-4">
              {getCartTotal()} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
