"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        base_price,
        discount_type,
        discount_value,
        brands (name),
        product_images (image_url, is_main)
      `
      )
      .order("created_at", { ascending: false }); // عرض الأحدث أولاً

    if (!error) setProducts(data);
    setLoading(false);
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold">
        جاري تحميل جميع المنتجات...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 text-right" dir="rtl">
      {/* هيدر الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-blue-600" /> كل المنتجات
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            استكشف المجموعة الكاملة من منتجاتنا
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black">
          إجمالي المنتجات: {products.length}
        </div>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const mainImg =
            product.product_images?.find((img) => img.is_main)?.image_url ||
            (product.product_images?.length > 0
              ? product.product_images[0].image_url
              : null);

          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                {mainImg ? (
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    لا توجد صورة
                  </div>
                )}

                {product.discount_value > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] md:text-xs px-3 py-1.5 rounded-xl shadow-lg z-10">
                    {product.discount_type === "percentage"
                      ? `خصم ${product.discount_value}%`
                      : `خصم ${product.discount_value} ج.م`}
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-widest">
                  {product.brands?.name}
                </p>
                <h3 className="font-bold text-gray-800 mb-3 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900">
                    {product.base_price}{" "}
                    <small className="text-xs font-normal">ج.م</small>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
