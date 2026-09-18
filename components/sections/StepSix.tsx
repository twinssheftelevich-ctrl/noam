"use client";

import { useState, type FormEvent } from "react";
import { Check, ArrowLeft } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const WHATSAPP_NUMBER = "972545247569";

function buildWhatsappLink(name: string) {
  const message = `היי אני ${name.trim()} אשמח לקבל שירות לגבי הסרת שיער`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function StepSix() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim() !== "";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    window.open(buildWhatsappLink(name), "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <BackButton />

        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#ab1521]">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>

        <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
          תודה, {name}!
        </h1>
        <p className="max-w-md text-lg text-white/80">
          פתחנו לך הודעת וואטסאפ מוכנה. אם היא לא נפתחה אוטומטית —
        </p>
        <a
          href={buildWhatsappLink(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-8 py-3 text-lg font-medium text-[#ab1521] transition-all duration-300 ease-out hover:scale-105 active:scale-95"
        >
          לחצו כאן לפתיחת וואטסאפ
        </a>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 text-center">
      <BackButton />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
          השאירו פרטים
        </h1>
        <p className="max-w-md text-lg text-white/80">
          נציג שלנו יחזור אליכם עם כל הפרטים וההצעה המתאימה
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="שם מלא"
          className="w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center text-white placeholder-white/60 backdrop-blur-sm outline-none transition-colors focus:border-white"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-2 flex items-center justify-center gap-2 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300 ease-out ${
            canSubmit
              ? "bg-white text-[#ab1521] opacity-100 hover:scale-105 active:scale-95"
              : "pointer-events-none bg-white/20 text-white/50 opacity-60"
          }`}
        >
          שליחה
          <ArrowLeft className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
}
