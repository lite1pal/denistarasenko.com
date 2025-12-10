import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

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
      <body
        className={`${myFont.className} dark:bg-neutral-900 dark:text-white`}
      >
        {/* Swetrix external script */}
        <Script
          src="https://swetrix.org/swetrix.js"
          strategy="afterInteractive"
          defer
        />

        {/* Swetrix inline initialization */}
        <Script id="swetrix-init" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function() {
              swetrix.init('M44aOKu05zLs', {
                apiURL: 'http://swetrixapi-gwc8s4s40ck40wk0cswks40s.188.245.162.140.sslip.io/log',
              });
              swetrix.trackViews();
            });
          `}
        </Script>

        {/* Noscript fallback */}
        <noscript>
          <img
            src="http://swetrixapi-gwc8s4s40ck40wk0cswks40s.188.245.162.140.sslip.io/log/noscript?pid=M44aOKu05zLs"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
