import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { OnboardingProvider } from "@/hooks/useOnboarding";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Fintar - Solusi Optimalisasi Finansial Pintar Keluarga dan UMKM Berbasis AI",
  description:
    "Fintar adalah platform pemberdayaan finansial berbasis AI yang membantu keluarga dan UMKM Indonesia mengelola keuangan dengan cerdas, meningkatkan literasi finansial, dan mencapai kebebasan finansial melalui teknologi AI terdepan.",
  keywords:
    "fintech Indonesia, perencanaan keuangan keluarga, AI finansial, UMKM, investasi, budgeting, konsultasi keuangan AI, Fintar",
  authors: [{ name: "Fintar Team" }],
  openGraph: {
    title:
      "Fintar - Solusi Optimalisasi Finansial Pintar Keluarga dan UMKM Berbasis AI",
    description:
      "Solusi finansial cerdas berbasis AI untuk keluarga dan UMKM Indonesia",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Fintar - Solusi Optimalisasi Finansial Pintar Keluarga dan UMKM Berbasis AI",
    description:
      "Solusi finansial cerdas berbasis AI untuk keluarga dan UMKM Indonesia",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <OnboardingProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </OnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
