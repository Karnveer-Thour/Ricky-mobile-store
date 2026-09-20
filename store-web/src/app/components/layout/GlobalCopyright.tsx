import React from "react";
import { BadgeCheck, Copyright, ExternalLink } from "lucide-react";

export interface GlobalCopyrightProps {
  className?: string;
  linkClassName?: string;
  /** Custom separator between store trademark and developer copyright. Defaults to "•". */
  separator?: string;
  /** Whether to show the official verified badge icon. Defaults to true. */
  showOfficialIcon?: boolean;
}

/**
 * Custom Registered Trademark icon matching Lucide Copyright geometry.
 */
export function RegisteredIcon({
  size = 13,
  className = "",
  ...props
}: {
  size?: number;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      <path d="m13 13 3 4" />
    </svg>
  );
}

/**
 * Global component for the Ricky Mobile Store main website.
 * Displays: "® Ricky Mobile Store ${year} • © by devThour"
 * with matching official vector icons, proper English grammar & capitalization,
 * and devThour linking to https://thour-portfolio.netlify.app.
 */
export default function GlobalCopyright({
  className = "",
  linkClassName = "",
  separator = "•",
  showOfficialIcon = true,
}: GlobalCopyrightProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 text-xs text-gray-300 font-normal ${className}`}
      data-testid="global-copyright"
    >
      <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#00cfff]/30 transition-all duration-300 shadow-sm shadow-black/20 backdrop-blur-sm group">
        {showOfficialIcon && (
          <BadgeCheck
            size={14}
            className="text-[#00cfff] shrink-0 fill-[#00cfff]/20 drop-shadow-[0_0_6px_rgba(0,207,255,0.4)]"
            aria-hidden="true"
            data-testid="official-store-icon"
          />
        )}
        <span className="inline-flex items-center gap-1.5 text-gray-200">
          <RegisteredIcon
            size={13}
            className="text-[#00cfff] shrink-0 drop-shadow-[0_0_4px_rgba(0,207,255,0.3)]"
            data-testid="registered-icon"
          />
          <span className="sr-only">® </span>
          <span className="font-medium tracking-wide text-white">Ricky Mobile Store</span>
          {" "}
          <span className="text-gray-400 font-mono">{currentYear}</span>
        </span>
        {" "}
        <span className="text-white/20 select-none px-0.5" aria-hidden="true">
          {separator}
        </span>
        {" "}
        <span className="inline-flex items-center gap-1 text-gray-300">
          <Copyright
            size={13}
            className="text-[#00cfff] shrink-0 drop-shadow-[0_0_4px_rgba(0,207,255,0.3)]"
            aria-hidden="true"
            data-testid="copyright-icon"
          />
          <span className="sr-only">© </span>
          <span>by </span>
          <a
            href="https://thour-portfolio.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-[#00cfff] hover:text-[#38bdf8] font-medium underline underline-offset-4 decoration-[#00cfff]/40 hover:decoration-[#00cfff] transition-colors duration-200 group/link ${linkClassName}`}
          >
            <span>devThour</span>
            <ExternalLink
              size={11}
              className="text-[#00cfff]/80 group-hover/link:text-[#38bdf8] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </span>
      </div>
    </div>
  );
}

