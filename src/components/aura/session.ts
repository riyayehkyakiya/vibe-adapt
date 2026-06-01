export type PhaseKey = "settle" | "activate" | "flow" | "release";

export interface PhaseOrbColors {
  primary: string;
  glow: string;
}

export interface PhaseTrackConfig {
  trackName: string;
  artist: string;
  type: string;
  lyricalDensity: string;
  orbColor: PhaseOrbColors;
}

export const PHASE_KEYS: PhaseKey[] = ["settle", "activate", "flow", "release"];

export const PHASE_ORCHESTRATION: Record<PhaseKey, string> = {
  settle:
    "Introducing low-density ambient texture to decompress cognitive load.",
  activate:
    "Introducing familiar melodic structure to gently increase engagement.",
  flow:
    "Reducing lyrical density to protect sustained concentration.",
  release:
    "Reintroducing emotionally resonant tracks as your session closes.",
};

export const ARC_PATH =
  "M 10,75 C 50,75 70,15 130,15 S 210,55 260,50 S 330,65 390,60";

export const ARC_VIEWBOX = "0 0 400 80";

type Point = { x: number; y: number };

const ARC_SEG1 = {
  p0: { x: 10, y: 75 },
  p1: { x: 50, y: 75 },
  p2: { x: 70, y: 15 },
  p3: { x: 130, y: 15 },
};

const ARC_SEG2 = {
  p0: { x: 130, y: 15 },
  p1: { x: 180, y: 15 },
  p2: { x: 210, y: 55 },
  p3: { x: 260, y: 50 },
};

const ARC_SEG3 = {
  p0: { x: 260, y: 50 },
  p1: { x: 295, y: 45 },
  p2: { x: 330, y: 65 },
  p3: { x: 390, y: 60 },
};

export function getPointOnCubicBezier(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

export function getArcDotPosition(phase: PhaseKey): Point {
  switch (phase) {
    case "settle":
      return getPointOnCubicBezier(0.08, ARC_SEG1.p0, ARC_SEG1.p1, ARC_SEG1.p2, ARC_SEG1.p3);
    case "activate":
      return getPointOnCubicBezier(0.5, ARC_SEG2.p0, ARC_SEG2.p1, ARC_SEG2.p2, ARC_SEG2.p3);
    case "flow":
      return getPointOnCubicBezier(0.3, ARC_SEG3.p0, ARC_SEG3.p1, ARC_SEG3.p2, ARC_SEG3.p3);
    case "release":
      return getPointOnCubicBezier(0.95, ARC_SEG3.p0, ARC_SEG3.p1, ARC_SEG3.p2, ARC_SEG3.p3);
  }
}

export type AdaptCopyKind = "focus" | "emotional" | "energy" | "sleep";

export function getAdaptCopyKind(session: SessionConfig): AdaptCopyKind {
  if (session.title.includes("Midnight")) return "sleep";
  if (session.title.includes("High Energy")) return "energy";
  if (
    session.title.includes("Soft Reflection") ||
    session.title.includes("Decompression")
  ) {
    return "emotional";
  }
  return "focus";
}

const ADAPT_COPY: Record<
  AdaptCopyKind,
  { headline: string; subtext: string; bullets: string[] }
> = {
  focus: {
    headline: "Noticing signs of cognitive fatigue.",
    subtext:
      "Listening patterns suggest overstimulation. Aura is softly recalibrating your arc.",
    bullets: [
      "Softening transitions between tracks",
      "Emphasizing instrumental layers",
      "Lowering overall stimulation",
    ],
  },
  emotional: {
    headline: "Sensing emotional openness.",
    subtext:
      "Your listening suggests you're ready to go deeper. Aura is opening the arc with care.",
    bullets: [
      "Favoring vocal intimacy and space",
      "Slowing transitions between phases",
      "Keeping stimulation low and present",
    ],
  },
  energy: {
    headline: "Sensing a shift in energy.",
    subtext:
      "Your rhythm is changing. Aura is adjusting the intensity curve.",
    bullets: [
      "Maintaining rhythmic momentum",
      "Reducing abrupt drops between tracks",
      "Sustaining energy without overstimulation",
    ],
  },
  sleep: {
    headline: "Noticing a deepening calm.",
    subtext: "You're settling in. Aura is softening the remaining arc.",
    bullets: [
      "Reducing all sonic density",
      "Extending ambient transitions",
      "Preparing a soft exit",
    ],
  },
};

export function getAdaptCopy(session: SessionConfig) {
  return ADAPT_COPY[getAdaptCopyKind(session)];
}

export const ADAPT_ORB_COLORS: PhaseOrbColors = {
  primary: "#1a1000",
  glow: "#c4922a",
};

const PHASE_LABELS: [string, string, string, string] = ["Settle", "Activate", "Flow", "Release"];

function track(
  trackName: string,
  artist: string,
  type: string,
  lyricalDensity: string,
  orbColor: PhaseOrbColors,
): PhaseTrackConfig {
  return { trackName, artist, type, lyricalDensity, orbColor };
}

export interface SessionConfig {
  title: string;
  subtitle: string;
  duration: string;
  orbGlow: string;
  orbGlowOpacity: number;
  composingOrchestration: string;
  phases: Record<PhaseKey, PhaseTrackConfig>;
  phaseLabels: [string, string, string, string];
  orchestration: Record<PhaseKey, string>;
  intent: string;
  energyLabel: string;
  inputNarration: string;
  composingStatements: string[];
  adaptHeadline: string;
  adaptBody: string;
  adaptInsights: string[];
  adaptActions: string[];
  reflection: string;
  summaryLine: string;
  atmosphere: {
    input: string;
    composing: string;
    player: string;
    adapt: string;
    summary: string;
  };
}

/** @deprecated Use SessionConfig */
export type SessionProfile = SessionConfig;

const DEEP_FOCUS_RECOVERY_ARC: SessionConfig = {
  title: "Deep Focus Recovery Arc",
  subtitle: "45 min · 4 emotional phases",
  duration: "45 min",
  orbGlow: "#1a9e75",
  orbGlowOpacity: 1,
  composingOrchestration: "Designing a focus arc with gradual cognitive activation.",
  phases: {
    settle: track("Reflection (Ambient Edit)", "Brian Eno", "ambient", "none", {
      primary: "#0a0f1a",
      glow: "#2d6e6e",
    }),
    activate: track("Kerala", "Bonobo", "melodic", "low", {
      primary: "#0d3b4f",
      glow: "#1a9e75",
    }),
    flow: track("Awake", "Tycho", "instrumental", "none", {
      primary: "#0a1628",
      glow: "#1a6eb5",
    }),
    release: track("Tum Hi Ho", "Arijit Singh", "lyrical", "high", {
      primary: "#1a0f1a",
      glow: "#7b4a8b",
    }),
  },
  phaseLabels: PHASE_LABELS,
  orchestration: PHASE_ORCHESTRATION,
  intent: "Sustained focus",
  energyLabel: "Low → steady",
  inputNarration:
    "Aura is configuring your session for sustained focus with reduced lyrical density.",
  composingStatements: [
    "Designing a focus arc with gradual cognitive activation.",
    "Balancing recovery with sustained attention.",
    "Stabilizing emotional pacing.",
  ],
  adaptHeadline: "Noticing signs of cognitive fatigue.",
  adaptBody:
    "Listening patterns suggest overstimulation. Aura is softly recalibrating your arc.",
  adaptInsights: [
    "Shorter listens and quicker skips in the last few minutes.",
    "Your session may benefit from a calmer emotional lane.",
  ],
  adaptActions: [
    "Softening transitions between tracks",
    "Emphasizing instrumental layers",
    "Lowering overall stimulation",
  ],
  reflection:
    "You held deeper concentration after lower-intensity ambient transitions arrived mid-session.",
  summaryLine: "Today · 45 minutes · 4 emotional phases",
  atmosphere: {
    input:
      "radial-gradient(110% 55% at 50% 0%, oklch(0.17 0.04 230 / 0.5) 0%, oklch(0.09 0.015 240) 45%, oklch(0.05 0 0) 100%)",
    composing:
      "radial-gradient(70% 45% at 50% 30%, oklch(0.16 0.04 220 / 0.45) 0%, oklch(0.07 0.015 235) 55%, oklch(0.03 0 0) 100%)",
    player:
      "linear-gradient(180deg, oklch(0.16 0.04 235 / 0.35) 0%, oklch(0.09 0.02 250) 50%, oklch(0.04 0.01 240) 100%)",
    adapt:
      "linear-gradient(180deg, oklch(0.14 0.03 65 / 0.35) 0%, oklch(0.08 0.02 45) 55%, oklch(0.03 0.01 30) 100%)",
    summary:
      "linear-gradient(180deg, oklch(0.15 0.03 220 / 0.3) 0%, oklch(0.09 0.02 260) 55%, oklch(0.03 0 240) 100%)",
  },
};

const MIDNIGHT_RECOVERY_SESSION: SessionConfig = {
  title: "Midnight Recovery Session",
  subtitle: "40 min · 4 emotional phases",
  duration: "40 min",
  orbGlow: "#4a3f8b",
  orbGlowOpacity: 1,
  composingOrchestration: "Building a gradual descent into rest through softening sonic layers.",
  phases: {
    settle: track("Weightless", "Marconi Union", "ambient", "none", {
      primary: "#0a0f1a",
      glow: "#3d3568",
    }),
    activate: track("Night Owl", "Khruangbin", "melodic", "low", {
      primary: "#12102a",
      glow: "#4a3f8b",
    }),
    flow: track("Says", "Nils Frahm", "instrumental", "none", {
      primary: "#0c1020",
      glow: "#5a4a9a",
    }),
    release: track("The Night Will Always Win", "Manchester Orchestra", "lyrical", "high", {
      primary: "#140f1c",
      glow: "#6b5a8b",
    }),
  },
  phaseLabels: PHASE_LABELS,
  orchestration: PHASE_ORCHESTRATION,
  intent: "Late-night calm",
  energyLabel: "Soft → still",
  inputNarration: "Aura is shaping a slow, low-light arc for rest without losing emotional warmth.",
  composingStatements: [
    "Building a gradual descent into rest through softening sonic layers.",
    "Easing the day out of the mix.",
    "Letting the night breathe.",
  ],
  adaptHeadline: "Sensing restlessness in a calm arc.",
  adaptBody:
    "Your listening suggests you may need even softer pacing. Aura is dimming the emotional brightness.",
  adaptInsights: [
    "Energy still slightly elevated for this hour.",
    "A gentler lane may help you settle.",
  ],
  adaptActions: [
    "Extending crossfades between tracks",
    "Favoring lower-register textures",
    "Lowering overall stimulation",
  ],
  reflection: "You settled into stillness as the arc leaned further into ambient space.",
  summaryLine: "Tonight · 40 minutes · 4 emotional phases",
  atmosphere: {
    input:
      "radial-gradient(110% 55% at 50% 0%, oklch(0.16 0.04 280 / 0.4) 0%, oklch(0.09 0.02 270) 45%, oklch(0.05 0 0) 100%)",
    composing:
      "radial-gradient(70% 45% at 50% 30%, oklch(0.15 0.04 285 / 0.4) 0%, oklch(0.07 0.02 270) 55%, oklch(0.03 0 0) 100%)",
    player:
      "linear-gradient(180deg, oklch(0.15 0.04 285 / 0.3) 0%, oklch(0.08 0.03 270) 50%, oklch(0.04 0.01 260) 100%)",
    adapt:
      "linear-gradient(180deg, oklch(0.14 0.03 300 / 0.3) 0%, oklch(0.08 0.02 280) 55%, oklch(0.03 0.01 270) 100%)",
    summary:
      "linear-gradient(180deg, oklch(0.14 0.03 285 / 0.35) 0%, oklch(0.08 0.02 275) 55%, oklch(0.03 0 260) 100%)",
  },
};

const HIGH_ENERGY_RESET: SessionConfig = {
  title: "High Energy Reset",
  subtitle: "40 min · 4 emotional phases",
  duration: "40 min",
  orbGlow: "#c4922a",
  orbGlowOpacity: 1,
  composingOrchestration: "Building peak energy arc with rhythm-forward progression.",
  phases: {
    settle: track("Starboy", "The Weeknd", "melodic", "low", {
      primary: "#1a1408",
      glow: "#8b6914",
    }),
    activate: track("Levitating", "Dua Lipa", "melodic", "low", {
      primary: "#1a1200",
      glow: "#c4922a",
    }),
    flow: track("SICKO MODE", "Travis Scott", "instrumental", "none", {
      primary: "#140f00",
      glow: "#d4a030",
    }),
    release: track("Golden Hour", "JVKE", "lyrical", "high", {
      primary: "#1a1008",
      glow: "#c4922a",
    }),
  },
  phaseLabels: PHASE_LABELS,
  orchestration: PHASE_ORCHESTRATION,
  intent: "Motivated lift",
  energyLabel: "Rise → peak",
  inputNarration:
    "Aura is building a forward-moving arc with momentum that still leaves room to breathe.",
  composingStatements: [
    "Building peak energy arc with rhythm-forward progression.",
    "Finding the right entry tempo.",
    "Holding energy without overwhelm.",
  ],
  adaptHeadline: "Energy climbing faster than expected.",
  adaptBody: "Your pace suggests you're ready for more lift. Aura is opening the arc slightly.",
  adaptInsights: [
    "Engagement rising through the last segment.",
    "A brighter lane may match where you are.",
  ],
  adaptActions: [
    "Brightening harmonic color",
    "Tightening rhythmic forward motion",
    "Sustaining peak without harsh edges",
  ],
  reflection: "You rode the lift cleanly — momentum peaked without tipping into fatigue.",
  summaryLine: "Today · 40 minutes · 4 emotional phases",
  atmosphere: {
    input:
      "radial-gradient(110% 55% at 50% 0%, oklch(0.17 0.05 165 / 0.35) 0%, oklch(0.09 0.02 200) 45%, oklch(0.05 0 0) 100%)",
    composing:
      "radial-gradient(70% 45% at 50% 30%, oklch(0.16 0.05 170 / 0.35) 0%, oklch(0.07 0.02 210) 55%, oklch(0.03 0 0) 100%)",
    player:
      "linear-gradient(180deg, oklch(0.16 0.05 175 / 0.3) 0%, oklch(0.09 0.03 200) 50%, oklch(0.04 0.01 220) 100%)",
    adapt:
      "linear-gradient(180deg, oklch(0.15 0.04 80 / 0.3) 0%, oklch(0.08 0.02 55) 55%, oklch(0.03 0.01 40) 100%)",
    summary:
      "linear-gradient(180deg, oklch(0.15 0.04 25 / 0.25) 0%, oklch(0.09 0.02 200) 55%, oklch(0.03 0 220) 100%)",
  },
};

const EMOTIONAL_DECOMPRESSION_ARC: SessionConfig = {
  title: "Emotional Decompression Arc",
  subtitle: "50 min · 4 emotional phases",
  duration: "50 min",
  orbGlow: "#1a9e75",
  orbGlowOpacity: 0.6,
  composingOrchestration:
    "Prioritising emotional decompression before gradual re-engagement.",
  phases: {
    settle: track("Holocene", "Bon Iver", "ambient", "none", {
      primary: "#0a1210",
      glow: "#1a9e75",
    }),
    activate: track("Comptine d'un autre été", "Yann Tiersen", "melodic", "low", {
      primary: "#0c1814",
      glow: "#1a9e75",
    }),
    flow: track("Experience", "Ludovico Einaudi", "instrumental", "none", {
      primary: "#0a1410",
      glow: "#1a9e75",
    }),
    release: track("The Night We Met", "Lord Huron", "lyrical", "high", {
      primary: "#101410",
      glow: "#2a8a6a",
    }),
  },
  phaseLabels: PHASE_LABELS,
  orchestration: PHASE_ORCHESTRATION,
  intent: "Burnout recovery",
  energyLabel: "High → ease",
  inputNarration:
    "Aura is unwinding stimulation gradually — making space to recover without going numb.",
  composingStatements: [
    "Prioritising emotional decompression before gradual re-engagement.",
    "Letting pressure leave the body of the mix.",
    "Making room to breathe again.",
  ],
  adaptHeadline: "Sensing residual tension.",
  adaptBody:
    "Listening patterns suggest you're still carrying weight. Aura is easing the arc further.",
  adaptInsights: [
    "Pacing may still feel slightly demanding.",
    "A slower emotional lane could help.",
  ],
  adaptActions: [
    "Stretching transitions between phases",
    "Reducing harmonic brightness",
    "Lowering overall stimulation",
  ],
  reflection: "You moved from tension into ease as the arc gradually opened up.",
  summaryLine: "Today · 50 minutes · 4 emotional phases",
  atmosphere: {
    input:
      "radial-gradient(110% 55% at 50% 0%, oklch(0.16 0.04 55 / 0.35) 0%, oklch(0.09 0.02 40) 45%, oklch(0.05 0 0) 100%)",
    composing:
      "radial-gradient(70% 45% at 50% 30%, oklch(0.15 0.04 50 / 0.35) 0%, oklch(0.07 0.02 35) 55%, oklch(0.03 0 0) 100%)",
    player:
      "linear-gradient(180deg, oklch(0.15 0.04 40 / 0.3) 0%, oklch(0.08 0.03 30) 50%, oklch(0.04 0.01 25) 100%)",
    adapt:
      "linear-gradient(180deg, oklch(0.14 0.03 70 / 0.28) 0%, oklch(0.08 0.02 50) 55%, oklch(0.03 0.01 35) 100%)",
    summary:
      "linear-gradient(180deg, oklch(0.14 0.03 35 / 0.3) 0%, oklch(0.08 0.02 25) 55%, oklch(0.03 0 20) 100%)",
  },
};

const SOFT_REFLECTION_SESSION: SessionConfig = {
  title: "Soft Reflection Session",
  subtitle: "35 min · 4 emotional phases",
  duration: "35 min",
  orbGlow: "#8b4a7b",
  orbGlowOpacity: 1,
  composingOrchestration: "Holding emotional space before gently guiding toward resolution.",
  phases: {
    settle: track("Falling", "Harry Styles", "melodic", "low", {
      primary: "#1a1014",
      glow: "#6b3a5a",
    }),
    activate: track("Fix You", "Coldplay", "melodic", "low", {
      primary: "#1a0f14",
      glow: "#8b4a7b",
    }),
    flow: track("Comptine d'un autre été", "Yann Tiersen", "instrumental", "none", {
      primary: "#140c12",
      glow: "#7b4a6b",
    }),
    release: track("Channa Mereya", "Arijit Singh", "lyrical", "high", {
      primary: "#1a0a10",
      glow: "#8b4a7b",
    }),
  },
  phaseLabels: PHASE_LABELS,
  orchestration: PHASE_ORCHESTRATION,
  intent: "Emotional space",
  energyLabel: "Tender → open",
  inputNarration:
    "Aura is holding space with warmth — no rush, no fix, just music that meets you where you are.",
  composingStatements: [
    "Holding emotional space before gently guiding toward resolution.",
    "Making room for what you're carrying.",
    "Letting the arc stay human.",
  ],
  adaptHeadline: "Sensing emotional openness.",
  adaptBody:
    "Your listening suggests you're ready to go deeper. Aura is opening the arc with care.",
  adaptInsights: [
    "Longer listens on quieter passages.",
    "A more intimate lane may resonate.",
  ],
  adaptActions: [
    "Favoring vocal intimacy and space",
    "Slowing transitions between phases",
    "Keeping stimulation low and present",
  ],
  reflection: "You stayed with the feeling — the arc held you without pushing toward a mood.",
  summaryLine: "Today · 35 minutes · 4 emotional phases",
  atmosphere: {
    input:
      "radial-gradient(110% 55% at 50% 0%, oklch(0.16 0.04 25 / 0.3) 0%, oklch(0.09 0.02 15) 45%, oklch(0.05 0 0) 100%)",
    composing:
      "radial-gradient(70% 45% at 50% 30%, oklch(0.15 0.04 20 / 0.3) 0%, oklch(0.07 0.02 10) 55%, oklch(0.03 0 0) 100%)",
    player:
      "linear-gradient(180deg, oklch(0.15 0.04 20 / 0.28) 0%, oklch(0.08 0.03 15) 50%, oklch(0.04 0.01 10) 100%)",
    adapt:
      "linear-gradient(180deg, oklch(0.14 0.03 30 / 0.28) 0%, oklch(0.08 0.02 20) 55%, oklch(0.03 0.01 15) 100%)",
    summary:
      "linear-gradient(180deg, oklch(0.14 0.03 25 / 0.3) 0%, oklch(0.08 0.02 280) 55%, oklch(0.03 0 260) 100%)",
  },
};

export const DEFAULT_SESSION = DEEP_FOCUS_RECOVERY_ARC;

export const ARC_DOT_ANIMATION_MS = 1200;

export type MiniPlayerPlayback = {
  session: SessionConfig;
  phaseKey: PhaseKey;
};

export function buildMiniPlayerPlayback(
  session: SessionConfig,
  phaseKey: PhaseKey = "release",
): MiniPlayerPlayback {
  return { session, phaseKey };
}

export function getSessionFromInput(input: string): SessionConfig {
  const t = input.toLowerCase();

  if (
    t.includes("gym") ||
    t.includes("workout") ||
    t.includes("energy") ||
    t.includes("motivated") ||
    t.includes("hype") ||
    t.includes("run") ||
    t.includes("training") ||
    t.includes("power") ||
    t.includes("pump")
  ) {
    return HIGH_ENERGY_RESET;
  }

  if (
    t.includes("sleep") ||
    t.includes("tired") ||
    t.includes("night") ||
    t.includes("calm") ||
    t.includes("rest") ||
    t.includes("bed") ||
    t.includes("wind down") ||
    t.includes("exhausted at night")
  ) {
    return MIDNIGHT_RECOVERY_SESSION;
  }

  if (
    t.includes("stress") ||
    t.includes("burnout") ||
    t.includes("overwhelmed") ||
    t.includes("anxious") ||
    t.includes("pressure") ||
    t.includes("burnt out") ||
    t.includes("too much") ||
    t.includes("breaking point") ||
    t.includes("breaking")
  ) {
    return EMOTIONAL_DECOMPRESSION_ARC;
  }

  if (
    t.includes("sad") ||
    t.includes("heartbreak") ||
    t.includes("lonely") ||
    t.includes("miss") ||
    t.includes("emotional") ||
    t.includes("crying") ||
    t.includes("hurt") ||
    t.includes("breakup") ||
    t.includes("lost") ||
    t.includes("feelings") ||
    t.includes("missing")
  ) {
    return SOFT_REFLECTION_SESSION;
  }

  if (
    t.includes("focus") ||
    t.includes("study") ||
    t.includes("work") ||
    t.includes("productivity") ||
    t.includes("concentrate") ||
    t.includes("deadline") ||
    t.includes("exam") ||
    t.includes("reading") ||
    t.includes("exhausted")
  ) {
    return DEEP_FOCUS_RECOVERY_ARC;
  }

  return DEEP_FOCUS_RECOVERY_ARC;
}

/** @deprecated Use getSessionFromInput */
export const resolveSession = getSessionFromInput;

export function composingOrbColors(session: SessionConfig): PhaseOrbColors {
  return { primary: "#0a0f1a", glow: session.orbGlow };
}

export const HOME_MOOD_PRESETS: Record<string, string> = {
  "Exhausted but need focus": "I'm exhausted but need to focus for 45 minutes.",
  "Late-night calm": "I need late-night calm to unwind before sleep.",
  "Gym recovery": "Gym recovery — I want energy without feeling wired.",
  "Recover after burnout": "Recovering after burnout — help me decompress gently.",
};

export const SUMMARY_METRICS = [
  { l: "FOCUS TIME", v: "42m", t: "sustained attention" },
  { l: "EFFECTIVENESS", v: "87%", t: "vs your baseline" },
  { l: "ADAPTATIONS", v: "3", t: "felt seamless" },
] as const;
