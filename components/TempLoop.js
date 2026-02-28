"use client";

import React from "react";
import { motion } from "framer-motion";

const Loop1 = ({
  texts = ["استخدم بروموكود RAMADAN واحصل علي خصم 10%"],
  speed = 10,
}) => {
  const duplicatedTexts = [...texts, ...texts, ...texts];

  return (
    <div className="w-full bg-black py-6 relative overflow-hidden group">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          className="flex items-center"
          animate={{
            x: ["0%", "50%"], // يتحرك من البداية حتى نصف القائمة لضمان التكرار السلس
          }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedTexts.map((text, i) => (
            <div key={i} className="flex items-center" dir="rtl">
              <span className="text-white text-l md:text-3xl font-black mx-12 tracking-tight uppercase">
                {text}
              </span>
              {/* عنصر فاصل جمالي */}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Loop1;
