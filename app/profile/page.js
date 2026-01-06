"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  User,
  Package,
  LogOut,
  Loader2,
  Calendar,
  CheckCircle2,
  Truck,
  Box,
  Search,
  Wallet,
  Info,
  Copy,
  Check,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const router = useRouter();

  const statusSteps = [
    "جاري المراجعة",
    "جاري التعبئة",
    "تم الشحن",
    "تم الاستلام",
  ];

  const fetchOrders = async (userId) => {
    const { data: userOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (userOrders) setOrders(userOrders);
  };

  useEffect(() => {
    const setup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      await fetchOrders(user.id);
      setLoading(false);

      const channel = supabase
        .channel(`orders-update-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id
                  ? { ...order, ...payload.new }
                  : order
              )
            );
            toast.success("تم تحديث حالة طلبكِ الآن!", {
              style: {
                borderRadius: "15px",
                background: "#2D3436",
                color: "#fff",
                fontWeight: "bold",
              },
            });
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };
    setup();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("ننتظر زيارتكِ القادمة");
    router.push("/");
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("تم نسخ رقم الطلب");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusInfo = (currentStatus) => {
    const themes = {
      "جاري المراجعة": {
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: <Search size={14} />,
      },
      "جاري التعبئة": {
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: <Box size={14} />,
      },
      "تم الشحن": {
        color: "text-[#5F6F52]",
        bg: "bg-[#F8F9F4]",
        icon: <Truck size={14} />,
      },
      "تم الاستلام": {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: <CheckCircle2 size={14} />,
      },
    };
    return (
      themes[currentStatus] || {
        color: "text-gray-600",
        bg: "bg-gray-50",
        icon: <Package size={14} />,
      }
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9F4]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#5F6F52]" size={40} />
          <p className="text-[#5F6F52] font-black animate-pulse">
            جاري تحميل بياناتكِ الجمالية...
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-24" dir="rtl">
      {/* Header Decor */}
      <div className="h-48 bg-[#2D3436] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex justify-around items-center">
          <ShoppingBag size={150} className="text-white rotate-12" />
          <Package size={150} className="text-white -rotate-12" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* الجانب الأيمن: بطاقة المستخدم */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-[#5F6F52]/5 border border-[#C3CBB9]/20 sticky top-10">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="w-full h-full bg-[#F8F9F4] rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <User size={45} className="text-[#C3CBB9]" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#E29595] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              </div>

              <h2 className="font-black text-2xl text-[#2D3436] text-center">
                {user?.user_metadata?.full_name || "جميلتنا"}
              </h2>
              <p className="text-[#5F6F52] text-xs text-center opacity-60 mb-8">
                {user?.email}
              </p>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#F8F9F4] mb-8">
                {/* <div className="text-center"> */}
                <p className="text-[10px] text-[#C3CBB9] font-black uppercase tracking-widest mb-1">
                  الطلبات
                </p>
                <p className="font-black text-xl text-[#2D3436]">
                  {orders.length}
                </p>
                {/* </div> */}
                {/* <div className="text-center border-r border-[#F8F9F4]">
                  <p className="text-[10px] text-[#C3CBB9] font-black uppercase tracking-widest mb-1">
                    العضوية
                  </p>
                  <p className="font-black text-xl text-[#5F6F52]">بريميوم</p>
                </div> */}
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-4 px-6 bg-[#F8F9F4] hover:bg-red-50 text-[#5F6F52] hover:text-red-600 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 border border-transparent hover:border-red-100"
              >
                <LogOut size={18} /> تسجيل الخروج
              </button>
            </div>
          </div>

          {/* الجانب الأيسر: قائمة الطلبات */}
          <div className="lg:col-span-8 space-y-8 text-right">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-2xl text-[#5F6F52] flex items-center gap-3">
                <ShoppingBag className="text-[#5F6F52]" /> تتبع مشترياتكِ
              </h3>
              <span className="text-xs font-bold text-[#e5ece0] opacity-50">
                آخر التحديثات تظهر هنا
              </span>
            </div>

            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const currentStepIndex = statusSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-[3rem] border border-[#C3CBB9]/20 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-[#5F6F52]/10 transition-all duration-500"
                  >
                    {/* Header */}
                    <div className="p-8 border-b border-[#F8F9F4] bg-[#F8F9F4]/30 flex flex-wrap justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                          <Package size={22} className="text-[#5F6F52]" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#C3CBB9] font-black uppercase">
                            رقم التتبع
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-md font-black font-mono text-[#2D3436]">
                              #{order.id.slice(0, 8)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(order.id)}
                              className="p-1.5 hover:bg-[#5F6F52] hover:text-white rounded-lg transition-all text-[#C3CBB9]"
                            >
                              {copiedId === order.id ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div
                          className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black ${statusInfo.bg} ${statusInfo.color} border border-current/10`}
                        >
                          {statusInfo.icon} {order.status}
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black bg-[#2D3436] text-white">
                          {order.payment_method === "transfer" ? (
                            <Wallet size={14} />
                          ) : (
                            <Truck size={14} />
                          )}
                          {order.payment_method === "transfer"
                            ? "تم التحويل"
                            : "الدفع عند الاستلام"}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-[#F8F9F4]/50 p-4 rounded-[1.5rem] border border-[#C3CBB9]/10"
                          >
                            <img
                              src={item.image}
                              className="w-16 h-16 object-cover bg-white rounded-xl shadow-sm border border-[#C3CBB9]/10"
                              alt=""
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-black text-[#2D3436] line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-[#5F6F52] font-bold opacity-60">
                                الكمية: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-black text-[#2D3436]">
                              {item.price} <small>ج.م</small>
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Progress Tracker */}
                      <div className="px-4 mb-10">
                        <div className="relative flex justify-between items-center">
                          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#F8F9F4] -translate-y-1/2"></div>
                          <div
                            className="absolute top-1/2 right-0 h-[3px] bg-[#5F6F52] -translate-y-1/2 transition-all duration-[1500ms]"
                            style={{
                              width: `${
                                (currentStepIndex / (statusSteps.length - 1)) *
                                100
                              }%`,
                            }}
                          ></div>

                          {statusSteps.map((step, index) => (
                            <div
                              key={step}
                              className="relative z-10 flex flex-col items-center"
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-4 border-white shadow-md transition-all duration-500 ${
                                  index <= currentStepIndex
                                    ? "bg-[#5F6F52] scale-125"
                                    : "bg-[#C3CBB9]"
                                }`}
                              ></div>
                              <span
                                className={`text-[10px] mt-4 font-black transition-colors ${
                                  index <= currentStepIndex
                                    ? "text-[#2D3436]"
                                    : "text-[#C3CBB9]"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Summary */}
                      <div className="pt-6 border-t border-dashed border-[#C3CBB9]/30 flex justify-between items-end">
                        <div className="flex items-center gap-2 text-[#C3CBB9]">
                          <Calendar size={16} />
                          <span className="text-xs font-bold">
                            {new Date(order.created_at).toLocaleDateString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-[#C3CBB9] font-black uppercase mb-1">
                            إجمالي الفاتورة
                          </p>
                          <p className="text-3xl font-black text-[#2D3436]">
                            {order.total_price}{" "}
                            <span className="text-sm">ج.م</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-[#C3CBB9]/20">
                <div className="w-24 h-24 bg-[#F8F9F4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} className="text-[#C3CBB9]" />
                </div>
                <p className="text-[#2D3436] text-xl font-black mb-2">
                  لا توجد طلبات بعد
                </p>
                <p className="text-[#5F6F52] font-bold opacity-60 mb-8">
                  ابدأي رحلة التسوق واحصلي على أفضل منتجات العناية
                </p>
                <Link
                  href="/all-products"
                  className="inline-flex items-center gap-3 bg-[#2D3436] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#5F6F52] transition-all shadow-xl shadow-[#2D3436]/10"
                >
                  تصفحي المنتجات <ArrowRight size={18} className="rotate-180" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
