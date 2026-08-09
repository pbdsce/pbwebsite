import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import AuthInitializer from "@/components/AuthInitializer";
import { Lexend } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@hellyeah/x-ray/next";

import Footer from "@/components/ui/Footer";
import { cookies } from "next/headers";
import verifyAuth from "@/lib/verifyAuth";
import ico from "@/public/favicon.ico";
import ReactLenis from "lenis/react";
import ScrollToTop from "@/components/ui/ScrollToTop";

const lexand = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pointblank.club"),
  title: {
    default: "Point Blank",
    template: "%s | Point Blank",
  },
  description:
    "Point Blank is a student run tech community. We are a group of tech enthusiasts who love to learn and grow together.",
  keywords: ["Point Blank", "student tech community", "open source community", "coding club"],
  authors:[{name: "Point Blank"}],
  icons: {
    icon: ico.src,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.pointblank.club",
    title: "Point Blank",
    description:
      "Point Blank is a student run open source community. We are a group of tech enthusiasts who love to learn and grow together.",
    siteName: "Point Blank",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Point Blank",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Point Blank",
    description:
      "Point Blank is a student run open source community.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.pointblank.club",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const user = sessionCookie ? (await verifyAuth(sessionCookie.value)) || null : null;

  return (
    <html lang="en-IN">
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}

      <body className={`bg-pbpages ${lexand.className}`}>
        <Analytics
          websiteId={process.env.NEXT_PUBLIC_HELLYEAH_TRACKER_ID as string}
          env={process.env.NEXT_PUBLIC_HELLYEAH_TRACKER_ENV}
          domains="www.pointblank.club"
        />
        <AuthInitializer
          authenticated={!!user}
          email={user?.email ?? null}
          name={user?.name ?? null}
          token={sessionCookie?.value ?? null}
        />
        <ReactLenis root>
          <ScrollToTop />
          {/* <DotWaveAnimation /> */}
          <div className="relative">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ReactLenis>
      </body>
    </html>
  );
}
