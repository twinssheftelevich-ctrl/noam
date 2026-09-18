import { Suspense } from "react";
import GenderQuestion from "@/components/sections/GenderQuestion";

export default function Home() {
  return (
    <Suspense>
      <GenderQuestion />
    </Suspense>
  );
}
