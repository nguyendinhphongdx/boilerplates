import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Fullstack Boilerplate",
  description: "Next.js + Tailwind + API Routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
            Next.js Fullstack Boilerplate
          </div>
        </footer>
      </body>
    </html>
  );
}
