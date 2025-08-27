import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Naagrik - Community Issue Reporting Platform",
  description: "Empowering communities to report, track, and resolve local issues together. Your voice, your city, your change.",
  keywords: "civic issues, community reporting, local government, municipal services, citizen engagement",
  authors: [{ name: "Naagrik Team" }],
  openGraph: {
    title: "Naagrik - Community Issue Reporting Platform",
    description: "Report, track, and resolve local issues in your community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
