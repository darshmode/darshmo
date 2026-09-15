import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#testimonials", label: "Testimonials" },
  { href: "#results", label: "Results" },
  { href: "#pullups", label: "Transformations" },
  { href: "/recipes", label: "Recipes" },
];

export default function Header() {
  return (
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
        <Link
          href="/book"
          className="font-heading text-xs sm:text-sm tracking-wide bg-[#E8862B] hover:bg-[#D1751F] text-white px-4 py-2 rounded-lg transition-colors duration-150"
        >
          Book a Call
        </Link>
      </div>
    </header>
  );
}
