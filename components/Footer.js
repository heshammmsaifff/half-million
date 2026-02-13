"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  ArrowUpRight,
  X,
  Heart,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [modalContent, setModalContent] = useState(null);

  // بيانات التواصل - يمكنك تغيير الروابط هنا بسهولة
  const contactLinks = {
    phone: "01022557962",
    email: "info@halfmillion1.com",
    instagram: "https://www.instagram.com/half96862?igsh=b3F1bmhzOXl2YzZz",
    facebook: "https://www.facebook.com/share/17Pv1LK3Se/",
    // twitter: "#",
  };

  const policies = {
    terms: {
      title: "الشروط والأحكام",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
          <p>
            أهلاً بك في <span className="text-[#C3CBB9]">Half Million</span>.
            باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط التالية:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>جميع المنتجات المعروضة تخضع للتوافر في المخزون.</li>
            <li>نلتزم بتقديم معلومات دقيقة حول المنتجات.</li>
            <li>يُحظر استخدام المحتوى الخاص بنا لأغراض تجارية دون إذن.</li>
          </ul>
        </div>
      ),
    },
    privacy: {
      title: "سياسة الخصوصية",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
          <p>خصوصيتك تهمنا جداً:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>نقوم بجمع البيانات الأساسية لإتمام الطلبات فقط.</li>
            <li>لا نقوم بمشاركة بياناتك مع أي طرف ثالث.</li>
            <li>بيانات الدفع مشفرة تماماً عبر بوابات آمنة.</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <footer
      className="relative bg-[#1A1C17] text-white pt-24 pb-12 overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#C3CBB9]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#C3CBB9] rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-[#C3CBB9]/10">
                <Link href="/" className="h-10">
                  <img
                    src="/logo.svg"
                    alt="Logo"
                    className="h-full object-contain"
                  />
                </Link>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  HALF MILLION
                </h2>
                <p className="text-[#C3CBB9] text-sm font-bold flex items-center gap-2">
                  الجمال والصحة من الطبيعة{" "}
                  <Heart size={12} className="fill-[#E29595] text-[#E29595]" />
                </p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed font-medium text-lg">
              نختار لكِ بعناية أجود الفيتامينات ومستحضرات التجميل العالمية،
              لأننا نؤمن أن روتينك اليومي يستحق الأفضل.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#C3CBB9]">
              التسوق
            </h4>
            <ul className="space-y-4 font-bold">
              {[
                { name: "المتجر", slug: "/all-products" },
                { name: "العروض الحصرية", slug: "/offers" },
                { name: "العلامات التجارية", slug: "/all-brands" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.slug}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#C3CBB9]">
              تواصل معنا
            </h4>
            <ul className="space-y-5 text-gray-300 font-medium">
              {/* Phone Link */}
              <li>
                <a
                  href={`tel:${contactLinks.phone}`}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#C3CBB9]/20 transition-colors">
                    <Phone size={18} className="text-[#C3CBB9]" />
                  </div>
                  <span
                    dir="ltr"
                    className="group-hover:text-white transition-colors"
                  >
                    {contactLinks.phone}
                  </span>
                </a>
              </li>
              {/* Email Link */}
              <li>
                <a
                  href={`mailto:${contactLinks.email}`}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#C3CBB9]/20 transition-colors">
                    <Mail size={18} className="text-[#C3CBB9]" />
                  </div>
                  <span className="group-hover:text-white transition-colors">
                    {contactLinks.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media - Individual Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#C3CBB9]">
              تابعونا
            </h4>
            <div className="flex gap-3">
              <a
                href={contactLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#C3CBB9] hover:text-[#1A1C17] transition-all duration-500"
              >
                <Instagram size={20} />
              </a>
              <a
                href={contactLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#C3CBB9] hover:text-[#1A1C17] transition-all duration-500"
              >
                <Facebook size={20} />
              </a>
              {/* <a
                href={contactLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#C3CBB9] hover:text-[#1A1C17] transition-all duration-500"
              >
                <Twitter size={20} />
              </a> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-sm font-bold">
            جميع الحقوق محفوظة © {currentYear}{" "}
            <span className="text-[#C3CBB9]">HALF MILLION</span>
          </p>
          <div className="flex gap-8 text-xs font-black text-gray-500">
            <button
              onClick={() => setModalContent(policies.terms)}
              className="hover:text-[#C3CBB9] transition-colors uppercase tracking-widest"
            >
              الشروط
            </button>
            <button
              onClick={() => setModalContent(policies.privacy)}
              className="hover:text-[#C3CBB9] transition-colors uppercase tracking-widest"
            >
              الخصوصية
            </button>
          </div>
        </div>
      </div>

      {/* Modern Modal Component */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-[#1A1C17]/90 backdrop-blur-md"
            onClick={() => setModalContent(null)}
          />
          <div className="relative bg-[#242721] border border-[#C3CBB9]/20 w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-8 border-b border-white/5">
              <h3 className="text-xl font-black text-white">
                {modalContent.title}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10">{modalContent.content}</div>
            <div className="p-8">
              <button
                onClick={() => setModalContent(null)}
                className="w-full py-4 bg-[#C3CBB9] text-[#1A1C17] rounded-2xl font-black hover:bg-white transition-all shadow-xl shadow-[#C3CBB9]/10"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
