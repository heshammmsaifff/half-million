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
    <section className="py-24 bg-white overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* الجانب الأيمن: النص */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-black tracking-widest uppercase">
                عن Half Million
              </span>
              <Heart size={16} className="text-red-500 fill-red-500" />
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1]">
              نهتم بجمالك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-gray-900 to-gray-500">
                من الداخل والخارج
              </span>
            </h2>

            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              في <span className="text-black font-bold">Half Million</span>،
              نؤمن أن الجمال الحقيقي يبدأ بصحة جيدة. لذا جمعنا لكِ خلاصة العلم
              في الفيتامينات، وأرقى صيحات المكياج ومستحضرات التجميل في مكان
              واحد.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-black/5 transition-all"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="font-black text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيسر: العرض البصري باستخدام img */}
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* العمود الأول */}
              <div className="space-y-4 pt-12">
                <div
                  className={`${images[0].height} rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-700`}
                >
                  <img
                    src={images[0].src}
                    alt={images[0].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`${images[1].height} rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-700`}
                >
                  <img
                    src={images[1].src}
                    alt={images[1].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-4">
                <div
                  className={`${images[2].height} rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-700`}
                >
                  <img
                    src={images[2].src}
                    alt={images[2].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`${images[3].height} rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-700`}
                >
                  <img
                    src={images[3].src}
                    alt={images[3].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* خلفية جمالية ضبابية */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gray-100 rounded-full -z-0 opacity-50 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
