"use client";

import { useStore } from "@/lib/zustand/store";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import router from "next/router";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const navItems = [
  { href: "https://github.com/pointblank-club", label: "GitHub", isExternal: true, icon: faGithub},
  // { href: "/recruitment", label: "Recruitment" },
  { href: "/events", label: "Events" },
  { href: "/leads", label: "Leads" },
  { href: "/lore", label: "Lore" },
  { href: "/members", label: "Members", specialPadding: true },
  { href: "/achievements", label: "Achievements" },
  { href: "/hustle", label: "Hustle Results" },
];

export default function Header() {
  const [top, setTop] = useState(true);
  const pathname = usePathname();
  const { isLoggedIn } = useStore();

  // Detect whether the user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
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
          <div className="shrink-0 mr-4">
            <Logo />
          </div>
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
             {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <p
                    className={`font-medium ${
                      pathname === item.href
                        ? "font-extrabold text-white"
                        : "text-gray-300"
                    } hover:text-white ${item.specialPadding ? "px-5" : "px-2 lg:px-5"} py-3 flex items-center transition duration-150 ease-in-out`}
                  >
                    {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2" size="lg" />}
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
            {isLoggedIn && (
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
              {/* <li>
                <Link href="mailto:admin@pointblank.club">
                <p className={`font-medium ${pathname === '/contact' ? 'font-extrabold text-white' : 'text-gray-300'} hover:text-white px-2 lg:px-5 py-3 flex items-center transition duration-150 ease-in-out`}>Contact Us</p>
                </Link>
              </li> */}
              <li>
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      useStore.getState().setLoggedIn(false);
                      localStorage.removeItem("admin_token");
                      router.push("/admin/logout");
                    }}
                  >
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
                ) : (
          <></>        
                )}
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}