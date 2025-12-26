import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { PackageOpen, ArrowRight } from "lucide-react";

export default async function SubCategoryPage({ params }) {
  const resolvedParams = await params;
  const { subId } = resolvedParams;

  if (!subId || subId === "undefined") {
    return <div className="p-20 text-center">خطأ في معرف القسم الفرعي</div>;
  }

  const { data: subCategory, error } = await supabase
    .from("sub_categories")
    .select(
      `
      name,
      description,
      main_categories (name),
      products (
        id,
        name,
        base_price,
        discount_type,
        discount_value,
        is_available,
        brands (name),
        product_images (image_url, is_main)
      )
    `
    )
    .eq("id", parseInt(subId))
    .single();

  if (error || !subCategory) {
    return (
      <div className="p-20 text-center" dir="rtl">
        <h2 className="text-red-600 font-bold text-2xl mb-4">
          خطأ في الاتصال بالانترنت
        </h2>
        <Link href="/" className="text-blue-600 underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const products = subCategory.products || [];

  return (
    <div className="max-w-7xl mx-auto p-6 text-right" dir="rtl">
      {/* الهيدر المحسن */}
      <div className="mb-12 p-10 bg-gradient-to-l from-blue-600 to-blue-400 rounded-[3rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          {/* Breadcrumbs المعدلة */}
          <div className="flex items-center gap-2 mb-4 text-blue-100 text-sm md:text-base">
            <Link
              href="/"
              className="hover:text-white transition-colors font-medium"
            >
              الرئيسية
            </Link>

            <ArrowRight size={14} className="rotate-180 opacity-50" />

            {/* الفئة الرئيسية (بدون لينك كما طلبت) */}
            <span className="opacity-80 font-medium">
              {subCategory.main_categories?.name || "قسم عام"}
            </span>

            <ArrowRight size={14} className="rotate-180 opacity-50" />

            {/* الفئة الفرعية الحالية */}
            <span className="font-bold text-white decoration-2 underline-offset-4">
              {subCategory.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {subCategory.name}
          </h1>
          <p className="text-blue-50 text-lg md:text-xl max-w-2xl font-medium leading-relaxed opacity-90">
            {subCategory.description ||
              "استعرض مجموعة مختارة من أفضل المنتجات في هذا القسم."}
          </p>
        </div>

        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* عرض المنتجات (نفس الكود السابق) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const basePrice = Number(product.base_price);
          const discount = Number(product.discount_value || 0);
          const finalPrice =
            product.discount_type === "percentage"
              ? basePrice - basePrice * (discount / 100)
              : basePrice - discount;

          const mainImg =
            product.product_images?.find((img) => img.is_main)?.image_url ||
            product.product_images?.[0]?.image_url;

          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                {mainImg && (
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                {!product.is_available && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase">
                      نفدت الكمية
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-tighter">
                  {product.brands?.name || "ماركة أصلية"}
                </p>
                <h3 className="font-bold text-gray-800 mb-4 line-clamp-1 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {finalPrice.toLocaleString()}{" "}
                    <small className="text-[10px]">ج.م</small>
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-gray-400 line-through font-bold">
                      {basePrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <PackageOpen size={80} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-bold text-gray-400">
            هذا القسم فارغ حالياً
          </h3>
        </div>
      )}
    </div>
  );
}
