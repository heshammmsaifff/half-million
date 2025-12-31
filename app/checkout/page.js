"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression"; // استيراد مكتبة الضغط
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Plus,
  Wallet,
  Truck,
  UploadCloud,
  FileCheck,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false); // حالة خاصة لعملية الضغط
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const totalAmount = getCartTotal();
  const isMandatoryOnline = totalAmount >= 2000;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    city: "",
    state: "",
    address: "",
    paymentMethod: isMandatoryOnline ? "transfer" : "cod",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Swal.fire({
          icon: "warning",
          title: "تسجيل الدخول مطلوب",
          text: "يرجى تسجيل الدخول أولاً لإتمام عملية الشراء",
          confirmButtonText: "تسجيل الدخول",
          confirmButtonColor: "#000",
        }).then(() => router.push("/login"));
      } else {
        setCurrentUser(user);
        setIsClient(true);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (isMandatoryOnline) {
      setFormData((prev) => ({ ...prev, paymentMethod: "transfer" }));
    }
  }, [isMandatoryOnline]);

  // دالة التعامل مع اختيار الصورة وضغطها فوراً
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressing(true);

    // إعدادات الضغط العالي (Target: ~50-70KB)
    const options = {
      maxSizeMB: 0.07, // أقصى حجم 70 كيلوبايت تقريباً
      maxWidthOrHeight: 1024, // تقليل الأبعاد للحفاظ على الوضوح مع صغر الحجم
      useWebWorker: true,
      initialQuality: 0.6, // جودة 60% (توازن ممتاز للوصلات الورقية)
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      // تحويل Blob إلى File مرة أخرى لرفعه لـ Supabase
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      setReceiptFile(compressedFile);
      toast.success(
        `تم ارفاق الصورة بنجاح (${(compressedFile.size / 1024).toFixed(1)} KB)`
      );
    } catch (error) {
      console.error("Compression Error:", error);
      toast.error("فشل ضغط الصورة، حاول مرة أخرى");
    } finally {
      setCompressing(false);
    }
  };

  const uploadReceipt = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(fileName, file);

    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("receipts").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return toast.error("سلتك فارغة!");
    if (formData.paymentMethod === "transfer" && !receiptFile) {
      return toast.error("يرجى إرفاق صورة إيصال التحويل");
    }

    setLoading(true);

    try {
      let receiptUrl = null;
      if (receiptFile) {
        receiptUrl = await uploadReceipt(receiptFile);
      }

      const orderData = {
        customer_name: formData.name,
        phone: formData.phone,
        secondary_phone: formData.phone2,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        total_price: totalAmount,
        items: cart,
        user_id: currentUser.id,
        payment_method: formData.paymentMethod,
        proof_image_url: receiptUrl,
        status: "جاري المراجعة",
      };

      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      toast.success("تم استلام طلبك بنجاح!");
      setOrderCompleted(true);
      clearCart();
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center p-6"
        dir="rtl"
      >
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={50} />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">
          شكراً لثقتك بنا
        </h1>
        <p className="text-gray-500 text-xl max-w-md font-bold italic">
          تم استلام طلبك بنجاح وجاري المراجعة.
        </p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-10 bg-black text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg"
        >
          عرض طلباتي
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16" dir="rtl">
      <Toaster position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black italic underline decoration-gray-200 underline-offset-8">
              إتمام الشراء
            </h1>
            {isMandatoryOnline && (
              <p className="text-red-600 font-bold text-sm bg-red-50 p-4 rounded-2xl flex items-center gap-2 animate-pulse">
                <Wallet size={16} /> تنبيه: للطلبات التي تزيد عن 2000 ج.م، الدفع
                عبر التحويل فقط.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2">
                <User size={16} /> الاسم بالكامل
              </label>
              <input
                required
                type="text"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <Phone size={16} /> رقم الهاتف
                </label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2 text-gray-400">
                  <Plus size={16} /> هاتف إضافي
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                  value={formData.phone2}
                  onChange={(e) =>
                    setFormData({ ...formData, phone2: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <MapPin size={16} /> المحافظة
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <MapPin size={16} /> المدينة
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black flex items-center gap-2">
                <MapPin size={16} /> العنوان بالتفصيل
              </label>
              <textarea
                required
                rows="2"
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-black italic">طريقة الدفع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={isMandatoryOnline}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "cod" })
                  }
                  className={`p-5 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${
                    formData.paymentMethod === "cod"
                      ? "border-black bg-black text-white shadow-xl"
                      : "border-gray-100 bg-gray-50"
                  } ${
                    isMandatoryOnline ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Truck size={24} />
                  <div className="text-right">
                    <p className="font-black text-sm">الدفع عند الاستلام</p>
                    <p
                      className={`text-[10px] ${
                        formData.paymentMethod === "cod"
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      متاح للطلبات أقل من 2000 ج.م
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "transfer" })
                  }
                  className={`p-5 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${
                    formData.paymentMethod === "transfer"
                      ? "border-black bg-black text-white shadow-xl"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <Wallet size={24} />
                  <div className="text-right">
                    <p className="font-black text-sm">انستا باي / محفظة</p>
                    <p
                      className={`text-[10px] ${
                        formData.paymentMethod === "transfer"
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      0123456789 (فودافون كاش)
                    </p>
                  </div>
                </button>
              </div>

              {formData.paymentMethod === "transfer" && (
                <div
                  className={`mt-6 p-8 border-2 border-dashed rounded-[2.5rem] space-y-4 transition-all ${
                    receiptFile
                      ? "border-green-200 bg-green-50/30"
                      : "border-blue-100 bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="font-black text-sm">إرفاق إيصال التحويل</p>
                      {/* <p className="text-xs text-gray-500">
                        سيتم ضغط الصورة تلقائياً لتوفير المساحة
                      </p> */}
                    </div>
                    {compressing ? (
                      <Loader2 className="animate-spin text-blue-500" />
                    ) : receiptFile ? (
                      <FileCheck className="text-green-500" />
                    ) : (
                      <UploadCloud className="text-blue-400" />
                    )}
                  </div>

                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                  />

                  {receiptFile && (
                    <p className="text-[10px] font-bold text-green-600">
                      تم التجهيز: {(receiptFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              disabled={loading || compressing}
              className="w-full py-6 rounded-[2.5rem] font-black text-2xl bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 transition-all flex items-center justify-center gap-4 shadow-2xl"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "إرسال الطلب الآن"
              )}
            </button>
          </form>
        </div>

        <div className="bg-[#0A0A0A] text-white p-8 md:p-12 rounded-[3.5rem] sticky top-10 border border-white/5 shadow-2xl h-fit">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-3 italic">
            <ShoppingBag size={24} /> ملخص الطلب
          </h3>
          <div className="space-y-6 max-h-[350px] overflow-y-auto mb-10 pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5"
              >
                <img
                  src={item.image}
                  className="w-16 h-16 object-cover rounded-2xl"
                  alt={item.name}
                />
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-xs font-bold italic">
                    {item.quantity} قطعة × {item.price} ج.م
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-2xl font-black pt-8 border-t border-white/10">
            <span>الإجمالي النهائي</span>
            <span className="text-green-400 underline decoration-white underline-offset-8">
              {totalAmount} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
