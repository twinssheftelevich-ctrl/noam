import Link from "next/link";

const links = [
  { href: "/accessibility", label: "הצהרת נגישות" },
  { href: "/privacy", label: "מדיניות פרטיות" },
];

export default function Footer() {
  return (
    <footer className="mt-auto flex justify-center gap-6 px-6 pb-6 pt-4 text-sm font-normal text-white/70">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:text-white focus-visible:underline"
        >
          {label}
        </Link>
      ))}
    </footer>
  );
}
