import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css"; // Path to your global styles
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-brand-accent',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Hiyaw Admin Dashboard",
  description: "Admin panel for Hiyaw Animation - Step Into Life",
  icons: {
    icon: "/favicon.ico", // Make sure favicon.ico exists in your /public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      {/*
        Next.js implicitly creates the <head> tag and populates it
        with content from the `metadata` export and any <Head> components
        used in child pages/layouts.
        Ensure NO characters (spaces, newlines, comments) are between
        the closing `>` of the `<html>` tag above and the opening `<` of the `<body>` tag below.
      */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          poppins.variable,
          montserrat.variable
        )}
      >
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}