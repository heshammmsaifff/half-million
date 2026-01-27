"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient"; // تأكد من صحة مسار ملف سوبابيس لديك
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Heart,
  AlertCircle,
  X,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  // States
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // التأكد من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, []);

  // دالة التعامل مع الضغط على زر إتمام الشراء
  const handleCheckoutClick = () => {
    if (isLoggedIn) {
      // إذا كان مسجلاً، اذهب مباشرة لصفحة الدفع
      router.push("/checkout");
    } else {
      // إذا لم يكن مسجلاً، اظهر التنبيه
      setShowLoginAlert(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div
        className="min-h-[75vh] flex flex-col items-center justify-center space-y-8 px-6 text-center"
        dir="rtl"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-[#F8F9F4] rounded-full flex items-center justify-center animate-bounce duration-[2000ms]">
            <ShoppingBag size={50} className="text-[#C3CBB9]" />
          </div>
          <Heart
            size={24}
            className="absolute -top-2 -right-2 text-[#E29595] fill-current"
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-[#2D3436]">السلة فارغة</h2>
          <p className="text-black font-medium max-w-sm mx-auto opacity-70">
            يبدو أنك لم تختر أي منتجات بعد. استكشف مجموعتنا المختارة وابدأ رحلة
            العناية اليوم.
          </p>
        </div>
        <Link
          href="/all-products"
          className="bg-[#2D3436] text-white px-12 py-5 rounded-[2rem] font-black hover:bg-[#5F6F52] transition-all shadow-xl shadow-[#2D3436]/10 flex items-center gap-3"
        >
          اكتشف المنتجات الآن
          <ArrowRight size={20} className="rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20" dir="rtl">
      {showLoginAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginAlert(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowLoginAlert(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={40} className="text-amber-500" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#2D3436]">
                  تنبيه قبل الاستمرار
                </h3>
                <p className="text-[#5F6F52] leading-relaxed">
                  أنت غير مسجل دخول حالياً. عند إتمام الشراء كـ "ضيف"، لن تتمكن
                  من متابعة حالة الطلب عبر الموقع، يمكنك المتابعة عبر:
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-bold pt-2">
                  <span className="flex items-center gap-1 text-[#5F6F52] opacity-70">
                    <MessageCircle size={14} /> واتساب
                  </span>
                  <span className="flex items-center gap-1 text-[#5F6F52] opacity-70">
                    <Phone size={14} /> الخط الساخن
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <Link
                  href="/login"
                  className="bg-[#2D3436] text-white py-4 rounded-2xl font-black hover:bg-[#5F6F52] transition-all text-center"
                >
                  تسجيل الدخول / إنشاء حساب
                </Link>
                <Link
                  href="/checkout"
                  className="border-2 border-[#2D3436] text-[#2D3436] py-4 rounded-2xl font-black hover:bg-gray-50 transition-all text-center"
                >
                  متابعة الشراء كـ "ضيف"
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[#2D3436] mb-3">
            حقيبة التسوق
          </h1>
          <p className="text-[#5F6F52] font-bold opacity-60">
            لديكِ {cart.length} منتجات رائعة في السلة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* قائمة المنتجات */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-[2.5rem] p-4 md:p-6 border border-[#C3CBB9]/20 hover:border-[#5F6F52]/30 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col sm:flex-row items-center gap-8"
            >
              {/* صورة المنتج */}
              <div className="w-full sm:w-40 aspect-square bg-[#F8F9F4] rounded-[2rem] overflow-hidden shrink-0 border border-[#C3CBB9]/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* تفاصيل المنتج */}
              <div className="flex-1 text-center sm:text-right space-y-2">
                <h3 className="text-xl font-black text-[#2D3436] group-hover:text-[#5F6F52] transition-colors">
                  {item.name}
                </h3>
                <div className="text-lg font-black text-[#2D3436]">
                  {item.price.toLocaleString()}{" "}
                  <small className="text-[10px] mr-1">ج.م</small>
                </div>
              </div>

              {/* التحكم في الكمية والحذف */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-[#F8F9F4] p-2 rounded-2xl border border-[#C3CBB9]/20">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-[#5F6F52] hover:text-white transition-all shadow-sm text-[#2D3436]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-black text-lg min-w-[20px] text-center text-[#2D3436]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-[#5F6F52] hover:text-white transition-all shadow-sm text-[#2D3436]"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}

          <Link
            href="/all-products"
            className="inline-flex items-center gap-3 text-[#5F6F52] font-black hover:gap-5 transition-all pt-6"
          >
            <ArrowRight size={20} /> أضيفي المزيد من الجمال لسلتكِ
          </Link>
        </div>

        {/* ملخص الطلب */}
        <div className="lg:col-span-4">
          <div className="bg-[#2D3436] rounded-[3rem] p-10 sticky top-10 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5F6F52]/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-2xl font-black mb-10 relative z-10 text-white">
              ملخص طلبكِ
            </h3>

            <div className="space-y-5 mb-10 relative z-10">
              <div className="flex justify-between text-gray-400 font-bold">
                <span>المجموع الفرعي</span>
                <span className="text-white">
                  {getCartTotal().toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold">
                <span>مصاريف الشحن</span>
                <span className="text-[#9db688]">تحدد عند الدفع</span>
              </div>
              <div className="h-px bg-white/10 my-6"></div>
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-300">
                  الإجمالي الكلي
                </span>
                <div className="text-right">
                  <span className="text-4xl font-black text-white">
                    {getCartTotal().toLocaleString()}
                  </span>
                  <span className="text-sm mr-2 font-bold text-gray-400">
                    ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* تم تحديث الزر لاستدعاء وظيفة التحقق */}
            <button
              onClick={handleCheckoutClick}
              disabled={checkingAuth}
              className="w-full bg-[#5F6F52] text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-white hover:text-[#2D3436] transition-all shadow-xl shadow-black/20 disabled:opacity-50"
            >
              <CreditCard size={22} />
              {checkingAuth ? "جاري التحقق..." : "إتمام الشراء الآن"}
            </button>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
              <div className="w-10 h-6 bg-white/10 rounded-md"></div>
              <div className="w-10 h-6 bg-white/10 rounded-md"></div>
              <div className="w-10 h-6 bg-white/10 rounded-md"></div>
            </div>

            <p className="text-center text-white/30 text-[10px] mt-8 font-medium leading-relaxed uppercase tracking-widest">
              التسوق آمن 100% مع معايير حماية عالمية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
