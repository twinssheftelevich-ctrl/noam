export const bodyParts = [
  { key: "face", label: "פנים", views: ["front"] },
  { key: "underarm", label: "בית שחי", views: ["front"] },
  { key: "chest", label: "חזה", views: ["front"] },
  { key: "stomach", label: "בטן", views: ["front"] },
  { key: "bikini", label: "ביקיני", views: ["front"] },
  { key: "upperArm", label: "יד עליונה", views: ["front"] },
  { key: "lowerArm", label: "יד תחתונה", views: ["front"] },
  { key: "throat", label: "גרון", views: ["front"] },
  { key: "neck", label: "צוואר", views: ["back"] },
  { key: "upperBack", label: "גב עליון", views: ["back"] },
  { key: "lowerBack", label: "גב תחתון", views: ["back"] },
  { key: "buttocks", label: "ישבן", views: ["back"] },
  { key: "upperLeg", label: "רגל עליונה", views: ["front"] },
  { key: "lowerLeg", label: "רגל תחתונה", views: ["front"] },
] as const;

export type PartKey = (typeof bodyParts)[number]["key"];

const partKeys = bodyParts.map((part) => part.key);

const partLabels: Record<PartKey, string> = Object.fromEntries(
  bodyParts.map((part) => [part.key, part.label])
) as Record<PartKey, string>;

export function parsePartKeys(raw: string | null): PartKey[] {
  if (!raw) return [];
  return raw.split(",").filter((key): key is PartKey => (partKeys as string[]).includes(key));
}

export function partsToLabel(raw: string | null): string {
  return parsePartKeys(raw)
    .map((key) => partLabels[key])
    .join(", ");
}
