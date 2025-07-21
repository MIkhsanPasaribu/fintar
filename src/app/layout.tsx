import type { Metadata } from "next";

// These styles apply to every route in the application
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintar - AI Financial Empowerment Platform",
  description:
    "Platform keuangan berbasis AI untuk literasi finansial dan konsultasi finansial 24/7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
