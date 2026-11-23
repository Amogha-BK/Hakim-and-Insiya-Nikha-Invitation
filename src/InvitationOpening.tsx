import { useEffect, useRef, useState } from "react";
import { useIsPresent, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { entranceMedia } from "./invitation/entranceMedia";
import { useInvitation } from "./invitation/InvitationContext";

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
  const { display, media, city } = useInvitation();
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
      className={`video-opening${media.coverUrl ? " has-invitation-cover" : ""}`}
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
      {phase !== "playing" && media.coverUrl && (
        <div className="invitation-cover">
          <picture className="invitation-cover-wide">
            <source media="(min-width: 601px)" srcSet={media.coverUrl} />
            <img alt={`${display.names.join(" and ")}’s wedding invitation`} width="1200" height="630" fetchPriority="high" />
          </picture>
          <div className="invitation-cover-mobile">
            <div className="invitation-cover-copy">
              <p className="invitation-cover-kicker">Wedding Invitation</p>
              <p className="invitation-cover-names">{display.names.join(" & ")}</p>
              <p className="invitation-cover-date">Nikah · {display.wedding.full} · {city}</p>
            </div>
            <div className="invitation-cover-portrait">
              <img src={media.portraitUrl} alt="" width="375" height="533" fetchPriority="high" />
            </div>
          </div>
        </div>
      )}
      {phase !== "playing" && !media.coverUrl && (
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
          className={`${media.coverUrl ? "invitation-cover-button" : "envelope-open-trigger"} focus-ring`}
          onClick={playVideo}
          disabled={!isPresent}
        >
          <span className={media.coverUrl ? undefined : "simple-open-label"}>Open invitation</span>
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
