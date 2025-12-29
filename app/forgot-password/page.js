"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "تعذر إرسال الرابط، تأكد من صحة البريد الإلكتروني",
        confirmButtonColor: "#000",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "تفقد بريدك الإلكتروني",
        text: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك بنجاح",
        confirmButtonColor: "#000",
      });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12 relative">
        {/* زر الرجوع */}
        <Link
          href="/login"
          className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-black border border-gray-100">
            <Send size={32} />
          </div>
          <h1 className="text-3xl font-black text-black mb-3">
            نسيت كلمة المرور؟
          </h1>
          <p className="text-gray-400 font-bold text-sm leading-relaxed px-4">
            لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
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
                placeholder="example@mail.com"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "إرسال رابط الاستعادة"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-sm font-black text-gray-400 hover:text-black underline"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
