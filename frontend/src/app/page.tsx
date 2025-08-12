"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";

const ModernHomepage = dynamic(
  () =>
    import("@/components/pages/ModernHomepage").then((mod) => ({
      default: mod.ModernHomepage,
    })),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <ModernHomepage />
      <Toaster />
    </>
  );
}
