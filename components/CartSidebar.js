"use client";
import React from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[110] ${isOpen ? "visible" : "invisible"}`}
      dir="rtl"
    >
      {/* Overlay الخلفية بلمسة ضبابية ناعمة */}
      <div
        className={`absolute inset-0 bg-[#1A1C17]/60 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar محتوى السلة بتصميم فخم */}
      <div
        className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header الرأس - الهوية الخضراء */}
        <div className="p-6 border-b border-[#C3CBB9]/20 flex items-center justify-between bg-[#F8F9F4]/50">
          <div className="flex items-center gap-4">
            <div className="bg-[#5F6F52] text-white p-3 rounded-2xl shadow-lg shadow-[#5F6F52]/20">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2D3436]">
                حقيبة التسوق
              </h2>
              <p className="text-[11px] text-[#5F6F52] font-black uppercase tracking-wider">
                {cart?.length || 0} قطعة مختارة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white hover:rotate-90 rounded-full transition-all duration-300 border border-transparent hover:border-[#C3CBB9]/30 text-gray-400 hover:text-[#2D3436]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items قائمة المنتجات */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {cart && cart.length > 0 ? (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group bg-white p-2 rounded-[1.5rem] border border-transparent hover:border-[#C3CBB9]/20 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-24 h-28 bg-[#F8F9F4] rounded-[1.2rem] overflow-hidden flex-shrink-0 border border-[#C3CBB9]/10 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[13px] font-black text-[#2D3436] line-clamp-2 leading-relaxed">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-[#E29595] transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-black text-[#5F6F52] mt-1">
                        {item.price.toLocaleString()} ج.م
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 bg-[#F8F9F4] px-4 py-1.5 rounded-xl border border-[#C3CBB9]/20">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="text-[#5F6F52] hover:text-black transition-colors"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="text-[13px] font-black w-4 text-center text-[#2D3436]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-[#5F6F52] hover:text-black transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">
                        المجموع: {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-[#F8F9F4] rounded-full flex items-center justify-center text-[#C3CBB9] mb-6 relative">
                <ShoppingBag size={40} strokeWidth={1} />
                <div className="absolute top-0 right-0 w-6 h-6 bg-[#E29595] rounded-full border-4 border-white animate-ping" />
              </div>
              <div>
                <h3 className="font-black text-[#2D3436] text-lg">
                  حقيبتك فارغة
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-bold leading-relaxed">
                  يبدو أنكِ لم تختاري أي منتجات بعد.
                  <br />
                  اكتشفي أحدث عروضنا الجمالية الآن.
                </p>
              </div>
              <Link
                href="/all-products"
                onClick={onClose}
                className="mt-8 inline-block bg-[#5F6F52] text-white px-10 py-4 rounded-2xl text-[13px] font-black hover:bg-[#2D3436] transition-all duration-300 shadow-lg shadow-[#5F6F52]/20"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>

        {/* Footer المجموع والطلب - التصميم الفاخر */}
        {cart && cart.length > 0 && (
          <div className="p-8 border-t border-[#C3CBB9]/20 bg-[#F8F9F4]/30 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-bold">المجموع الفرعي:</span>
                <span className="text-gray-700 font-black tracking-tight">
                  {getCartTotal().toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-bold">الشحن:</span>
                <span className="text-[#5F6F52] font-black">
                  يُحسب عند الدفع
                </span>
              </div>
              <div className="h-px bg-[#C3CBB9]/20 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-[#2D3436] font-black text-lg">
                  الإجمالي
                </span>
                <span className="text-2xl font-black text-[#5F6F52] tracking-tighter">
                  {getCartTotal().toLocaleString()}{" "}
                  <span className="text-xs">ج.م</span>
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#5F6F52] text-white py-5 rounded-[1.5rem] font-black text-[15px] flex items-center justify-center gap-3 hover:bg-[#2D3436] transition-all duration-500 shadow-xl shadow-[#5F6F52]/20 group"
            >
              إتمام عملية الشراء
              <ArrowLeft
                size={20}
                className="group-hover:translate-x-[-5px] transition-transform duration-300"
              />
            </Link>

            <button
              onClick={onClose}
              className="w-full text-center text-[11px] font-black text-gray-400 hover:text-[#5F6F52] transition-colors uppercase tracking-widest"
            >
              استكمال التسوق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
