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
  title: "Point Blank",
  description:
    "Point Blank is a student-run tech community. We are a group of tech enthusiasts who love to learn and grow together.",
  icons: {
    icon: ico.src,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const user = sessionCookie ? await verifyAuth(sessionCookie.value) : null;

  return (
    <html lang="en_IN">
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
