import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Info,
  ShoppingBag,
  Youtube,
  ArrowLeftRight,
  XCircle,
} from "lucide-react";
import ProductImageGallery from "@/components/ProductImageGallery";

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const { productId } = resolvedParams;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands!left (name), 
      product_images (id, image_url, is_main),
      sub_categories!left (name),
      comparison_product:comparison_product_id (id, name, base_price)
    `
    )
    .eq("id", Number(productId))
    .single();

  if (error || !product) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-white"
        dir="rtl"
      >
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          المنتج غير موجود
        </h2>
        <a
          href="/"
          className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold"
        >
          العودة للمتجر
        </a>
      </div>
    );
  }

  // --- حل الخطأ الأول: منطق حساب الخصم ---
  const basePrice = Number(product.base_price);
  const discountValue = Number(product.discount_value || 0);
  let finalPrice = basePrice;

  if (discountValue > 0) {
    if (product.discount_type === "percentage") {
      // إذا كان الخصم نسبة مئوية: 1000 - (1000 * 0.05) = 950
      finalPrice = basePrice - basePrice * (discountValue / 100);
    } else {
      // إذا كان الخصم مبلع ثابت: 1000 - 50 = 950
      finalPrice = basePrice - discountValue;
    }
  }

  // --- ترتيب الصور وفيديو يوتيوب ---
  const images = [...(product.product_images || [])].sort(
    (a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)
  );
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = getYouTubeId(product.youtube_link);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductImageGallery images={images} productName={product.name} />

        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                {product.brands?.name || "ماركة أصلية"}
              </span>

              {/* --- حل الخطأ الثاني: حالة التوفر --- */}
              {product.is_available ? (
                <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg">
                  <CheckCircle2 size={14} /> متوفر في المخزون
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg">
                  <XCircle size={14} /> غير متوفر حالياً
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 text-xl font-medium leading-relaxed italic">
              {product.description}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-blue-600">
                {finalPrice.toLocaleString()}{" "}
                <small className="text-lg font-bold">ج.م</small>
              </span>
              {discountValue > 0 && (
                <span className="text-gray-300 line-through text-2xl font-bold italic">
                  {basePrice.toLocaleString()} ج.م
                </span>
              )}
            </div>

            <button
              disabled={!product.is_available}
              className={`w-full px-8 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl
                ${
                  product.is_available
                    ? "bg-gray-900 text-white hover:bg-blue-600 shadow-blue-100"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }
              `}
            >
              <ShoppingBag size={24} />
              {product.is_available ? "أضف إلى السلة" : "نفدت الكمية"}
            </button>
          </div>

          {product.detailed_description && (
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 text-gray-700 leading-loose">
              <h4 className="font-black mb-2 flex items-center gap-2 text-blue-700">
                <Info size={20} /> عن المنتج:
              </h4>
              {product.detailed_description}
            </div>
          )}
        </div>
      </div>

      {/* أقسام التفاصيل الإضافية (JSONB) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {product.ingredients?.length > 0 && (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <FlaskConical className="text-blue-500" /> المكونات
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-4 py-2 rounded-xl font-bold text-gray-600 text-sm"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.benefits?.length > 0 && (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" /> الفوائد والمميزات
            </h3>
            <ul className="space-y-4 font-medium text-gray-700">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-1 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* تعليمات الاستخدام والتحذيرات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {product.usage_instructions?.length > 0 && (
          <div className="space-y-6 p-6 text-right">
            <h3 className="text-2xl font-black flex items-center gap-3 text-gray-900">
              <Info className="text-blue-400" /> طريقة الاستعمال
            </h3>
            <div className="space-y-4">
              {product.usage_instructions.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <span className="text-2xl font-black text-blue-200 italic">
                    0{i + 1}
                  </span>
                  <p className="text-gray-600 font-bold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.warnings?.length > 0 && (
          <div className="space-y-6 p-6 text-right">
            <h3 className="text-2xl font-black flex items-center gap-3 text-red-600">
              <AlertTriangle /> تحذيرات هامة
            </h3>
            <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
              {product.warnings.map((warn, i) => (
                <p
                  key={i}
                  className="mb-3 last:mb-0 text-red-800 font-bold flex items-center gap-2"
                >
                  • {warn}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* مقارنة المنتج */}
      {product.comparison_product && (
        <div className="bg-amber-50 p-10 rounded-[3.5rem] border border-amber-100">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-amber-900">
            <ArrowLeftRight />
            مقارنة بمنتج شبيه
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-right">
            <p className="text-amber-800 text-lg font-medium leading-relaxed">
              {product.comparison_text ||
                `بالمقارنة مع ${product.comparison_product.name}...`}
            </p>
            <div className="bg-white/50 p-6 rounded-3xl border border-white">
              <p className="text-xl font-black text-gray-400 mt-1">
                {product.comparison_product.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* قسم الفيديو */}
      {videoId && (
        <div className="pt-20 border-t border-gray-100 text-center">
          <h3 className="text-3xl font-black mb-10 flex items-center justify-center gap-3">
            <Youtube className="text-red-600" size={36} /> مراجعة المنتج
            بالفيديو
          </h3>
          <div className="max-w-4xl mx-auto aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube product video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
