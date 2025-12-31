"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-6"
        dir="rtl"
      >
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">
          سلة المشتريات فارغة
        </h2>
        <p className="text-gray-500 font-medium text-center">
          يبدو أنكِ لم تختارِ أي منتجات بعد، تصفحي العروض الآن.
        </p>
        <Link
          href="/all-products"
          className="bg-black text-white px-10 py-4 rounded-2xl font-black hover:bg-gray-800 transition-all"
        >
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" dir="rtl">
      <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
        سلة المشتريات{" "}
        <span className="text-gray-400 text-lg">({cart.length} منتجات)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* قائمة المنتجات */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-6 p-6 border-b border-gray-100 group"
            >
              {/* صورة المنتج */}
              <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* تفاصيل المنتج */}
              <div className="flex-1 space-y-2 text-center sm:text-right">
                <h3 className="text-xl font-black text-gray-900">
                  {item.name}
                </h3>
                <p className="text-gray-400 font-bold">{item.price} ج.م</p>
              </div>

              {/* التحكم في الكمية */}
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black w-8 text-center text-lg">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* حذف المنتج */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <Link
            href="/all-products"
            className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors pt-4"
          >
            <ArrowLeft size={18} /> إضافة المزيد من المنتجات
          </Link>
        </div>

        {/* ملخص الطلب */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-[2.5rem] p-10 sticky top-10 border border-gray-100">
            <h3 className="text-2xl font-black mb-8">ملخص الطلب</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>المجموع الفرعي</span>
                <span>{getCartTotal()} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold">
                <span>الشحن</span>
                <span className="text-green-600">مجاني لفترة محدودة</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>الإجمالي</span>
                <span>{getCartTotal()} ج.م</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-black text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
            >
              <CreditCard size={22} /> إتمام الشراء
            </Link>

            <p className="text-center text-gray-400 text-xs mt-6 font-bold leading-relaxed">
              بالضغط على إتمام الشراء، أنتِ توافقين على سياسة الخصوصية والشروط
              الخاصة بـ HALF MILLION.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
