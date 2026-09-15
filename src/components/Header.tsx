"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#testimonials", label: "Testimonials" },
  { href: "#results", label: "Results" },
  { href: "#pullups", label: "Transformations" },
  { href: "/recipes", label: "Recipes" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="shrink-0">
            <Image
              src="/darshmode-logo-transparent.png"
              alt="MODE"
              width={928}
              height={240}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-heading text-lg sm:text-xl tracking-wide text-white hover:text-accent-dim transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-accent-dim transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/book"
            className="font-heading text-xs sm:text-sm tracking-wide bg-[#E8862B] hover:bg-[#D1751F] text-white px-4 py-2 rounded-lg transition-colors duration-150"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[80] flex items-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative w-full bg-surface border-t border-edge rounded-t-2xl p-6">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-heading text-xl tracking-wide text-white hover:text-accent-dim transition-colors py-3 border-b border-edge last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
