import Link from 'next/link'
import React from 'react';
import Logo from './logo';
import navItems from './NavItems';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <div className="mx-auto max-w-screen-xl text-center">
        <ul className="flex flex-wrap justify-center items-center mb-6 text-white">
          <li><Link href="/" className="mr-4 hover:underline md:mr-6">Home</Link></li>
          <li><Link href="/events" className="mr-4 hover:underline md:mr-6">Events</Link></li>
          <li><Link href="/leads" className="mr-4 hover:underline md:mr-6">Leads</Link></li>
          <li><Link href="/members" className="mr-4 hover:underline md:mr-6">Members</Link></li>
          <li><Link href="/achievements" className="mr-4 hover:underline md:mr-6">Achievements</Link></li>
          <li><Link href="/alumni" className="mr-4 hover:underline md:mr-6">Alumni</Link></li>
          <li><Link href="/hustle" className="mr-4 hover:underline md:mr-6">Hustle Results</Link></li>
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
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">Made with ❤️ by <Link href="/" className="hover:underline">Point Blank</Link>. All Rights Reserved.</span>
      </div>
    </footer>
  );
}