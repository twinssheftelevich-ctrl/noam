import type { ReactNode } from "react";
import BackButton from "@/components/ui/BackButton";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

// Shared shell for long-form text pages (accessibility statement, privacy policy).
export default function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-10 pt-20 sm:px-6">
      <BackButton />

      <div className="stagger-children flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="text-sm font-normal text-white/70">עודכן לאחרונה: {updatedAt}</p>
        </header>

        <article className="flex flex-col gap-6 rounded-2xl border border-white/30 bg-white/10 p-6 text-base font-normal leading-relaxed text-white backdrop-blur-sm sm:p-8 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ms-5 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
          {children}
        </article>
      </div>
    </main>
  );
}
