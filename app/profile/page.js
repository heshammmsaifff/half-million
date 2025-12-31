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
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null); // لحالة نسخ رقم الطلب
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
            toast.success("تم تحديث حالة طلبك!");
          }
        )
        .subscribe();

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
        color: "text-purple-600",
        bg: "bg-purple-50",
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <h1 className="text-3xl font-black italic mb-8 text-right">حسابي</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ملف المستخدم - يحتوي الآن على زر الخروج */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 text-center sticky top-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <User size={30} className="text-gray-400" />
                )}
              </div>
              <h2 className="font-black text-lg">
                {user?.user_metadata?.full_name || "المستخدم"}
              </h2>
              <p className="text-gray-400 text-xs mb-6">{user?.email}</p>

              <div className="pt-4 border-t border-gray-50 flex justify-around mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    الطلبات
                  </p>
                  <p className="font-black text-lg">{orders.length}</p>
                </div>
                <div className="border-r border-gray-100"></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    الحالة
                  </p>
                  <p className="font-black text-lg text-green-500">نشط</p>
                </div>
              </div>

              {/* زر تسجيل الخروج هنا */}
              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* قائمة الطلبات */}
          <div className="lg:col-span-2 space-y-6 text-right">
            <h3 className="font-black text-xl flex items-center gap-2 px-2">
              <Package className="text-gray-400" /> تتبع مشترياتك
            </h3>

            {orders.length > 0 ? (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const currentStepIndex = statusSteps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* رأس الطلب */}
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <Info size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-black">
                            رقم الطلب
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black font-mono">
                              #{order.id.slice(0, 8)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(order.id)}
                              className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400"
                              title="نسخ رقم الطلب"
                            >
                              {copiedId === order.id ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.icon} {order.status}
                        </div>
                        {order.payment_method === "transfer" ? (
                          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-600">
                            <Wallet size={14} /> تحويل بنكي أو محفظة الكترونية
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-600">
                            <Truck size={14} /> دفع عند الاستلام
                          </div>
                        )}
                      </div>
                    </div>

                    {/* محتوى الطلب */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50"
                          >
                            <img
                              src={item.image}
                              className="w-14 h-14 object-contain bg-white rounded-lg p-1 border"
                              alt=""
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">
                                الكمية: {item.quantity}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-black">
                                {item.price} ج.م
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* شريط التتبع */}
                      <div className="py-6 px-2">
                        <div className="relative flex justify-between items-center">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2"></div>
                          <div
                            className="absolute top-1/2 right-0 h-1 bg-black -translate-y-1/2 transition-all duration-1000"
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
                                className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                                  index <= currentStepIndex
                                    ? "bg-black"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span
                                className={`text-[8px] mt-2 font-black ${
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
                      </div>

                      {/* ملخص الدفع */}
                      <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            تاريخ الطلب
                          </p>
                          <p className="text-xs font-bold text-gray-600">
                            {new Date(order.created_at).toLocaleDateString(
                              "ar-EG"
                            )}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            إجمالي ما تم دفعه
                          </p>
                          <p className="text-xl font-black text-black">
                            {order.total_price} ج.م
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <Package size={48} className="mx-auto text-gray-100 mb-4" />
                <p className="text-gray-400 font-bold">لم تقم بأي طلبات بعد</p>
                <Link
                  href="/all-products"
                  className="mt-4 inline-block bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm"
                >
                  ابدأ التسوق
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
