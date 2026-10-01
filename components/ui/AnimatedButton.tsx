import { ArrowLeft } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type AnimatedButtonProps = AsButton | AsAnchor;

const BASE_CLASSES =
  "group relative flex items-center justify-center gap-1 overflow-hidden rounded-full px-9 py-4 text-lg font-semibold text-white shadow-[0_0_0_2px_white] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl hover:text-[#ab1521] hover:shadow-[0_0_0_12px_transparent] active:scale-95 disabled:pointer-events-none disabled:opacity-50";

function AnimatedButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-white transition-[clip-path] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(100%_at_50%_50%)]" />
      <ArrowLeft className="pointer-events-none absolute left-4 z-10 h-6 w-6 text-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:left-[-25%] group-hover:text-[#ab1521]" />
      <ArrowLeft className="pointer-events-none absolute right-[-25%] z-10 h-6 w-6 text-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:right-4 group-hover:text-[#ab1521]" />
      <span className="relative z-10 translate-x-3 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-3">
        {children}
      </span>
    </>
  );
}

export default function AnimatedButton({ children, className = "", ...props }: AnimatedButtonProps) {
  const classes = cn(BASE_CLASSES, className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as AsAnchor;
    return (
      <a href={href} className={classes} {...anchorProps}>
        <AnimatedButtonContent>{children}</AnimatedButtonContent>
      </a>
    );
  }

  const buttonProps = props as AsButton;
  return (
    <button className={classes} {...buttonProps}>
      <AnimatedButtonContent>{children}</AnimatedButtonContent>
    </button>
  );
}
