import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { navItems, footerConfig } from "./shared";

export default function Footer() {
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      {/* Navigation Links */}
      <div className="mx-auto max-w-screen-xl text-center">
        <ul className="flex flex-wrap justify-center items-center mb-6 text-white">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="mr-4 hover:underline md:mr-6"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer Text */}
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          {footerConfig.madeWith}{" "}
          <Link href="/" className="hover:underline">
            {footerConfig.orgName}
          </Link>
          . {footerConfig.copyright}
        </span>
      </div>
    </footer>
  );
}
