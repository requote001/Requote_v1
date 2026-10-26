import test from "node:test";
import assert from "node:assert/strict";
import {
  heroGuideAction,
  heroGuideControl,
  initialHeroGuidePlayback,
  canPlayHeroGuide,
  startHeroGuide,
} from "./hero-demo-guide.ts";

function fakeClock() {
  let now = 0,
    id = 0;
  const queue = new Map();
  return {
    schedule(callback, delay) {
      const handle = ++id;
      queue.set(handle, { at: now + delay, callback });
      return handle;
    },
    cancel(handle) {
      queue.delete(handle);
    },
    tick(delay) {
      const end = now + delay;
      while (true) {
        const next = [...queue.entries()]
          .filter(([, item]) => item.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        queue.delete(next[0]);
        next[1].callback();
      }
      now = end;
    },
    pending() {
      return queue.size;
    },
  };
}
const ready = {
  ready: true,
  reducedMotion: false,
  inView: true,
  pageVisible: true,
  finePointer: true,
  optedIn: false,
  pointerInside: false,
  keyboardFocus: false,
  paused: false,
};

test("page-load initialization enables the demo with either motion preference", () => {
  for (const reducedMotion of [false, true]) {
    const playback = initialHeroGuidePlayback(reducedMotion);
    assert.deepEqual(playback, {
      optedIn: true,
      motionOverride: reducedMotion,
      paused: false,
    });
    assert.equal(canPlayHeroGuide({ ...ready, reducedMotion, ...playback }), true);
    assert.equal(
      canPlayHeroGuide({ ...ready, finePointer: false, reducedMotion, ...playback }),
      true,
    );
  }
});
test("autoplay never bypasses hover, focus, explicit pause or visibility safeguards", () => {
  const autoplay = {
    ...ready,
    reducedMotion: true,
    ...initialHeroGuidePlayback(true),
  };
  for (const key of ["pointerInside", "keyboardFocus", "paused"])
    assert.equal(canPlayHeroGuide({ ...autoplay, [key]: true }), false);
  for (const key of ["ready", "inView", "pageVisible"])
    assert.equal(canPlayHeroGuide({ ...autoplay, [key]: false }), false);
  assert.equal(canPlayHeroGuide({ ...autoplay, motionOverride: false }), false);
});

test("motion opt-in control is offered only for a confirmed reduced-motion preference", () => {
  assert.equal(
    heroGuideControl({
      ready: false,
      reducedMotion: true,
      motionOverride: false,
      requested: true,
    }),
    null,
  );
  assert.equal(
    heroGuideControl({
      ready: true,
      reducedMotion: false,
      motionOverride: false,
      requested: true,
    }).mode,
    "pause",
  );
  assert.equal(
    heroGuideControl({
      ready: true,
      reducedMotion: false,
      motionOverride: false,
      requested: false,
    }).mode,
    "play",
  );
  assert.equal(
    heroGuideControl({
      ready: true,
      reducedMotion: true,
      motionOverride: false,
      requested: true,
    }).mode,
    "enable-motion",
  );
});
test("the demo-only override never bypasses interaction or visibility pauses", () => {
  const consented = { ...ready, reducedMotion: true, motionOverride: true };
  assert.equal(
    canPlayHeroGuide({ ...consented, motionOverride: false }),
    false,
  );
  assert.equal(canPlayHeroGuide(consented), true);
  for (const key of ["pointerInside", "keyboardFocus", "paused"])
    assert.equal(canPlayHeroGuide({ ...consented, [key]: true }), false);
  for (const key of ["inView", "pageVisible"])
    assert.equal(canPlayHeroGuide({ ...consented, [key]: false }), false);
  assert.equal(
    canPlayHeroGuide({ ...consented, finePointer: false, optedIn: true }),
    true,
  );
});
test("autoplay shows no Disable motion button and can restart after pausing", () => {
  assert.equal(
    heroGuideControl({
      ready: true,
      reducedMotion: true,
      motionOverride: true,
      requested: true,
    }),
    null,
  );
  assert.equal(
    heroGuideControl({
      ready: true,
      reducedMotion: true,
      motionOverride: true,
      requested: false,
    }).mode,
    "enable-motion",
  );
  assert.equal(
    canPlayHeroGuide({ ...ready, reducedMotion: true, motionOverride: false }),
    false,
  );
});

test("hero guide advances through existing controls and loops back to Request", () => {
  assert.deepEqual(heroGuideAction(0), {
    phase: 0,
    nextPhase: 1,
    target: "next",
  });
  assert.deepEqual(heroGuideAction(1), {
    phase: 1,
    nextPhase: 2,
    target: "next",
  });
  assert.deepEqual(heroGuideAction(2), {
    phase: 2,
    nextPhase: 0,
    target: "request",
  });
  assert.equal(heroGuideAction(NaN).phase, 0);
});
test("interaction, explicit pause, hidden page and reduced motion all prevent playback", () => {
  assert.equal(canPlayHeroGuide(ready), true);
  for (const key of [
    "reducedMotion",
    "pointerInside",
    "keyboardFocus",
    "paused",
  ])
    assert.equal(canPlayHeroGuide({ ...ready, [key]: true }), false, key);
  for (const key of ["ready", "inView", "pageVisible"])
    assert.equal(canPlayHeroGuide({ ...ready, [key]: false }), false, key);
});
test("coarse-pointer playback requires initialization or the Play control", () => {
  assert.equal(canPlayHeroGuide({ ...ready, finePointer: false }), false);
  assert.equal(
    canPlayHeroGuide({ ...ready, finePointer: false, optedIn: true }),
    true,
  );
  assert.equal(
    canPlayHeroGuide({
      ...ready,
      finePointer: false,
      optedIn: true,
      reducedMotion: true,
    }),
    false,
  );
});
test("the cursor visibly aims and clicks before any example changes", () => {
  const clock = fakeClock(),
    beats = [];
  let phase = 0;
  const stop = startHeroGuide({
    clock,
    readPhase: () => phase,
    onBeat: (beat, action) => {
      beats.push(beat);
      if (beat === "advance") phase = action.nextPhase;
    },
  });
  assert.deepEqual(beats, ["wake"]);
  clock.tick(4049);
  assert.equal(phase, 0);
  assert.deepEqual(beats, ["wake", "read", "scan", "aim"]);
  clock.tick(1);
  assert.equal(beats.at(-1), "click");
  assert.equal(phase, 0);
  clock.tick(200);
  assert.equal(phase, 1);
  stop();
  assert.equal(clock.pending(), 0);
});
test("hover cancellation clears every pending click and transition", () => {
  const clock = fakeClock(),
    beats = [];
  const stop = startHeroGuide({
    clock,
    readPhase: () => 0,
    onBeat: (beat) => beats.push(beat),
  });
  clock.tick(3500);
  stop();
  clock.tick(30000);
  assert.equal(beats.includes("click"), false);
  assert.equal(beats.includes("advance"), false);
  assert.equal(clock.pending(), 0);
});
test("resuming wakes once and continues from the visitor’s chosen phase", () => {
  const clock = fakeClock(),
    beats = [];
  let phase = 2;
  const stop = startHeroGuide({
    clock,
    readPhase: () => phase,
    onBeat: (beat, action) => {
      beats.push({ beat, target: action.target });
      if (beat === "advance") phase = action.nextPhase;
    },
  });
  clock.tick(7100);
  assert.equal(phase, 0);
  assert.equal(beats.filter((item) => item.beat === "wake").length, 1);
  assert.equal(beats.find((item) => item.beat === "click").target, "request");
  stop();
});
test("stale actions cannot overwrite a phase changed by the visitor", () => {
  const clock = fakeClock();
  let phase = 0,
    advances = 0;
  const stop = startHeroGuide({
    clock,
    readPhase: () => phase,
    onBeat: (beat) => {
      if (beat === "advance") advances++;
    },
  });
  clock.tick(3100);
  phase = 2;
  clock.tick(1200);
  assert.equal(advances, 0);
  stop();
});
test("the guide completes repeat cycles without accumulating timers", () => {
  const clock = fakeClock();
  let phase = 0,
    count = 0;
  const stop = startHeroGuide({
    clock,
    readPhase: () => phase,
    onBeat: (beat, action) => {
      if (beat === "advance") {
        phase = action.nextPhase;
        count++;
      }
    },
  });
  clock.tick(21000);
  assert.equal(count, 3);
  assert.equal(phase, 0);
  assert.ok(clock.pending() <= 7);
  stop();
  stop();
  assert.equal(clock.pending(), 0);
});
