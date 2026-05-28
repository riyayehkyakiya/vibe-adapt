import { useEffect, useState } from "react";
import { AuraOrb, Waveform, EnergyCurve } from "./AuraOrb";
import {
  HomeIcon, SearchIcon, LibraryIcon, SparkIcon, PlayIcon, PauseIcon,
  ShuffleIcon, RepeatIcon, PrevIcon, NextIcon, HeartIcon, CloseIcon,
  BellIcon, ClockIcon, ChevronDown, Dots,
} from "./icons";

type Nav = (s: number) => void;

/* ---------- shared ---------- */
function TabBar({ active = "home" }: { active?: "home" | "search" | "library" }) {
  const item = (k: string, Icon: typeof HomeIcon, label: string) => (
    <div className={`flex flex-col items-center gap-1 ${active === k ? "text-foreground" : "text-muted-foreground"}`}>
      <Icon width={24} height={24} />
      <span className="text-[10.5px] font-semibold tracking-tight">{label}</span>
    </div>
  );
  return (
    <div className="absolute bottom-0 inset-x-0 pt-2 pb-6 px-10 flex items-center justify-between bg-gradient-to-t from-black via-black/95 to-transparent">
      {item("home", HomeIcon, "Home")}
      {item("search", SearchIcon, "Search")}
      {item("library", LibraryIcon, "Your Library")}
    </div>
  );
}

function MiniPlayer({ phase = "Cognitive Activation" }: { phase?: string }) {
  return (
    <div className="absolute bottom-[78px] inset-x-2 rounded-lg overflow-hidden">
      <div className="bg-[oklch(0.24_0.04_180)] flex items-center gap-3 p-2 pr-3">
        <div className="w-10 h-10 rounded-md bg-gradient-aura shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold truncate">Deep Focus Recovery Arc</div>
          <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
            <SparkIcon width={11} height={11} className="text-primary" /> Aura · {phase}
          </div>
        </div>
        <HeartIcon width={20} height={20} className="text-primary" />
        <PauseIcon width={22} height={22} />
      </div>
      <div className="h-[2px] bg-white/20"><div className="h-full bg-white w-2/5" /></div>
    </div>
  );
}

/* ---------- SCREEN 1 — HOME ---------- */
export function HomeScreen({ go }: { go: Nav }) {
  const chips = ["All", "Music", "Podcasts", "Aura"];
  const [activeChip, setActiveChip] = useState("All");
  const auraChips = ["Exhausted but need focus", "Late-night calm", "Gym recovery", "Recover after burnout", "Need emotional reset"];
  const quickRow = [
    { title: "Liked Songs", grad: "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.85 0.05 270))" },
    { title: "Discover Weekly", grad: "linear-gradient(135deg, oklch(0.35 0.12 250), oklch(0.7 0.18 200))" },
    { title: "Daily Mix 1", grad: "linear-gradient(135deg, oklch(0.6 0.2 30), oklch(0.4 0.15 10))" },
    { title: "Chill Hits", grad: "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.3 0.1 180))" },
    { title: "Lo-Fi Beats", grad: "linear-gradient(135deg, oklch(0.5 0.15 320), oklch(0.3 0.08 290))" },
    { title: "Focus Flow", grad: "linear-gradient(135deg, oklch(0.45 0.12 220), oklch(0.25 0.06 240))" },
  ];
  const madeForYou = [
    { title: "Daily Mix 2", sub: "Bonobo, Tycho, Floating Points and more" },
    { title: "Daily Mix 3", sub: "Tame Impala, Khruangbin, Mac DeMarco" },
    { title: "Release Radar", sub: "Catch all the latest music from artists you follow" },
    { title: "On Repeat", sub: "Songs you can't stop playing" },
  ];

  return (
    <div className="h-full relative bg-background">
      <div className="absolute inset-0 bg-gradient-fade pointer-events-none" />
      <div className="h-full overflow-y-auto no-scrollbar pb-[160px]">
        {/* greeting */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <h1 className="text-[22px] font-extrabold tracking-tight">Good evening</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <BellIcon width={22} height={22} />
            <ClockIcon width={22} height={22} />
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-aura-2 grid place-items-center text-[11px] font-bold text-primary-foreground">A</div>
          </div>
        </div>

        {/* chips */}
        <div className="flex gap-2 px-4 mt-4 overflow-x-auto no-scrollbar">
          {chips.map(c => {
            const isAura = c === "Aura";
            const active = activeChip === c;
            return (
              <button
                key={c}
                onClick={() => setActiveChip(c)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition ${
                  active
                    ? isAura ? "bg-gradient-aura text-primary-foreground" : "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/90"
                } ${isAura && !active ? "ring-1 ring-primary/40" : ""}`}
              >
                {isAura && <span className="mr-1">✨</span>}{c}
              </button>
            );
          })}
        </div>

        {/* quick grid */}
        <div className="grid grid-cols-2 gap-2 px-4 mt-5">
          {quickRow.map(q => (
            <div key={q.title} className="flex items-center gap-2 rounded-md bg-white/[0.06] hover:bg-white/[0.1] overflow-hidden h-14">
              <div className="w-14 h-14 shrink-0" style={{ background: q.grad }} />
              <span className="text-[13px] font-semibold truncate pr-2">{q.title}</span>
            </div>
          ))}
        </div>

        {/* AURA module */}
        <div className="mx-4 mt-7">
          <button
            onClick={() => go(2)}
            className="w-full text-left rounded-2xl p-[1px] bg-gradient-aura"
          >
            <div className="rounded-2xl bg-[oklch(0.13_0.02_200)] p-4 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-aura opacity-30 blur-3xl" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparkIcon width={16} height={16} className="text-primary" />
                  <span className="text-[12px] font-bold tracking-[0.18em] uppercase text-primary">Aura</span>
                  <span className="text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-white/10">NEW</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Adaptive</span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-1.5">Adaptive listening for how you feel.</p>
              <h3 className="text-[20px] font-extrabold tracking-tight mt-3 leading-tight">How do you want to feel?</h3>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {auraChips.map(c => (
                  <span key={c} className="text-[12px] px-2.5 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-foreground/90">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Waveform bars={14} className="h-4 opacity-70" /></span>
                <span className="text-primary font-semibold">Start a session →</span>
              </div>
            </div>
          </button>
        </div>

        {/* Made For You */}
        <section className="mt-7">
          <h2 className="px-4 text-[19px] font-extrabold tracking-tight">Made For You</h2>
          <div className="flex gap-3 px-4 mt-3 overflow-x-auto no-scrollbar">
            {madeForYou.map((m, i) => (
              <div key={m.title} className="w-[150px] shrink-0">
                <div className="w-[150px] h-[150px] rounded-md" style={{ background: `linear-gradient(${135 + i * 30}deg, oklch(0.55 0.18 ${145 + i * 40}), oklch(0.25 0.08 ${200 + i * 30}))` }} />
                <div className="mt-2 text-[13px] font-semibold truncate">{m.title}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently played */}
        <section className="mt-6">
          <h2 className="px-4 text-[19px] font-extrabold tracking-tight">Recently played</h2>
          <div className="flex gap-3 px-4 mt-3 overflow-x-auto no-scrollbar">
            {["Late Night Tapes", "Ambient Works", "Slow Mornings", "Night Drive"].map((t, i) => (
              <div key={t} className="w-[150px] shrink-0">
                <div className="w-[150px] h-[150px] rounded-md" style={{ background: `linear-gradient(${45 + i * 40}deg, oklch(0.4 0.12 ${280 + i * 20}), oklch(0.2 0.05 ${220 + i * 30}))` }} />
                <div className="mt-2 text-[13px] font-semibold truncate">{t}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MiniPlayer />
      <TabBar active="home" />
    </div>
  );
}

/* ---------- SCREEN 2 — INPUT ---------- */
export function InputScreen({ go }: { go: Nav }) {
  const [text, setText] = useState("I'm exhausted but need to focus for 45 minutes.");
  const opts = [
    { k: "vocals", title: "Lower vocals", desc: "Reduce lyrical density", on: true },
    { k: "focus", title: "Deep focus mode", desc: "Minimize distractions", on: true },
    { k: "ambient", title: "Ambient emphasis", desc: "Layered textures, soft pads", on: true },
    { k: "transitions", title: "Smooth energy transitions", desc: "Crossfaded phase shifts", on: false },
  ];
  const [state, setState] = useState(opts);
  return (
    <div className="h-full relative flex flex-col" style={{ background: "radial-gradient(120% 60% at 50% 0%, oklch(0.22 0.06 200) 0%, oklch(0.06 0.01 240) 55%, oklch(0 0 0) 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => go(1)} className="p-1 -ml-1"><ChevronDown width={26} height={26} /></button>
        <div className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.18em] uppercase text-primary">
          <SparkIcon width={14} height={14} /> Aura
        </div>
        <button className="p-1 -mr-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="px-5 mt-2">
        <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">How do you want to feel?</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5">Describe your state. Aura will compose an adaptive listening session.</p>
      </div>

      <div className="px-4 mt-5">
        <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-transparent outline-none resize-none text-[16px] leading-snug placeholder:text-muted-foreground"
            rows={3}
          />
          <div className="mt-2 flex items-center justify-between">
            <Waveform bars={20} className="h-5 opacity-80" />
            <span className="text-[11px] text-muted-foreground">Listening…</span>
          </div>
        </div>
      </div>

      {/* detected */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "Intent", v: "Focus" },
          { l: "Energy", v: "Low → Steady" },
          { l: "Duration", v: "45 min" },
        ].map(d => (
          <div key={d.l} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.l}</div>
            <div className="text-[13px] font-semibold mt-0.5">{d.v}</div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5 flex items-center gap-2 text-[12px] text-primary">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Adaptive listening enabled
      </div>

      <div className="px-4 mt-3 space-y-2 overflow-y-auto no-scrollbar pb-3">
        {state.map((o, i) => (
          <button
            key={o.k}
            onClick={() => setState(s => s.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
            className="w-full flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-left"
          >
            <div>
              <div className="text-[14px] font-semibold">{o.title}</div>
              <div className="text-[11.5px] text-muted-foreground">{o.desc}</div>
            </div>
            <span className={`w-10 h-6 rounded-full p-0.5 transition ${o.on ? "bg-primary" : "bg-white/15"}`}>
              <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${o.on ? "translate-x-4" : ""}`} />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 pb-6">
        <button
          onClick={() => go(3)}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground text-[15px] font-bold tracking-tight active:scale-[0.99] transition"
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
    "Analyzing emotional intent…",
    "Calibrating focus depth…",
    "Designing energy progression…",
    "Generating adaptive emotional arc…",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= steps.length - 1) {
      const t = setTimeout(() => go(4), 1300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(step + 1), 1100);
    return () => clearTimeout(t);
  }, [step, go]);

  return (
    <div className="h-full relative overflow-hidden" style={{ background: "radial-gradient(80% 50% at 50% 35%, oklch(0.2 0.08 200) 0%, oklch(0.05 0.01 240) 60%, oklch(0 0 0) 100%)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => go(2)} className="p-1 text-muted-foreground"><CloseIcon width={22} height={22} /></button>
        <div className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.18em] uppercase text-primary">
          <SparkIcon width={14} height={14} /> Aura
        </div>
        <span className="w-6" />
      </div>

      <div className="flex flex-col items-center justify-center mt-10">
        <AuraOrb size={260} />
      </div>

      <div className="px-6 mt-4 text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Composing</div>
        <h2 className="text-[22px] font-extrabold tracking-tight mt-1.5">Deep Focus Recovery Arc</h2>
        <p className="text-[13px] text-muted-foreground mt-1">45 minutes · 4 emotional phases</p>
      </div>

      <div className="px-6 mt-6">
        <EnergyCurve />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
          <span>Settle</span><span>Activate</span><span>Flow</span><span>Release</span>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-2">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s} className={`flex items-center gap-3 text-[13.5px] transition ${active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary animate-pulse" : done ? "bg-primary/60" : "bg-white/20"}`} />
              {s}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 inset-x-0 text-center text-[11px] text-muted-foreground">
        Balancing recovery with sustained attention
      </div>
    </div>
  );
}

/* ---------- SCREEN 4 — PLAYER ---------- */
export function PlayerScreen({ go }: { go: Nav }) {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="h-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.22 0.08 195) 0%, oklch(0.1 0.04 230) 45%, oklch(0.04 0.01 240) 100%)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={() => go(1)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Aura Session</div>
          <div className="text-[12.5px] font-semibold">Deep Focus Recovery Arc</div>
        </div>
        <button onClick={() => go(5)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="grid place-items-center mt-6">
        <AuraOrb size={300} />
      </div>

      {/* phase pill */}
      <div className="px-5 mt-6 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary flex items-center gap-1.5">
            <SparkIcon width={11} height={11} /> Current phase
          </div>
          <div className="text-[20px] font-extrabold tracking-tight mt-0.5">Cognitive Activation</div>
          <div className="text-[12px] text-muted-foreground">Bonobo — Kerala (low-vocal edit)</div>
        </div>
        <HeartIcon width={24} height={24} className="text-primary" />
      </div>

      {/* energy arc with phase markers */}
      <div className="px-5 mt-4">
        <EnergyCurve />
        <div className="flex justify-between mt-1">
          {["Settle", "Activate", "Flow", "Release"].map((p, i) => (
            <div key={p} className={`text-[10px] ${i === 1 ? "text-primary font-bold" : "text-muted-foreground"}`}>{p}</div>
          ))}
        </div>
      </div>

      {/* live AI adjustment */}
      <div className="mx-5 mt-4 rounded-xl border border-primary/30 bg-primary/[0.06] px-3.5 py-2.5 flex items-start gap-2 animate-fade-up">
        <SparkIcon width={14} height={14} className="text-primary mt-0.5 shrink-0" />
        <div className="text-[12px] leading-snug">
          <span className="font-semibold text-primary">Aura · live</span>
          <span className="text-foreground/90"> — Reducing lyrical intensity to minimize cognitive overload.</span>
        </div>
      </div>

      {/* progress */}
      <div className="px-5 mt-5">
        <div className="h-1 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full w-[28%] bg-foreground rounded-full" />
        </div>
        <div className="flex justify-between text-[10.5px] text-muted-foreground mt-1.5">
          <span>12:18</span><span>−32:42</span>
        </div>
      </div>

      {/* controls */}
      <div className="px-6 mt-3 flex items-center justify-between">
        <ShuffleIcon width={22} height={22} className="text-primary" />
        <PrevIcon width={30} height={30} />
        <button onClick={() => setPlaying(p => !p)} className="w-16 h-16 rounded-full bg-white grid place-items-center text-black active:scale-95 transition">
          {playing ? <PauseIcon width={26} height={26} /> : <PlayIcon width={26} height={26} />}
        </button>
        <NextIcon width={30} height={30} />
        <RepeatIcon width={22} height={22} className="text-primary" />
      </div>
    </div>
  );
}

/* ---------- SCREEN 5 — ADAPTATION ---------- */
export function AdaptScreen({ go }: { go: Nav }) {
  return (
    <div className="h-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.2 0.08 285) 0%, oklch(0.08 0.03 250) 50%, oklch(0.03 0.01 240) 100%)" }}>
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={() => go(4)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Aura Session</div>
          <div className="text-[12.5px] font-semibold">Deep Focus Recovery Arc</div>
        </div>
        <button onClick={() => go(6)} className="p-1 text-muted-foreground"><Dots width={22} height={22} /></button>
      </div>

      <div className="grid place-items-center mt-4">
        <AuraOrb size={220} intensity={0.7} />
      </div>

      {/* sensing card */}
      <div className="mx-4 mt-2 rounded-2xl bg-white/[0.05] border border-white/10 p-4 animate-fade-up">
        <div className="flex items-center gap-2">
          <SparkIcon width={14} height={14} className="text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Aura · sensing</span>
        </div>
        <h3 className="text-[16.5px] font-extrabold tracking-tight mt-2 leading-snug">
          We're noticing signs of cognitive fatigue.
        </h3>
        <p className="text-[12.5px] text-muted-foreground mt-1">
          Recent skips and shorter engagement suggest stimulation is too high. Recalibrating your arc.
        </p>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { l: "Skips", v: "4", t: "last 6 min" },
            { l: "Engagement", v: "↓ 28%", t: "vs baseline" },
            { l: "Distraction", v: "Rising", t: "pattern" },
          ].map(s => (
            <div key={s.l} className="rounded-lg bg-black/30 px-2.5 py-2">
              <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className="text-[13px] font-bold mt-0.5">{s.v}</div>
              <div className="text-[9.5px] text-muted-foreground">{s.t}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5">
          {[
            "Softening transitions between tracks",
            "Emphasizing instrumental layers",
            "Lowering overall stimulation",
          ].map(a => (
            <div key={a} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-foreground/90">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* recalibrating curve */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Recalibrating emotional curve</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> stabilizing
          </span>
        </div>
        <EnergyCurve />
      </div>

      <div className="absolute bottom-6 inset-x-0 px-5 flex gap-2">
        <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/10 text-[13.5px] font-semibold">Dismiss</button>
        <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-primary text-primary-foreground text-[13.5px] font-bold">Apply changes</button>
      </div>
    </div>
  );
}

/* ---------- SCREEN 6 — SUMMARY ---------- */
export function SummaryScreen({ go }: { go: Nav }) {
  return (
    <div className="h-full relative overflow-y-auto no-scrollbar pb-10" style={{ background: "linear-gradient(180deg, oklch(0.18 0.06 165) 0%, oklch(0.07 0.02 200) 55%, oklch(0.02 0 240) 100%)" }}>
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={() => go(4)} className="p-1"><ChevronDown width={24} height={24} /></button>
        <div className="text-[12px] font-bold tracking-[0.18em] uppercase text-primary flex items-center gap-1.5">
          <SparkIcon width={13} height={13} /> Session complete
        </div>
        <span className="w-6" />
      </div>

      <div className="px-5 mt-4">
        <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">Deep Focus<br/>Recovery Arc</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">Today · 45 minutes · 4 phases</p>
      </div>

      <div className="grid place-items-center mt-2">
        <AuraOrb size={180} intensity={0.6} />
      </div>

      <div className="px-4 grid grid-cols-3 gap-2 mt-2">
        {[
          { l: "Focus time", v: "42m" },
          { l: "Effectiveness", v: "87%" },
          { l: "Adaptations", v: "3" },
        ].map(s => (
          <div key={s.l} className="rounded-xl bg-white/[0.05] border border-white/10 px-3 py-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="text-[18px] font-extrabold tracking-tight mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Emotional progression</div>
        <EnergyCurve />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
          <span>Settle</span><span>Activate</span><span>Flow</span><span>Release</span>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/25 p-4">
        <div className="flex items-center gap-2">
          <SparkIcon width={14} height={14} className="text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Aura reflection</span>
        </div>
        <p className="text-[14px] leading-snug mt-2 text-foreground/95">
          You maintained deeper concentration after lower-intensity ambient transitions were introduced.
        </p>
      </div>

      <div className="px-4 mt-4 space-y-2">
        <button className="w-full h-11 rounded-full bg-primary text-primary-foreground text-[14px] font-bold">Save session</button>
        <div className="flex gap-2">
          <button onClick={() => go(4)} className="flex-1 h-11 rounded-full bg-white/10 text-[13px] font-semibold">Replay</button>
          <button onClick={() => go(3)} className="flex-1 h-11 rounded-full bg-white/10 text-[13px] font-semibold">Generate similar</button>
        </div>
      </div>

      <div className="px-5 mt-6 text-center">
        <h3 className="text-[18px] font-bold tracking-tight">How do you feel now?</h3>
        <div className="flex justify-center gap-2 mt-3">
          {["Calmer", "Focused", "Energized", "Reset"].map(f => (
            <span key={f} className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[12px]">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}