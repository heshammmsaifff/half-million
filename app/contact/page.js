"use client";

import React from "react";
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
} from "lucide-react";
import Link from "next/link";

export default function ContactUs() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "اتصل بنا",
      detail: "0123456789",
      subDetail: "متاح من 9 صباحاً لـ 10 مساءً",
      link: "tel:0123456789",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "واتساب",
      detail: "0109876543",
      subDetail: "رد سريع خلال ساعة",
      link: "https://wa.me/20109876543",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      detail: "support@brandname.com",
      subDetail: "للاستفسارات الرسمية",
      link: "mailto:support@brandname.com",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const socialLinks = [
    {
      name: "انستجرام",
      icon: <Instagram />,
      link: "#",
      color: "hover:text-pink-600",
    },
    {
      name: "فيسبوك",
      icon: <Facebook />,
      link: "#",
      color: "hover:text-blue-700",
    },
    {
      name: "تويتر",
      icon: <Twitter />,
      link: "#",
      color: "hover:text-sky-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header Section */}
      <div className="relative h-[40vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070')] bg-cover bg-center" />
        <div className="relative z-10 text-center space-y-4 px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">
            تواصل معنا
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            نحن هنا للإجابة على استفساراتك ومساعدتك في الحصول على أفضل تجربة
            تسوق
          </p>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((item, index) => (
            <a
              href={item.link}
              key={index}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-gray-50 hover:scale-105 transition-all duration-300 group"
            >
              <div
                className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-black mb-2">{item.title}</h3>
              <p className="text-2xl font-black mb-1 dir-ltr inline-block">
                {item.detail}
              </p>
              <p className="text-gray-400 text-sm font-bold">
                {item.subDetail}
              </p>
            </a>
          ))}
        </div>

        {/* Social Media & Extra Info */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-right">
            <div>
              <h2 className="text-4xl font-black mb-6 italic underline underline-offset-8 decoration-gray-200">
                تابعنا على منصاتنا
              </h2>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                كن أول من يعرف بأحدث العروض والمنتجات الحصرية من خلال متابعتنا
                على مواقع التواصل الاجتماعي.
              </p>
            </div>

            <div className="flex gap-6">
              {socialLinks.map((soc, i) => (
                <Link
                  href={soc.link}
                  key={i}
                  className={`w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 ${soc.color} transition-all border border-gray-100 shadow-sm`}
                >
                  {soc.icon}
                </Link>
              ))}
            </div>

            <div className="pt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase text-gray-400">
                    مقرنا الرئيسي
                  </h4>
                  <p className="font-bold text-lg">
                    القاهرة، مصر - التجمع الخامس
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase text-gray-400">
                    ساعات العمل
                  </h4>
                  <p className="font-bold text-lg">الأحد - الخميس (10ص - 6م)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Visual Box */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gray-100 rounded-[4rem] rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative bg-black h-[400px] rounded-[3.5rem] p-12 overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-white text-3xl font-black italic">
                  نحن دائماً بالقرب!
                </h3>
                <p className="text-gray-400 font-bold">
                  لا تتردد في طرح أي سؤال، فريقنا جاهز لخدمتك في أي وقت.
                </p>
              </div>
              <Link
                href="/"
                className="bg-white text-black w-fit px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:gap-5 transition-all"
              >
                <ArrowLeft size={20} /> العودة للمتجر
              </Link>
              {/* Decorative Element */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
