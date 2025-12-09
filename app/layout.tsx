import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { Nunito_Sans as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://denistarasenko.com"),
  title: {
    default: "Denis Tarasenko",
    template: "%s | Denis Tarasenko",
  },
  description:
    "I design beautiful, high-performing websites for companies around the world. Email me if you’re in need of a powerful online presence. If we’re compatible, I’ll provide a time and cost breakdown.",
  openGraph: {
    title: "Denis Tarasenko",
    description:
      "I design beautiful, high-performing websites for companies around the world. Email me if you’re in need of a powerful online presence. If we’re compatible, I’ll provide a time and cost breakdown.",
    url: "https://denistarasenko.com",
    siteName: "Denis Tarasenko",
    locale: "en_US",
    type: "website",
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
  twitter: {
    title: "Denis Tarasenko",
    card: "summary_large_image",
  },
  verification: {
    google: "LHTT-WRptRShm2aPWwLVMp0C_4X2H7QMLYWuLfnvXGk",
  },
};

// Change a font for all text
const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${fontSans.className} max-w-screen overflow-x-hidden bg-white`}
      >
        <Toaster />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
