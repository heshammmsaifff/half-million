import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// --- التعديل الجوهري هنا ---
// هذا السطر يخبر Next.js بإعادة جلب البيانات عند كل زيارة للصفحة
// لضمان ظهور البراندات الجديدة واختفاء المحذوفة فوراً
export const revalidate = 0;

export default async function AllBrandsPage() {
  // جلب البيانات مع إضافة ترتيب لضمان عدم حدوث تضارب في الكاش
  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase Error:", error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#2D3436] font-bold">
        عذراً، حدث خطأ أثناء تحميل الماركات.
      </div>
    );
  }

  // إذا كان الجدول فارغاً تماماً بعد الـ Truncate
  if (!brands || brands.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Sparkles size={40} className="text-[#C3CBB9] mb-4" />
        <h2 className="text-2xl font-black text-[#2D3436]">
          لا توجد ماركات حالياً
        </h2>
        <p className="text-[#5F6F52] mt-2">
          سيتم إضافة الماركات العالمية قريباً.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-16 text-right" dir="rtl">
      {/* Header Section */}
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4 bg-[#F8F9F4] px-4 py-1.5 rounded-full border border-[#C3CBB9]/30">
          <Sparkles size={14} className="text-[#5F6F52]" />
          <span className="text-[10px] font-black text-[#5F6F52] uppercase tracking-[0.2em]">
            Elite Selection
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#2D3436] mb-4">
          شركاء الأناقة والجمال
        </h1>
        <p className="text-[#5F6F52] font-bold text-lg opacity-70 max-w-2xl">
          ننتقي لك أفضل الماركات العالمية لتنعم بتجربة لا مثيل لها
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.id}`}
            prefetch={false}
            className="group relative flex flex-col items-center"
          >
            {/* الدائرة الخلفية التأثيرية */}
            <div className="absolute inset-0 bg-[#F8F9F4] rounded-[3rem] scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />

            <div className="relative w-full aspect-square bg-white border border-[#C3CBB9]/20 rounded-[2.5rem] flex items-center justify-center p-8 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(95,111,82,0.1)] group-hover:border-[#5F6F52]/30">
              {brand.image_url ? (
                <img
                  src={brand.image_url}
                  alt={brand.name}
                  className="w-full h-full object-contain group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-20 h-20 bg-[#F8F9F4] rounded-full flex items-center justify-center">
                  <span className="text-3xl font-black text-[#C3CBB9]">
                    {brand.name ? brand.name[0] : "?"}
                  </span>
                </div>
              )}

              {/* زر صغير يظهر عند التحويم */}
              <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-[#5F6F52] text-white p-2 rounded-full shadow-lg">
                  <ArrowRight size={16} className="rotate-180" />
                </div>
              </div>
            </div>

            <span className="mt-6 text-sm font-black text-[#2D3436] group-hover:text-[#5F6F52] transition-colors tracking-wide">
              {brand.name}
            </span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              عرض المنتجات
            </span>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-24 p-12 bg-[#2D3436] rounded-[3rem] text-center text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-4">هل تبحث عن ماركة معينة؟</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            جميع المنتجات المتوفرة لدينا أصلية 100% ومستوردة من الوكلاء
            الرسميين.
          </p>
          <Link
            href="/all-products"
            className="inline-flex items-center gap-3 bg-white text-[#2D3436] px-8 py-4 rounded-2xl font-black hover:bg-[#5F6F52] hover:text-white transition-all shadow-xl"
          >
            تصفح كل المنتجات
            <ArrowRight size={18} className="rotate-180" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      </div>
    </div>
  );
}
