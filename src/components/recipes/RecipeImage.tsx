import Image from "next/image";

/**
 * Drop a real photo in later by passing `src` (e.g. "/recipes/darshs-chicken-curry.jpg").
 * Until then this renders a plain placeholder instead of stock imagery.
 */
export default function RecipeImage({
  name,
  src,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  objectPosition = "center",
}: {
  name: string;
  src?: string;
  className?: string;
  /** Match this to the actual grid the image sits in, so the browser fetches the right resolution. */
  sizes?: string;
  /** CSS object-position, for the rare photo whose subject isn't centred in frame. */
  objectPosition?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-surface ${className}`}>
        <Image src={src} alt={name} fill className="object-cover" style={{ objectPosition }} sizes={sizes} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-surface via-bg to-surface border border-edge flex items-end ${className}`}
    >
      <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-[#E8862B]/20 via-transparent to-transparent" />
      <div className="relative p-5">
        <div className="font-heading text-sm sm:text-base tracking-wide text-fg">{name}</div>
        <div className="font-body text-xs text-muted mt-0.5">Photography coming soon</div>
      </div>
    </div>
  );
}
