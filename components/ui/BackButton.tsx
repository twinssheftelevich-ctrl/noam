"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="absolute start-6 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
    >
      <ArrowRight className="h-4 w-4" />
      חזרה
    </button>
  );
}
