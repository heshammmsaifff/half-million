"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  X,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [modalContent, setModalContent] = useState(null);

  // محتوى السياسات
  const policies = {
    terms: {
      title: "الشروط والأحكام",
      content: (
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            أهلاً بك في Half Million. باستخدامك لموقعنا، فإنك توافق على الالتزام
            بالشروط التالية:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>جميع المنتجات المعروضة تخضع للتوافر في المخزون.</li>
            <li>
              نلتزم بتقديم معلومات دقيقة حول المنتجات، ولكن قد تحدث أخطاء تقنية
              أحياناً.
            </li>
            <li>يُحظر استخدام المحتوى الخاص بنا لأغراض تجارية دون إذن مسبق.</li>
            <li>نحتفظ بالحق في تعديل الأسعار أو شروط الخدمة في أي وقت.</li>
          </ul>
        </div>
      ),
    },
    privacy: {
      title: "سياسة الخصوصية",
      content: (
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>خصوصيتك تهمنا. إليك كيف نتعامل مع بياناتك:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              نقوم بجمع البيانات الشخصية الأساسية (الاسم، العنوان، الهاتف)
              لإتمام الطلبات فقط.
            </li>
            <li>
              لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية.
            </li>
            <li>
              نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح الخاصة
              بك.
            </li>
            <li>
              بيانات الدفع مشفرة تماماً عبر بوابات دفع آمنة ومعتمدة عالمياً.
            </li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <footer className="relative bg-[#0A0A0A] text-white pt-20 pb-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        {/* الجزء العلوي: اللوجو */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="Half Million"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span className="hidden font-black text-black text-xl">HM</span>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter">
                  HALF MILLION
                </h2>
                <p className="text-gray-400 text-sm font-bold">
                  الجمال والصحة في مكان واحد
                </p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed font-medium">
              نحن نقدم لكِ أفضل تشكيلة من الفيتامينات ومستحضرات التجميل
              العالمية، نهتم بأدق التفاصيل لنضمن لكِ تجربة تسوق فاخرة.
            </p>
          </div>
        </div>

        {/* الجزء الأوسط: الروابط */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-16">
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
              التسوق
            </h4>
            <ul className="space-y-4 font-bold">
              <li>
                <Link
                  href="/all-products"
                  className="hover:text-gray-400 transition-colors flex items-center gap-1"
                >
                  المتجر <ArrowUpRight size={14} />
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="hover:text-gray-400 transition-colors text-amber-400"
                >
                  العروض الحصرية
                </Link>
              </li>
              <li>
                <Link
                  href="/all-brands"
                  className="hover:text-gray-400 transition-colors"
                >
                  العلامات التجارية
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
              تواصل معنا
            </h4>
            <ul className="space-y-4 font-bold text-gray-300">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white" />
                <span dir="ltr">0100-000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white" />
                example@example.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-white shrink-0" /> المحافظة،
                الدولة
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
              تابعونا
            </h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* الجزء السفلي: الحقوق والسياسات */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-bold text-center md:text-right">
            جميع الحقوق محفوظة © {currentYear}{" "}
            <span className="text-white">HALF MILLION</span>
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-xs text-gray-500 font-bold">
              <button
                onClick={() => setModalContent(policies.terms)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                الشروط والأحكام
              </button>
              <button
                onClick={() => setModalContent(policies.privacy)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                سياسة الخصوصية
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المودال الاحترافي */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalContent(null)}
          />
          <div className="relative bg-[#111] border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <h3 className="text-xl font-black">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-right">
              {modalContent.content}
            </div>
            <div className="p-6 border-t border-white/5 text-center">
              <button
                onClick={() => setModalContent(null)}
                className="w-full py-3 bg-white text-black rounded-xl font-black hover:bg-gray-200 transition-colors"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
