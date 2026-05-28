export function AuraOrb({ size = 280, intensity = 1 }: { size?: number; intensity?: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-aura-pulse"
        style={{ background: "var(--gradient-aura)", opacity: 0.5 * intensity }}
      />
      <div className="absolute inset-4 rounded-full animate-aura-rotate" style={{ background: "conic-gradient(from 0deg, var(--aura-2), var(--aura-1), var(--aura-3), var(--aura-2))", filter: "blur(14px)", opacity: 0.85 }} />
      <div className="absolute inset-10 rounded-full animate-float-orb" style={{ background: "radial-gradient(circle at 35% 30%, oklch(0.95 0.05 145 / 0.95), oklch(0.55 0.2 200 / 0.6) 55%, oklch(0.25 0.1 290 / 0.4) 80%)", boxShadow: "inset 0 0 60px oklch(1 0 0 / 0.15), 0 0 60px oklch(0.78 0.19 145 / 0.25)" }} />
      <div className="absolute inset-16 rounded-full opacity-30" style={{ background: "radial-gradient(circle, transparent 55%, oklch(1 0 0 / 0.15) 70%, transparent 75%)" }} />
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

export function EnergyCurve() {
  return (
    <svg viewBox="0 0 320 80" className="w-full h-20">
      <defs>
        <linearGradient id="curveG" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.65 0.18 200)" />
          <stop offset="55%" stopColor="oklch(0.78 0.19 145)" />
          <stop offset="100%" stopColor="oklch(0.6 0.22 290)" />
        </linearGradient>
        <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.19 145 / 0.35)" />
          <stop offset="100%" stopColor="oklch(0.78 0.19 145 / 0)" />
        </linearGradient>
      </defs>
      <path d="M0,60 C40,50 70,18 120,22 C170,26 190,62 230,52 C270,42 290,28 320,32 L320,80 L0,80 Z" fill="url(#curveFill)" />
      <path d="M0,60 C40,50 70,18 120,22 C170,26 190,62 230,52 C270,42 290,28 320,32" stroke="url(#curveG)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}