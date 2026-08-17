"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import React, { ReactNode, MouseEventHandler } from "react";
import cn from "classnames";

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
}) => {
  const pathname = usePathname();
  const isActive = linkTo !== "" && pathname === linkTo;

  return (
    <Link
      href={linkTo}
      onClick={menu}
      className={cn(
        "flex items-center gap-3 rounded-lg cursor-pointer overflow-hidden transition-all duration-200 relative group",
        isOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
        isActive
          ? "nav-active text-cyan-400"
          : "text-slate-400 hover:text-white hover:bg-white/5",
      )}
    >
      {/* Active left border accent */}
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r"
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "shrink-0 transition-colors duration-200",
          isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white",
          isOpen ? "ml-1" : "",
        )}
      >
        {icon}
      </span>

      {/* Label — shown only when open */}
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-medium whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
};

export default Navitem;
