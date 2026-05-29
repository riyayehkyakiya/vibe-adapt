export type AuraPalette = "focus" | "fatigue" | "calm" | "recovery" | "compose";

const PALETTES: Record<AuraPalette, { core: string; mid: string; outer: string; halo: string; conic: string }> = {
  // Deep focus — cool indigo / dark teal / subdued electric blue
  focus: {
    core: "oklch(0.78 0.12 220 / 0.92)",
    mid: "oklch(0.48 0.16 235 / 0.7)",
    outer: "oklch(0.22 0.09 255 / 0.55)",
    halo: "oklch(0.55 0.18 230 / 0.32)",
    conic: "conic-gradient(from 0deg, oklch(0.45 0.15 235), oklch(0.35 0.1 200), oklch(0.55 0.18 260), oklch(0.45 0.15 235))",
  },
  // Burnout / cognitive fatigue — muted amber, warm charcoal, soft bronze
  fatigue: {
    core: "oklch(0.82 0.1 75 / 0.9)",
    mid: "oklch(0.5 0.13 55 / 0.65)",
    outer: "oklch(0.24 0.07 40 / 0.55)",
    halo: "oklch(0.6 0.14 60 / 0.28)",
    conic: "conic-gradient(from 0deg, oklch(0.5 0.12 55), oklch(0.35 0.08 35), oklch(0.55 0.15 70), oklch(0.5 0.12 55))",
  },
  // Late-night calm — navy + lavender fog
  calm: {
    core: "oklch(0.86 0.06 285 / 0.92)",
    mid: "oklch(0.5 0.12 280 / 0.6)",
    outer: "oklch(0.2 0.06 270 / 0.55)",
    halo: "oklch(0.55 0.14 285 / 0.28)",
    conic: "conic-gradient(from 0deg, oklch(0.45 0.12 285), oklch(0.3 0.08 260), oklch(0.55 0.14 300), oklch(0.45 0.12 285))",
  },
  // Emotional recovery — muted rose, warm coral
  recovery: {
    core: "oklch(0.85 0.09 25 / 0.9)",
    mid: "oklch(0.55 0.14 20 / 0.6)",
    outer: "oklch(0.25 0.08 15 / 0.55)",
    halo: "oklch(0.6 0.16 20 / 0.28)",
    conic: "conic-gradient(from 0deg, oklch(0.5 0.14 20), oklch(0.4 0.1 10), oklch(0.55 0.15 35), oklch(0.5 0.14 20))",
  },
  // Composing — neutral teal/indigo Aura signature (subtle, brand)
  compose: {
    core: "oklch(0.82 0.1 180 / 0.9)",
    mid: "oklch(0.5 0.13 210 / 0.6)",
    outer: "oklch(0.22 0.08 250 / 0.55)",
    halo: "oklch(0.55 0.16 200 / 0.28)",
    conic: "conic-gradient(from 0deg, oklch(0.5 0.14 200), oklch(0.4 0.1 240), oklch(0.55 0.15 170), oklch(0.5 0.14 200))",
  },
};

export function AuraOrb({
  size = 280,
  intensity = 1,
  palette = "focus",
}: { size?: number; intensity?: number; palette?: AuraPalette }) {
  const p = PALETTES[palette];
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {/* ambient halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-aura-pulse"
        style={{ background: p.halo, opacity: 0.55 * intensity }}
      />
      {/* slow rotating chroma — heavy blur, low contrast */}
      <div
        className="absolute inset-6 rounded-full animate-aura-rotate"
        style={{ background: p.conic, filter: "blur(22px)", opacity: 0.55 * intensity }}
      />
      {/* core orb */}
      <div
        className="absolute inset-12 rounded-full animate-float-orb"
        style={{
          background: `radial-gradient(circle at 36% 30%, ${p.core}, ${p.mid} 55%, ${p.outer} 88%)`,
          boxShadow: `inset 0 0 70px oklch(1 0 0 / 0.08), 0 0 80px ${p.halo}`,
        }}
      />
      {/* specular highlight */}
      <div
        className="absolute inset-14 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 40% 30% at 35% 25%, oklch(1 0 0 / 0.18), transparent 70%)",
        }}
      />
    </div>
  );
}

export function Waveform({ bars = 32, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] h-10 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary animate-wave"
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

export function EnergyCurve({
  progress = 0.35,
  className = "",
}: { progress?: number; className?: string }) {
  // Smooth four-phase emotional arc: Settle → Activate → Flow → Release
  // Bezier path tuned for visual rhythm; gradient fill below.
  const path =
    "M0,62 C28,60 52,48 80,40 C108,32 132,18 160,18 C188,18 208,32 232,38 C256,44 280,52 320,46";
  const fill =
    "M0,62 C28,60 52,48 80,40 C108,32 132,18 160,18 C188,18 208,32 232,38 C256,44 280,52 320,46 L320,80 L0,80 Z";
  const x = Math.max(0, Math.min(1, progress)) * 320;
  return (
    <svg viewBox="0 0 320 80" className={`w-full h-20 ${className}`}>
      <defs>
        <linearGradient id="curveStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.7 0.1 220)" />
          <stop offset="55%" stopColor="oklch(0.82 0.16 155)" />
          <stop offset="100%" stopColor="oklch(0.65 0.14 290)" />
        </linearGradient>
        <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 165 / 0.28)" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 165 / 0)" />
        </linearGradient>
      </defs>
      {/* faint baseline grid */}
      {[20, 40, 60].map(y => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="oklch(1 0 0 / 0.04)" strokeWidth="1" />
      ))}
      <path d={fill} fill="url(#curveFill)" />
      <path d={path} stroke="url(#curveStroke)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* progress marker */}
      <line x1={x} x2={x} y1="6" y2="74" stroke="oklch(1 0 0 / 0.18)" strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={x} cy="34" r="3.5" fill="oklch(0.98 0 0)" />
    </svg>
  );
}