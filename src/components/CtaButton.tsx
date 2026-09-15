import Link from "next/link";

const badges = [
  {
    label: "No Long-Term Contract",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 21l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Free Discovery Call",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3c1 2 1.5 3.5 1.5 5S6.5 10 5 11c1.5 3.5 4.5 6.5 8 8 1-1.5 2-2.5 3-2.5s3 .5 5 1.5c0 2-1 3.5-3 4-5 1-13-7-12-12 .5-2 2-3 4-4z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Response Within 24 Hours",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 ${className}`}>
      {badges.map((b) => (
        <div key={b.label} className="flex items-center gap-2 text-muted">
          {b.icon}
          <span className="font-body text-xs sm:text-sm">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CtaButton({
  label = "Book a Free Call",
  className = "",
  variant = "amber",
}: {
  label?: string;
  className?: string;
  variant?: "default" | "amber";
}) {
  const styles =
    variant === "amber"
      ? "bg-[#E8862B] hover:bg-[#D1751F] text-white"
      : "bg-accent hover:bg-accent-dim text-bg";
  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <Link
        href="/book"
        className={`inline-block ${styles} font-heading text-lg sm:text-xl tracking-wide px-10 py-4 rounded-lg transition-colors duration-150`}
      >
        {label}
      </Link>
    </div>
  );
}
