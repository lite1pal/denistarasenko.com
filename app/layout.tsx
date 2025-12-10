import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const myFont = localFont({
  src: [
    {
      path: "../public/fonts/PTSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PTSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/PTSerif-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://analytics.denistarasenko.com/script.js"
          data-website-id="d149d048-b9f5-468c-be25-0c30e20d04f5"
        ></script>
      </head>
      <body
        className={`${myFont.className} dark:bg-neutral-900 dark:text-white`}
      >
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
