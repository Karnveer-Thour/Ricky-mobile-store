import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import GlobalCopyright from "./GlobalCopyright";
import FooterCopyright from "./FooterCopyright";

describe("GlobalCopyright Component", () => {
  const currentYear = new Date().getFullYear();

  it("renders dynamic current year with correct text and proper English grammar", () => {
    render(<GlobalCopyright />);

    const copyrightEl = screen.getByTestId("global-copyright");
    expect(copyrightEl).toBeInTheDocument();
    expect(copyrightEl.textContent).toContain(`® Ricky Mobile Store ${currentYear}`);
    expect(copyrightEl.textContent).toContain("© by devThour");
  });

  it("renders matching vector icons for Registered (®) and Copyright (©)", () => {
    render(<GlobalCopyright />);

    const registeredIcon = screen.getByTestId("registered-icon");
    const copyrightIcon = screen.getByTestId("copyright-icon");
    expect(registeredIcon).toBeInTheDocument();
    expect(copyrightIcon).toBeInTheDocument();
  });

  it("contains devThour link redirecting to thour-portfolio.netlify.app", () => {
    render(<GlobalCopyright />);

    const link = screen.getByRole("link", { name: "devThour" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://thour-portfolio.netlify.app");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports custom separator for typography flexibility", () => {
    render(<GlobalCopyright separator="|" />);

    const copyrightEl = screen.getByTestId("global-copyright");
    expect(copyrightEl.textContent).toContain("|");
  });

  it("calculates current year dynamically when year changes", () => {
    // Mock system time to a future year (e.g. 2028)
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2028-01-01T00:00:00Z"));

    render(<GlobalCopyright />);
    expect(screen.getByText(/2028/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("applies custom className and linkClassName", () => {
    render(<GlobalCopyright className="custom-class" linkClassName="custom-link-class" />);

    const container = screen.getByTestId("global-copyright");
    expect(container).toHaveClass("custom-class");

    const link = screen.getByRole("link", { name: "devThour" });
    expect(link).toHaveClass("custom-link-class");
  });

  it("works seamlessly when imported via FooterCopyright alias", () => {
    render(<FooterCopyright />);

    const link = screen.getByRole("link", { name: "devThour" });
    expect(link).toHaveAttribute("href", "https://thour-portfolio.netlify.app");
  });

  it("renders the official verified store icon by default", () => {
    render(<GlobalCopyright />);

    const icon = screen.getByTestId("official-store-icon");
    expect(icon).toBeInTheDocument();
  });

  it("can hide the official verified store icon when showOfficialIcon is false", () => {
    render(<GlobalCopyright showOfficialIcon={false} />);

    const icon = screen.queryByTestId("official-store-icon");
    expect(icon).not.toBeInTheDocument();
  });
});

