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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const statusSteps = [
    "جاري المراجعة",
    "جاري التعبئة",
    "تم الشحن",
    "تم الاستلام",
  ];

  // 1. دالة جلب البيانات الأساسية
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

      // 2. تفعيل التتبع اللحظي (Realtime)
      // هذا الجزء يجعل الصفحة "تسمع" لأي تغيير يحدث في جدول الطلبات
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
            // تحديث الطلب المعين في الحالة (State) فوراً عند وصول التحديث
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === payload.new.id
                  ? { ...order, ...payload.new }
                  : order
              )
            );
            toast.success("تم تحديث حالة طلبك!");
          }
        )
        .subscribe();

      // تنظيف الاشتراك عند إغلاق الصفحة
      return () => {
        supabase.removeChannel(channel);
      };
    };

    setup();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push("/");
  };

  const getStatusInfo = (currentStatus) => {
    switch (currentStatus) {
      case "جاري المراجعة":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          icon: <Search size={14} />,
        };
      case "جاري التعبئة":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          icon: <Box size={14} />,
        };
      case "تم الشحن":
        return {
          color: "text-purple-600",
          bg: "bg-purple-50",
          icon: <Truck size={14} />,
        };
      case "تم الاستلام":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          icon: <CheckCircle2 size={14} />,
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          icon: <Package size={14} />,
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <h1 className="text-3xl font-bold mb-8 italic">ملفي الشخصي</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <h2 className="font-bold text-xl truncate">
                {user?.user_metadata?.full_name || "مستخدم"}
              </h2>
              <p className="text-gray-500 text-xs mb-6 truncate">
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} /> تسجيل الخروج
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Package size={22} /> تتبع الطلبات ({orders.length})
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-8">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const currentStepIndex = statusSteps.indexOf(order.status);

                    return (
                      <div
                        key={order.id}
                        className="border border-gray-100 p-6 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                              <Calendar size={14} />
                              <span className="text-xs font-bold">
                                {new Date(order.created_at).toLocaleDateString(
                                  "ar-EG"
                                )}
                              </span>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color}`}
                            >
                              {statusInfo.icon} {order.status}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold mb-1">
                              الإجمالي
                            </p>
                            <p className="font-bold text-black">
                              {order.total_price} ج.م
                            </p>
                          </div>
                        </div>

                        <div className="relative flex justify-between items-center mb-8 px-2">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                          <div
                            className="absolute top-1/2 right-0 h-1 bg-black -translate-y-1/2 z-0 transition-all duration-700"
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
                                className={`w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors duration-500 ${
                                  index <= currentStepIndex
                                    ? "bg-black"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span
                                className={`text-[9px] mt-2 font-bold ${
                                  index <= currentStepIndex
                                    ? "text-black"
                                    : "text-gray-300"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="relative shrink-0 w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 p-1"
                            >
                              <img
                                src={item.image}
                                className="w-full h-full object-contain"
                                alt=""
                              />
                              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 font-bold">
                    لا يوجد طلبات لتتبعها حالياً
                  </p>
                  <Link
                    href="/all-products"
                    className="text-black underline font-bold text-sm mt-4 inline-block"
                  >
                    تسوق الآن
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
