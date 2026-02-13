"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Clock,
  ArrowLeft,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // هنا يمكنك ربط النموذج بجدول 'messages' في Supabase
    setTimeout(() => {
      alert("تم إرسال رسالتك بنجاح!");
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "اتصل بنا",
      detail: "01022557962",
      subDetail: "متاح من 9 صباحاً لـ 10 مساءً",
      link: "tel:01022557962",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "واتساب",
      detail: "01022557986",
      subDetail: "رد سريع خلال ساعة",
      link: "https://wa.me/201022557986",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      detail: "info@halfmillion1.com",
      subDetail: "للاستفسارات الرسمية",
      link: "mailto:support@halfmillion.com",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header Section */}
      <div className="relative h-[45vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070')] bg-cover bg-center scale-110" />
        <div className="relative z-10 text-center space-y-4 px-6">
          <span className="text-white/70 uppercase tracking-[0.3em] text-sm font-bold">
            نحن هنا لمساعدتك
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
            تواصل معنا
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((item, index) => (
            <a
              href={item.link}
              key={index}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 hover:-translate-y-2 transition-all duration-500 group"
            >
              <div
                className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-black mb-1">{item.title}</h3>
              <p
                className="text-xl font-black text-gray-900 mb-1"
                style={{ direction: "ltr" }}
              >
                {item.detail}
              </p>
              <p className="text-gray-400 text-xs font-bold">
                {item.subDetail}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-24 flex justify-center text-center">
          {/* Social & Info Section */}
          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                ابقَ على اتصال <br />
                <span className="text-[#5F6F52]">دائماً</span>
              </h2>
              <p className="text-gray-500 font-bold text-lg max-w-md">
                فريق خدمة العملاء متواجد لمساعدتك في اختيار المنتجات المناسبة لك
                ومتابعة طلباتك.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center gap-5">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase">
                    العنوان
                  </p>
                  <p className="font-bold">
                    الشرقية، فاقوس، شارع كفر العدوي، أمام 9A كافيه
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase">
                    ساعات العمل
                  </p>
                  <p className="font-bold">يومياً من 10 صباحاً حتى 10 مساءً</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-5">
              <Link
                href="#"
                className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              {/* <Link
                href="#"
                className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center hover:bg-sky-500 transition-colors"
              >
                <Twitter size={20} />
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
