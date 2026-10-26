/** Illustration timing only. Never dispatches DOM clicks, focuses controls, or submits data. */
export type HeroGuideBeat =
  "wake" | "read" | "scan" | "aim" | "click" | "advance" | "retreat";
export function heroGuideAction(phase: number) {
  const current =
    Number.isInteger(phase) && phase >= 0 && phase < 3 ? phase : 0;
  return {
    phase: current,
    nextPhase: (current + 1) % 3,
    target: current === 2 ? "request" : "next",
  } as const;
}
export type HeroGuideConditions = {
  ready: boolean;
  reducedMotion: boolean;
  motionOverride?: boolean;
  inView: boolean;
  pageVisible: boolean;
  finePointer: boolean;
  optedIn: boolean;
  pointerInside: boolean;
  keyboardFocus: boolean;
  paused: boolean;
};
/** Product-selected autoplay for this demo only; never changes device settings. */
export function initialHeroGuidePlayback(reducedMotion: boolean) {
  return { optedIn: true, motionOverride: reducedMotion, paused: false };
}
export function canPlayHeroGuide(state: HeroGuideConditions) {
  return (
    state.ready &&
    (!state.reducedMotion || state.motionOverride === true) &&
    state.inView &&
    state.pageVisible &&
    (state.finePointer || state.optedIn) &&
    !state.pointerInside &&
    !state.keyboardFocus &&
    !state.paused
  );
}

export function heroGuideControl({
  ready,
  reducedMotion,
  motionOverride,
  requested,
}: {
  ready: boolean;
  reducedMotion: boolean;
  motionOverride: boolean;
  requested: boolean;
}) {
  if (!ready) return null;
  if (reducedMotion)
    return motionOverride && requested
      ? null
      : ({
          mode: "enable-motion",
          label: "Enable demo motion",
          text: "Enable motion",
          active: false,
        } as const);
  return requested
    ? ({
        mode: "pause",
        label: "Pause demo animation",
        text: "Pause demo",
        active: true,
      } as const)
    : ({
        mode: "play",
        label: "Play demo animation",
        text: "Play demo",
        active: false,
      } as const);
}
type Action = ReturnType<typeof heroGuideAction>;
type Clock = {
  schedule: (callback: () => void, delay: number) => unknown;
  cancel: (handle: unknown) => void;
};
export function startHeroGuide({
  readPhase,
  onBeat,
  clock = {
    schedule: (callback, delay) => setTimeout(callback, delay),
    cancel: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
  },
}: {
  readPhase: () => number;
  onBeat: (beat: HeroGuideBeat, action: Action) => void;
  clock?: Clock;
}) {
  let stopped = false;
  const timers = new Set<unknown>();
  function later(callback: () => void, delay: number) {
    const handle = clock.schedule(() => {
      timers.delete(handle);
      if (!stopped) callback();
    }, delay);
    timers.add(handle);
  }
  function cycle(wake = false) {
    if (stopped) return;
    const action = heroGuideAction(readPhase());
    onBeat(wake ? "wake" : "read", action);
    if (stopped) return;
    if (wake) later(() => onBeat("read", action), 700);
    later(() => onBeat("scan", action), 2100);
    later(() => onBeat("aim", action), 3000);
    later(() => onBeat("click", action), 4050);
    later(() => {
      if (readPhase() === action.phase) onBeat("advance", action);
    }, 4250);
    later(() => onBeat("retreat", action), 4700);
    later(() => cycle(), 7100);
  }
  cycle(true);
  return () => {
    stopped = true;
    timers.forEach((handle) => clock.cancel(handle));
    timers.clear();
  };
}
