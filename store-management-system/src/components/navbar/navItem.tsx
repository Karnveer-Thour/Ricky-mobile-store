'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, MouseEventHandler } from 'react';

interface NavitemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  menu?: MouseEventHandler<HTMLAnchorElement>;
  linkTo: string;
}

const Navitem: React.FC<NavitemProps> = ({ icon, label, isOpen, menu, linkTo }) => {
  const pathname = usePathname();

  const isActive =
    (label !== 'Profile' || ['/profile', '/logout'].includes(pathname)) &&
    pathname === linkTo;

  return (
    <Link
      href={linkTo || pathname}
      onClick={menu}
      className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 cursor-pointer overflow-hidden ${
        isActive ? 'bg-gray-700' : ''
      }`}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

export default Navitem;