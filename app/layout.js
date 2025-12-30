import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { Alexandria } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Half Million | الجمال والصحة",
  description: "أفضل منتجات الفيتامينات والتجميل العالمية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${alexandria.className} bg-white antialiased`}>
        {/* التغليف بـ CartProvider يضمن وصول البيانات لكل الصفحات */}
        <CartProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#000",
                color: "#fff",
                borderRadius: "16px",
                fontWeight: "bold",
              },
            }}
          />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
