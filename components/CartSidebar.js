"use client";
import React from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar({ isOpen, onClose }) {
  // تم تغيير cartItems إلى cart وتغيير الدوال لتناسب الـ Context
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[110] ${isOpen ? "visible" : "invisible"}`}
      dir="rtl"
    >
      {/* Overlay الخلفية */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar محتوى السلة */}
      <div
        className={`absolute top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header الرأس */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-black">سلة التسوق</h2>
              <p className="text-xs text-gray-500 font-bold">
                {cart?.length || 0} منتجات في سلتك
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items قائمة المنتجات */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart && cart.length > 0 ? (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-black text-gray-800 line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-black">
                        {item.price} ج.م
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-black w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-gray-500 hover:text-black"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="font-black text-gray-800">سلتك فارغة حالياً</p>
                <p className="text-xs text-gray-500 mt-1 font-bold">
                  ابدأ بإضافة المنتجات التي تحبها
                </p>
              </div>
              <Link
                href="/all-products"
                onClick={onClose} // لإغلاق السلة الجانبية عند الضغط على الرابط
                className="inline-block bg-black text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-gray-800 transition-colors text-center"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>

        {/* Footer المجموع والطلب */}
        {cart && cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-bold">المجموع الفرعي:</span>
              <span className="text-xl font-black text-black">
                {getCartTotal().toLocaleString()} ج.م
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all group"
            >
              إتمام الطلب
              <ArrowRight
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
