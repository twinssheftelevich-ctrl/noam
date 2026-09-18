"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

const genders = ["גבר", "אישה"];

export default function GenderQuestion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(() => searchParams.get("gender"));

  useEffect(() => {
    router.prefetch("/step-2");
  }, [router]);

  function handleClick(gender: string) {
    setSelected(gender);
    window.history.replaceState(null, "", `/?gender=${encodeURIComponent(gender)}`);
    router.push(`/step-2?gender=${encodeURIComponent(gender)}`);
  }

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-12 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-4xl text-white/90 sm:text-5xl">שלום! מה שלומך?</p>
        <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
          מה המין שלך?
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {genders.map((gender) => {
          const isSelected = selected === gender;
          return (
            <button
              key={gender}
              type="button"
              onClick={() => handleClick(gender)}
              className={`relative min-w-32 rounded-2xl border px-8 py-4 text-lg transition-all duration-300 ease-out active:scale-95 ${
                isSelected
                  ? "scale-105 border-white bg-white text-[#ab1521] shadow-[0_0_0_4px_rgba(255,255,255,0.25),0_0_35px_12px_rgba(255,255,255,0.4)]"
                  : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:scale-105 hover:bg-white/20"
              }`}
            >
              {gender}
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
