"use client";

import { useRef, useState } from "react";

/**
 * Vertical (9:16) player for the post-booking video.
 *
 * Deliberately does not autoplay: browsers only allow autoplay when muted,
 * and this clip is meant to be heard. The poster frame plus an explicit play
 * button means the first play is a real user gesture, so it starts with sound.
 */
export default function BookedVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play();
  }

  return (
    <div className="relative mx-auto w-full max-w-[22rem] aspect-[9/16] overflow-hidden rounded-2xl border border-edge bg-black">
      <video
        ref={videoRef}
        src="/videos/post-sign-up-video.mp4"
        poster="/videos/posters/post-sign-up-video.jpg"
        controls
        playsInline
        preload="metadata"
        onPlay={() => setStarted(true)}
        className="h-full w-full object-cover"
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8862B] shadow-lg transition-colors duration-150 hover:bg-[#D1751F]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
