"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
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
  Copy,
  Check,
  ArrowRight,
  TicketPercent,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [copiedText, setCopiedText] = useState("");

  // حالات البرومو كود
  const [promoCode, setPromoCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState({ percent: 0, code: "" });
  const [verifyingPromo, setVerifyingPromo] = useState(false);

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discountInfo.percent) / 100;
  const totalAmount = subtotal - discountAmount;

  const isMandatoryOnline = totalAmount >= 2000;

  const WALLET_NUMBER = "01063272272";
  const INSTAPAY_ID = "xowof272272";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    city: "",
    state: "",
    address: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUser(user);
      setIsClient(true);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (isMandatoryOnline) {
      setFormData((prev) => ({ ...prev, paymentMethod: "transfer" }));
    }
  }, [isMandatoryOnline]);

  // وظيفة التحقق من البرومو كود
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error("يرجى إدخال الكود أولاً");

    setVerifyingPromo(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error("كود الخصم غير صحيح أو منتهي الصلاحية");
      }

      // التحقق من تاريخ الانتهاء
      if (new Date(data.expiration_date) < new Date()) {
        throw new Error("هذا الكود انتهت صلاحيته");
      }

      // التحقق من الحد الأقصى للاستخدام
      if (data.times_used >= data.usage_limit) {
        throw new Error("وصل هذا الكود للحد الأقصى للاستخدام");
      }

      setDiscountInfo({ percent: data.discount_percent, code: data.code });

      Swal.fire({
        title: "تم تفعيل الخصم!",
        text: `مبروك! حصلتِ على خصم ${data.discount_percent}%`,
        icon: "success",
        confirmButtonText: "تأكيد",
        confirmButtonColor: "#5F6F52",
      });
    } catch (err) {
      Swal.fire({
        title: "عذراً!",
        text: err.message,
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#2D3436",
      });
      setDiscountInfo({ percent: 0, code: "" });
    } finally {
      setVerifyingPromo(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success("تم نسخ البيانات بنجاح");
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("يرجى اختيار ملف صورة صالح");

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });
      setReceiptFile(compressedFile);
      toast.success("تم تجهيز صورة الإيصال");
    } catch (error) {
      toast.error("فشل معالجة الصورة");
    } finally {
      setCompressing(false);
    }
  };

  const uploadReceipt = async (file) => {
    const fileExt = file.name.split(".").pop();
    const folderPath = currentUser ? currentUser.id : "guest_uploads";
    const fileName = `${folderPath}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
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
    if (formData.phone.length < 11) return toast.error("رقم الهاتف غير صحيح");
    if (formData.paymentMethod === "transfer" && !receiptFile) {
      return toast.error("يرجى إرفاق صورة إيصال التحويل لإتمام الطلب");
    }

    setLoading(true);
    try {
      let receiptUrl = null;
      if (receiptFile) receiptUrl = await uploadReceipt(receiptFile);

      const orderData = {
        customer_name: formData.name,
        phone: formData.phone,
        secondary_phone: formData.phone2,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        subtotal_price: subtotal,
        discount_amount: discountAmount,
        total_price: totalAmount,
        applied_promo: discountInfo.code,
        items: cart,
        user_id: currentUser ? currentUser.id : null,
        payment_method: formData.paymentMethod,
        proof_image_url: receiptUrl,
        status: "جاري المراجعة",
        created_at: new Date(),
      };

      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      // تحديث عدد مرات استخدام الكود في قاعدة البيانات
      // استبدل الكود القديم بهذا السطر فقط بعد تنفيذ الـ SQL أعلاه
      if (discountInfo.code) {
        await supabase.rpc("increment_promo_usage", {
          code_param: discountInfo.code,
        });
      }

      setOrderCompleted(true);
      clearCart();
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#F8F9F4]"
        dir="rtl"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200/50">
          <CheckCircle2 size={50} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#2D3436]">
          شكراً لثقتكِ بجمالكِ
        </h1>
        <p className="text-gray-500 text-lg max-w-md mb-10">
          تم استلام طلبكِ بنجاح. سيقوم فريقنا بمراجعة البيانات وتأكيد الطلب
          قريباً.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/profile")}
            className="bg-[#2D3436] text-white px-10 py-4 rounded-2xl font-black"
          >
            متابعة طلباتي
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-[#2D3436] border border-gray-200 px-10 py-4 rounded-2xl font-black"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-[#2D3436] pt-16 pb-24 px-6 text-center text-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            إتمام عملية الشراء
          </h1>
          <p className="text-[#C3CBB9] font-medium">
            خطوة واحدة وتصلكِ منتجاتكِ المفضلة
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                <div className="w-10 h-10 bg-[#5F6F52]/10 text-[#5F6F52] rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-[#2D3436]">
                  معلومات الشحن
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 mr-2">
                    الاسم بالكامل
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="اكتب اسمك الثلاثي..."
                    className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold outline-none border border-gray-100"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 mr-2">
                      رقم الهاتف الأساسي
                    </label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      placeholder="01xxxxxxxxx"
                      className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold text-right border border-gray-100"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 mr-2">
                      رقم هاتف بديل (اختياري)
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold text-right border border-gray-100"
                      value={formData.phone2}
                      onChange={(e) =>
                        setFormData({ ...formData, phone2: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 mr-2">
                      المحافظة
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold border border-gray-100"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 mr-2">
                      المدينة / المنطقة
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold border border-gray-100"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 mr-2">
                    العنوان بالتفصيل
                  </label>
                  <textarea
                    required
                    rows="2"
                    className="w-full bg-[#F8F9F4] p-4 rounded-2xl font-bold border border-gray-100 resize-none"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>

                {/* Payment Methods */}
                <div className="pt-8 border-t">
                  <h3 className="text-lg font-black text-[#2D3436] mb-6 flex items-center gap-2">
                    <Wallet size={20} className="text-[#E29595]" /> طريقة الدفع
                  </h3>

                  {isMandatoryOnline && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <CheckCircle2 size={14} /> للطلبات فوق 2000 ج.م، الدفع عبر
                      التحويل فقط.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      disabled={isMandatoryOnline}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "cod" })
                      }
                      className={`p-6 rounded-[2.2rem] border-2 text-right transition-all ${formData.paymentMethod === "cod" ? "border-[#2D3436] bg-[#2D3436] text-white shadow-xl" : "border-gray-100 bg-gray-50"} ${isMandatoryOnline ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <Truck
                        size={24}
                        className={`mb-3 ${formData.paymentMethod === "cod" ? "text-[#E29595]" : "text-gray-400"}`}
                      />
                      <p className="font-black text-sm">الدفع عند الاستلام</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "transfer" })
                      }
                      className={`p-6 rounded-[2.2rem] border-2 text-right transition-all ${formData.paymentMethod === "transfer" ? "border-[#2D3436] bg-[#2D3436] text-white shadow-xl" : "border-gray-100 bg-gray-50"}`}
                    >
                      <Wallet
                        size={24}
                        className={`mb-3 ${formData.paymentMethod === "transfer" ? "text-[#E29595]" : "text-gray-400"}`}
                      />
                      <p className="font-black text-sm">انستا باي / محفظة</p>
                    </button>
                  </div>

                  {formData.paymentMethod === "transfer" && (
                    <div className="mt-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-4 bg-[#F8F9F4] rounded-2xl border">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">
                              محفظة
                            </p>
                            <p className="font-black">{WALLET_NUMBER}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(WALLET_NUMBER)}
                            className="p-2.5 bg-white rounded-xl shadow-sm"
                          >
                            {copiedText === WALLET_NUMBER ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#F8F9F4] rounded-2xl border">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">
                              InstaPay
                            </p>
                            <p className="font-black">{INSTAPAY_ID}@instapay</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(INSTAPAY_ID)}
                            className="p-2.5 bg-white rounded-xl shadow-sm"
                          >
                            {copiedText === INSTAPAY_ID ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`mt-4 p-8 border-2 border-dashed rounded-[2.5rem] text-center ${receiptFile ? "border-green-200 bg-green-50/20" : "border-gray-100"}`}
                      >
                        <input
                          type="file"
                          id="receipt"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="receipt"
                          className="cursor-pointer block"
                        >
                          {compressing ? (
                            <Loader2 className="animate-spin mx-auto mb-2" />
                          ) : receiptFile ? (
                            <FileCheck
                              className="text-green-500 mx-auto mb-2"
                              size={32}
                            />
                          ) : (
                            <UploadCloud
                              className="text-gray-300 mx-auto mb-2"
                              size={32}
                            />
                          )}
                          <p className="text-sm font-black">
                            {receiptFile
                              ? "تم رفع الإيصال"
                              : "ارفع صورة إيصال التحويل"}
                          </p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || compressing}
                  className="w-full py-5 rounded-2xl font-black text-xl bg-[#2D3436] text-white hover:bg-[#5F6F52] disabled:bg-gray-200 transition-all flex items-center justify-center gap-3 mt-10 shadow-xl shadow-[#2D3436]/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "إرسال الطلب الآن"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Cart Summary Side */}
          <div className="lg:col-span-5">
            <div className="bg-[#2D3436] text-white p-8 md:p-10 rounded-[3rem] sticky top-10 shadow-2xl">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <ShoppingBag size={22} className="text-[#E29595]" /> ملخص
                الطلبات
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-[#C3CBB9] text-[10px] font-bold mt-1">
                        {item.quantity} × {item.price.toLocaleString()} ج.م
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <p className="text-xs font-black text-gray-400 mb-3 flex items-center gap-2">
                  <TicketPercent size={14} className="text-[#E29595]" /> هل لديك
                  كود خصم؟
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ادخل الكود هنا..."
                    className="flex-1 bg-white/10 border-white/10 p-3 rounded-xl font-bold text-sm outline-none focus:ring-1 focus:ring-[#E29595] transition-all"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={discountInfo.percent > 0}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={verifyingPromo || discountInfo.percent > 0}
                    className="bg-[#E29595] text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-[#d48484] disabled:bg-gray-500 transition-all"
                  >
                    {verifyingPromo ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "تفعيل"
                    )}
                  </button>
                </div>
                {discountInfo.percent > 0 && (
                  <p className="text-green-400 text-[10px] font-bold mt-2 flex items-center gap-1">
                    <Check size={12} /> تم تطبيق خصم {discountInfo.percent}%
                    بنجاح
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">
                    مجموع المنتجات
                  </span>
                  <span className="font-black">
                    {subtotal.toLocaleString()} ج.م
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span className="font-bold text-sm">
                      خصم الكود ({discountInfo.percent}%)
                    </span>
                    <span className="font-black font-mono">
                      -{discountAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">
                    مصاريف الشحن
                  </span>
                  <span className="text-[#E29595] font-black text-xs">
                    يحدد لاحقاً
                  </span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-[#C3CBB9] font-black uppercase mb-1">
                      المبلغ الإجمالي
                    </p>
                    <p className="text-4xl font-black text-white">
                      {totalAmount.toLocaleString()}{" "}
                      <small className="text-xs">ج.م</small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
