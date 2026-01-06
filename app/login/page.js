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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // تخصيص شكل تنبيهات SweetAlert لتناسب الهوية
    const customSwal = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-[#2D3436] text-white px-8 py-3 rounded-xl font-black",
      },
      buttonsStyling: false,
    });

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        customSwal.fire({
          icon: "error",
          title: "فشل الدخول",
          text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      } else {
        router.push("/profile");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        customSwal.fire({
          icon: "warning",
          title: "تنبيه",
          text: "كلمات المرور غير متطابقة",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName },
        },
      });

      if (error) {
        customSwal.fire({
          icon: "error",
          title: "فشل إنشاء الحساب",
          text: error.message,
        });
      } else {
        customSwal.fire({
          icon: "success",
          title: "تم التسجيل بنجاح",
          text: "يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب",
        });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9F4] flex items-center justify-center p-6"
      dir="rtl"
    >
      {/* العنصر الزخرفي الخلفي */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#5F6F52]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#E29595]/5 rounded-full blur-3xl" />
      </div>

      <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-[0_30px_100px_rgba(95,111,82,0.1)] border border-[#C3CBB9]/20 p-8 md:p-12 relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D3436] rounded-2xl mb-6 shadow-xl shadow-[#2D3436]/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Sparkles className="text-[#E29595]" size={30} />
          </div>
          <h1 className="text-3xl font-black text-[#2D3436] mb-2">
            {isLogin ? "مرحباً بكِ مجدداً" : "انضم لعالمنا"}
          </h1>
          {/* <p className="text-[#5F6F52] font-bold text-sm opacity-60">
            {isLogin
              ? "سجلي دخولكِ لمتابعة جمالكِ"
              : "أنشئي حسابكِ للحصول على عروض حصرية"}
          </p> */}
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {/* حقل الاسم */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#5F6F52] mr-4 uppercase tracking-wider">
                الاسم بالكامل
              </label>
              <div className="relative">
                <User
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C3CBB9]"
                  size={18}
                />
                <input
                  type="text"
                  required
                  placeholder="أدخلِ اسمكِ الكامل"
                  className="w-full bg-[#F8F9F4] border-2 border-transparent rounded-[1.2rem] py-4 pr-14 pl-4 text-sm font-bold focus:border-[#5F6F52]/20 focus:bg-white transition-all outline-none"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* حقل البريد */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#5F6F52] mr-4 uppercase tracking-wider">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C3CBB9]"
                size={18}
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full bg-[#F8F9F4] border-2 border-transparent rounded-[1.2rem] py-4 pr-14 pl-4 text-sm font-bold focus:border-[#5F6F52]/20 focus:bg-white transition-all outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* حقل كلمة السر */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#5F6F52] mr-4 uppercase tracking-wider">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C3CBB9]"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-[#F8F9F4] border-2 border-transparent rounded-[1.2rem] py-4 pr-14 pl-12 text-sm font-bold focus:border-[#5F6F52]/20 focus:bg-white transition-all outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C3CBB9] hover:text-[#5F6F52] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* تأكيد كلمة السر */}
          {!isLogin && (
            <div className="space-y-1.5 animate-in fade-in duration-500">
              <label className="text-[11px] font-black text-[#5F6F52] mr-4 uppercase tracking-wider">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C3CBB9]"
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#F8F9F4] border-2 border-transparent rounded-[1.2rem] py-4 pr-14 pl-4 text-sm font-bold focus:border-[#5F6F52]/20 focus:bg-white transition-all outline-none"
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

          {isLogin && (
            <div className="flex justify-end px-2">
              <Link
                href="/forgot-password"
                size={18}
                className="text-[11px] font-black text-[#E29595] hover:text-[#5F6F52] transition-colors"
              >
                هل نسيتِ كلمة السر؟
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D3436] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#5F6F52] transition-all shadow-xl shadow-[#2D3436]/10 active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isLogin ? "تسجيل الدخول" : "إنشاء حسابكِ الآن"}
                <ArrowRight size={20} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-[#F8F9F4] pt-8">
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
            className="text-sm font-bold text-[#5F6F52] hover:text-[#2D3436] transition-colors"
          >
            {isLogin ? (
              <>
                ليس لديكِ حساب؟{" "}
                <span className="text-[#E29595] font-black border-b-2 border-[#E29595]/20 pb-0.5">
                  انضم إلينا
                </span>
              </>
            ) : (
              <>
                لديكِ حساب بالفعل؟{" "}
                <span className="text-[#E29595] font-black border-b-2 border-[#E29595]/20 pb-0.5">
                  سجل دخولكِ
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
