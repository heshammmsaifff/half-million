"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Globe, MapPin, Phone, X, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const MobileFullCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("card_images")
          .select("image_url, category")
          .order("category", { ascending: false })
          .order("display_order", { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // السلايدر التلقائي
  useEffect(() => {
    if (images.length <= 1 || isModalOpen) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images, isModalOpen]);

  const vitaminImages = useMemo(
    () => images.filter((img) => img.category === "vitamin"),
    [images],
  );
  const cosmeticsImages = useMemo(
    () => images.filter((img) => img.category === "cosmetics"),
    [images],
  );

  // دالة التعامل مع السحب اليدوي
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    } else if (info.offset.x > swipeThreshold) {
      setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col overflow-hidden select-none"
      dir="rtl"
    >
      {/* منطقة الصور مع دعم السحب اليدوي */}
      <div className="relative flex-grow w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="flex items-center justify-center h-full bg-neutral-900"
            >
              <Loader2 className="animate-spin text-emerald-400" size={40} />
            </motion.div>
          ) : images.length > 0 ? (
            <motion.div
              key={currentIdx}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <img
                src={images[currentIdx].image_url}
                alt="Product"
                className="w-full h-full object-cover shadow-2xl"
              />
              {/* Overlay متدرج لتحسين الرؤية */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              لا توجد صور
            </div>
          )}
        </AnimatePresence>

        {/* المؤشرات المحسنة */}
        <div className="absolute bottom-20 w-full px-8 z-20 flex justify-between items-end gap-10">
          {/* كوزمتكس */}
          <div className="flex flex-col items-center flex-1 gap-2">
            <span
              className={`text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${images[currentIdx]?.category === "cosmetics" ? "text-pink-400 drop-shadow-md" : "text-white/20"}`}
            >
              Cosmetics
            </span>
            <div className="flex gap-1.5 w-full justify-center">
              {cosmeticsImages.map((img, i) => {
                const globalIdx = images.indexOf(img);
                return (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${globalIdx === currentIdx ? "w-8 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" : "w-2 bg-white/20"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* فيتامينات */}
          <div className="flex flex-col items-center flex-1 gap-2">
            <span
              className={`text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${images[currentIdx]?.category === "vitamin" ? "text-emerald-400 drop-shadow-md" : "text-white/20"}`}
            >
              Vitamins
            </span>
            <div className="flex gap-1.5 w-full justify-center">
              {vitaminImages.map((img, i) => {
                const globalIdx = images.indexOf(img);
                return (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${globalIdx === currentIdx ? "w-8 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "w-2 bg-white/20"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* شريط التحكم السفلي - تصميم Dark Premium */}
      <div className="h-32 bg-[#111111] flex justify-around items-center px-8 z-30 border-t border-white/5 rounded-t-[45px] -mt-10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <a
          href="https://halfmillion1.com"
          target="_blank"
          className="flex flex-col items-center gap-2 group"
        >
          <div className="bg-neutral-800 p-4 rounded-2xl group-active:scale-90 transition-all text-neutral-300 border border-white/5">
            <Globe size={22} />
          </div>
          <span className="text-[11px] font-bold text-neutral-400">الموقع</span>
        </a>

        <a
          href="https://www.google.com/maps/place/30%C2%B043'33.8%22N+31%C2%B047'18.2%22E/@30.7260492,31.7858226,600m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d30.7260492!4d31.7883975?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
          target="_blank"
          className="flex flex-col items-center gap-2 relative"
        >
          <div className="bg-emerald-500 p-5 rounded-full text-white shadow-[0_10px_25px_rgba(16,185,129,0.4)] -translate-y-10 border-[6px] border-[#111111] active:scale-95 transition-all">
            <MapPin size={28} />
          </div>
          <span className="text-[11px] font-black text-emerald-400 -translate-y-8 uppercase tracking-tighter">
            Location
          </span>
        </a>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="bg-neutral-800 p-4 rounded-2xl group-active:scale-90 transition-all text-neutral-300 border border-white/5">
            <Phone size={22} />
          </div>
          <span className="text-[11px] font-bold text-neutral-400">تواصل</span>
        </button>
      </div>

      {/* مودال التواصل Modern Glassmorphism */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#1a1a1a] w-full rounded-t-[40px] p-10 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-1.5 bg-neutral-700 rounded-full mx-auto mb-10" />
              <div className="space-y-4">
                <a
                  href="tel:+201000000000"
                  className="flex justify-between items-center p-6 bg-neutral-800/50 rounded-[24px] border border-white/5 hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 uppercase font-bold mb-1">
                      Call Us
                    </span>
                    <span className="text-xl font-mono text-white tracking-wider">
                      01000000000
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500">
                    <Phone size={24} />
                  </div>
                </a>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  className="flex justify-between items-center p-6 bg-neutral-800/50 rounded-[24px] border border-white/5 hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 uppercase font-bold mb-1">
                      WhatsApp
                    </span>
                    <span className="text-xl font-mono text-white tracking-wider">
                      Start Chat
                    </span>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full text-green-500">
                    <FaWhatsapp size={26} />
                  </div>
                </a>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-8 py-5 text-neutral-400 font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFullCard;
