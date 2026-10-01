"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import BackButton from "@/components/ui/BackButton";
import { partsToLabel } from "@/lib/body-parts";

const WHATSAPP_NUMBER = "972508717100";

function buildWhatsappLink(name: string, gender: string | null, parts: string | null) {
  const isMale = gender === "גבר";
  const wantsToKnow = isMale ? "הייתי מעוניין" : "הייתי מעוניינת";
  const areas = partsToLabel(parts);
  const areasText = areas ? ` באזורים: ${areas}` : "";
  const message = `היי אני ${name.trim()}, ${wantsToKnow} לדעת כמה זה עולה לעשות הסרת שיער${areasText}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function StepSix() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim() !== "" && phone.trim() !== "";
  const whatsappLink = buildWhatsappLink(name, searchParams.get("gender"), searchParams.get("parts"));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        gender: searchParams.get("gender"),
        age: searchParams.get("age"),
        hairType: searchParams.get("hairType"),
        hairCustom: searchParams.get("hairCustom"),
        hairColor: searchParams.get("hairColor"),
        hairColorCustom: searchParams.get("hairColorCustom"),
        parts: searchParams.get("parts"),
      }),
    }).catch((error) => console.error("Failed to send lead", error));

    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  }

  if (submitted) {
    return (
      <section className="stagger-children relative flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <BackButton />

        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#ab1521] animate-pop">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>

        <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
          תודה, {name}!
        </h1>
        <p className="max-w-md text-lg text-white/80">
          פתחנו לך הודעת וואטסאפ מוכנה. אם היא לא נפתחה אוטומטית —
        </p>
        <AnimatedButton
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:rounded-full"
        >
          לחצו כאן לפתיחת וואטסאפ
        </AnimatedButton>
      </section>
    );
  }

  return (
    <section className="stagger-children relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 text-center">
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

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="מספר טלפון"
          className="w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center text-white placeholder-white/60 backdrop-blur-sm outline-none transition-colors focus:border-white"
        />


        <AnimatedButton type="submit" disabled={!canSubmit} className="mt-2 mx-auto">
          שליחה
        </AnimatedButton>
      </form>
    </section>
  );
}
