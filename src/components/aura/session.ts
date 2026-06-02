export type PhaseKey = "settle" | "activate" | "flow" | "release";
export type LyricalDensity = "none" | "low" | "medium" | "high";
export type Point = { x: number; y: number };

export interface PhaseOrbColors {
  primary: string;
  glow: string;
}

export interface PhaseConfig {
  name: string;
  trackName: string;
  artist: string;
  lyricalDensity: LyricalDensity;
  orbOpacity: number;
  orchestrationCopy: string;
}

export interface SessionConfig {
  sessionName: string;
  orbGlow: string;
  arcPath: string;
  subtitle: string;
  phases: [PhaseConfig, PhaseConfig, PhaseConfig, PhaseConfig];
  duration: string;
  sessionIncludes: [string, string, string, string];
  orbGlowOpacity: number;
  composingOrchestration: string;
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

export const PHASE_KEYS: PhaseKey[] = ["settle", "activate", "flow", "release"];
export const ARC_VIEWBOX = "0 0 400 80";
export const ARC_PATH = "M 10,75 C 50,75 70,15 130,15 S 210,55 260,50 S 330,65 390,60";
export const ARC_DOT_ANIMATION_MS = 1200;

type BezierSegment = { p0: Point; p1: Point; p2: Point; p3: Point };

function phase(
  name: string,
  trackName: string,
  artist: string,
  lyricalDensity: LyricalDensity,
  orbOpacity: number,
  orchestrationCopy: string,
): PhaseConfig {
  return { name, trackName, artist, lyricalDensity, orbOpacity, orchestrationCopy };
}

function baseAtmosphere(accent = 220): SessionConfig["atmosphere"] {
  return {
    input: `radial-gradient(110% 55% at 50% 0%, oklch(0.17 0.04 ${accent} / 0.45) 0%, oklch(0.09 0.02 ${accent}) 45%, oklch(0.05 0 0) 100%)`,
    composing: `radial-gradient(70% 45% at 50% 30%, oklch(0.16 0.04 ${accent} / 0.35) 0%, oklch(0.07 0.02 ${accent}) 55%, oklch(0.03 0 0) 100%)`,
    player: `linear-gradient(180deg, oklch(0.16 0.04 ${accent} / 0.32) 0%, oklch(0.09 0.03 ${accent}) 50%, oklch(0.04 0.01 ${accent}) 100%)`,
    adapt: `linear-gradient(180deg, oklch(0.15 0.04 ${accent} / 0.3) 0%, oklch(0.08 0.02 ${accent}) 55%, oklch(0.03 0.01 ${accent}) 100%)`,
    summary: `linear-gradient(180deg, oklch(0.15 0.04 ${accent} / 0.28) 0%, oklch(0.09 0.02 ${accent}) 55%, oklch(0.03 0 ${accent}) 100%)`,
  };
}

const GOLDEN_HOUR_LIFT: SessionConfig = {
  sessionName: "Golden Hour Lift",
  orbGlow: "#f5c842",
  arcPath: "M 10,65 C 50,65 80,30 130,20 S 200,15 260,15 S 330,18 390,15",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Open", "A Walk", "Tycho", "none", 0.6, "Creating space for joy to expand naturally."),
    phase("Rise", "Electric Feel", "MGMT", "medium", 0.75, "Amplifying energy with familiar melodic momentum."),
    phase("Float", "A Moment Apart", "ODESZA", "low", 0.85, "Sustaining peak energy with atmospheric lift."),
    phase("Radiate", "Yellow", "Coldplay", "high", 1, "Releasing into full emotional warmth and resonance."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Uplifting melodic arc",
    "Progressive brightness",
    "Familiar energetic tracks",
    "Full emotional release",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Building a bright, expansive emotional rise.",
  intent: "Uplifted joy",
  energyLabel: "Mid → high",
  inputNarration: "Aura is shaping an expansive arc that ends higher than it starts.",
  composingStatements: [
    "Creating space for joy to expand naturally.",
    "Amplifying energy with familiar melodic momentum.",
    "Sustaining peak energy with atmospheric lift.",
  ],
  adaptHeadline: "Sensing elevated positive momentum.",
  adaptBody: "Aura is preserving your lift while keeping transitions smooth.",
  adaptInsights: ["Emotional pacing is expansive and progressive.", "The arc remains elevated through the release phase."],
  adaptActions: ["Maintain warm brightness", "Protect upward trajectory", "Avoid abrupt drops"],
  reflection: "The session moved steadily upward and closed with full warmth.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(85),
};

const SOFT_REFLECTION_SESSION: SessionConfig = {
  sessionName: "Soft Reflection Session",
  orbGlow: "#8b4a7b",
  arcPath: "M 10,40 C 60,40 90,60 140,65 S 210,65 260,58 S 330,45 390,35",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Hold", "On the Nature of Daylight", "Max Richter", "none", 0.65, "Holding space for what you're carrying right now."),
    phase("Remember", "Space Song", "Beach House", "low", 0.7, "Introducing gentle melodic familiarity to ease into feeling."),
    phase("Still", "Comptine d'un autre été", "Yann Tiersen", "none", 0.65, "Resting in stillness without pressure to resolve."),
    phase("Let Go", "Iktara", "Kavita Seth, Amit Trivedi", "high", 0.75, "Allowing emotional release through lyrical resonance."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Emotional melodic recall",
    "Reflective pacing",
    "Nostalgic resonance",
    "Soft emotional release",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Holding a gentle reflective valley with soft emotional space.",
  intent: "Reflective release",
  energyLabel: "Soft valley",
  inputNarration: "Aura is creating space for reflection without rushing resolution.",
  composingStatements: [
    "Holding space for what you're carrying right now.",
    "Introducing gentle melodic familiarity to ease into feeling.",
    "Resting in stillness without pressure to resolve.",
  ],
  adaptHeadline: "Sensing emotional openness.",
  adaptBody: "Aura is keeping the curve gentle and non-intrusive.",
  adaptInsights: ["Pacing remains slow and patient.", "Transitions are intentionally soft."],
  adaptActions: ["Preserve stillness", "Minimize intensity changes", "Keep transitions airy"],
  reflection: "You were held in a quiet reflective arc with gentle closure.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(330),
};

const EMOTIONAL_DECOMPRESSION_ARC: SessionConfig = {
  sessionName: "Emotional Decompression Arc",
  orbGlow: "#4a7b8b",
  arcPath: "M 10,80 C 60,78 100,65 150,55 S 220,45 270,42 S 340,38 390,35",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Ground", "Weightless", "Marconi Union", "none", 0.45, "Grounding first. No rush. Letting the weight settle."),
    phase("Breathe", "Holocene", "Bon Iver", "low", 0.58, "Introducing breath and space through soft melodic texture."),
    phase("Settle", "Kerala", "Bonobo", "none", 0.68, "Maintaining a stable, low-stimulus rhythm to preserve steadiness."),
    phase("Lift", "Fix You", "Coldplay", "high", 0.78, "Gently lifting with emotionally familiar lyrical resonance."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Ambient grounding layer",
    "Gradual emotional lift",
    "Low-stimulus transitions",
    "Lyrical release at close",
  ],
  orbGlowOpacity: 0.85,
  composingOrchestration: "Building a patient decompression arc with gradual lift.",
  intent: "Emotional decompression",
  energyLabel: "Low → gentle lift",
  inputNarration: "Aura is moving slowly, only building when the arc is ready.",
  composingStatements: [
    "Grounding first. No rush. Letting the weight settle.",
    "Introducing breath and space through soft melodic texture.",
    "Maintaining a stable, low-stimulus rhythm to preserve steadiness.",
  ],
  adaptHeadline: "Sensing residual emotional weight.",
  adaptBody: "Aura is preserving steadiness while keeping the lift gentle.",
  adaptInsights: ["The curve starts very low and rises gradually.", "No dramatic peaks are introduced."],
  adaptActions: ["Lower stimulation", "Increase breathing room", "Protect steady rhythm"],
  reflection: "The session eased pressure first, then lifted gradually.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(210),
};

const MIDNIGHT_RECOVERY_SESSION: SessionConfig = {
  sessionName: "Midnight Recovery Session",
  orbGlow: "#3d4f8b",
  arcPath: "M 10,20 C 70,22 110,40 160,55 S 230,68 280,72 S 350,76 390,80",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Land", "An Ending (Ascent)", "Brian Eno", "none", 0.8, "Creating a safe landing space. Slowing the pace intentionally."),
    phase("Soften", "Bloom", "The Paper Kites", "low", 0.65, "Introducing gentle warmth to soften the edges."),
    phase("Drift", "Awake", "Tycho", "none", 0.5, "Allowing the mind to drift without anchoring to thought."),
    phase("Rest", "Kasoor", "Prateek Kuhad", "medium", 0.35, "Closing with intimate warmth as the session softens to rest."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Nervous system grounding",
    "Ambient decompression",
    "Low-stimulation transitions",
    "Emotional regulation",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Designing a smooth descending arc toward rest.",
  intent: "Night calm",
  energyLabel: "High → low",
  inputNarration: "Aura is guiding a steady descent to a low resting state.",
  composingStatements: [
    "Creating a safe landing space. Slowing the pace intentionally.",
    "Introducing gentle warmth to soften the edges.",
    "Allowing the mind to drift without anchoring to thought.",
  ],
  adaptHeadline: "Sensing nighttime restlessness.",
  adaptBody: "Aura is dimming intensity with each phase.",
  adaptInsights: ["The arc descends smoothly.", "Each phase is quieter than the previous."],
  adaptActions: ["Reduce stimulation", "Lengthen calm transitions", "Protect restful close"],
  reflection: "The session steadily softened toward a near-rest state.",
  summaryLine: "Tonight · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(255),
};

const HIGH_ENERGY_RESET: SessionConfig = {
  sessionName: "High Energy Reset",
  orbGlow: "#c4922a",
  arcPath: "M 10,75 C 40,72 70,40 120,15 S 180,8 250,10 S 330,10 390,12",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Wake", "Near Light", "Ólafur Arnalds", "none", 0.55, "Warming up the system. Preparing energy reserves."),
    phase("Build", "Can't Hold Us", "Macklemore & Ryan Lewis", "high", 0.75, "Building momentum with high-energy lyrical drive."),
    phase("Peak", "Midnight City", "M83", "medium", 0.9, "Sustaining peak intensity with rhythmic forward momentum."),
    phase("Sustain", "Runaway", "AURORA", "medium", 0.85, "Holding elevated energy with emotional resonance."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Progressive energy buildup",
    "Familiar momentum tracks",
    "Controlled stimulation",
    "Emotional uplift",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Building aggressively through peak and holding intensity.",
  intent: "Power and drive",
  energyLabel: "Aggressive rise",
  inputNarration: "Aura is shaping a progressive high-energy plateau arc.",
  composingStatements: [
    "Warming up the system. Preparing energy reserves.",
    "Building momentum with high-energy lyrical drive.",
    "Sustaining peak intensity with rhythmic forward momentum.",
  ],
  adaptHeadline: "Sensing strong motivational drive.",
  adaptBody: "Aura is sustaining your peak while reducing harshness.",
  adaptInsights: ["Energy rises steeply through the mid arc.", "The end remains elevated."],
  adaptActions: ["Sustain momentum", "Protect peak band", "Avoid abrupt drops"],
  reflection: "The session climbed hard and stayed elevated through the finish.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(55),
};

const VELVET_WARMTH_SESSION: SessionConfig = {
  sessionName: "Velvet Warmth Session",
  orbGlow: "#b5616a",
  arcPath: "M 10,55 C 60,55 90,25 150,22 S 220,25 270,40 S 340,50 390,45",
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Ease", "Open Eye Signal", "Jon Hopkins", "none", 0.65, "Easing into warmth. No urgency, only presence."),
    phase("Connect", "Until I Found You", "Stephen Sanchez", "medium", 0.75, "Introducing familiar warmth through melodic connection."),
    phase("Flow", "Pink + White", "Frank Ocean", "medium", 0.8, "Sustaining emotional warmth through lyrical intimacy."),
    phase("Linger", "Raabta", "Arijit Singh", "high", 0.85, "Closing with deep emotional resonance and warmth."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Warm melodic intimacy",
    "Lyrical emotional depth",
    "Unhurried pacing",
    "Soft ambient grounding",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Maintaining warm, intimate continuity through a gentle wave.",
  intent: "Comfort and closeness",
  energyLabel: "Gentle wave",
  inputNarration: "Aura is keeping the pacing unhurried and intimate.",
  composingStatements: [
    "Easing into warmth. No urgency, only presence.",
    "Introducing familiar warmth through melodic connection.",
    "Sustaining emotional warmth through lyrical intimacy.",
  ],
  adaptHeadline: "Sensing steady emotional warmth.",
  adaptBody: "Aura is preserving your gentle pulse and intimacy.",
  adaptInsights: ["Pacing remains smooth and unhurried.", "Warmth stays consistent without spikes."],
  adaptActions: ["Keep smooth transitions", "Maintain warm tone", "Avoid sharp accents"],
  reflection: "The session stayed intimate and warm from beginning to close.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(5),
};

const DEEP_FOCUS_RECOVERY_ARC: SessionConfig = {
  sessionName: "Deep Focus Recovery Arc",
  orbGlow: "#1a9e75",
  arcPath: ARC_PATH,
  subtitle: "48 sec · 4 emotional phases",
  phases: [
    phase("Settle", "Reflection (Ambient Edit)", "Brian Eno", "none", 0.58, "Introducing low-density ambient texture to decompress cognitive load."),
    phase("Activate", "Kerala", "Bonobo", "low", 0.68, "Introducing familiar melodic structure to gently increase engagement."),
    phase("Flow", "Awake", "Tycho", "none", 0.72, "Reducing lyrical density to protect sustained concentration."),
    phase("Release", "Tum Hi Ho", "Arijit Singh", "high", 0.82, "Reintroducing emotionally resonant tracks as your session closes."),
  ],
  duration: "48 sec",
  sessionIncludes: [
    "Instrumental focus layer",
    "Reduced lyrical density",
    "Rhythmic consistency",
    "Cognitive stabilization",
  ],
  orbGlowOpacity: 1,
  composingOrchestration: "Designing a focus arc with gradual cognitive activation.",
  intent: "Sustained focus",
  energyLabel: "Low → steady",
  inputNarration: "Aura is configuring your session for sustained focus with reduced lyrical density.",
  composingStatements: [
    "Designing a focus arc with gradual cognitive activation.",
    "Balancing recovery with sustained attention.",
    "Stabilizing emotional pacing.",
  ],
  adaptHeadline: "Noticing signs of cognitive fatigue.",
  adaptBody: "Listening patterns suggest overstimulation. Aura is softly recalibrating your arc.",
  adaptInsights: ["Shorter listens and quicker skips in the last few minutes.", "Your session may benefit from a calmer emotional lane."],
  adaptActions: ["Softening transitions between tracks", "Emphasizing instrumental layers", "Lowering overall stimulation"],
  reflection: "You held deeper concentration after lower-intensity ambient transitions arrived mid-session.",
  summaryLine: "Today · 48 seconds · 4 emotional phases",
  atmosphere: baseAtmosphere(220),
};

export const DEFAULT_SESSION = DEEP_FOCUS_RECOVERY_ARC;

export type MiniPlayerPlayback = {
  session: SessionConfig;
  phaseIndex: number;
  elapsedTime: number;
  isPlaying: boolean;
};

export function buildMiniPlayerPlayback(
  session: SessionConfig,
  phaseIndex = 0,
  elapsedTime = 0,
  isPlaying = true,
): MiniPlayerPlayback {
  return { session, phaseIndex, elapsedTime, isPlaying };
}

export function getSessionFromInput(input: string): SessionConfig {
  const sessionDefaults: Record<string, string> = {
    "Golden Hour Lift": "45 min",
    "Soft Reflection Session": "35 min",
    "Emotional Decompression Arc": "50 min",
    "Midnight Recovery Session": "40 min",
    "High Energy Reset": "40 min",
    "Velvet Warmth Session": "45 min",
    "Deep Focus Recovery Arc": "45 min",
  };
  const parseDuration = (text: string): string | null => {
    const h = text.match(/\b(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/);
    if (h) {
      const mins = Math.round(Number(h[1]) * 60);
      return `${Math.max(30, mins)} min`;
    }
    const m = text.match(/\b(\d+)\s*(?:m|min|mins|minute|minutes)\b/);
    if (m) {
      const mins = Number(m[1]);
      return `${Math.max(30, mins)} min`;
    }
    return null;
  };
  const withDuration = (session: SessionConfig): SessionConfig => {
    const parsedDuration = parseDuration(t);
    return {
      ...session,
      duration: parsedDuration ?? sessionDefaults[session.sessionName] ?? "45 min",
    };
  };
  const t = input.toLowerCase();
  if (/(happy|happiness|joy|excited|excitement|good mood|amazing|great|celebrating|euphoric|elated|uplifted|energetic|pumped)/.test(t)) return withDuration(GOLDEN_HOUR_LIFT);
  if (/(lonely|loneliness|heartbreak|heartbroken|nostalgia|nostalgic|miss someone|missing someone|alone|lost|empty|grief|longing)/.test(t)) return withDuration(SOFT_REFLECTION_SESSION);
  if (/(sad|sadness|overwhelmed|overwhelm|crying|tearful|depressed|heavy|broken|shattered|falling apart|too much|can't cope)/.test(t)) return withDuration(EMOTIONAL_DECOMPRESSION_ARC);
  if (/(anxious|anxiety|stressed|stress|nervous|worried|panic|restless|racing thoughts|can't sleep|night|calm down|overwhelmed at night|sleep|tired|rest|wind down|bed)/.test(t)) return withDuration(MIDNIGHT_RECOVERY_SESSION);
  if (/(motivated|motivation|confidence|confident|gym|workout|energy|hype|run|training|power|pump|burnout|need energy|exhausted but need to push|hustle|grind)/.test(t)) return withDuration(HIGH_ENERGY_RESET);
  if (/(romantic|romance|love|peaceful|peace|comfortable|comfort|cozy|warm|intimate|content|serene|grateful|calm and happy|relaxed|at ease)/.test(t)) return withDuration(VELVET_WARMTH_SESSION);
  return withDuration(DEEP_FOCUS_RECOVERY_ARC);
}

/** @deprecated Use getSessionFromInput */
export const resolveSession = getSessionFromInput;

export function composingOrbColors(session: SessionConfig): PhaseOrbColors {
  return { primary: "#0a0f1a", glow: session.orbGlow };
}

export function getPhase(session: SessionConfig, phaseIndex: number): PhaseConfig {
  return session.phases[Math.max(0, Math.min(3, phaseIndex))];
}

export function getPhaseLabels(session: SessionConfig): [string, string, string, string] {
  return [session.phases[0].name, session.phases[1].name, session.phases[2].name, session.phases[3].name];
}

export function getAdaptCopyKind(session: SessionConfig): "focus" | "emotional" | "energy" | "sleep" {
  if (session.sessionName.includes("Midnight")) return "sleep";
  if (session.sessionName.includes("High Energy")) return "energy";
  if (session.sessionName.includes("Soft Reflection") || session.sessionName.includes("Decompression")) return "emotional";
  return "focus";
}

export function getAdaptCopy(session: SessionConfig) {
  const map = {
    focus: {
      headline: "Noticing signs of cognitive fatigue.",
      subtext: "Listening patterns suggest overstimulation. Aura is softly recalibrating your arc.",
      bullets: ["Softening transitions between tracks", "Emphasizing instrumental layers", "Lowering overall stimulation"],
    },
    emotional: {
      headline: "Sensing emotional openness.",
      subtext: "Your listening suggests you're ready to go deeper. Aura is opening the arc with care.",
      bullets: ["Favoring vocal intimacy and space", "Slowing transitions between phases", "Keeping stimulation low and present"],
    },
    energy: {
      headline: "Sensing a shift in energy.",
      subtext: "Your rhythm is changing. Aura is adjusting the intensity curve.",
      bullets: ["Maintaining rhythmic momentum", "Reducing abrupt drops between tracks", "Sustaining energy without overstimulation"],
    },
    sleep: {
      headline: "Noticing a deepening calm.",
      subtext: "You're settling in. Aura is softening the remaining arc.",
      bullets: ["Reducing all sonic density", "Extending ambient transitions", "Preparing a soft exit"],
    },
  } as const;
  return map[getAdaptCopyKind(session)];
}

export const ADAPT_ORB_COLORS: PhaseOrbColors = {
  primary: "#1a1000",
  glow: "#c4922a",
};

export function parseBezierSegments(path: string): BezierSegment[] {
  const tokens = path.trim().split(/\s+/);
  const segments: BezierSegment[] = [];
  let i = 0;
  let cursor: Point = { x: 0, y: 0 };
  let lastCp: Point | null = null;
  const toPoint = (value: string): Point => {
    const [x, y] = value.split(",").map(Number);
    return { x, y };
  };
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === "M") {
      cursor = toPoint(tokens[i++]);
      lastCp = null;
      continue;
    }
    if (cmd === "C") {
      const p1 = toPoint(tokens[i++]);
      const p2 = toPoint(tokens[i++]);
      const p3 = toPoint(tokens[i++]);
      segments.push({ p0: cursor, p1, p2, p3 });
      cursor = p3;
      lastCp = p2;
      continue;
    }
    if (cmd === "S") {
      const p2 = toPoint(tokens[i++]);
      const p3 = toPoint(tokens[i++]);
      const reflected = lastCp ? { x: cursor.x * 2 - lastCp.x, y: cursor.y * 2 - lastCp.y } : cursor;
      segments.push({ p0: cursor, p1: reflected, p2, p3 });
      cursor = p3;
      lastCp = p2;
    }
  }
  return segments;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function getBezierPoint(path: string, t: number): Point {
  const clampedT = clamp01(t);
  const segments = parseBezierSegments(path);
  if (!segments.length) return { x: 10, y: 65 };
  const segCount = segments.length;
  const segT = clampedT * segCount;
  const segIndex = Math.min(Math.floor(segT), segCount - 1);
  const localT = segT - segIndex;
  const seg = segments[segIndex];
  const mt = 1 - localT;
  return {
    x: mt * mt * mt * seg.p0.x + 3 * mt * mt * localT * seg.p1.x + 3 * mt * localT * localT * seg.p2.x + localT * localT * localT * seg.p3.x,
    y: mt * mt * mt * seg.p0.y + 3 * mt * mt * localT * seg.p1.y + 3 * mt * localT * localT * seg.p2.y + localT * localT * localT * seg.p3.y,
  };
}

export const HOME_MOOD_PRESETS: Record<string, string> = {
  "Exhausted but need focus": "I'm exhausted but need to focus for 45 minutes.",
  "Late-night calm": "I feel anxious and need to wind down before sleep.",
  "Gym recovery": "I need energy and motivation for my workout.",
  "Recover after burnout": "I feel overwhelmed and can't cope today.",
};

export const SUMMARY_METRICS = [
  { l: "FOCUS TIME", v: "42m", t: "sustained attention" },
  { l: "EFFECTIVENESS", v: "87%", t: "vs your baseline" },
  { l: "ADAPTATIONS", v: "3", t: "felt seamless" },
] as const;
