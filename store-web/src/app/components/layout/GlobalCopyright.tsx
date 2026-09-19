import React from "react";

export interface GlobalCopyrightProps {
  className?: string;
  linkClassName?: string;
  /** Whether to include a space between ®️ and "by". Defaults to false to match "®️by ricky mobile store ${year} and ©️ by devThour". */
  spaced?: boolean;
}

/**
 * Global component for the Ricky Mobile Store main website.
 * Displays: "®️by ricky mobile store ${year} and ©️ by devThour"
 * with dynamically calculated year and devThour linking to https://thour-portfolio.netlify.app.
 */
export default function GlobalCopyright({
  className = "",
  linkClassName = "",
  spaced = false,
}: GlobalCopyrightProps) {
  const currentYear = new Date().getFullYear();
  const registeredPrefix = spaced ? "®️ by" : "®️by";

  return (
    <p
      className={`inline-flex flex-wrap items-center gap-1 text-xs text-gray-400 ${className}`}
      data-testid="global-copyright"
    >
      <span>
        {registeredPrefix} ricky mobile store {currentYear} and ©️ by{" "}
      </span>
      <a
        href="https://thour-portfolio.netlify.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-[#00cfff] hover:text-[#38bdf8] font-medium underline underline-offset-4 decoration-[#00cfff]/40 hover:decoration-[#00cfff] transition-colors duration-200 ${linkClassName}`}
      >
        devThour
      </a>
    </p>
  );
}
