"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Loader2 } from "lucide-react"; // استيراد الأيقونات
import { useCart } from "@/context/CartContext"; // استيراد السلة
import toast from "react-hot-toast"; // استيراد التنبيهات

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // حالة لتتبع أي منتج يتم إضافته الآن
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
            product_images(image_url)
          `
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

  // دالة الإضافة للسلة مع تأثير التحميل والتنبيه
  const handleAddToCart = async (e, product, finalPrice, mainImage) => {
    e.preventDefault(); // منع الانتقال لصفحة المنتج
    e.stopPropagation();

    setAddingId(product.id);

    // تأخير بسيط لمحاكاة المعالجة
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
      <div className="text-center py-20 font-bold animate-pulse">
        جاري تحميل أحدث المنتجات...
      </div>
    );

  return (
    <section className="py-16 px-4 md:px-12 max-w-[1600px] mx-auto" dir="rtl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-black mb-2">
          أحدث المنتجات
        </h2>
        <div className="w-20 h-1.5 bg-black mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {products.map((product) => {
          const mainImage =
            product.product_images?.[0]?.image_url || "/placeholder.jpg";
          const hasDiscount = product.discount_value > 0;
          const isAdding = addingId === product.id;

          const finalPrice =
            hasDiscount && product.discount_type === "percentage"
              ? product.base_price -
                product.base_price * (product.discount_value / 100)
              : product.base_price - (product.discount_value || 0);

          return (
            <div key={product.id} className="group relative flex flex-col">
              <Link
                href={`/product/${product.id}`}
                className="cursor-pointer block flex-1"
              >
                <div className="relative aspect-[4/5] bg-[#F3F3F3] rounded-[2rem] overflow-hidden mb-4 flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  />
                  {hasDiscount && (
                    <span className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                      {product.discount_type === "percentage"
                        ? `خصم ${product.discount_value}%`
                        : `خصم ${product.discount_value} جنيه`}
                    </span>
                  )}
                </div>

                <div className="text-right px-2 mb-20">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1 transition-colors group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-black text-black">
                      {Number(finalPrice).toLocaleString()} ج.م
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through font-bold">
                        {product.base_price} ج.م
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* زر الإضافة للسلة متموضع في الأسفل */}
              <div className="absolute bottom-4 left-0 w-full px-2">
                <button
                  disabled={isAdding}
                  onClick={(e) =>
                    handleAddToCart(e, product, finalPrice, mainImage)
                  }
                  className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdding
                      ? "bg-gray-300 cursor-not-allowed"
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

      <div className="flex justify-center">
        <Link
          href="/all-products"
          className="bg-gray-100 text-black px-12 py-4 rounded-full font-black text-sm hover:bg-black hover:text-white transition-all shadow-sm"
        >
          استكشف المتجر بالكامل
        </Link>
      </div>
    </section>
  );
}
