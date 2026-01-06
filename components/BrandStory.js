import React from "react";
import { Sparkles, Leaf, Heart, ShieldCheck } from "lucide-react";

const BrandStory = () => {
  const features = [
    {
      icon: <Leaf className="text-emerald-500" size={24} />,
      title: "صحة مستدامة",
      desc: "فيتامينات ومكملات غذائية مختارة بعناية لدعم نشاطك اليومي.",
    },
    {
      icon: <Sparkles className="text-amber-500" size={24} />,
      title: "جمال طبيعي",
      desc: "أرقى مستحضرات التجميل والمكياج التي تبرز تألقك الفريد.",
    },
    {
      icon: <ShieldCheck className="text-blue-500" size={24} />,
      title: "جودة مضمونة",
      desc: "نضمن لك منتجات أصلية 100% من أشهر العلامات العالمية.",
    },
  ];

  // مصفوفة الصور لتسهيل الإدارة
  const images = [
    { src: "/story/story-1.jpg", alt: "صحة وجمال 1", height: "h-64" },
    { src: "/story/story-2.jpg", alt: "صحة وجمال 2", height: "h-80" },
    { src: "/story/story-3.jpg", alt: "صحة وجمال 3", height: "h-80" },
    { src: "/story/story-4.jpg", alt: "صحة وجمال 4", height: "h-64" },
  ];

  return (
    <section className="py-24 overflow-hidden bg-transparent" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Right Content: Text & Features */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#C3CBB9]/20 rounded-full border border-[#C3CBB9]/30">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#5F6F52]">
                عن Half Million
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-[#2D3436] leading-[1.1]">
              نهتم بجمالك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#5F6F52] to-[#A9B388]">
                من الداخل والخارج
              </span>
            </h2>

            <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
              في{" "}
              <span className="text-[#2D3436] font-extrabold border-b-2 border-[#C3CBB9]">
                Half Million
              </span>
              ، نؤمن أن الجمال الحقيقي يبدأ بصحة جيدة. لذا جمعنا لكِ خلاصة العلم
              في الفيتامينات، وأرقى صيحات المكياج في مكان واحد.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white hover:border-[#C3CBB9] hover:shadow-xl transition-all duration-500 group"
                >
                  <div className="mb-4 p-3 bg-white w-fit rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    {/* Clone element to inject color if it's an icon */}
                    {React.cloneElement(feature.icon, {
                      className: "text-[#5F6F52]",
                    })}
                  </div>
                  <h4 className="font-black text-[#2D3436] mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Left Content: Visual Masonry Grid */}
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {[0, 1].map((colIndex) => (
                <div
                  key={colIndex}
                  className={`space-y-4 ${colIndex === 0 ? "pt-12" : ""}`}
                >
                  {images
                    .slice(colIndex * 2, colIndex * 2 + 2)
                    .map((img, i) => (
                      <div
                        key={i}
                        className={`${img.height} rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(195,203,185,0.4)] transition-all duration-700 hover:-translate-y-2`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {/* Artistic Background Blurs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 opacity-40 blur-3xl pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E6D3] rounded-full" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C3CBB9] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
