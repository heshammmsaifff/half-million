"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // التبديل بين الدخول والاشتراك
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // الحقول
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // --- منطق تسجيل الدخول ---
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ في الدخول",
          text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          confirmButtonColor: "#000",
        });
      } else {
        router.push("/profile");
      }
    } else {
      // --- منطق إنشاء حساب جديد ---
      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "تنبيه",
          text: "كلمات المرور غير متطابقة",
          confirmButtonColor: "#000",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "فشل إنشاء الحساب",
          text: error.message,
          confirmButtonColor: "#000",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "تم التسجيل بنجاح",
          text: "يرجى الذهاب إلى بريدك الإلكتروني لتأكيد حسابك وتفعيل الدخول",
          confirmButtonText: "موافق",
          confirmButtonColor: "#22c55e",
        });
        setIsLogin(true); // ارجاعه لصفحة الدخول بعد التسجيل
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-black mb-3">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-gray-400 font-bold text-sm">
            {isLogin
              ? "أهلاً بك مجدداً في Half Million"
              : "انضم إلينا واستمتع بأفضل العروض"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {/* حقل الاسم (يظهر في الإنشاء فقط) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 mr-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={18}
                />
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* حقل البريد */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type="email"
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* حقل كلمة السر */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">
              كلمة السر
            </label>
            <div className="relative">
              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-12 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* حقل تأكيد كلمة السر (يظهر في الإنشاء فقط) */}
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-black text-gray-400 mr-2">
                تأكيد كلمة السر
              </label>
              <div className="relative">
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* نسيان كلمة السر */}
          {isLogin && (
            <div className="text-left">
              <Link
                href="/forgot-password"
                size={18}
                className="text-xs font-black text-gray-400 hover:text-black"
              >
                نسيت كلمة السر؟
              </Link>
            </div>
          )}

          {/* زر التقديم */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isLogin ? (
              "تسجيل الدخول"
            ) : (
              "إنشاء حساب"
            )}
            <ArrowRight size={18} className="rotate-180" />
          </button>
        </form>

        {/* التبديل بين الحالتين */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                fullName: "",
              });
            }}
            className="text-sm font-bold text-gray-500 hover:text-black"
          >
            {isLogin ? (
              <>
                ليس لديك حساب؟{" "}
                <span className="text-black font-black underline">
                  اشترك الآن
                </span>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{" "}
                <span className="text-black font-black underline">
                  سجل دخولك
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
