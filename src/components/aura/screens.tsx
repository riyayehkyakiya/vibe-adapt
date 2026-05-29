import { useEffect, useState } from "react";
import { AuraOrb, Waveform, EnergyCurve } from "./AuraOrb";
import {
  HomeIcon, SearchIcon, LibraryIcon, SparkIcon, PlayIcon, PauseIcon,
  PrevIcon, NextIcon, HeartIcon, CloseIcon, ChevronDown, Dots,
  PlusIcon, ChevronRight,
} from "./icons";

type Nav = (s: number) => void;

/* ---------- AlbumArt: deterministic blurred mosaic that reads as artwork ---------- */
function hueFromSeed(seed: string, offset = 0) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h + offset * 47) % 360;
}

function AlbumArt({
  seed,
  size = 150,
  rounded = "rounded-[3px]",
}: { seed: string; size?: number; rounded?: string }) {
  const h1 = hueFromSeed(seed, 0);
  const h2 = hueFromSeed(seed, 1);
  const h3 = hueFromSeed(seed, 2);
  const bg = `
    radial-gradient(circle at 22% 28%, oklch(0.72 0.18 ${h1} / 0.95), transparent 55%),
    radial-gradient(circle at 78% 30%, oklch(0.55 0.2 ${h2} / 0.9), transparent 60%),
    radial-gradient(circle at 50% 88%, oklch(0.42 0.16 ${h3} / 0.95), transparent 65%),
    linear-gradient(160deg, oklch(0.32 0.08 ${h1}) 0%, oklch(0.18 0.05 ${h3}) 100%)
  `;
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded}`}
      style={{ width: size, height: size, background: bg }}
    >
      {/* subtle film grain / vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(120% 80% at 50% 0%, transparent 40%, oklch(0 0 0 / 0.35) 100%)",
      }} />
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.08]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, oklch(1 0 0 / 0.6) 0 1px, transparent 1px 3px)",
      }} />
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
    <div className="absolute bottom-0 inset-x-0 pt-3 pb-6 px-6 flex items-center justify-between bg-gradient-to-t from-background via-background/95 to-transparent">
      {items.map(({ k, Icon, label }) => {
        const on = active === k;
        return (
          <div key={k} className={`flex flex-col items-center gap-1 ${on ? "text-foreground" : "text-muted-foreground"}`}>
            <Icon width={23} height={23} strokeWidth={on ? 2.4 : 1.8} />
            <span className="text-[10px] font-semibold tracking-[-0.01em]">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MiniPlayer({
  phase = "Cognitive Activation",
  progress = 0.28,
  onTap,
}: { phase?: string; progress?: number; onTap?: () => void }) {
  return (
    <div className="absolute bottom-[78px] inset-x-2 rounded-md overflow-hidden shadow-[0_8px_24px_-12px_oklch(0_0_0/0.6)]">
      <button
        onClick={onTap}
        className="w-full text-left bg-[oklch(0.22_0.02_220)] flex items-center gap-3 p-2 pr-3 active:bg-[oklch(0.25_0.02_220)] transition-colors"
      >
        <div className="w-10 h-10 rounded-[3px] overflow-hidden shrink-0 relative"
          style={{ background: "radial-gradient(circle at 35% 30%, oklch(0.7 0.14 220), oklch(0.3 0.1 260))" }}
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(circle at 70% 80%, oklch(0.55 0.18 200 / 0.7), transparent 60%)",
          }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold truncate tracking-[-0.01em]">Deep Focus Recovery Arc</div>
          <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
            <SparkIcon width={10} height={10} className="text-primary" />
            <span>Aura · {phase}</span>
          </div>
        </div>
        <HeartIcon width={20} height={20} className="text-primary" />
        <PauseIcon width={22} height={22} />
      </button>
      <div className="h-[2px] bg-white/15">
        <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

/* ---------- SCREEN 1 — HOME ---------- */
export function HomeScreen({ go }: { go: Nav }) {
  const chips = ["All", "Music", "Podcasts", "Aura"];
  const [activeChip, setActiveChip] = useState("All");
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
    { title: "Late Night Tapes", sub: "Playlist" },
    { title: "Ambient Works Vol. II", sub: "Album · Aphex Twin" },
    { title: "Slow Mornings", sub: "Playlist" },
    { title: "Night Drive", sub: "Playlist" },
  ];

  return (
    <div className="h-full relative bg-background">
      {/* faint header tint, fades as you scroll */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, oklch(0.28 0.05 200 / 0.55), transparent)" }} />
      <div className="h-full overflow-y-auto no-scrollbar pb-[160px] relative">
        {/* greeting — avatar TOP-LEFT, Spotify-style */}
        <div className="px-4 pt-3 flex items-center gap-3">
          <button className="w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 25), oklch(0.4 0.15 320))" }}>
            A
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {chips.map(c => {
              const isAura = c === "Aura";
              const active = activeChip === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveChip(c)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.08] text-foreground hover:bg-white/[0.12]"
                  }`}
                >
                  {isAura && <SparkIcon width={11} height={11} className="inline -mt-0.5 mr-1" />}
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* quick grid */}
        <div className="grid grid-cols-2 gap-2 px-4 mt-5">
          {quickRow.map(q => (
            <button key={q.title} className="flex items-center gap-2 rounded-[4px] bg-white/[0.07] hover:bg-white/[0.11] overflow-hidden h-14 active:bg-white/[0.14] transition-colors">
              {q.liked
                ? <LikedSongsArt size={56} rounded="rounded-l-[4px] rounded-r-none" />
                : <AlbumArt seed={q.title} size={56} rounded="rounded-l-[4px] rounded-r-none" />}
              <span className="text-[13px] font-semibold truncate pr-2 tracking-[-0.01em]">{q.title}</span>
            </button>
          ))}
        </div>

        {/* AURA module — restrained, thin green border + faint edge glow */}
        <div className="mx-4 mt-7 animate-fade-up">
          <button
            onClick={() => go(2)}
            className="w-full text-left rounded-2xl relative overflow-hidden border border-primary/35 bg-[oklch(0.17_0.02_200)] p-4"
          >
            <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, oklch(0.78 0.19 150 / 0.6), transparent 70%)" }} />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <SparkIcon width={14} height={14} className="text-primary" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary">Aura</span>
                <span className="text-[9.5px] font-semibold text-foreground/80 px-1.5 py-0.5 rounded bg-white/10 tracking-wider">NEW</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Adaptive listening</span>
            </div>
            <h3 className="text-[19px] font-extrabold tracking-[-0.025em] mt-3 leading-tight">
              How do you want to feel?
            </h3>
            <p className="text-[12.5px] text-muted-foreground mt-1 leading-snug">
              Describe your state. Aura composes a session that adapts in real time.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {auraChips.map(c => (
                <span key={c} className="text-[11.5px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-foreground/90">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[12px]">
              <Waveform bars={14} className="h-3.5 opacity-60" />
              <span className="text-primary font-semibold flex items-center gap-1">Start a session <ChevronRight width={14} height={14} /></span>
            </div>
          </button>
        </div>

        {/* Made For You */}
        <section className="mt-7">
          <h2 className="px-4 text-[20px] font-extrabold tracking-[-0.025em]">Made For You</h2>
          <div className="flex gap-4 px-4 mt-3 overflow-x-auto no-scrollbar">
            {madeForYou.map(m => (
              <div key={m.title} className="w-[148px] shrink-0">
                <AlbumArt seed={m.title} size={148} />
                <div className="mt-2 text-[13px] font-semibold truncate tracking-[-0.01em]">{m.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently played */}
        <section className="mt-7">
          <h2 className="px-4 text-[20px] font-extrabold tracking-[-0.025em]">Recently played</h2>
          <div className="flex gap-4 px-4 mt-3 overflow-x-auto no-scrollbar">
            {recents.map(r => (
              <div key={r.title} className="w-[148px] shrink-0">
                <AlbumArt seed={r.title + r.sub} size={148} />
                <div className="mt-2 text-[13px] font-semibold truncate tracking-[-0.01em]">{r.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{r.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Jump back in */}
        <section className="mt-7">
          <h2 className="px-4 text-[20px] font-extrabold tracking-[-0.025em]">Jump back in</h2>
          <div className="flex gap-4 px-4 mt-3 overflow-x-auto no-scrollbar">
            {["Sunday Strings", "Deep House Relax", "Indie Pop Mix"].map(t => (
              <div key={t} className="w-[148px] shrink-0">
                <AlbumArt seed={t} size={148} />
                <div className="mt-2 text-[13px] font-semibold truncate tracking-[-0.01em]">{t}</div>
                <div className="text-[11px] text-muted-foreground truncate">Playlist</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MiniPlayer onTap={() => go(4)} />
      <TabBar active="home" />
    </div>
  );
}

/* ---------- SCREEN 2 — INPUT ---------- */
export function InputScreen({ go }: { go: Nav }) {
  const [text, setText] = useState("I'm exhausted but need to focus for 45 minutes.");
  const opts = [
    { k: "vocals", title: "Lower vocal density", desc: "Prefer instrumental and low-lyric edits", on: true },
    { k: "focus", title: "Deep focus mode", desc: "Minimize abrupt transitions and notifications", on: true },
    { k: "ambient", title: "Ambient emphasis", desc: "Layered pads and warm low-end textures", on: true },
    { k: "transitions", title: "Soft phase transitions", desc: "Crossfade between emotional phases", on: false },
  ];
  const [state, setState] = useState(opts);
  return (
    <div className="h-full relative flex flex-col" style={{ background: "radial-gradient(110% 55% at 50% 0%, oklch(0.2 0.06 210) 0%, oklch(0.09 0.02 230) 50%, oklch(0.05 0 0) 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={() => go(1)} className="p-1 -ml-1"><ChevronDown width={26} height={26} /></button>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] uppercase text-primary">
          <SparkIcon width={13} height={13} /> Aura
        </div>
        <button className="p-1 -mr-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-5 mt-1">
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] leading-[1.1]">How do you<br/>want to feel?</h1>
          <p className="text-[13.5px] text-muted-foreground mt-2 leading-snug">Describe your state in your own words. Aura composes a session and adapts as you listen.</p>
        </div>

        <div className="px-4 mt-5">
          <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-4">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full bg-transparent outline-none resize-none text-[16px] leading-snug placeholder:text-muted-foreground tracking-[-0.01em]"
              rows={3}
            />
            <div className="mt-2 flex items-center justify-between">
              <Waveform bars={18} className="h-4 opacity-70" />
              <span className="text-[11px] text-muted-foreground">Interpreting…</span>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4 grid grid-cols-3 gap-2">
          {[
            { l: "Intent", v: "Sustained focus" },
            { l: "Energy curve", v: "Low → Steady" },
            { l: "Duration", v: "45 min" },
          ].map(d => (
            <div key={d.l} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
              <div className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">{d.l}</div>
              <div className="text-[12.5px] font-semibold mt-0.5 tracking-[-0.01em]">{d.v}</div>
            </div>
          ))}
        </div>

        <div className="px-5 mt-5 flex items-center gap-2 text-[12px] text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Adaptive listening enabled
        </div>

        <div className="px-4 mt-3 space-y-2 pb-32">
          {state.map((o, i) => (
            <button
              key={o.k}
              onClick={() => setState(s => s.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
              className="w-full flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-left active:bg-white/[0.07] transition-colors"
            >
              <div className="min-w-0 pr-3">
                <div className="text-[14px] font-semibold tracking-[-0.01em]">{o.title}</div>
                <div className="text-[11.5px] text-muted-foreground leading-snug">{o.desc}</div>
              </div>
              <span className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 ${o.on ? "bg-primary" : "bg-white/15"}`}>
                <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${o.on ? "translate-x-4" : ""}`} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 pb-6 bg-gradient-to-t from-black via-black/85 to-transparent">
        <button
          onClick={() => go(3)}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground text-[15px] font-bold tracking-[-0.01em] active:scale-[0.98] transition-transform"
        >
          Compose session
        </button>
      </div>
    </div>
  );
}

/* ---------- SCREEN 3 — GENERATION ---------- */
export function GeneratingScreen({ go }: { go: Nav }) {
  const steps = [
    "Interpreting emotional intent",
    "Calibrating focus depth",
    "Designing energy progression",
    "Composing adaptive arc",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps.length - 1) {
      const t = setTimeout(() => go(4), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 950);
    return () => clearTimeout(t);
  }, [step, go]);

  return (
    <div className="h-full relative overflow-hidden" style={{ background: "radial-gradient(70% 45% at 50% 30%, oklch(0.18 0.07 210) 0%, oklch(0.07 0.02 235) 55%, oklch(0.03 0 0) 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => go(2)} className="p-1 text-muted-foreground"><CloseIcon width={22} height={22} /></button>
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] uppercase text-primary">
          <SparkIcon width={13} height={13} /> Aura
        </div>
        <span className="w-6" />
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <AuraOrb size={240} palette="compose" />
      </div>

      <div className="px-6 mt-3 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Composing</div>
        <h2 className="text-[22px] font-extrabold tracking-[-0.025em] mt-2">Deep Focus Recovery Arc</h2>
        <p className="text-[12.5px] text-muted-foreground mt-1">45 minutes · 4 emotional phases</p>
      </div>

      <div className="px-6 mt-5">
        <EnergyCurve progress={0.05 + step * 0.22} />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1 tracking-wide">
          <span>Settle</span><span>Activate</span><span>Flow</span><span>Release</span>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-2.5">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s} className={`flex items-center gap-3 text-[13px] tracking-[-0.01em] transition-colors ${active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/45"}`}>
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? "bg-primary animate-pulse" : done ? "bg-primary/70" : "bg-white/20"}`} />
              {s}{active && "…"}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center text-[11px] text-muted-foreground tracking-[-0.005em]">
        Balancing recovery with sustained attention
      </div>
    </div>
  );
}

/* ---------- SCREEN 4 — PLAYER ---------- */
export function PlayerScreen({ go }: { go: Nav }) {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="h-full relative overflow-y-auto no-scrollbar" style={{ background: "linear-gradient(180deg, oklch(0.18 0.07 240) 0%, oklch(0.09 0.04 250) 50%, oklch(0.04 0.01 240) 100%)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10 bg-gradient-to-b from-black/30 to-transparent">
        <button onClick={() => go(1)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-center">
          <div className="text-[9.5px] uppercase tracking-[0.28em] text-muted-foreground">Aura Session</div>
          <div className="text-[12.5px] font-semibold tracking-[-0.01em]">Deep Focus Recovery Arc</div>
        </div>
        <button onClick={() => go(5)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="grid place-items-center mt-4">
        <AuraOrb size={280} palette="focus" />
      </div>

      {/* track + phase */}
      <div className="px-5 mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary flex items-center gap-1.5">
            <SparkIcon width={10} height={10} /> Phase 2 of 4 · Activation
          </div>
          <div className="text-[19px] font-extrabold tracking-[-0.025em] mt-1 leading-tight">Kerala</div>
          <div className="text-[12.5px] text-muted-foreground tracking-[-0.005em]">Bonobo · Aura instrumental edit</div>
        </div>
        <HeartIcon width={22} height={22} className="text-primary" />
      </div>

      {/* progress */}
      <div className="px-5 mt-4">
        <div className="h-1 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full w-[28%] bg-foreground rounded-full" />
        </div>
        <div className="flex justify-between text-[10.5px] text-muted-foreground mt-1.5 tabular-nums">
          <span>12:18</span><span>−32:42</span>
        </div>
      </div>

      {/* controls */}
      <div className="px-8 mt-3 flex items-center justify-between">
        <PrevIcon width={28} height={28} className="text-foreground/90" />
        <button onClick={() => setPlaying(p => !p)} className="w-[64px] h-[64px] rounded-full bg-white grid place-items-center text-black active:scale-95 transition-transform shadow-lg">
          {playing ? <PauseIcon width={26} height={26} /> : <PlayIcon width={26} height={26} />}
        </button>
        <NextIcon width={28} height={28} className="text-foreground/90" />
      </div>

      {/* emotional arc with progress marker */}
      <div className="mx-5 mt-6 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Emotional arc</div>
          <span className="text-[10.5px] text-primary font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> adapting live
          </span>
        </div>
        <EnergyCurve progress={0.32} className="mt-1" />
        <div className="flex justify-between -mt-1">
          {["Settle", "Activate", "Flow", "Release"].map((p, i) => (
            <div key={p} className={`text-[10px] tracking-[-0.005em] ${i === 1 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{p}</div>
          ))}
        </div>
      </div>

      {/* live AI adjustment */}
      <div className="mx-5 mt-3 mb-8 rounded-xl border border-primary/25 bg-primary/[0.05] px-3.5 py-3 flex items-start gap-2 animate-fade-up">
        <SparkIcon width={13} height={13} className="text-primary mt-[3px] shrink-0" />
        <div className="text-[12px] leading-snug tracking-[-0.005em]">
          <span className="font-semibold text-primary">Aura · live</span>
          <span className="text-foreground/90"> — Reducing lyrical intensity to preserve cognitive bandwidth.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- SCREEN 5 — ADAPTATION ---------- */
export function AdaptScreen({ go }: { go: Nav }) {
  return (
    <div className="h-full relative overflow-y-auto no-scrollbar pb-28" style={{ background: "linear-gradient(180deg, oklch(0.18 0.07 60) 0%, oklch(0.08 0.03 40) 55%, oklch(0.03 0.01 30) 100%)" }}>
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 bg-gradient-to-b from-black/30 to-transparent z-10">
        <button onClick={() => go(4)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-center">
          <div className="text-[9.5px] uppercase tracking-[0.28em] text-muted-foreground">Aura Session</div>
          <div className="text-[12.5px] font-semibold tracking-[-0.01em]">Deep Focus Recovery Arc</div>
        </div>
        <button onClick={() => go(6)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="grid place-items-center mt-2">
        <AuraOrb size={200} intensity={0.75} palette="fatigue" />
      </div>

      <div className="mx-4 mt-2 rounded-2xl bg-white/[0.05] border border-white/10 p-4 animate-fade-up">
        <div className="flex items-center gap-2">
          <SparkIcon width={13} height={13} className="text-primary" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-primary">Aura · sensing</span>
        </div>
        <h3 className="text-[16px] font-extrabold tracking-[-0.02em] mt-2 leading-snug">
          Noticing signs of cognitive fatigue.
        </h3>
        <p className="text-[12.5px] text-muted-foreground mt-1 leading-snug">
          Recent skips and shorter engagement suggest stimulation is too high. Aura is gently recalibrating your arc.
        </p>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { l: "Skip rate", v: "4×", t: "last 6 min" },
            { l: "Engagement", v: "−28%", t: "vs baseline" },
            { l: "Load index", v: "Rising", t: "trend" },
          ].map(s => (
            <div key={s.l} className="rounded-lg bg-black/35 px-2.5 py-2">
              <div className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">{s.l}</div>
              <div className="text-[13px] font-bold mt-0.5 tracking-[-0.01em] tabular-nums">{s.v}</div>
              <div className="text-[9.5px] text-muted-foreground">{s.t}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5">
          {[
            "Softening transitions between tracks",
            "Emphasizing instrumental layers",
            "Lowering overall stimulation by 18%",
          ].map(a => (
            <div key={a} className="flex items-center gap-2 text-[12.5px] tracking-[-0.005em]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-foreground/90">{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Recalibrating emotional curve</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> stabilizing
          </span>
        </div>
        <EnergyCurve progress={0.48} className="mt-1" />
        <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
          <span>Settle</span><span>Activate</span><span>Flow</span><span>Release</span>
        </div>
      </div>

      <div className="px-4 mt-4 flex gap-2">
        <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/10 text-[13.5px] font-semibold tracking-[-0.01em] active:bg-white/15 transition-colors">Keep as-is</button>
        <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-primary text-primary-foreground text-[13.5px] font-bold tracking-[-0.01em] active:scale-[0.98] transition-transform">Apply changes</button>
      </div>
    </div>
  );
}

/* ---------- SCREEN 6 — SUMMARY ---------- */
export function SummaryScreen({ go }: { go: Nav }) {
  return (
    <div className="h-full relative overflow-y-auto no-scrollbar pb-10" style={{ background: "linear-gradient(180deg, oklch(0.2 0.06 25) 0%, oklch(0.09 0.03 280) 55%, oklch(0.03 0 240) 100%)" }}>
      <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10 bg-gradient-to-b from-black/30 to-transparent">
        <button onClick={() => go(4)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-1.5">
          <SparkIcon width={12} height={12} /> Session complete
        </div>
        <span className="w-6" />
      </div>

      <div className="px-5 mt-3">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] leading-[1.05]">Deep Focus<br/>Recovery Arc</h1>
        <p className="text-[12.5px] text-muted-foreground mt-2">Today · 45 minutes · 4 emotional phases</p>
      </div>

      <div className="grid place-items-center mt-2">
        <AuraOrb size={170} intensity={0.65} palette="recovery" />
      </div>

      <div className="px-4 grid grid-cols-3 gap-2 mt-2">
        {[
          { l: "Sustained focus", v: "42m", t: "of 45 min" },
          { l: "Stabilization", v: "+34%", t: "vs baseline" },
          { l: "Adaptations", v: "3", t: "applied live" },
        ].map(s => (
          <div key={s.l} className="rounded-xl bg-white/[0.05] border border-white/10 px-3 py-3">
            <div className="text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground leading-tight">{s.l}</div>
            <div className="text-[18px] font-extrabold tracking-[-0.025em] mt-0.5 tabular-nums">{s.v}</div>
            <div className="text-[9.5px] text-muted-foreground tracking-[-0.005em]">{s.t}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <div className="text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">Emotional progression</div>
        <EnergyCurve progress={1} className="mt-1" />
        <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
          <span>Settle</span><span>Activate</span><span>Flow</span><span>Release</span>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/25 p-4">
        <div className="flex items-center gap-2">
          <SparkIcon width={13} height={13} className="text-primary" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-primary">Aura reflection</span>
        </div>
        <p className="text-[13.5px] leading-snug mt-2 text-foreground/95 tracking-[-0.005em]">
          You held deeper concentration after lower-intensity ambient transitions were introduced around minute 18.
        </p>
      </div>

      <div className="px-5 mt-6 text-center">
        <h3 className="text-[17px] font-bold tracking-[-0.02em]">How do you feel now?</h3>
        <div className="flex justify-center flex-wrap gap-2 mt-3">
          {["Calmer", "Focused", "Energized", "Reset"].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[12px] tracking-[-0.005em] active:bg-white/[0.12] transition-colors">{f}</button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 space-y-2">
        <button className="w-full h-11 rounded-full bg-primary text-primary-foreground text-[14px] font-bold tracking-[-0.01em] active:scale-[0.98] transition-transform">Save session</button>
        <div className="flex gap-2">
          <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/10 text-[13px] font-semibold tracking-[-0.005em] active:bg-white/15 transition-colors">Replay</button>
          <button onClick={() => go(3)} className="flex-1 h-11 rounded-full bg-white/10 text-[13px] font-semibold tracking-[-0.005em] active:bg-white/15 transition-colors">Compose similar</button>
        </div>
      </div>
    </div>
  );
}