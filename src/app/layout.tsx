import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceX Web - Monitoreo de Lanzamientos",
  description: "Aplicación web moderna para monitorear lanzamientos de SpaceX con visualizaciones interactivas y datos en tiempo real.",
  keywords: ["SpaceX", "lanzamientos", "cohetes", "espacio", "monitoreo"],
  authors: [{ name: "SpaceX Web Team" }],
  robots: "index, follow",
  openGraph: {
    title: "SpaceX Web - Monitoreo de Lanzamientos",
    description: "Aplicación web moderna para monitorear lanzamientos de SpaceX",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
