"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const ageRanges = ["10-17", "18-25", "26-34", "35+"];

export default function Hero() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  function handleClick(range: string) {
    setSelected((current) => (current === range ? null : range));
  }

  function handleContinue() {
    if (!selected) return;
    router.push(`/step-3?age=${encodeURIComponent(selected)}`);
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-12 px-6 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        בן/בת כמה את/ה?
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
        {ageRanges.map((range) => {
          const isSelected = selected === range;
          return (
            <button
              key={range}
              type="button"
              onClick={() => handleClick(range)}
              className={`relative min-w-28 rounded-2xl border px-7 py-4 text-lg transition-all duration-200 ease-out active:scale-95 ${
                isSelected
                  ? "scale-105 border-white bg-white text-[#ab1521] shadow-xl shadow-black/20"
                  : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:scale-105 hover:bg-white/20"
              }`}
            >
              {range}
              <span
                className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ab1521] text-white shadow-md transition-all duration-200 ${
                  isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className={`flex items-center gap-2 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300 ease-out ${
          selected
            ? "translate-y-0 bg-white text-[#ab1521] opacity-100 hover:scale-105 active:scale-95"
            : "pointer-events-none translate-y-2 bg-white/20 text-white/50 opacity-0"
        }`}
      >
        המשך
        <ArrowLeft className="h-5 w-5" />
      </button>
    </section>
  );
}
