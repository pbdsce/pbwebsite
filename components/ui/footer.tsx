import Link from 'next/link'
import React from 'react';
import Logo from './logo';
import {navItems} from '../ui/Items';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <ul className="flex flex-wrap justify-center items-center mb-6 text-white">
  {navItems.map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        className="mr-4 hover:underline md:mr-6"
      >
        {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2" size="lg" />}
        {item.label}
      </Link>
    </li>
  ))}
</ul>
    </footer>
  );
}