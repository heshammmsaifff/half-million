"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, ShoppingBag, Loader2 } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const cat = searchParams.get("cat");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullResults = async () => {
      setLoading(true);
      // جلب البيانات مع العلاقات (البراند، الصور، الفئة) تماماً مثل صفحة المتجر
      let supabaseQuery = supabase
        .from("products")
        .select(
          `
          *,
          brands (name),
          product_images (image_url, is_main),
          sub_categories (id, name, category_id)
        `
        )
        .ilike("name", `%${query}%`);

      if (cat && cat !== "all") {
        supabaseQuery = supabaseQuery.eq("subcategory_id", cat);
      }

      const { data, error } = await supabaseQuery.order("created_at", {
        ascending: false,
      });

      if (!error) setProducts(data || []);
      setLoading(false);
    };

    if (query) fetchFullResults();
  }, [query, cat]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-bold text-gray-500">جاري البحث في المتجر...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-right" dir="rtl">
      {/* هيدر صفحة البحث */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <Search className="text-blue-600" size={28} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">نتائج البحث</h1>
        </div>
        <p className="text-gray-500 font-medium mr-16">
          وجدنا {products.length} نتيجة لـ{" "}
          <span className="text-blue-600 font-black">"{query}"</span>
        </p>
      </div>

      {/* شبكة المنتجات المستوحاة من صفحة المتجر */}
      <main>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              // تحديد الصورة الرئيسية
              const mainImg =
                product.product_images?.find((img) => img.is_main)?.image_url ||
                product.product_images?.[0]?.image_url;

              // حساب السعر النهائي بعد الخصم
              const discount = Number(product.discount_value || 0);
              const finalPrice =
                product.discount_type === "percentage"
                  ? product.base_price - product.base_price * (discount / 100)
                  : product.base_price - discount;

              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  {/* قسم الصورة */}
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    {mainImg && (
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}

                    {/* شارة الخصم */}
                    {discount > 0 && (
                      <div className="absolute top-5 right-5 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                        {product.discount_type === "percentage"
                          ? `خصم ${discount}%`
                          : `خصم ${discount} ج.م`}
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-8 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mb-5">
                        من منتجات{" "}
                        <span className="text-blue-500 text-xl">
                          {product.brands?.name || "Half Million"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-2xl font-black text-gray-900">
                        {finalPrice.toLocaleString()}{" "}
                        <small className="text-xs font-normal">ج.م</small>
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-300 line-through font-bold">
                          {product.base_price.toLocaleString()} ج.م
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* حالة عدم وجود نتائج */
          <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-black text-xl mb-4">
              للأسف، لم نجد أي منتج يطابق بحثك
            </p>
            <Link
              href="/all-products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <ShoppingBag size={20} />
              تصفح المتجر بالكامل
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
