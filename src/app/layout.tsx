import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
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
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light"> {/* Default to light theme */}
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