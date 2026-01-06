"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Heart,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

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
          <h2 className="text-3xl font-black text-[#2D3436]">
            سلتكِ بانتظار جمالكِ
          </h2>
          <p className="text-[#5F6F52] font-medium max-w-sm mx-auto opacity-70">
            يبدو أنكِ لم تختارِ أي منتجات بعد. استكشفي مجموعتنا المختارة وابدأي
            رحلة العناية اليوم.
          </p>
        </div>
        <Link
          href="/all-products"
          className="bg-[#2D3436] text-white px-12 py-5 rounded-[2rem] font-black hover:bg-[#5F6F52] transition-all shadow-xl shadow-[#2D3436]/10 flex items-center gap-3"
        >
          اكتشفي المنتجات الآن
          <ArrowRight size={20} className="rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20" dir="rtl">
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
                <span className="text-[10px] font-black text-[#5F6F52] uppercase tracking-[0.2em] opacity-60">
                  منتج أصلي
                </span>
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

            <Link
              href="/checkout"
              className="w-full bg-[#5F6F52] text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-white hover:text-[#2D3436] transition-all shadow-xl shadow-black/20"
            >
              <CreditCard size={22} /> إتمام الشراء الآن
            </Link>

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
