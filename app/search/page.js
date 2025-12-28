"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, ShoppingBag, Loader2, Tag, Filter } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const catFilter = searchParams.get("cat") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      let q = supabase
        .from("products")
        .select(`*, brands(name), product_images(image_url, is_main)`)
        .ilike("name", `%${query}%`);

      if (catFilter === "offers") {
        q = q.gt("discount_value", 0);
      } else if (catFilter !== "all") {
        q = q.eq("subcategory_id", catFilter);
      }

      const { data, error } = await q.order("created_at", { ascending: false });
      if (!error) setProducts(data || []);
      setLoading(false);
    };

    if (query || catFilter !== "all") fetchResults();
    else setLoading(false);
  }, [query, catFilter]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black text-gray-400">جاري فحص الرفوف...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white p-2 rounded-xl">
              <Search size={24} />
            </span>
            <h1 className="text-4xl font-black text-gray-900">نتائج البحث</h1>
          </div>
          <p className="text-gray-500 font-bold">
            عرض <span className="text-blue-600">{products.length}</span> منتج
            بحثاً عن
            <span className="text-black underline px-2">"{query}"</span>
            {catFilter !== "all" && (
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs mr-2">
                تصفية: {catFilter === "offers" ? "العروض" : "قسم خاص"}
              </span>
            )}
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const mainImg =
              product.product_images?.find((img) => img.is_main)?.image_url ||
              product.product_images?.[0]?.image_url;
            const discount = Number(product.discount_value || 0);
            const finalPrice =
              product.discount_type === "percentage"
                ? product.base_price * (1 - discount / 100)
                : product.base_price - discount;

            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl">
                      وفر{" "}
                      {product.discount_type === "percentage"
                        ? `${discount}%`
                        : `${discount} ج.م`}
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">
                    {product.brands?.name}
                  </span>
                  <h3 className="text-lg font-black text-gray-800 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl font-black text-gray-900">
                      {finalPrice.toLocaleString()}{" "}
                      <span className="text-xs">ج.م</span>
                    </div>
                    {discount > 0 && (
                      <div className="text-sm text-gray-300 line-through font-bold">
                        {product.base_price.toLocaleString()} ج.م
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
            <Search size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">عذراً</h2>
          <p className="text-gray-500 font-bold mb-8">
            لم نجد أي منتج يطابق هذا البحث، جرب كلمات أخرى
          </p>
          <Link
            href="/all-products"
            className="bg-black text-white px-10 py-4 rounded-2xl font-black hover:bg-gray-600 transition-all"
          >
            تصفح كل المنتجات
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
