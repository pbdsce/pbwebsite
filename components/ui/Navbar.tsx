"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/lib/store/loading";
import { Lexend } from "next/font/google";
import logo from "@/public/logo.svg";
import { useAuthStore } from "@/lib/store/auth";
import { logout } from "@/app/admin/actions";

const lexend = Lexend({ subsets: ["latin"] });

const adminLinks: { name: string; href: string; icon: React.ReactNode }[] = [
  {
    name: "Activity Logs",
    href: "/admin/logs",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

function AdminSidebar({
  isOpen,
  onClose,
  name,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | null;
  email: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-pbgray z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pbgreen flex items-center justify-center">
              <svg
                className="w-4 h-4 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {name ?? "Admin Panel"}
              </p>
              {email && (
                <p className="text-xs text-white/40 truncate max-w-35">
                  {email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            aria-label="Close admin panel"
          >
            <svg
              className="w-4 h-4 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
          <p className="text-xs text-white/30 uppercase tracking-widest px-2 mb-1">
            Pages
          </p>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                pathname === link.href
                  ? "bg-pbgreen text-black font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="px-4 py-4 border-t border-white/10">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { authenticated, email, name } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [pastHero, setPastHero] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const prevPathnameRef = React.useRef(pathname);

  React.useLayoutEffect(() => {
    if (pathname === "/" && prevPathnameRef.current !== "/") setLoading(true);
    prevPathnameRef.current = pathname;
  }, [pathname, setLoading]);

  React.useEffect(() => {
    if (pathname !== "/") return;
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  const pages: { name: string; href: string; ext?: boolean }[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Events",
      href: "/events",
    },
    {
      name: "OSS",
      href: "/oss",
    },
    {
      name: "Members",
      href: "/members",
    },
    {
      name: "Achievements",
      href: "/achievements",
    },
    {
      name: "Placements",
      href: "/placements",
    },
    {
      name: "Lore",
      href: "/lore",
    },
    {
      name: "Talks",
      href: "/talks",
    },
    {
      name: "Hustle Results",
      href: "/hustle",
    },
  ];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`sticky top-0 z-30 pt-5 px-5 ${lexend.className} ${pathname === "/" && !pastHero && !isLoading ? "bg-black" : "bg-transparent"}`}
      >
        <div className="relative bg-pbgray rounded-4xl text-white">
          <div className="mx-auto pl-12 pr-5">
            <div className="flex items-center justify-between h-16">
              <Link href={"/"} className="flex items-center">
                <Image
                  src={logo}
                  alt="Logo - Point Blank"
                  className="scale-150"
                  draggable={false}
                  loading="eager"
                />
              </Link>
              <div className="hidden lg:flex items-center gap-2">
                <div className="ml-10 flex items-baseline space-x-4">
                  {pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      target={page.ext ? "_blank" : "_self"}
                      className={`px-3 py-2 rounded-3xl text-sm hover:bg-pbgreen hover:text-black transition-all ${pathname === page.href ? "bg-pbgreen text-black" : ""}`}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
                {authenticated && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    title={email ?? undefined}
                    className="flex items-center gap-2 px-3 py-2 rounded-3xl text-sm hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-pbgreen flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-black"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    {name?.split(" ")[0] ?? "Admin"}
                  </button>
                )}
              </div>

              <div className="lg:hidden flex items-center gap-2">
                {authenticated && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    title={email ?? undefined}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-pbgreen/20 hover:bg-pbgreen/30 transition-all"
                    aria-label="Admin panel"
                  >
                    <svg
                      className="w-5 h-5 text-pbgreen"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-pbgreen text-black rounded-full w-10 h-10 flex items-center justify-center transition-all"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 21 14"
                    >
                      <path d="M0 0.875C0 0.391751 0.391751 0 0.875 0H20.125C20.6082 0 21 0.391751 21 0.875C21 1.35825 20.6082 1.75 20.125 1.75H0.875C0.391751 1.75 0 1.35825 0 0.875ZM0 7C0 6.51675 0.391751 6.125 0.875 6.125H20.125C20.6082 6.125 21 6.51675 21 7C21 7.48325 20.6082 7.875 20.125 7.875H0.875C0.391751 7.875 0 7.48325 0 7ZM9.625 13.125C9.625 12.6418 10.0168 12.25 10.5 12.25H20.125C20.6082 12.25 21 12.6418 21 13.125C21 13.6082 20.6082 14 20.125 14H10.5C10.0168 14 9.625 13.6082 9.625 13.125Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`lg:hidden absolute left-0 right-0 top-full mt-2 bg-pbgray rounded-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {pages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  target={page.ext ? "_blank" : "_self"}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-sm hover:bg-pbgreen hover:text-black transition-all ${pathname === page.href ? "bg-pbgreen text-black" : ""}`}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <AdminSidebar
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        name={name}
        email={email}
      />
    </>
  );
}
