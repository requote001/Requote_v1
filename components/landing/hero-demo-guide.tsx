"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  canPlayHeroGuide,
  heroGuideControl,
  initialHeroGuidePlayback,
  startHeroGuide,
} from "@/lib/hero-demo-guide";
import "./hero-demo-guide.css";

export function HeroDemoGuide({
  phase,
  onPhaseChange,
  children,
}: {
  phase: number;
  onPhaseChange: (phase: number) => void;
  children: (playbackControl: ReactNode) => ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  const stopRef = useRef<(() => void) | null>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const [environment, setEnvironment] = useState({
    ready: false,
    reducedMotion: true,
    finePointer: false,
    pageVisible: false,
  });
  const [inView, setInView] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [paused, setPaused] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const requested = !paused && (environment.finePointer || optedIn);
  const playing = canPlayHeroGuide({
    ...environment,
    inView,
    pointerInside,
    keyboardFocus,
    paused,
    optedIn,
    motionOverride,
  });

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      setEnvironment({
        ready: true,
        reducedMotion: motion.matches,
        finePointer: pointer.matches,
        pageVisible: document.visibilityState === "visible",
      });
      setPointerInside(pointer.matches && element.matches(":hover"));
      if (document.hidden) stopRef.current?.();
    };
    const motionChanged = () => {
      stopRef.current?.();
      setMotionOverride(false);
      update();
    };
    function enableMotionOnLoad() {
      const playback = initialHeroGuidePlayback(motion.matches);
      setOptedIn(playback.optedIn);
      setMotionOverride(playback.motionOverride);
      setPaused(playback.paused);
      update();
    }
    // Initialize once, not on visibility/pointer updates that must preserve Pause.
    const frame = requestAnimationFrame(enableMotionOnLoad);
    motion.addEventListener("change", motionChanged);
    pointer.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible =
          entries[0]?.isIntersecting === true &&
          entries[0].intersectionRatio >= 0.35;
        if (!visible) stopRef.current?.();
        setInView(visible);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      stopRef.current?.();
      motion.removeEventListener("change", motionChanged);
      pointer.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    const element = stage.current,
      arrow = cursor.current;
    if (!playing || !element || !arrow) return;
    function position(x: number, y: number, duration = 850) {
      const point = {
        x: Math.max(10, Math.min(element!.clientWidth - 36, x)),
        y: Math.max(10, Math.min(element!.clientHeight - 35, y)),
      };
      arrow!.style.transitionDuration = duration + "ms";
      arrow!.style.setProperty("--rq-guide-glide", duration + "ms");
      arrow!.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
      lastPosition.current = point;
    }
    function targetCentre(name: string) {
      const target = element!.querySelector<HTMLElement>(
        `[data-guide-target="${name}"]`,
      );
      if (!target) return null;
      // Layout offsets keep the cursor aligned inside the same rotated card.
      let x = target.offsetWidth * 0.55,
        y = target.offsetHeight * 0.55;
      let node: HTMLElement | null = target;
      while (node && node !== element) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return node === element ? { x: x - 3, y: y - 3 } : null;
    }
    const previous = lastPosition.current;
    position(
      previous?.x ?? element.clientWidth * 0.79,
      previous?.y ?? element.clientHeight * 0.5,
      0,
    );
    arrow.dataset.positioned = "true";
    const stop = startHeroGuide({
      readPhase: () => phaseRef.current,
      onBeat: (beat, action) => {
        arrow.dataset.beat = beat;
        element.dataset.guideBeat = beat;
        element.dataset.guideActiveTarget = action.target;
        if (beat === "scan")
          position(
            element.clientWidth * 0.47,
            element.clientHeight * 0.43,
            850,
          );
        if (beat === "aim") {
          const centre = targetCentre(action.target);
          if (centre) position(centre.x, centre.y, 900);
        }
        if (beat === "advance") {
          phaseRef.current = action.nextPhase;
          onPhaseChange(action.nextPhase);
        }
        if (beat === "retreat")
          position(element.clientWidth * 0.8, element.clientHeight * 0.48, 850);
      },
    });
    const cancel = () => {
      stop();
      // Freeze a partially finished glide, so waking never jumps back to its destination.
      const transform = getComputedStyle(arrow).transform;
      if (transform && transform !== "none") {
        const matrix = new DOMMatrixReadOnly(transform);
        lastPosition.current = { x: matrix.m41, y: matrix.m42 };
        position(matrix.m41, matrix.m42, 0);
      }
      delete element.dataset.guideBeat;
      delete element.dataset.guideActiveTarget;
      delete arrow.dataset.beat;
    };
    stopRef.current = cancel;
    return () => {
      cancel();
      if (stopRef.current === cancel) stopRef.current = null;
    };
  }, [playing, onPhaseChange, environment.reducedMotion, motionOverride]);

  const control = heroGuideControl({
    ...environment,
    motionOverride,
    requested,
  });
  const playbackControl = control ? (
    <button
      className="rq-guide__toggle"
      data-guide-playback
      type="button"
      aria-label={control.label}
      title={
        environment.reducedMotion
          ? "Enable motion for this demo only; other page animations still respect reduced motion."
          : undefined
      }
      onClick={() => {
        stopRef.current?.();
        if (control.mode === "pause") setPaused(true);
        else {
          if (control.mode === "enable-motion") setMotionOverride(true);
          setOptedIn(true);
          setPaused(false);
          setKeyboardFocus(false);
        }
      }}
    >
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        {control.active ? (
          <path d="M4 3h3v10H4zm5 0h3v10H9z" />
        ) : (
          <path d="m5 3 8 5-8 5z" />
        )}
      </svg>
      {control.text}
    </button>
  ) : null;

  return (
    <div
      className="rq-guided-demo"
      ref={stage}
      data-guide-playing={playing}
      data-guide-paused={paused}
      data-guide-motion-override={environment.reducedMotion && motionOverride}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") {
          stopRef.current?.();
          setPointerInside(true);
        }
      }}
      onPointerLeave={() => setPointerInside(false)}
      onPointerDown={(event) => {
        setKeyboardFocus(false);
        if (
          event.pointerType === "touch" &&
          !(event.target as HTMLElement).closest("[data-guide-playback]")
        ) {
          stopRef.current?.();
          setPaused(true);
        }
      }}
      onFocusCapture={(event) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          stopRef.current?.();
          setKeyboardFocus(true);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setKeyboardFocus(false);
      }}
      onKeyDownCapture={(event) => {
        if (event.key === "Escape") {
          stopRef.current?.();
          setPaused(true);
        } else if (
          !(event.target as HTMLElement).closest("[data-guide-playback]")
        ) {
          stopRef.current?.();
          setKeyboardFocus(true);
        }
      }}
    >
      {children(playbackControl)}
      <div className="rq-guide__cursor-layer" aria-hidden="true">
        <div className="rq-guide-cursor" ref={cursor}>
          <span className="rq-guide-cursor__body">
            <svg width="31" height="35" viewBox="0 0 31 35" fill="none">
              <path
                d="m3 2 24 16-11 2-5 11L3 2Z"
                fill="var(--rq-blue)"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="m16 20 6 10"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="m16 20 6 10"
                stroke="var(--rq-blue)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="rq-guide-cursor__ripple" />
        </div>
      </div>
    </div>
  );
}
