"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const hairExamples = ["עדין", "גס", "דליל", "צפוף"];

export default function HairQuestion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(() => searchParams.get("hairType"));
  const [customText, setCustomText] = useState(() => searchParams.get("hairCustom") ?? "");
  const canContinue = customText.trim() !== "";

  useEffect(() => {
    router.prefetch("/step-4");
  }, [router]);

  function handleClick(type: string) {
    setSelected(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set("hairType", type);
    params.delete("hairCustom");
    window.history.replaceState(null, "", `/step-3?${params.toString()}`);
    router.push(`/step-4?${params.toString()}`);
  }

  function handleContinue() {
    if (!canContinue) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("hairCustom", customText.trim());
    params.delete("hairType");
    window.history.replaceState(null, "", `/step-3?${params.toString()}`);
    router.push(`/step-4?${params.toString()}`);
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10 px-6 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        איזה שיער יש לך בגוף?
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center">
        {hairExamples.map((type) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleClick(type)}
              className={`relative min-w-28 rounded-2xl border px-7 py-4 text-lg transition-all duration-300 ease-out active:scale-95 ${
                isSelected
                  ? "scale-105 border-white bg-white text-[#ab1521] shadow-[0_0_0_4px_rgba(255,255,255,0.25),0_0_35px_12px_rgba(255,255,255,0.4)]"
                  : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:scale-105 hover:bg-white/20"
              }`}
            >
              {type}
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

      <input
        type="text"
        value={customText}
        onChange={(event) => setCustomText(event.target.value)}
        placeholder="אחר? תכתבו בחופשיות..."
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
