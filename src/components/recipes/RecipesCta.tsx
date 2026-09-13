import Link from "next/link";

export default function RecipesCta() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
      <h2 className="font-heading text-2xl sm:text-3xl text-fg tracking-wide leading-snug mb-8">
        Want to enjoy food like this while getting into the best shape of your life?
      </h2>
      <Link
        href="/book"
        className="inline-block bg-[#E8862B] hover:bg-[#D1751F] text-white font-heading text-lg sm:text-xl tracking-wide px-10 py-4 rounded-lg transition-colors duration-150"
      >
        Work with Darsh &rarr;
      </Link>
    </div>
  );
}
