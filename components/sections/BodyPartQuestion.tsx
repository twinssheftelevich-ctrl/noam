"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, RotateCw } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

type View = "front" | "back";
type BodyType = "male" | "female";

type Anchor = { y: number; hw: number };

type Limb = { rTop: number; rBottom: number; offset: number };

type Shape = {
  chest: Anchor[];
  waist: Anchor[];
  hip: Anchor[];
  neckTop: number;
  neckBottom: number;
  upperArm: Limb;
  lowerArm: Limb;
  upperLeg: Limb;
  lowerLeg: Limb;
  headRx: number;
  headRy: number;
};

const CX = 120;

const SHAPES: Record<BodyType, Shape> = {
  male: {
    chest: [
      { y: 60, hw: 44 },
      { y: 90, hw: 47 },
      { y: 122, hw: 45 },
    ],
    waist: [
      { y: 122, hw: 45 },
      { y: 146, hw: 44 },
      { y: 170, hw: 43 },
    ],
    hip: [
      { y: 170, hw: 43 },
      { y: 193, hw: 42 },
      { y: 216, hw: 40 },
    ],
    neckTop: 12,
    neckBottom: 16,
    upperArm: { rTop: 19, rBottom: 14, offset: 60 },
    lowerArm: { rTop: 14, rBottom: 10, offset: 60 },
    upperLeg: { rTop: 23, rBottom: 17, offset: 21 },
    lowerLeg: { rTop: 17, rBottom: 12, offset: 21 },
    headRx: 20,
    headRy: 22,
  },
  female: {
    chest: [
      { y: 60, hw: 37 },
      { y: 88, hw: 44 },
      { y: 122, hw: 36 },
    ],
    waist: [
      { y: 122, hw: 36 },
      { y: 146, hw: 31 },
      { y: 170, hw: 33 },
    ],
    hip: [
      { y: 170, hw: 33 },
      { y: 193, hw: 43 },
      { y: 216, hw: 46 },
    ],
    neckTop: 10,
    neckBottom: 13,
    upperArm: { rTop: 15, rBottom: 11, offset: 52 },
    lowerArm: { rTop: 11, rBottom: 8, offset: 52 },
    upperLeg: { rTop: 20, rBottom: 15, offset: 19 },
    lowerLeg: { rTop: 15, rBottom: 11, offset: 19 },
    headRx: 18,
    headRy: 21,
  },
};

// Smooth torso band: curved sides through the given anchors, straight top/bottom
// seams so adjacent bands (chest -> waist -> hip) tile without gaps.
function bandPath(anchors: Anchor[], cx: number): string {
  const top = anchors[0];
  const bottom = anchors[anchors.length - 1];

  let d = `M ${cx - top.hw} ${top.y} L ${cx + top.hw} ${top.y} `;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    const dy = (b.y - a.y) / 2;
    d += `C ${cx + a.hw} ${a.y + dy}, ${cx + b.hw} ${b.y - dy}, ${cx + b.hw} ${b.y} `;
  }
  d += `L ${cx - bottom.hw} ${bottom.y} `;
  for (let i = anchors.length - 1; i > 0; i--) {
    const a = anchors[i];
    const b = anchors[i - 1];
    const dy = (b.y - a.y) / 2;
    d += `C ${cx - a.hw} ${a.y + dy}, ${cx - b.hw} ${b.y - dy}, ${cx - b.hw} ${b.y} `;
  }
  return d + "Z";
}

// Tapered capsule for limbs: rounded cap at each end, straight tapered sides.
function limbPath(cx: number, y0: number, y1: number, rTop: number, rBottom: number): string {
  return [
    `M ${cx - rTop} ${y0 + rTop}`,
    `A ${rTop} ${rTop} 0 0 1 ${cx + rTop} ${y0 + rTop}`,
    `L ${cx + rBottom} ${y1 - rBottom}`,
    `A ${rBottom} ${rBottom} 0 0 1 ${cx - rBottom} ${y1 - rBottom}`,
    `L ${cx - rTop} ${y0 + rTop}`,
    "Z",
  ].join(" ");
}

function neckPath(topHw: number, bottomHw: number, y0: number, y1: number): string {
  return `M ${CX - topHw} ${y0} L ${CX + topHw} ${y0} L ${CX + bottomHw} ${y1} L ${CX - bottomHw} ${y1} Z`;
}

const UPPER_ARM_Y: [number, number] = [62, 150];
const LOWER_ARM_Y: [number, number] = [150, 234];
const UPPER_LEG_Y: [number, number] = [216, 300];
const LOWER_LEG_Y: [number, number] = [300, 392];
const NECK_Y: [number, number] = [46, 60];
const HEAD_CY = 26;

const bodyParts = [
  { key: "face", label: "פנים", views: ["front"] },
  { key: "underarmRight", label: "בית שחי ימין", views: ["front"] },
  { key: "underarmLeft", label: "בית שחי שמאל", views: ["front"] },
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

type PartKey = (typeof bodyParts)[number]["key"];

export default function BodyPartQuestion() {
  const searchParams = useSearchParams();
  const bodyType: BodyType = searchParams.get("gender") === "אישה" ? "female" : "male";
  const shape = SHAPES[bodyType];

  const armRightCx = CX + shape.upperArm.offset;
  const armLeftCx = CX - shape.upperArm.offset;
  const legRightCx = CX + shape.upperLeg.offset;
  const legLeftCx = CX - shape.upperLeg.offset;

  const chestTop = shape.chest[0];
  const underarmY = chestTop.y + 6;
  const underarmRightX = (CX + chestTop.hw + (armRightCx - shape.upperArm.rTop)) / 2 - 10;
  const underarmLeftX = 240 - underarmRightX - 20;

  const partKeys = bodyParts.map((part) => part.key);
  const [selected, setSelected] = useState<PartKey[]>(() => {
    const raw = searchParams.get("parts");
    if (!raw) return [];
    return raw.split(",").filter((key): key is PartKey => (partKeys as string[]).includes(key));
  });
  const [view, setView] = useState<View>("front");
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/step-6");
  }, [router]);

  function handleContinue() {
    if (selected.length === 0) return;
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/step-6?${params.toString()}`);
  }

  function toggle(key: PartKey) {
    setSelected((current) => {
      const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
      const params = new URLSearchParams(searchParams.toString());
      if (next.length > 0) {
        params.set("parts", next.join(","));
      } else {
        params.delete("parts");
      }
      router.replace(`/step-5?${params.toString()}`);
      return next;
    });
  }

  function isSelected(key: PartKey) {
    return selected.includes(key);
  }

  function fillFor(key: PartKey) {
    return {
      fill: isSelected(key) ? "#ffffff" : "rgba(255,255,255,0.16)",
      stroke: isSelected(key) ? "#ffffff" : "rgba(255,255,255,0.35)",
      strokeWidth: 1,
    };
  }

  function shapeProps(key: PartKey) {
    return {
      onClick: () => toggle(key),
      className: "cursor-pointer transition-colors duration-200",
      ...fillFor(key),
    };
  }

  const visibleParts = bodyParts.filter((part) => (part.views as readonly View[]).includes(view));

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <BackButton />

      <h1 className="text-3xl tracking-tight text-white sm:text-4xl">
        איזה אזור בגוף {bodyType === "female" ? "תרצי" : "תרצה"} לטפל?
      </h1>

      <button
        type="button"
        onClick={() => setView((current) => (current === "front" ? "back" : "front"))}
        className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
      >
        <RotateCw className="h-4 w-4" />
        {view === "front" ? "הצג גב" : "הצג חזית"}
      </button>

      <svg viewBox="0 0 240 410" className="h-[380px] w-auto sm:h-[420px]" aria-hidden="true">
        {view === "front" ? (
          <>
            {/* lower legs (drawn first so upper legs overlap the knee seam) */}
            <path d={limbPath(legRightCx, LOWER_LEG_Y[0], LOWER_LEG_Y[1], shape.upperLeg.rBottom, shape.lowerLeg.rBottom)} {...shapeProps("lowerLeg")} />
            <path d={limbPath(legLeftCx, LOWER_LEG_Y[0], LOWER_LEG_Y[1], shape.upperLeg.rBottom, shape.lowerLeg.rBottom)} {...shapeProps("lowerLeg")} />

            {/* upper legs */}
            <path d={limbPath(legRightCx, UPPER_LEG_Y[0], UPPER_LEG_Y[1], shape.upperLeg.rTop, shape.upperLeg.rBottom)} {...shapeProps("upperLeg")} />
            <path d={limbPath(legLeftCx, UPPER_LEG_Y[0], UPPER_LEG_Y[1], shape.upperLeg.rTop, shape.upperLeg.rBottom)} {...shapeProps("upperLeg")} />

            {/* lower arms (drawn before upper arms so the elbow seam is covered) */}
            <path d={limbPath(armRightCx, LOWER_ARM_Y[0], LOWER_ARM_Y[1], shape.upperArm.rBottom, shape.lowerArm.rBottom)} {...shapeProps("lowerArm")} />
            <path d={limbPath(armLeftCx, LOWER_ARM_Y[0], LOWER_ARM_Y[1], shape.upperArm.rBottom, shape.lowerArm.rBottom)} {...shapeProps("lowerArm")} />

            {/* upper arms */}
            <path d={limbPath(armRightCx, UPPER_ARM_Y[0], UPPER_ARM_Y[1], shape.upperArm.rTop, shape.upperArm.rBottom)} {...shapeProps("upperArm")} />
            <path d={limbPath(armLeftCx, UPPER_ARM_Y[0], UPPER_ARM_Y[1], shape.upperArm.rTop, shape.upperArm.rBottom)} {...shapeProps("upperArm")} />

            {/* bikini / hip */}
            <path d={bandPath(shape.hip, CX)} {...shapeProps("bikini")} />

            {/* stomach / waist */}
            <path d={bandPath(shape.waist, CX)} {...shapeProps("stomach")} />

            {/* chest */}
            <path d={bandPath(shape.chest, CX)} {...shapeProps("chest")} />

            {/* underarms, bridging the shoulder/torso seam */}
            <rect x={underarmRightX} y={underarmY} width={20} height={28} rx={9} {...shapeProps("underarmRight")} />
            <rect x={underarmLeftX} y={underarmY} width={20} height={28} rx={9} {...shapeProps("underarmLeft")} />

            {/* throat, with breathing room from the head above it */}
            <path d={neckPath(shape.neckTop, shape.neckBottom, NECK_Y[0], NECK_Y[1])} {...shapeProps("throat")} />

            {/* head / face */}
            <ellipse cx={CX} cy={HEAD_CY} rx={shape.headRx} ry={shape.headRy} {...shapeProps("face")} />
          </>
        ) : (
          <>
            {/* lower legs (decorative only — legs can't be selected from the back) */}
            <path d={limbPath(legRightCx, LOWER_LEG_Y[0], LOWER_LEG_Y[1], shape.upperLeg.rBottom, shape.lowerLeg.rBottom)} {...fillFor("lowerLeg")} />
            <path d={limbPath(legLeftCx, LOWER_LEG_Y[0], LOWER_LEG_Y[1], shape.upperLeg.rBottom, shape.lowerLeg.rBottom)} {...fillFor("lowerLeg")} />

            {/* upper legs (decorative only) */}
            <path d={limbPath(legRightCx, UPPER_LEG_Y[0], UPPER_LEG_Y[1], shape.upperLeg.rTop, shape.upperLeg.rBottom)} {...fillFor("upperLeg")} />
            <path d={limbPath(legLeftCx, UPPER_LEG_Y[0], UPPER_LEG_Y[1], shape.upperLeg.rTop, shape.upperLeg.rBottom)} {...fillFor("upperLeg")} />

            {/* lower arms (decorative only — arms can't be selected from the back) */}
            <path d={limbPath(armRightCx, LOWER_ARM_Y[0], LOWER_ARM_Y[1], shape.upperArm.rBottom, shape.lowerArm.rBottom)} {...fillFor("lowerArm")} />
            <path d={limbPath(armLeftCx, LOWER_ARM_Y[0], LOWER_ARM_Y[1], shape.upperArm.rBottom, shape.lowerArm.rBottom)} {...fillFor("lowerArm")} />

            {/* upper arms (decorative only) */}
            <path d={limbPath(armRightCx, UPPER_ARM_Y[0], UPPER_ARM_Y[1], shape.upperArm.rTop, shape.upperArm.rBottom)} {...fillFor("upperArm")} />
            <path d={limbPath(armLeftCx, UPPER_ARM_Y[0], UPPER_ARM_Y[1], shape.upperArm.rTop, shape.upperArm.rBottom)} {...fillFor("upperArm")} />

            {/* buttocks */}
            <path d={bandPath(shape.hip, CX)} {...shapeProps("buttocks")} />

            {/* lower back */}
            <path d={bandPath(shape.waist, CX)} {...shapeProps("lowerBack")} />

            {/* upper back */}
            <path d={bandPath(shape.chest, CX)} {...shapeProps("upperBack")} />

            {/* shoulder seam fillers */}
            <rect x={underarmRightX} y={underarmY} width={20} height={28} rx={9} {...shapeProps("upperBack")} />
            <rect x={underarmLeftX} y={underarmY} width={20} height={28} rx={9} {...shapeProps("upperBack")} />

            {/* neck, with breathing room from the head above it */}
            <path d={neckPath(shape.neckTop, shape.neckBottom, NECK_Y[0], NECK_Y[1])} {...shapeProps("neck")} />

            {/* head (decorative, back of head is not a selectable zone) */}
            <ellipse cx={CX} cy={HEAD_CY} rx={shape.headRx} ry={shape.headRy} fill="rgba(255,255,255,0.16)" />
          </>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
        {visibleParts.map(({ key, label }) => {
          const active = isSelected(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`relative min-w-28 rounded-2xl border px-4 py-2 text-sm transition-all duration-300 ease-out active:scale-95 ${
                active
                  ? "scale-105 border-white bg-white text-[#ab1521] shadow-[0_0_0_3px_rgba(255,255,255,0.25),0_0_25px_10px_rgba(255,255,255,0.4)]"
                  : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:scale-105 hover:bg-white/20"
              }`}
            >
              {label}
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ab1521] text-white shadow-md transition-all duration-200 ${
                  active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={selected.length === 0}
        className={`flex items-center gap-2 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300 ease-out ${
          selected.length > 0
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
