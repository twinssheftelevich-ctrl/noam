import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Velaris from "@/components/ui/velaris";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "הסרת שיער הכי טובה שיש",
  description: "נוצר עם Next.js",
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
      </body>
    </html>
  );
}
