"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { Lexend_Tera } from "next/font/google";
import { track } from "@hellyeah/x-ray";

const lexendTera = Lexend_Tera({
  subsets: ["latin"],
  weight: ["700"],
});

const footerLinks = [
  { name: "Events", href: "/events" },
  { name: "OSS", href: "/oss" },
  { name: "Members", href: "/members" },
  { name: "Achievements", href: "/achievements" },
  { name: "Lore", href: "/lore" },
  { name: "Talks", href: "/talks" },
  { name: "Blog", href: "https://blog.pointblank.club", ext: true, trackTarget: "blog" },
  { name: "Hustle Results", href: "/hustle" },
];

const socials = [
  {
    label: "Instagram",
    trackTarget: "instagram",
    href: "https://instagram.com/pointblank_club_",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "X",
    trackTarget: "twitter",
    href: "https://x.com/pointblank_club",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    trackTarget: "linkedin",
    href: "https://linkedin.com/company/pointblank-club",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-pbgray text-white pt-14 pb-8 px-4 sm:px-10 lg:px-20">
      <div className="max-w-8xl mx-auto flex flex-col items-center gap-7">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-bold tracking-tight select-none ${lexendTera.className}`}
        >
          <Image
            src={logo}
            alt="Logo - Point Blank"
            width={117}
            height={30}
            className="scale-150"
            draggable={false}
          />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-white/70">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors"
              target={link.ext ? "_blank" : undefined}
              rel={link.ext ? "noopener noreferrer" : undefined}
              onClick={
                link.trackTarget
                  ? () =>
                      track("outbound_link_clicked", {
                        target: link.trackTarget as string,
                        surface: "footer_nav",
                      })
                  : undefined
              }
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full border-t border-white/16" />

        {/* Bottom row */}
        <div className="w-full flex flex-col items-center gap-4 md:flex-row md:justify-between bg-pbsurface rounded-2xl md:rounded-full px-5 py-3 border border-white/22">
          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socials.map(({ path, href, label, trackTarget }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={() =>
                  track("outbound_link_clicked", {
                    target: trackTarget,
                    surface: "footer_socials",
                  })
                }
                className="w-10 h-10 rounded-full bg-pbgreen flex items-center justify-center text-black hover:bg-pbgreen/80 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={path} />
                </svg>
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white/70 text-sm text-center">
            © 2026 Point Blank. All Rights Reserved
          </p>

          {/* Spacing for right (justify-between) */}
          <div className="hidden md:block w-24" />
          {/* Privacy Policy */}
          {/* <Link
            href="/privacy"
            className="text-white/70 text-sm hover:text-white transition-colors text-center"
          >
            Privacy Policy
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
