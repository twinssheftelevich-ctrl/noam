"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const hairColors = [
  { name: "חום כהה", color: "#3B2A1E" },
  { name: "חום בהיר", color: "#8B5E3C" },
  { name: "בלונדיני", color: "#D9B382" },
  { name: "בלונד אפרפר", color: "#B8A88E" },
  { name: "אדמוני", color: "#7B3F2A" },
  { name: "אפור / לבן", color: "#C4C4C4" },
];

export default function HairColorQuestion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(() => searchParams.get("hairColor"));
  const [customText, setCustomText] = useState(() => searchParams.get("hairColorCustom") ?? "");
  const canContinue = customText.trim() !== "";

  useEffect(() => {
    router.prefetch("/step-5");
  }, [router]);

  function handleClick(name: string) {
    setSelected(name);
    const params = new URLSearchParams(searchParams.toString());
    params.set("hairColor", name);
    params.delete("hairColorCustom");
    window.history.replaceState(null, "", `/step-4?${params.toString()}`);
    router.push(`/step-5?${params.toString()}`);
  }

  function handleContinue() {
    if (!canContinue) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("hairColorCustom", customText.trim());
    params.delete("hairColor");
    window.history.replaceState(null, "", `/step-4?${params.toString()}`);
    router.push(`/step-5?${params.toString()}`);
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10 px-6 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        מה צבע השיער שלך?
      </h1>

      <div className="grid grid-cols-3 gap-6 sm:flex sm:flex-wrap sm:justify-center">
        {hairColors.map(({ name, color }) => {
          const isSelected = selected === name;
          return (
            <div key={name} className="flex flex-col items-center gap-2">
              <button
                type="button"
                aria-label={name}
                onClick={() => handleClick(name)}
                className={`relative h-20 w-20 rounded-full border-2 transition-all duration-300 ease-out active:scale-95 sm:h-24 sm:w-24 ${
                  isSelected
                    ? "scale-110 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.25),0_0_35px_12px_rgba(255,255,255,0.4)]"
                    : "border-white/40 hover:scale-105"
                }`}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ab1521] text-white shadow-md transition-all duration-200 ${
                    isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              </button>
              <span className="text-base text-white/80">{name}</span>
            </div>
          );
        })}
      </div>

      <input
        type="text"
        value={customText}
        onChange={(event) => setCustomText(event.target.value)}
        placeholder="הצבע שלך לא ברשימה? תכתבו כאן..."
        className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center text-white placeholder-white/60 backdrop-blur-sm outline-none transition-colors focus:border-white"
      />

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className={`flex items-center gap-2 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300 ease-out ${
          canContinue
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
