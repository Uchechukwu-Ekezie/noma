import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { PrivyProviderWrapper } from "@/providers/privy-provider";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Zephyra - Modern Web Application Platform",
    template: "%s | Zephyra",
  },
  description:
    "Zephyra is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
  icons: {
    icon: "/noma_logo.svg",
    shortcut: "/noma_logo.svg",
    apple: "/nomalogo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/nomalogo.png",
    },
  },
  keywords: [
    "zephyra",
    "nextjs",
    "typescript",
    "tailwind css",
    "web application",
    "modern design",
    "react",
    "frontend development",
    "user interface",
    "responsive design",
  ],
  authors: [{ name: "Zephyra Team" }],
  creator: "Zephyra",
  publisher: "Zephyra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zephyra.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zephyra.app",
    title: "Zephyra - Modern Web Application Platform",
    description:
      "Zephyra is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
    siteName: "Zephyra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zephyra - Modern Web Application Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zephyra - Modern Web Application Platform",
    description:
      "Zephyra is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
    images: ["/twitter-image.png"],
    creator: "@zephyra_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} font-sans bg-[#2b2b2b] text-[#A259FF]`}
      >
        <PrivyProviderWrapper>
          <Navigation />
          {children}
          <Toaster />
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
