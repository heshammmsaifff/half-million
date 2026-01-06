"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Loader2,
  Tag,
  Filter,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 bg-[#F8F9F4]">
        <div className="relative">
          <Loader2 className="animate-spin text-[#5F6F52]" size={60} />
          <Search
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2D3436]"
            size={20}
          />
        </div>
        <p className="font-black text-[#5F6F52] animate-pulse tracking-widest text-lg">
          جاري البحث في خزائن الجمال...
        </p>
      </div>
    );

  return (
    <div className="bg-[#F8F9F4] min-h-screen pb-20" dir="rtl">
      {/* Header Section */}
      <div className="bg-[#2D3436] pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5F6F52]/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-right">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#5F6F52] p-3 rounded-2xl shadow-lg shadow-black/20">
              <Search size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                نتائج البحث
              </h1>
              <p className="text-[#C3CBB9] mt-2 font-bold flex items-center gap-2">
                اكتشفنا{" "}
                <span className="text-white underline">{products.length}</span>{" "}
                منتج{products.length !== 1 ? "ات" : ""} طبقاً بحثك
              </p>
            </div>
          </div>

          {query && (
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <span className="text-[#C3CBB9] text-sm font-bold tracking-wide">
                كلمة البحث:
              </span>
              <span className="text-[#E29595] font-black text-lg italic">
                "{query}"
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12 -mt-16 relative z-20">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => {
              const mainImg =
                product.product_images?.find((img) => img.is_main)?.image_url ||
                product.product_images?.[0]?.image_url ||
                "/placeholder.jpg";

              const discount = Number(product.discount_value || 0);
              const finalPrice =
                product.discount_type === "percentage"
                  ? product.base_price * (1 - discount / 100)
                  : product.base_price - discount;

              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group bg-white rounded-[2.5rem] border border-[#C3CBB9]/20 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#5F6F52]/10 transition-all duration-500 flex flex-col h-full"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-[#F8F9F4]">
                    <img
                      src={mainImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />

                    {/* وسم الخصم المطور */}
                    {discount > 0 && (
                      <div className="absolute top-5 right-5 bg-[#E29595] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg z-10 flex items-center gap-1">
                        <Tag size={12} />
                        وفر{" "}
                        {product.discount_type === "percentage"
                          ? `${discount}%`
                          : `${discount} ج.م`}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-8 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-[#5F6F52] uppercase tracking-[0.2em] mb-3 block opacity-70">
                        {product.brands?.name || "براند حصري"}
                      </span>
                      <h3 className="text-xl font-black text-[#2D3436] mb-4 group-hover:text-[#5F6F52] transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-center gap-1 mt-auto">
                      <div className="text-3xl font-black text-[#2D3436]">
                        {finalPrice.toLocaleString()}{" "}
                        <span className="text-xs font-bold">ج.م</span>
                      </div>
                      {discount > 0 && (
                        <div className="text-sm text-[#C3CBB9] line-through font-bold">
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
          <div className="text-center py-24 bg-white rounded-[4rem] border border-[#C3CBB9]/20 shadow-sm overflow-hidden relative">
            {/* زخرفة خلفية للحالة الفارغة */}
            <Sparkles
              className="absolute top-10 left-10 text-[#F8F9F4]"
              size={100}
            />

            <div className="relative z-10">
              <div className="w-24 h-24 bg-[#F8F9F4] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner text-[#C3CBB9]">
                <Search size={48} />
              </div>
              <h2 className="text-3xl font-black text-[#2D3436] mb-4">
                لم نجد ما تبحثين عنه..
              </h2>
              <p className="text-[#5F6F52] font-bold mb-10 max-w-sm mx-auto leading-relaxed">
                ربما لم تكتبي الاسم بشكل دقيق، أو أن المنتج نفد من مخازننا
                حالياً. جربي البحث بكلمة أخرى.
              </p>
              <Link
                href="/all-products"
                className="inline-flex items-center gap-3 bg-[#2D3436] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#5F6F52] transition-all shadow-xl shadow-[#2D3436]/20"
              >
                تصفح تشكيلتنا الكاملة <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9F4]">
          <Loader2 className="animate-spin text-[#5F6F52]" size={40} />
          <p className="mt-4 font-bold text-[#5F6F52]">تحضير صفحة البحث...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
