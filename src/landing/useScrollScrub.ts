import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Higher = the video catches up with the scroll faster. */
const SMOOTHING = 9;
/** Below this distance the animation snaps to the target and the loop goes to sleep. */
const SETTLE = 0.0004;
/** Progress at which the door is considered open and the visitor is let in. */
const ENTER_AT = 0.985;
/** The clip is 24 fps and every frame is a keyframe, so seeks are cheap and frame-exact. */
const HALF_FRAME = 1 / 48;
const END_GUARD = 0.04;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface ScrubOptions {
  /** When false the hook does nothing (reduced motion, data saver, broken video). */
  enabled: boolean;
  /** Tall element whose scroll distance drives the video. */
  trackRef: RefObject<HTMLElement>;
  /** Sticky child of the track; the track scrolls by `track height - stage height`. */
  stageRef: RefObject<HTMLElement>;
  videoRef: RefObject<HTMLVideoElement>;
  /** Called on every animation frame with the smoothed progress (0..1). Write to the DOM directly, never to React state. */
  onFrame: (progress: number) => void;
  /** Called once when the door has opened. */
  onEnter: () => void;
}

/**
 * Scroll-scrubbed video.
 *
 * Interface: pass refs, receive `onFrame(progress)` and `onEnter()`; get back `glideToEnd`.
 * Everything else lives here:
 *  - one passive scroll listener; the rAF loop only runs while the video is catching up;
 *  - exponential smoothing, independent of the display's refresh rate;
 *  - at most one in-flight seek: while the decoder is busy the newest target is remembered and
 *    applied on `seeked`, so the clip never queues stale frames.
 */
export function useScrollScrub({ enabled, trackRef, stageRef, videoRef, onFrame, onEnter }: ScrubOptions) {
  const onFrameRef = useRef(onFrame);
  const onEnterRef = useRef(onEnter);
  const glideRef = useRef<() => void>(() => {});

  useEffect(() => {
    onFrameRef.current = onFrame;
    onEnterRef.current = onEnter;
  });

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!enabled || !track || !stage || !video) return;

    let range = 1;
    let target = 0;
    let current = 0;
    let raf = 0;
    let last = 0;
    let entered = false;

    const measure = () => {
      range = Math.max(1, track.offsetHeight - stage.offsetHeight);
    };

    const seek = () => {
      const { duration } = video;
      if (!Number.isFinite(duration) || duration <= 0 || video.seeking) return;
      const time = clamp01(current) * (duration - END_GUARD);
      if (Math.abs(video.currentTime - time) > HALF_FRAME) video.currentTime = time;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      current += (target - current) * (1 - Math.exp(-dt * SMOOTHING));
      if (Math.abs(target - current) < SETTLE) current = target;

      seek();
      onFrameRef.current(current);

      if (!entered && current >= ENTER_AT) {
        entered = true;
        onEnterRef.current();
        return;
      }
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || entered) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const readScroll = () => {
      target = clamp01((window.scrollY - track.offsetTop) / range);
      wake();
    };

    const onSeeked = () => {
      seek();
    };

    // Smooth, interruptible auto-scroll used by the "Entrar" button.
    let glideRaf = 0;
    const stopGlide = () => {
      cancelAnimationFrame(glideRaf);
      glideRaf = 0;
      window.removeEventListener('wheel', stopGlide);
      window.removeEventListener('touchstart', stopGlide);
      window.removeEventListener('keydown', stopGlide);
    };
    glideRef.current = () => {
      stopGlide();
      const from = window.scrollY;
      const to = track.offsetTop + range;
      const duration = 5200 * clamp01((to - from) / range) + 400;
      const start = performance.now();
      const step = (now: number) => {
        const t = clamp01((now - start) / duration);
        window.scrollTo(0, from + (to - from) * easeInOutCubic(t));
        if (t < 1) glideRaf = requestAnimationFrame(step);
        else stopGlide();
      };
      window.addEventListener('wheel', stopGlide, { passive: true });
      window.addEventListener('touchstart', stopGlide, { passive: true });
      window.addEventListener('keydown', stopGlide);
      glideRaf = requestAnimationFrame(step);
    };

    // Prime the decoder: iOS ignores seeks on a video that has never played.
    const prime = () => {
      void video.play().then(() => video.pause()).catch(() => {});
    };

    measure();
    // Start where the page already is (reloads restore the scroll position): no catch-up tween.
    current = target = clamp01((window.scrollY - track.offsetTop) / range);
    onFrameRef.current(current);

    const resize = new ResizeObserver(() => {
      measure();
      readScroll();
    });
    resize.observe(track);
    window.addEventListener('scroll', readScroll, { passive: true });
    video.addEventListener('seeked', onSeeked);
    const onMetadata = () => {
      seek();
      prime();
    };
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();
    else video.addEventListener('loadedmetadata', onMetadata, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      stopGlide();
      glideRef.current = () => {};
      resize.disconnect();
      window.removeEventListener('scroll', readScroll);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
    };
  }, [enabled, trackRef, stageRef, videoRef]);

  return { glideToEnd: useCallback(() => glideRef.current(), []) };
}
