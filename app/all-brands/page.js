import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function AllBrandsPage() {
  // جلب جميع البراندات من الجدول
  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error)
    return <div className="p-20 text-center">خطأ في تحميل البراندات</div>;

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">
      <div className="mb-10 text-right">
        <h1 className="text-4xl font-black text-gray-900 mb-2">شركاء النجاح</h1>
        <p className="text-gray-500 font-bold">تسوق حسب الماركة التي تفضلها</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands?.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.id}`} // التوجيه لصفحة البراند الخاصة
            className="group bg-white border border-gray-100 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:shadow-2xl hover:border-gray-600 transition-all duration-500"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full overflow-hidden flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
              {brand.image_url ? (
                <img
                  src={brand.image_url}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-2xl font-black text-gray-300">
                  {brand.name[0]}
                </span>
              )}
            </div>
            <span className="text-sm font-black text-gray-800 group-hover:text-gray-600">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
