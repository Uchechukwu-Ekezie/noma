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
    default: "Noma - Modern Web Application Platform",
    template: "%s | Noma",
  },
  description:
    "Noma is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
  keywords: [
    "noma",
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
  authors: [{ name: "Noma Team" }],
  creator: "Noma",
  publisher: "Noma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://noma.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://noma.app",
    title: "Noma - Modern Web Application Platform",
    description:
      "Noma is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
    siteName: "Noma",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Noma - Modern Web Application Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noma - Modern Web Application Platform",
    description:
      "Noma is a cutting-edge web application built with Next.js, TypeScript, and Tailwind CSS. Experience modern design with premium user interface and seamless performance.",
    images: ["/twitter-image.png"],
    creator: "@noma_app",
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
