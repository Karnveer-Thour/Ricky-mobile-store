"use client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface MultiselectProps {
  Heading: React.ReactNode;
  children: React.ReactNode;
}

function Multiselect({ Heading, children }: MultiselectProps) {
  const [selectorOpened, setSelectorOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  const hideSelector = useCallback((e: { target: any }) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) && // Click is outside the menu
      buttonRef.current &&
      !buttonRef.current.contains(e.target) // Click is outside the button
    ) {
      setSelectorOpened(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", hideSelector);
    return () => {
      document.removeEventListener("mousedown", hideSelector);
    };
  }, [hideSelector]);

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        ref={buttonRef}
        className="w-full h-full p-3 border border-gray-300 rounded-md shadow-sm text-sm bg-white flex justify-between items-center cursor-pointer hover:ring-blue-500 hover:ring-2 hover:font-bold hover:text-blue-500"
        onClick={() => setSelectorOpened((prev) => !prev)}
        role="button"
        aria-expanded={selectorOpened}
      >
        <span className="text-md font-medium">{Heading}</span>
        {!selectorOpened ? <ArrowBigUp /> : <ArrowBigDown />}
      </button>

      {/* Dropdown Menu */}
      {selectorOpened && (
        <div
          ref={menuRef}
          className="absolute w-full h-auto p-4 border bg-white mt-1 rounded-lg shadow-lg z-50"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Multiselect;
