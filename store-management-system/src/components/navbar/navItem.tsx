"use client";
import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

interface NavitemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  menu?: React.MouseEventHandler<HTMLDivElement>;
  linkTo?: string;
}

function Navitem({ icon, label, isOpen, menu, linkTo }: NavitemProps) {
//   const location = useLocation();

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 cursor-pointer overflow-hidden`}
      onClick={menu || undefined}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </div>
  );
}

export default Navitem;