"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const ageRanges = ["10-17", "18-25", "26-34", "35+"];

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gender = searchParams.get("gender");
  const isFemale = gender === "אישה";
  const [selected, setSelected] = useState<string | null>(() => searchParams.get("age"));

  useEffect(() => {
    router.prefetch("/step-3");
  }, [router]);

  function handleClick(range: string) {
    setSelected(range);
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    params.set("age", range);
    window.history.replaceState(null, "", `/step-2?${params.toString()}`);
    router.push(`/step-3?${params.toString()}`);
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-12 px-6 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        {isFemale ? "בת כמה את?" : "בן כמה אתה?"}
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
        {ageRanges.map((range) => {
          const isSelected = selected === range;
          return (
            <button
              key={range}
              type="button"
              onClick={() => handleClick(range)}
              className={`relative min-w-28 rounded-2xl border px-7 py-4 text-lg transition-all duration-300 ease-out active:scale-95 ${
                isSelected
                  ? "scale-105 border-white bg-white text-[#ab1521] shadow-[0_0_0_4px_rgba(255,255,255,0.25),0_0_35px_12px_rgba(255,255,255,0.4)]"
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
    </section>
  );
}
