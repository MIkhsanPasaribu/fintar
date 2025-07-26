import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintar - AI-Powered Financial Empowerment Platform",
  description:
    "Platform pemberdayaan finansial berbasis AI yang membantu individu dan UKM mengelola keuangan, meningkatkan literasi finansial, dan mencapai kebebasan finansial.",
  keywords:
    "fintech, financial planning, AI assistant, investment, budgeting, Indonesia",
  authors: [{ name: "Fintar Team" }],
  openGraph: {
    title: "Fintar - AI-Powered Financial Empowerment Platform",
    description: "Platform pemberdayaan finansial berbasis AI untuk Indonesia",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fintar - AI-Powered Financial Empowerment Platform",
    description: "Platform pemberdayaan finansial berbasis AI untuk Indonesia",
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
          <div className="min-h-screen bg-gray-50">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
