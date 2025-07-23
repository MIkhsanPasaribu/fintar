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
    <div className="min-h-screen bg-gradient-to-br from-primary-darker via-primary-dark to-bg-surface flex items-center justify-center">
      <div className="glass-effect p-8 rounded-2xl">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-font-primary text-center">Memuat Fintar...</p>
      </div>
    </div>
  );
}
