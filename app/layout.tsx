import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/ui/Footer";
import Velaris from "@/components/ui/velaris";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "הסרת שיער הכי טובה שיש",
  description: "שאלון קצר לקבלת הצעת מחיר להסרת שיער",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans font-black">
        <Velaris className="fixed inset-0 -z-10" height="100vh" grain={0.25} speed={1.4} />
        {children}
        <Footer />
        {/* UserWay accessibility widget, loaded once for all pages. data-position 3 = bottom right. */}
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="ABoYPO2OLo"
          data-position="3"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
