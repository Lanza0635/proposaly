import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proposaly — Professional Proposal & PDF Generator",
  description:
    "Create professional B2B proposals and PDF reports in seconds with live preview.",
  verification: {
    google: "jRuRfYPTlK56-rUOWdJWsdSgM7DKxMAjUM67YvsQTcw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${figtree.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
