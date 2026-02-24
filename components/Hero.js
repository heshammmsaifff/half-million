"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronRight, ChevronLeft, ArrowLeftCircle } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data?.length) {
      setSlides(data);

      // نحسب أبعاد أول صورة عشان نخلي الهيرو adaptive
      const img = new window.Image();
      img.src = data[0].image_url;
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-200 animate-pulse rounded-3xl" />
    );
  }

  if (!slides.length) return null;

  return (
    <section className="w-full mx-auto" dir="rtl">
      <div
        className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
        style={{ aspectRatio }}
      >
        <Swiper
          spaceBetween={30}
          effect="fade"
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
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Blur Background */}
              <div className="absolute inset-0 scale-110 blur-2xl opacity-40">
                <Image
                  src={slide.image_url}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Main Image */}
              <Image
                src={slide.image_url}
                alt={slide.title || "hero image"}
                fill
                priority
                sizes="100vw"
                className="object-contain z-10"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 z-20" />

              {/* Content */}
              <div className="absolute inset-0 z-30 flex flex-col justify-center items-start px-8 md:px-20 text-white space-y-4">
                {/* {slide.title && (
                  <h2 className="text-2xl md:text-4xl font-bold">
                    {slide.title}
                  </h2>
                )} */}

                {slide.link_url && (
                  <a
                    href={slide.link_url}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all"
                  >
                    اكتشف الآن
                    <ArrowLeftCircle size={22} />
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}

          <button className="hero-prev absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all hidden md:block">
            <ChevronRight size={28} />
          </button>

          <button className="hero-next absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all hidden md:block">
            <ChevronLeft size={28} />
          </button>
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          width: 12px;
          height: 12px;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 28px;
          border-radius: 10px;
          background: #3b82f6 !important;
        }
      `}</style>
    </section>
  );
}
