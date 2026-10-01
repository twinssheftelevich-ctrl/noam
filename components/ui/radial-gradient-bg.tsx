import { cn } from "@/lib/utils";

interface RadialGradientBackgroundProps {
  className?: string;
}

// Decorative radial spotlight, colored to match this site's red palette (see app/globals.css).
// Fixed to the viewport (like the global Velaris background in app/layout.tsx) rather than the
// local section box, so it fully covers the page instead of being clipped at the section's height.
export function RadialGradientBackground({ className }: RadialGradientBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_10%,#1a0306_40%,#d1202c_100%)]",
        className,
      )}
    />
  );
}
