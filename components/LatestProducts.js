"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Loader2, ArrowLeft, Ban } from "lucide-react"; // استيراد أيقونة للمنع
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            id, 
            name, 
            base_price, 
            discount_value,
            discount_type,
            is_available,
            product_images(image_url)
          `,
          )
          .eq("product_images.is_main", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const handleAddToCart = async (e, product, finalPrice, mainImage) => {
    e.preventDefault();
    e.stopPropagation();

    // حماية إضافية: التأكد من أن المنتج متاح قبل الإضافة
    if (!product.is_available) {
      toast.error("عذراً، هذا المنتج غير متوفر حالياً");
      return;
    }

    setAddingId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: mainImage,
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-[#C3CBB9] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#5F6F52] font-black animate-pulse text-lg">
          جاري تحضير أحدث منتجاتنا...
        </p>
      </div>
    );

  return (
    <section
      className="py-20 px-4 md:px-12 max-w-[1600px] mx-auto bg-transparent"
      dir="rtl"
    >
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#2D3436] mb-4">
          أحدث المنتجات
        </h2>
        <div className="w-20 h-1.5 bg-[#C3CBB9] rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {products.map((product) => {
          const mainImage =
            product.product_images?.[0]?.image_url || "/placeholder.jpg";
          const hasDiscount = product.discount_value > 0;
          const isAdding = addingId === product.id;
          const isAvailable = product.is_available; // حالة التوفر

          const finalPrice =
            hasDiscount && product.discount_type === "percentage"
              ? product.base_price -
                product.base_price * (product.discount_value / 100)
              : product.base_price - (product.discount_value || 0);

          return (
            <div
              key={product.id}
              className={`group relative flex flex-col bg-white/40 p-2 rounded-[24px] transition-all duration-500 hover:shadow-xl hover:bg-white border border-transparent hover:border-white ${
                !isAvailable ? "opacity-75" : ""
              }`}
            >
              <Link
                href={`/product/${product.id}`}
                className="cursor-pointer block flex-1"
              >
                <div className="relative aspect-square bg-[#F9F7F5] rounded-[1.5rem] overflow-hidden mb-3 flex items-center justify-center border border-gray-50/50">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-700 ${
                      isAvailable ? "group-hover:scale-105" : "grayscale"
                    }`}
                  />

                  {/* ملصق الخصم: يظهر فقط لو المنتج متاح */}
                  {hasDiscount && isAvailable && (
                    <span className="absolute top-2 right-2 bg-[#E29595] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 backdrop-blur-md">
                      {product.discount_type === "percentage"
                        ? `-${product.discount_value}%`
                        : `خصم ${product.discount_value}`}
                    </span>
                  )}

                  {/* طبقة المنتج غير المتاح */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="bg-white/90 text-[#2D3436] px-4 py-2 rounded-full text-xs font-black shadow-lg">
                        غير متوفر حالياً
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right px-2 mb-12">
                  <h3 className="font-bold text-[#2D3436] text-sm line-clamp-1 group-hover:text-[#5F6F52] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-lg font-black ${!isAvailable ? "text-gray-400" : "text-[#2D3436]"}`}
                    >
                      {Number(finalPrice).toLocaleString()}{" "}
                      <span className="text-[9px] font-medium">ج.م</span>
                    </span>
                    {hasDiscount && isAvailable && (
                      <span className="text-[10px] text-gray-400 line-through font-medium">
                        {product.base_price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button */}
              <div className="absolute bottom-3 left-0 w-full px-3">
                <button
                  disabled={isAdding || !isAvailable}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImage)
                  }
                  className={`w-full py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    !isAvailable
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isAdding
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#C3CBB9] text-[#2D3436] hover:bg-[#5F6F52] hover:text-white active:scale-95"
                  }`}
                >
                  {isAdding ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : !isAvailable ? (
                    <>
                      <Ban size={14} />
                      نفذت الكمية
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

      <div className="flex justify-center">
        <Link
          href="/all-products"
          className="group flex items-center gap-3 border-2 border-[#C3CBB9] text-[#5F6F52] px-14 py-4 rounded-full font-black text-sm hover:bg-[#C3CBB9] hover:text-[#2D3436] transition-all duration-300 shadow-sm"
        >
          استكشف المتجر بالكامل
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
