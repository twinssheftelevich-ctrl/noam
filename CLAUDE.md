@AGENTS.md

# הנחיות פרויקט

## שפה וכיוון
- כל התוכן באתר בעברית.
- כיוון RTL בכל הפרויקט (`<html lang="he" dir="rtl">` ב-`app/layout.tsx`).

## עיצוב וסגנון
- עיצוב מודרני, נקי ומינימליסטי.
- פונט: [Rubik](https://fonts.google.com/specimen/Rubik) מ-Google Fonts, נטען דרך `next/font/google` (ולא `<link>` חיצוני).
- CSS: Tailwind CSS (גרסה אחרונה, v4) — כל עיצוב ייעשה באמצעות מחלקות Tailwind, ללא קבצי CSS נפרדים אלא אם ממש נדרש.
- אייקונים: [lucide-react](https://lucide.dev/) בלבד.

## פריימוורק וטכנולוגיה
- Next.js (הגרסה האחרונה) עם React בגרסה האחרונה.
- שימוש תמידי ב-App Router (תיקיית `app/`) — לא Pages Router.
- כל הקומפוננטות והקבצים בפרויקט נכתבים ב-TypeScript (`.tsx` / `.ts` בלבד, לא `.jsx`/`.js`).
- תמונות תמיד דרך `next/image` (`import Image from "next/image"`), לא תגית `<img>` רגילה.

## מבנה נכסים (assets)
- `assets/images/` — תמונות תוכן כלליות.
- `assets/logos/` — קבצי לוגו.
- `assets/fonts/` — קבצי פונט מקומיים (אם נדרש פונט שאינו מ-Google Fonts).
- `assets/icons/` — אייקונים מותאמים אישית (מעבר ל-lucide-react).

## הערה חשובה
- קובץ `AGENTS.md` (הנטען למעלה עם `@AGENTS.md`) נוצר ומתעדכן אוטומטית על ידי `next dev` ומכיל אזהרות על שינויים לא תואמים (breaking changes) בגרסת Next.js הנוכחית ביחס לידע המוקדם. יש לקרוא אותו ואת התיעוד ב-`node_modules/next/dist/docs/` לפני שימוש ב-API-ים לא מוכרים.
