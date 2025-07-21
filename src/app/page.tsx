"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";

export default function Home() {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to landing
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/landing");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
}
