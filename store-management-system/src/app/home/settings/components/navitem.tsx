"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, MouseEventHandler } from "react";

interface NavitemProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  menu?: MouseEventHandler<HTMLAnchorElement>;
  linkTo: string;
  isDark?: boolean;
}

const Navitem: React.FC<NavitemProps> = ({
  icon,
  label,
  isOpen,
  menu,
  linkTo,
  isDark = false,
}) => {
  const pathname = usePathname();
  const isActive = pathname === linkTo;

  const activeClass = isDark
    ? "bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/30"
    : "bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200 shadow-xs";

  const inactiveClass = isDark
    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60";

  return (
    <Link
      href={linkTo}
      onClick={menu}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

export default Navitem;
