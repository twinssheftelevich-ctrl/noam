"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

import darkBrown from "@/assets/images/hair-dark-brown.jpg";
import lightBrown from "@/assets/images/hair-light-brown.jpg";
import blonde from "@/assets/images/hair-blonde.jpg";
import ashBlonde from "@/assets/images/hair-ash-blonde.jpg";
import auburn from "@/assets/images/hair-auburn.jpg";
import gray from "@/assets/images/hair-gray.jpg";

const hairColors = [
  { name: "חום כהה", image: darkBrown },
  { name: "חום בהיר", image: lightBrown },
  { name: "בלונדיני", image: blonde },
  { name: "בלונד אפרפר", image: ashBlonde },
  { name: "אדמוני", image: auburn },
  { name: "אפור / לבן", image: gray },
];

export default function HairColorQuestion() {
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(name: string) {
    setSelected((current) => (current === name ? null : name));
  }

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-10 px-6 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        מה צבע השיער שלך?
      </h1>

      <div className="grid grid-cols-3 gap-6 sm:flex sm:flex-wrap sm:justify-center">
        {hairColors.map(({ name, image }) => {
          const isSelected = selected === name;
          return (
            <button
              key={name}
              type="button"
              aria-label={name}
              onClick={() => handleClick(name)}
              className={`relative h-20 w-20 rounded-full border-2 transition-all duration-200 ease-out active:scale-95 sm:h-24 sm:w-24 ${
                isSelected
                  ? "scale-110 border-white shadow-xl shadow-black/30"
                  : "border-white/40 hover:scale-105"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Image src={image} alt={name} fill sizes="96px" className="object-cover" />
              </div>
              <span
                className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ab1521] text-white shadow-md transition-all duration-200 ${
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
