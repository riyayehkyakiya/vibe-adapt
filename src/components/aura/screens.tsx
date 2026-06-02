import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Waveform } from "./AuraOrb";
import {
  HomeIcon, SearchIcon, LibraryIcon, SparkIcon, PlayIcon, PauseIcon,
  PrevIcon, NextIcon, HeartIcon, CloseIcon, ChevronDown, Dots,
  PlusIcon, ChevronRight,
} from "./icons";
import {
  ADAPT_ORB_COLORS,
  ARC_VIEWBOX,
  composingOrbColors,
  getAdaptCopy,
  getBezierPoint,
  getPhase,
  getPhaseLabels,
  getSessionFromInput,
  HOME_MOOD_PRESETS,
  SUMMARY_METRICS,
  type MiniPlayerPlayback,
  type PhaseOrbColors,
  type SessionConfig,
} from "./session";

const PHASE_COUNT = 4;
const SESSION_TOTAL_MS = 48000;

function InputWaveform({ bars = 36, className = "" }: { bars?: number; className?: string }) {
  return (
    <div
      className={`flex items-end justify-between w-full ${className}`}
      style={{ width: "100%" }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-[#1db954] animate-wave shrink-0"
          style={{
            height: `${30 + ((i * 37) % 70)}%`,
            animationDelay: `${(i * 73) % 900}ms`,
            animationDuration: `${900 + ((i * 53) % 700)}ms`,
            opacity: 0.55 + ((i % 5) * 0.09),
          }}
        />
      ))}
    </div>
  );
}

function formatPhaseTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Nav = (s: number) => void;

type FlowProps = {
  go: Nav;
  session: SessionConfig;
  inputText: string;
  setInputText: (text: string) => void;
  beginInput: (text?: string) => void;
  beginComposing: () => void;
  playerPhaseIndex: number;
  setPlayerPhaseIndex: (index: number) => void;
  miniPlayer: MiniPlayerPlayback | null;
  resumePlayback: () => void;
  elapsedTime: number;
  setElapsedTime: (ms: number | ((ms: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean | ((value: boolean) => boolean)) => void;
  setMiniPlayer: (value: MiniPlayerPlayback | null) => void;
  setSession: (session: SessionConfig) => void;
};

function ArcCurve({
  t,
  arcPath,
  className = "",
}: {
  t: number;
  arcPath: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const clampedT = Math.max(0, Math.min(1, t));
  const dot = getBezierPoint(arcPath, clampedT);
  const fill = `${arcPath} L 390,80 L 10,80 Z`;

  return (
    <svg viewBox={ARC_VIEWBOX} className={`w-full h-20 ${className}`}>
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.68 0.08 220)" />
          <stop offset="55%" stopColor="oklch(0.75 0.12 165)" />
          <stop offset="100%" stopColor="oklch(0.62 0.1 280)" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.12 175 / 0.22)" />
          <stop offset="55%" stopColor="oklch(0.65 0.1 220 / 0.12)" />
          <stop offset="100%" stopColor="oklch(0.72 0.12 175 / 0)" />
        </linearGradient>
      </defs>
      {[24, 44, 64].map(y => (
        <line key={y} x1="10" x2="390" y1={y} y2={y} stroke="oklch(1 0 0 / 0.03)" strokeWidth="1" />
      ))}
      <path d={fill} fill={`url(#${id}-fill)`} />
      <path
        d={arcPath}
        stroke={`url(#${id}-stroke)`}
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx={dot.x}
        cy={dot.y}
        r={4}
        fill="white"
        style={{
          filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))",
          transition: "cx 80ms linear, cy 80ms linear",
        }}
      />
    </svg>
  );
}

/* ---------- Album art: photographic covers + Spotify-style 2×2 collages ---------- */
function coverSlug(seed: string, offset = 0) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i) + offset * 17) >>> 0;
  return `${seed.replace(/\s+/g, "-").toLowerCase()}-${h % 9999}`;
}

function coverUrl(seed: string, offset = 0) {
  return `https://picsum.photos/seed/${coverSlug(seed, offset)}/400/400`;
}

function AlbumArt({
  seed,
  size = 150,
  rounded = "rounded-[4px]",
  variant = "collage",
}: {
  seed: string;
  size?: number;
  rounded?: string;
  variant?: "single" | "collage";
}) {
  const showCollage = variant === "collage" && size >= 48;

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[oklch(0.14_0_0)] ${rounded}`}
      style={{ width: size, height: size }}
    >
      {showCollage ? (
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[1px]">
          {[0, 1, 2, 3].map(i => (
            <img
              key={i}
              src={coverUrl(seed, i)}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ))}
        </div>
      ) : (
        <img
          src={coverUrl(seed, 0)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, oklch(0 0 0 / 0.08) 0%, oklch(0 0 0 / 0.18) 100%)" }}
      />
    </div>
  );
}

/* Liked Songs uses Spotify's signature gradient — keep as a small exception */
function LikedSongsArt({ size = 56, rounded = "rounded-[3px]" }: { size?: number; rounded?: string }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded}`}
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, oklch(0.55 0.22 290) 0%, oklch(0.92 0.04 270) 100%)",
      }}
    >
      <div className="absolute inset-0 grid place-items-center">
        <HeartIcon width={size * 0.42} height={size * 0.42} className="text-white" />
      </div>
    </div>
  );
}

/* ---------- shared chrome ---------- */
function TabBar({ active = "home" }: { active?: "home" | "search" | "create" | "library" }) {
  const items: { k: typeof active; Icon: typeof HomeIcon; label: string }[] = [
    { k: "home", Icon: HomeIcon, label: "Home" },
    { k: "search", Icon: SearchIcon, label: "Search" },
    { k: "create", Icon: PlusIcon, label: "Create" },
    { k: "library", Icon: LibraryIcon, label: "Your Library" },
  ];
  return (
    <div
      className="absolute bottom-0 inset-x-0 pt-2 pb-[22px] px-7 flex items-center justify-between border-t border-white/[0.06]"
      style={{
        background: "oklch(0.11 0 0 / 0.72)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      {items.map(({ k, Icon, label }) => {
        const on = active === k;
        return (
          <div key={k} className={`flex flex-col items-center gap-0.5 ${on ? "text-foreground" : "text-muted-foreground"}`}>
            <Icon width={22} height={22} strokeWidth={on ? 2.35 : 1.75} />
            <span className="text-[10px] font-semibold tracking-[-0.01em]">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function PhaseOrb({
  colors,
  size = 280,
  intensity = 1,
  glowMultiplier = 1,
}: { colors: PhaseOrbColors; size?: number; intensity?: number; glowMultiplier?: number }) {
  const inset = Math.round(size * 0.14);
  const glowOpacity = 0.38 * intensity * glowMultiplier;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-orb-breathe"
        style={{ background: colors.glow, opacity: glowOpacity }}
      />
      <div
        className="absolute rounded-full animate-orb-breathe"
        style={{
          inset,
          background: `radial-gradient(circle at 36% 30%, ${colors.glow}ee, ${colors.primary} 55%, ${colors.primary} 88%)`,
          boxShadow: `inset 0 0 60px rgba(255,255,255,0.06), 0 0 64px ${colors.glow}88`,
          animationDelay: "0.6s",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: inset + 2,
          background: "radial-gradient(ellipse 40% 30% at 35% 25%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />
    </div>
  );
}

function MiniPlayer({
  playback,
  onTap,
  onTogglePlay,
}: { playback: MiniPlayerPlayback; onTap?: () => void; onTogglePlay?: () => void }) {
  const track = getPhase(playback.session, playback.phaseIndex);
  const phaseLabel = getPhaseLabels(playback.session)[playback.phaseIndex] ?? getPhaseLabels(playback.session)[3];
  const progress = Math.max(0, Math.min(1, playback.elapsedTime / SESSION_TOTAL_MS));

  return (
    <div className="absolute bottom-[68px] inset-x-2.5 rounded-[5px] overflow-hidden bg-[oklch(0.155_0_0)]">
      <div className="w-full flex items-center gap-2.5 px-2 py-1.5 pr-2">
        <button type="button" onClick={onTap} className="flex flex-1 items-center gap-2.5 min-w-0 text-left active:opacity-90 transition-opacity">
          <div
            className="shrink-0"
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: `radial-gradient(circle at 40% 40%, ${playback.session.orbGlow}99, ${playback.session.orbGlow}22)`,
              flexShrink: 0,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold truncate tracking-[-0.015em] leading-tight">
              {track.trackName}
            </div>
            <div className="text-[10.5px] text-muted-foreground truncate mt-0.5">{track.artist}</div>
            <div className="text-[10px] text-muted-foreground/90 truncate flex items-center gap-1 mt-0.5">
              <SparkIcon width={9} height={9} className="text-primary shrink-0" />
              <span>
                {playback.session.sessionName} · {phaseLabel}
              </span>
            </div>
          </div>
        </button>
        <HeartIcon width={18} height={18} className="text-primary shrink-0" />
        <button type="button" onClick={onTogglePlay} className="shrink-0 p-0.5 active:opacity-80" aria-label={playback.isPlaying ? "Pause" : "Play"}>
          {playback.isPlaying ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />}
        </button>
      </div>
      <div className="h-[2px] bg-white/[0.08]">
        <div className="h-full bg-white/80 transition-all duration-500 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

/* ---------- SCREEN 1 — HOME ---------- */
export function HomeScreen({ beginInput, miniPlayer, resumePlayback, setMiniPlayer }: FlowProps) {
  const chips = ["All", "Music", "Podcasts", "Aura"];
  const [activeChip, setActiveChip] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  const auraChips = ["Exhausted but need focus", "Late-night calm", "Gym recovery", "Recover after burnout"];
  const quickRow = [
    { title: "Liked Songs", liked: true },
    { title: "Discover Weekly" },
    { title: "Daily Mix 1" },
    { title: "Chill Hits" },
    { title: "Lo-Fi Beats" },
    { title: "Focus Flow" },
  ];
  const madeForYou = [
    { title: "Daily Mix 2", sub: "Bonobo, Tycho, Floating Points and more" },
    { title: "Daily Mix 3", sub: "Tame Impala, Khruangbin, Mac DeMarco" },
    { title: "Release Radar", sub: "Catch the latest from artists you follow" },
    { title: "On Repeat", sub: "Songs you can't stop playing" },
  ];
  const recents = [
    { title: "Late Night Tapes", sub: "Playlist", variant: "collage" as const },
    { title: "Ambient Works Vol. II", sub: "Album · Aphex Twin", variant: "single" as const },
    { title: "Slow Mornings", sub: "Playlist", variant: "collage" as const },
    { title: "Night Drive", sub: "Playlist", variant: "collage" as const },
  ];

  const scrollToAura = useCallback(() => {
    const container = scrollRef.current;
    const target = auraRef.current;
    if (!container || !target) return;

    setActiveChip("Aura");
    const top = Math.max(0, target.offsetTop - 10);
    container.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleChipClick = (c: string) => {
    if (c === "Aura") {
      scrollToAura();
      return;
    }
    setActiveChip(c);
  };

  return (
    <div className="h-full relative bg-background">
      <div ref={scrollRef} className="h-full overflow-y-auto no-scrollbar pb-[148px] relative scroll-smooth">
        {/* greeting — avatar TOP-LEFT, Spotify-style */}
        <div className="px-4 pt-2.5 flex items-center gap-2.5">
          <button
            type="button"
            className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0 bg-[oklch(0.48_0.14_25)]"
          >
            A
          </button>
          <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {chips.map(c => {
              const isAura = c === "Aura";
              const active = activeChip === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChipClick(c)}
                  className={`px-3 py-[5px] rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.07] text-foreground active:bg-white/[0.11]"
                  }`}
                >
                  {isAura && <SparkIcon width={11} height={11} className="inline -mt-px mr-1" />}
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* quick grid */}
        <div className="grid grid-cols-2 gap-2 px-4 mt-4">
          {quickRow.map(q => (
            <button
              key={q.title}
              type="button"
              className="flex items-center gap-0 rounded-[4px] bg-white/[0.06] active:bg-white/[0.1] overflow-hidden h-[52px] transition-colors"
            >
              {q.liked
                ? <LikedSongsArt size={52} rounded="rounded-l-[4px] rounded-r-none" />
                : <AlbumArt seed={q.title} size={52} rounded="rounded-l-[4px] rounded-r-none" variant="collage" />}
              <span className="text-[12.5px] font-semibold truncate px-2.5 tracking-[-0.015em] leading-tight">{q.title}</span>
            </button>
          ))}
        </div>

        {/* AURA module */}
        <div ref={auraRef} className="mx-4 mt-6 scroll-mt-3">
          <div
            className="w-full text-left rounded-2xl relative overflow-hidden bg-white/[0.04] p-3.5 border border-[rgba(74,222,128,0.2)]"
          >
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-1.5">
                <SparkIcon width={12} height={12} className="text-primary/90" />
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-primary/90">Aura</span>
              </div>
              <span className="text-xs text-yellow-400/80 font-medium">✦ Premium</span>
            </div>
            <h3 className="text-[15px] font-bold tracking-[-0.025em] mt-2 leading-[1.2] text-foreground">
              How do you want to feel?
            </h3>
            <p className="text-[11.5px] text-muted-foreground mt-1 leading-snug max-w-[94%]">
              Describe your state — Aura shapes a session that adapts as you listen.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {auraChips.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => beginInput(HOME_MOOD_PRESETS[c])}
                  className="text-[11px] px-2 py-[5px] rounded-full bg-white/[0.05] text-foreground/85 tracking-[-0.01em] active:bg-white/[0.09] transition-colors duration-200"
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => beginInput()}
              className="mt-3 w-full flex items-center justify-between active:opacity-80 transition-opacity duration-200"
            >
              <Waveform bars={14} className="h-3 opacity-40" />
              <span className="text-[11.5px] text-foreground/90 font-medium flex items-center gap-0.5 tracking-[-0.01em]">
                Start a session <ChevronRight width={13} height={13} className="text-muted-foreground" />
              </span>
            </button>
          </div>
        </div>

        {/* Made For You */}
        <section className="mt-8">
          <h2 className="px-4 text-[21px] font-extrabold tracking-[-0.03em] leading-none">Made For You</h2>
          <div className="flex gap-3 px-4 mt-3.5 overflow-x-auto no-scrollbar pb-0.5">
            {madeForYou.map(m => (
              <div key={m.title} className="w-[140px] shrink-0">
                <AlbumArt seed={m.title} size={140} variant="collage" />
                <div className="mt-2.5 text-[13px] font-semibold truncate tracking-[-0.015em] leading-tight">{m.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 leading-[1.25] mt-0.5 tracking-[-0.005em]">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently played */}
        <section className="mt-8">
          <h2 className="px-4 text-[21px] font-extrabold tracking-[-0.03em] leading-none">Recently played</h2>
          <div className="flex gap-3 px-4 mt-3.5 overflow-x-auto no-scrollbar pb-0.5">
            {recents.map(r => (
              <div key={r.title} className="w-[140px] shrink-0">
                <AlbumArt seed={r.title + r.sub} size={140} variant={r.variant} />
                <div className="mt-2.5 text-[13px] font-semibold truncate tracking-[-0.015em] leading-tight">{r.title}</div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">{r.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Jump back in */}
        <section className="mt-8 pb-2">
          <h2 className="px-4 text-[21px] font-extrabold tracking-[-0.03em] leading-none">Jump back in</h2>
          <div className="flex gap-3 px-4 mt-3.5 overflow-x-auto no-scrollbar pb-0.5">
            {["Sunday Strings", "Deep House Relax", "Indie Pop Mix"].map(t => (
              <div key={t} className="w-[140px] shrink-0">
                <AlbumArt seed={t} size={140} variant="collage" />
                <div className="mt-2.5 text-[13px] font-semibold truncate tracking-[-0.015em] leading-tight">{t}</div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">Playlist</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {miniPlayer && (
        <MiniPlayer
          playback={miniPlayer}
          onTap={resumePlayback}
          onTogglePlay={() => setMiniPlayer({ ...miniPlayer, isPlaying: !miniPlayer.isPlaying })}
        />
      )}
      <TabBar active="home" />
    </div>
  );
}

/* ---------- SCREEN 2 — INPUT ---------- */
export function InputScreen({ go, inputText, setInputText, beginComposing, setMiniPlayer, setElapsedTime, setPlayerPhaseIndex, setIsPlaying }: FlowProps) {
  const [interpreting, setInterpreting] = useState(false);
  const preview = useMemo(() => getSessionFromInput(inputText), [inputText]);
  const hasInput = inputText.trim().length >= 3;

  useEffect(() => {
    setInterpreting(true);
    const t = setTimeout(() => setInterpreting(false), 1400);
    return () => clearTimeout(t);
  }, [inputText]);

  return (
    <div className="h-full relative flex flex-col transition-[background] duration-700 ease-out" style={{ background: preview.atmosphere.input }}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            setMiniPlayer(null);
            setElapsedTime(0);
            setPlayerPhaseIndex(0);
            setIsPlaying(true);
            go(1);
          }}
          className="p-1 -ml-1"
        >
          <ChevronDown width={26} height={26} />
        </button>
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.18em] uppercase text-primary/90">
          <SparkIcon width={12} height={12} /> Aura
        </div>
        <button type="button" className="p-1 -mr-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-5 mt-1">
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] leading-[1.1]">How do you<br/>want to feel?</h1>
          <p className="text-[13px] text-muted-foreground mt-2 leading-snug">Describe your state. Aura listens and shapes the arc for you.</p>
        </div>

        <div className="px-4 mt-5">
          <div className="rounded-2xl bg-white/[0.04] p-3.5">
            <div className="flex items-start gap-1">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Describe how you're feeling..."
                className="aura-input flex-1 min-h-0 bg-transparent outline-none resize-none text-[16px] leading-snug tracking-[-0.01em]"
                rows={2}
              />
              {interpreting && (
                <span
                  className="w-0.5 h-[1.15rem] bg-foreground/85 shrink-0 mt-1 animate-pulse"
                  aria-hidden
                />
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <InputWaveform
                className={`h-3.5 transition-opacity duration-500 ${interpreting ? "opacity-55" : "opacity-30"}`}
              />
              <span className="text-[11px] text-muted-foreground shrink-0">{interpreting ? "Interpreting…" : ""}</span>
            </div>
          </div>
        </div>

        {hasInput && (
          <>
            <div className="px-4 mt-4 flex flex-wrap gap-2">
              {[
                { l: "INTENT", v: preview.intent },
                { l: "ENERGY CURVE", v: preview.energyLabel },
                { l: "DURATION", v: preview.duration },
              ].map(d => (
                <div
                  key={d.l}
                  className="flex flex-col justify-center min-h-[36px] rounded-lg px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider text-white/40">{d.l}</span>
                  <span className="text-[13px] font-medium text-white/90 mt-0.5">{d.v}</span>
                </div>
              ))}
            </div>

            <div className="px-5 mt-4 flex items-center gap-2 text-[12px] font-normal" style={{ color: "#1db954" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#1db954" }} />
              Adaptive listening enabled
            </div>

            <div className="px-5">
              <div className="flex items-start gap-2 mt-2">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                  style={{ backgroundColor: "#1db954" }}
                />
                <p
                  className="text-[13px] font-normal leading-[1.6]"
                  style={{ color: "rgba(74, 222, 128, 0.8)" }}
                >
                  Aura is configuring your session — introducing familiar melodic tracks during activation, reducing lyrical density during deep focus, and reintroducing emotional resonance at close.
                </p>
              </div>

              <p
                className="uppercase mt-5"
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.30)",
                  letterSpacing: "0.8px",
                }}
              >
                YOUR SESSION WILL INCLUDE
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {preview.sessionIncludes.map(label => (
                  <span
                    key={label}
                    className="text-[12px] rounded-full"
                    style={{
                      color: "rgba(255,255,255,0.50)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "transparent",
                      padding: "6px 12px",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[oklch(0.05_0_0)] via-[oklch(0.05_0_0/0.92)] to-transparent">
        <div className="p-4 pb-0">
          <button
            type="button"
            onClick={beginComposing}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground text-[15px] font-bold tracking-[-0.01em] active:scale-[0.98] transition-transform duration-200"
          >
            Compose Session
          </button>
        </div>
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-32 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

/* ---------- SCREEN 3 — GENERATION ---------- */
export function GeneratingScreen({ go, session, setMiniPlayer, setElapsedTime, setPlayerPhaseIndex, setIsPlaying }: FlowProps) {
  const statements = session.composingStatements;
  const [stmtIdx, setStmtIdx] = useState(0);
  const [previewT, setPreviewT] = useState(0);
  const generationMs = 5200;

  useEffect(() => {
    const stmtTimer = setInterval(() => {
      setStmtIdx(i => (i + 1) % statements.length);
    }, 2800);
    return () => clearInterval(stmtTimer);
  }, [statements.length]);

  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / generationMs);
      setPreviewT(progress);
      if (progress >= 1) {
        window.clearInterval(id);
        go(4);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [generationMs, go]);

  const orbColors = composingOrbColors(session);

  return (
    <div className="h-full relative overflow-hidden transition-[background] duration-700" style={{ background: session.atmosphere.composing }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => {
            setMiniPlayer(null);
            setElapsedTime(0);
            setPlayerPhaseIndex(0);
            setIsPlaying(true);
            go(1);
          }}
          className="p-1 text-muted-foreground"
        >
          <CloseIcon width={22} height={22} />
        </button>
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.18em] uppercase text-primary/90">
          <SparkIcon width={12} height={12} /> Aura
        </div>
        <span className="w-6" />
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <PhaseOrb
          size={240}
          colors={orbColors}
          intensity={session.orbGlowOpacity}
        />
      </div>

      <div className="px-6 mt-3 text-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Composing</div>
        <h2 className="text-[22px] font-extrabold tracking-[-0.025em] mt-2">{session.sessionName}</h2>
        <p className="text-[12.5px] text-muted-foreground mt-1">{session.duration} · 4 emotional phases</p>
      </div>

      <div className="px-6 mt-5">
        <ArcCurve t={previewT} arcPath={session.arcPath} />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1 tracking-wide">
          {getPhaseLabels(session).map(p => <span key={p}>{p}</span>)}
        </div>

        <div
          className="flex justify-between mt-7 mb-2 border-t border-white/[0.06]"
        >
          <div
            className="text-center flex-1"
            style={{ padding: "16px 20px" }}
          >
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-sm text-white/70 font-medium">{session.duration}</p>
          </div>
          <div className="w-px bg-white/[0.08]" />
          <div
            className="text-center flex-1"
            style={{ padding: "16px 20px" }}
          >
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Phases</p>
            <p className="text-sm text-white/70 font-medium">4 emotional phases</p>
          </div>
          <div className="w-px bg-white/[0.08]" />
          <div
            className="text-center flex-1"
            style={{ padding: "16px 20px" }}
          >
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Adapts to</p>
            <p className="text-sm text-white/70 font-medium">Your responses</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 px-8 min-h-[2.5rem] flex items-center justify-center">
        <p
          key={stmtIdx}
          className="text-center text-[12.5px] text-muted-foreground tracking-[-0.01em] leading-snug animate-statement-fade"
        >
          {statements[stmtIdx]}
        </p>
      </div>
    </div>
  );
}

/* ---------- SCREEN 4 — PLAYER ---------- */

export function PlayerScreen({
  go,
  session,
  playerPhaseIndex: phaseIndex,
  setPlayerPhaseIndex: setPhaseIndex,
  elapsedTime,
  setElapsedTime,
  isPlaying: playing,
  setIsPlaying: setPlaying,
  setMiniPlayer,
}: FlowProps) {
  const [liked, setLiked] = useState(true);
  const [messageOpacity, setMessageOpacity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const phaseIndexRef = useRef(phaseIndex);
  const elapsedRef = useRef(elapsedTime);
  const activePhaseIdx = phaseIndex;
  const phaseTrack = getPhase(session, activePhaseIdx);
  const liveOrchestration = phaseTrack.orchestrationCopy;
  const phaseLabels = getPhaseLabels(session);
  const phaseElapsed = elapsedTime % 12000;
  const phaseProgress = Math.max(0, Math.min(100, (phaseElapsed / 12000) * 100));
  const elapsedSec = phaseElapsed / 1000;
  const remainingSec = Math.max(0, 12 - elapsedSec);
  const t = Math.max(0, Math.min(1, elapsedTime / SESSION_TOTAL_MS));

  const applyPhaseAdvance = useCallback(
    (fromSkip: boolean) => {
      const current = Math.floor(elapsedRef.current / 12000);
      if (current >= 3) {
        setMiniPlayer({ session, phaseIndex: 3, elapsedTime: SESSION_TOTAL_MS, isPlaying: false });
        go(6);
        return;
      }
      const next = Math.min(3, current + 1);
      phaseIndexRef.current = next;
      setPhaseIndex(next);
      setMessageOpacity(0);
      window.setTimeout(() => setMessageOpacity(1), 80);
      if (next === 2 && fromSkip) {
        go(5);
      }
    },
    [go, session, setMiniPlayer, setPhaseIndex],
  );

  const skipPhase = useCallback(() => {
    const nextElapsed = Math.min(SESSION_TOTAL_MS, (Math.floor(elapsedTime / 12000) + 1) * 12000);
    setElapsedTime(nextElapsed);
    applyPhaseAdvance(true);
  }, [applyPhaseAdvance, elapsedTime, setElapsedTime]);

  useEffect(() => {
    phaseIndexRef.current = phaseIndex;
  }, [phaseIndex]);

  useEffect(() => {
    elapsedRef.current = elapsedTime;
    const nextPhase = Math.min(3, Math.floor(elapsedTime / 12000));
    if (nextPhase !== phaseIndexRef.current) {
      phaseIndexRef.current = nextPhase;
      setPhaseIndex(nextPhase);
      setMessageOpacity(0);
      window.setTimeout(() => setMessageOpacity(1), 80);
    }
    if (elapsedTime >= SESSION_TOTAL_MS) {
      setMiniPlayer({ session, phaseIndex: 3, elapsedTime: SESSION_TOTAL_MS, isPlaying: false });
      go(6);
    }
  }, [elapsedTime, go, session, setMiniPlayer, setPhaseIndex]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="h-full relative overflow-y-auto no-scrollbar transition-[background] duration-700" style={{ background: session.atmosphere.player }}>
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10 bg-gradient-to-b from-[oklch(0.05_0_0/0.4)] to-transparent">
        <button
          type="button"
          onClick={() => {
            setMiniPlayer({ session, phaseIndex, elapsedTime, isPlaying: playing });
            go(1);
          }}
          className="p-1"
        >
          <ChevronDown width={24} height={24} />
        </button>
        <div className="text-center">
          <div className="text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">Aura Session</div>
          <div
            className="font-medium whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "-0.2px", maxWidth: "calc(100vw - 96px)" }}
          >
            {session.sessionName}
          </div>
        </div>
        <button type="button" onClick={() => setMenuOpen(true)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative rounded-t-2xl bg-[oklch(0.12_0_0)] px-4 pb-8 pt-3 animate-slide-up">
            <div className="flex justify-center mb-4">
              <div className="w-9 h-1 rounded-full bg-white/25" />
            </div>
            <button
              type="button"
              className="w-full text-left text-[15px] text-white py-3.5 border-b border-white/[0.08]"
              onClick={() => {
                setMenuOpen(false);
                setMiniPlayer(null);
                go(6);
              }}
            >
              End session
            </button>
            <button
              type="button"
              className="w-full text-left text-[15px] text-white py-3.5"
              onClick={() => {
                setToast("Session saved");
                setMenuOpen(false);
              }}
            >
              Save to library
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-white/10 text-[13px] text-white/90 backdrop-blur-md">
          {toast}
        </div>
      )}

      <div className="grid place-items-center mt-4">
        <PhaseOrb
          size={280}
          colors={{ primary: "#0a0f1a", glow: session.orbGlow }}
          intensity={phaseTrack.orbOpacity}
        />
      </div>

      <div className="px-5 mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-primary/90 flex items-center gap-1.5">
            <SparkIcon width={10} height={10} /> Phase {activePhaseIdx + 1} of 4 · {phaseLabels[activePhaseIdx]}
          </div>
          <div className="text-[19px] font-extrabold tracking-[-0.025em] mt-1 leading-tight">{phaseTrack.trackName}</div>
          <div className="text-[12.5px] text-muted-foreground tracking-[-0.005em]">{phaseTrack.artist}</div>
        </div>
        <button type="button" onClick={() => setLiked(l => !l)} aria-label="Save">
          <HeartIcon width={22} height={22} className={liked ? "text-primary" : "text-muted-foreground"} />
        </button>
      </div>

      <div className="px-5 mt-4">
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-foreground/90 rounded-full transition-[width] duration-100 linear" style={{ width: `${phaseProgress}%` }} />
        </div>
        <div className="flex justify-between text-[10.5px] text-muted-foreground mt-1.5 tabular-nums">
          <span>{formatPhaseTime(elapsedSec)}</span>
          <span>-{formatPhaseTime(remainingSec)}</span>
        </div>
      </div>

      <div className="px-10 mt-4 flex items-center justify-between">
        <PrevIcon width={26} height={26} className="text-foreground/40" />
        <button
          type="button"
          onClick={() => setPlaying(p => !p)}
          className="w-[52px] h-[52px] rounded-full grid place-items-center text-white active:scale-[0.96] transition-all duration-200"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          {playing ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />}
        </button>
        <button type="button" onClick={skipPhase} aria-label="Skip forward">
          <NextIcon width={26} height={26} className="text-foreground/90" />
        </button>
      </div>

      <div className="mx-5 mt-7 px-1">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Emotional arc</div>
          <span className="text-[10.5px] text-primary font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> adapting live
          </span>
        </div>
        <ArcCurve t={t} arcPath={session.arcPath} className="mt-1" />
        <div className="flex justify-between -mt-1">
          {phaseLabels.map((p, i) => (
            <span
              key={p}
              className={`text-[10px] tracking-[-0.005em] ${i === activePhaseIdx ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-3 mb-8 rounded-xl bg-white/[0.03] px-3.5 py-3 flex items-start gap-2">
        <SparkIcon width={12} height={12} className="text-primary/80 mt-[3px] shrink-0" />
        <p
          className="text-[12px] leading-snug tracking-[-0.005em] text-foreground/85 transition-opacity duration-[600ms] ease-in-out"
          style={{ opacity: messageOpacity }}
        >
          <span className="text-primary/90">Aura</span>
          {" — "}
          {liveOrchestration}
        </p>
      </div>
    </div>
  );
}

/* ---------- SCREEN 5 — ADAPTATION ---------- */
export function AdaptScreen({ go, session, elapsedTime }: FlowProps) {
  const [applied, setApplied] = useState(false);
  const adaptCopy = getAdaptCopy(session);
  const recalibratedT = Math.max(0, Math.min(1, elapsedTime / SESSION_TOTAL_MS - 0.05));

  return (
    <div className="h-full relative overflow-y-auto no-scrollbar pb-28 transition-[background] duration-700" style={{ background: session.atmosphere.adapt }}>
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 bg-gradient-to-b from-[oklch(0.05_0_0/0.35)] to-transparent z-10">
        <button type="button" onClick={() => go(4)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-center">
          <div className="text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">Aura Session</div>
          <div className="text-[12.5px] font-semibold tracking-[-0.01em]">{session.sessionName}</div>
        </div>
        <button type="button" onClick={() => go(6)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="grid place-items-center mt-2">
        <PhaseOrb size={200} intensity={0.85} glowMultiplier={1.45} colors={ADAPT_ORB_COLORS} />
      </div>

      <div className="mx-4 mt-2 rounded-2xl bg-white/[0.03] p-4 animate-fade-up">
        <div className="flex items-center gap-2">
          <SparkIcon width={12} height={12} className="text-primary/80" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/85">Aura · sensing</span>
        </div>
        <h3 className="text-[16px] font-bold tracking-[-0.02em] mt-2 leading-snug">
          {adaptCopy.headline}
        </h3>
        <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-snug">
          {adaptCopy.subtext}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { l: "Skip rate", v: "Higher", t: "last few minutes" },
            { l: "Engagement", v: "Shorter listens", t: "recent pattern" },
          ].map(s => (
            <div key={s.l} className="rounded-lg bg-black/25 px-2.5 py-2">
              <div className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">{s.l}</div>
              <div className="text-[13px] font-semibold mt-0.5 tracking-[-0.01em]">{s.v}</div>
              <div className="text-[9.5px] text-muted-foreground">{s.t}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {session.adaptInsights.map(line => (
            <p key={line} className="text-[12px] text-foreground/75 leading-snug tracking-[-0.005em]">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-4 space-y-2 pt-3 border-t border-white/[0.05]">
          {adaptCopy.bullets.map(a => (
            <div key={a} className="flex items-center gap-2 text-[12px] tracking-[-0.005em] text-foreground/80">
              <span className="w-1 h-1 rounded-full bg-primary/70" />
              {a}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 px-1">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-muted-foreground">Emotional arc</span>
          <span className="text-primary/85 font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-primary/70 animate-pulse" /> recalibrating
          </span>
        </div>
        <ArcCurve t={recalibratedT} arcPath={session.arcPath} />
        <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
          {getPhaseLabels(session).map(p => <span key={p}>{p}</span>)}
        </div>
      </div>

      <div className="px-4 mt-5 flex gap-2">
        <button type="button" onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/[0.06] text-[13.5px] font-semibold tracking-[-0.01em] active:bg-white/[0.1] transition-colors duration-200">Keep as-is</button>
        <button
          type="button"
          onClick={() => { setApplied(true); setTimeout(() => go(4), 280); }}
          className={`flex-1 h-11 rounded-full text-[13.5px] font-bold tracking-[-0.01em] active:scale-[0.98] transition-all duration-300 ${
            applied ? "bg-primary/80" : "bg-primary text-primary-foreground"
          }`}
        >
          Apply changes
        </button>
      </div>
    </div>
  );
}

/* ---------- SCREEN 6 — SUMMARY ---------- */
export function SummaryScreen({ go, session, beginComposing, setMiniPlayer, setElapsedTime, setPlayerPhaseIndex, setIsPlaying }: FlowProps) {
  const [saved, setSaved] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState<string | null>(null);

  return (
    <div className="h-full relative overflow-y-auto no-scrollbar pb-10 transition-[background] duration-700" style={{ background: session.atmosphere.summary }}>
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10 bg-gradient-to-b from-[oklch(0.05_0_0/0.35)] to-transparent">
        <button
          type="button"
          onClick={() => {
            setMiniPlayer({ session, phaseIndex: 3, elapsedTime: SESSION_TOTAL_MS, isPlaying: false });
            go(1);
          }}
          className="p-1 -ml-0.5 text-muted-foreground active:text-foreground/80 transition-colors"
          aria-label="Back to Home"
        >
          <ChevronDown width={24} height={24} />
        </button>
        <div className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-primary/90 flex items-center gap-1.5">
          <SparkIcon width={12} height={12} /> Session complete
        </div>
        <span className="w-6" />
      </div>

      <div className="px-5 mt-3">
        <h1 className="text-[20px] font-bold tracking-[-0.02em] leading-[1.1] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {session.sessionName}
        </h1>
        <p className="text-[12.5px] text-muted-foreground mt-2">{session.duration} · 4 emotional phases</p>
      </div>

      <div className="grid place-items-center mt-2">
        <PhaseOrb
          size={170}
          intensity={session.orbGlowOpacity}
          colors={composingOrbColors(session)}
        />
      </div>

      <div className="px-4 grid grid-cols-3 gap-2 mt-3">
        {SUMMARY_METRICS.map(s => (
          <div key={s.l} className="rounded-xl bg-white/[0.04] px-3 py-3 text-center">
            <div className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground leading-tight">{s.l}</div>
            <div className="text-[18px] font-extrabold tracking-[-0.025em] mt-0.5 tabular-nums">{s.v}</div>
            <div className="text-[9.5px] text-muted-foreground tracking-[-0.005em]">{s.t}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-white/[0.03] p-4">
        <div className="flex items-center gap-2">
          <SparkIcon width={12} height={12} className="text-primary/80" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/85">Reflection</span>
        </div>
        <p className="text-[13.5px] leading-snug mt-2 text-foreground/90 tracking-[-0.005em]">
          {session.reflection}
        </p>
      </div>

      <div className="px-5 mt-6 text-center">
        <h3 className="text-[17px] font-bold tracking-[-0.02em]">How do you feel now?</h3>
        {moodNote && (
          <p className="text-[12px] text-primary/90 mt-2 animate-fade-up">{moodNote}</p>
        )}
        <div className="flex justify-center flex-wrap gap-2 mt-3">
          {["Calmer", "Focused", "Energized", "Reset"].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setMood(f);
                setMoodNote(`Noted — feeling ${f.toLowerCase()}.`);
              }}
              className={`px-3 py-1.5 rounded-full text-[12px] tracking-[-0.005em] transition-colors duration-200 ${
                mood === f ? "bg-primary/20 text-primary" : "bg-white/[0.05] text-foreground/85 active:bg-white/[0.09]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 space-y-2">
        <button
          type="button"
          onClick={() => setSaved(true)}
          className={`w-full h-11 rounded-full text-[14px] font-bold tracking-[-0.01em] transition-all duration-200 ${
            saved ? "bg-white/[0.12] text-foreground" : "bg-primary text-primary-foreground active:scale-[0.98]"
          }`}
        >
          {saved ? "Saved to your library" : "Save session"}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/[0.06] text-[13px] font-semibold tracking-[-0.005em] active:bg-white/[0.1] transition-colors">Replay</button>
          <button type="button" onClick={beginComposing} className="flex-1 h-11 rounded-full bg-white/[0.06] text-[13px] font-semibold tracking-[-0.005em] active:bg-white/[0.1] transition-colors">Generate similar</button>
        </div>
      </div>
    </div>
  );
}