"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronRight, ChevronLeft, ArrowLeftCircle } from "lucide-react";

// استيراد تنسيقات Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-3xl" />
    );
  if (slides.length === 0) return null;

  return (
    <section className="relative w-full mx-auto pt-0.5" dir="rtl">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper  overflow-hidden shadow-2xl h-[400px] md:h-[550px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* الصورة الخلفية مع طبقة تغميق متدرجة */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={slide.image_url}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* محتوى النص */}
            <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 md:px-20 text-white space-y-4 md:space-y-6">
              {/* {slide.title && (
                <h2 className="text-3xl md:text-6xl font-black leading-tight drop-shadow-lg max-w-2xl animate-fade-in-up">
                  {slide.title}
                </h2>
              )} */}

              {slide.link_url && (
                <a
                  href={slide.link_url}
                  className="group flex items-center gap-3 bg-white text-black px-8 py-3 md:py-4 rounded-full font-bold text-lg hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  اكتشف الآن
                  <ArrowLeftCircle className="w-6 h-6 transform group-hover:-translate-x-2 transition-transform" />
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}

        {/* أزرار التنقل المخصصة */}
        <button className="hero-prev absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all hidden md:block">
          <ChevronRight size={32} />
        </button>
        <button className="hero-next absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all hidden md:block">
          <ChevronLeft size={32} />
        </button>
      </Swiper>

      {/* تنسيقات CSS إضافية للأنيميشن والبوليتس */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          width: 12px;
          height: 12px;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 10px;
          background: #3b82f6 !important;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
