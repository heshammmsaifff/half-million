"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Lock, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "كلمات المرور غير متطابقة",
        confirmButtonColor: "#000",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء تحديث كلمة المرور: " + error.message,
        confirmButtonColor: "#000",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "تم التغيير بنجاح",
        text: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
        confirmButtonColor: "#22c55e",
      }).then(() => {
        router.push("/login");
      });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-black/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black text-black mb-3">
            كلمة مرور جديدة
          </h1>
          <p className="text-gray-400 font-bold text-sm">
            قم بإنشاء كلمة مرور قوية لحماية حسابك
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* كلمة المرور الجديدة */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">
              كلمة المرور الجديدة
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* تأكيد كلمة المرور */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <CheckCircle2
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={18}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "تحديث كلمة المرور"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
