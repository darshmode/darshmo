import type { Metadata } from "next";
import Header from "@/components/Header";
import BookedVideo from "@/components/BookedVideo";

export const metadata: Metadata = {
  title: "You're booked in | MODE",
  // Confirmation page, only ever reached straight after booking, so keep it
  // out of search results.
  robots: { index: false, follow: false },
};

export default function BookedPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Header showBookButton={false} />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 sm:pt-14">
        <h1 className="font-heading text-3xl sm:text-4xl tracking-wide text-center">You&rsquo;re booked in.</h1>
        <p className="font-body text-muted text-center mt-3 mb-8">Watch this quick video before our call.</p>

        <BookedVideo />

        <p className="font-body text-sm text-muted text-center mt-8 max-w-md mx-auto">
          Need to change the time? Use the reschedule link in your confirmation email.
        </p>
      </div>
    </main>
  );
}
