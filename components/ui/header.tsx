"use client";

import { useStore } from "@/lib/zustand/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navItems } from "./shared"; // ✅ import shared data

export default function Header() {
  const [top, setTop] = useState(true);
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const { reset } = useStore();

  const handleLogout = async () => {
    await auth.signOut();
    setLoggedIn(false);
    reset();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? "bg-black backdrop-blur-sm shadow-lg" : ""
      }`}
    >
      <div className="mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <p
                      className={`font-medium ${
                        pathname === item.href
                          ? "font-extrabold text-white"
                          : "text-gray-300"
                      } hover:text-white ${
                        item.specialPadding ? "px-5" : "px-2 lg:px-5"
                      } py-3 flex items-center transition duration-150 ease-in-out`}
                    >
                      {item.icon && (
                        <FontAwesomeIcon icon={item.icon} className="mr-2" size="lg" />
                      )}
                      {item.label}
                    </p>
                  </Link>
                </li>
              ))}

              {/* Docs (visible only when logged in) */}
              {loggedIn && (
                <li>
                  <Link href="/docs">
                    <p
                      className={`font-medium ${
                        pathname === "/docs"
                          ? "font-extrabold text-white"
                          : "text-gray-300"
                      } hover:text-white px-2 lg:px-5 py-3 flex items-center transition duration-150 ease-in-out`}
                    >
                      Docs
                    </p>
                  </Link>
                </li>
              )}

              {/* Logout button */}
              {loggedIn && (
                <li>
                  <button onClick={handleLogout}>
                    <p
                      className={`font-medium ${
                        pathname === "/logout"
                          ? "font-extrabold text-white"
                          : "text-gray-300"
                      } hover:text-white px-2 lg:px-5 py-3 flex items-center transition duration-150 ease-in-out`}
                    >
                      Logout
                    </p>
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
