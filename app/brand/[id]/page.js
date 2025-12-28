"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { PackageOpen, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function BrandProductsPage({ params: paramsPromise }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBrandData = async () => {
      const params = await paramsPromise;
      const { id } = params;

      try {
        const { data, error } = await supabase
          .from("brands")
          .select(
            `
            name,
            description,
            image_url,
            products (
              id,
              name,
              base_price,
              discount_type,
              discount_value,
              is_available,
              product_images (image_url, is_main)
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setBrand(data);
      } catch (err) {
        console.error("Error fetching brand:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [paramsPromise]);

  const handleAddToCart = async (e, product, finalPrice, mainImg) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: mainImg,
    });

    toast.success(`${product.name} أضيف للسلة`, {
      style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
        fontWeight: "bold",
        direction: "rtl",
      },
    });

    setAddingId(null);
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold animate-pulse">
        جاري تحميل المنتجات...
      </div>
    );
  if (!brand) return <div className="p-20 text-center">البراند غير موجود</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 text-right" dir="rtl">
      {/* هيدر البراند - تصميم Monochrome */}
      <div className="mb-12 flex flex-col md:flex-row items-center gap-8 p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="w-32 h-32 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center p-4">
          <img
            src={brand.image_url}
            alt={brand.name}
            className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            {brand.name}
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
            {brand.description || "أفضل منتجات هذه الماركة المختارة بعناية."}
          </p>
        </div>
      </div>

      {/* عرض المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {brand.products?.map((product) => {
          const mainImg =
            product.product_images?.find((img) => img.is_main)?.image_url ||
            product.product_images?.[0]?.image_url ||
            "/placeholder.jpg";

          const discount = Number(product.discount_value || 0);
          const finalPrice =
            product.discount_type === "percentage"
              ? product.base_price * (1 - discount / 100)
              : product.base_price - discount;

          const isAdding = addingId === product.id;

          return (
            <div key={product.id} className="relative group flex flex-col">
              <Link
                href={`/product/${product.id}`}
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full pb-24"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full font-black text-[10px]">
                      خصم {discount}
                      {product.discount_type === "percentage" ? "%" : " ج.م"}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-black">
                      {finalPrice.toLocaleString()} ج.م
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-400 line-through font-bold">
                        {product.base_price.toLocaleString()} ج.م
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* زر أضف للسلة */}
              <div className="absolute bottom-6 left-0 w-full px-6">
                <button
                  disabled={isAdding}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImg)
                  }
                  className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdding
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-600 active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      أضف للسلة
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {brand.products?.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
          <PackageOpen size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-bold">
            لا توجد منتجات متوفرة لهذا البراند حالياً
          </p>
        </div>
      )}
    </div>
  );
}
