import { useEffect, useRef, useState } from "react";
import { useIsPresent, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { entranceMedia } from "./invitation/entranceMedia";

export function InvitationOpening({
  onOpen,
  onStart,
  dissolveDuration,
}: {
  onOpen: () => void;
  onStart: () => void;
  dissolveDuration: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPresent = useIsPresent();
  const reducedMotion = useReducedMotion();
  const finished = useRef(false);
  const playbackRequested = useRef(false);
  const startupTimer = useRef<number | undefined>(undefined);
  const [phase, setPhase] = useState<"idle" | "starting" | "playing">("idle");

  useEffect(() => () => window.clearTimeout(startupTimer.current), []);

  const finishOpening = () => {
    if (finished.current) return;
    finished.current = true;
    window.clearTimeout(startupTimer.current);
    videoRef.current?.pause();
    onOpen();
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (!video || finished.current || playbackRequested.current) return;
    onStart();
    if (reducedMotion || video.error) {
      finishOpening();
      return;
    }
    video.playbackRate = 1;
    playbackRequested.current = true;
    setPhase("starting");
    startupTimer.current = window.setTimeout(finishOpening, 6500);
    // Remain inside the guest's gesture so inline playback works on Safari.
    void video.play().catch(finishOpening);
  };

  return (
    <m.section
      className="video-opening"
      data-phase={phase}
      aria-label="Wedding invitation opening"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dissolveDuration, ease: [0.4, 0, 0.2, 1] }}
    >
      <video
        ref={videoRef}
        className="envelope-video"
        src={entranceMedia.video}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
        aria-label="Wedding invitation opening video"
        onPlaying={() => {
          window.clearTimeout(startupTimer.current);
          setPhase("playing");
        }}
        onEnded={finishOpening}
        onError={() => {
          if (playbackRequested.current) finishOpening();
        }}
      />
      {phase !== "playing" && (
        <picture aria-hidden="true">
          <source type="image/avif" srcSet={entranceMedia.poster} />
          <img
            className="envelope-poster"
            src={entranceMedia.fallbackPoster}
            alt=""
            fetchPriority="high"
          />
        </picture>
      )}
      {phase === "idle" ? (
        <button
          type="button"
          className="envelope-open-trigger focus-ring"
          onClick={playVideo}
          disabled={!isPresent}
        >
          <span className="simple-open-label">Tap to open</span>
        </button>
      ) : (
        <button
          type="button"
          className="opening-skip focus-ring"
          onClick={finishOpening}
          disabled={!isPresent}
        >
          Skip animation
        </button>
      )}
    </m.section>
  );
}
