import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[100dvh] bg-background overflow-hidden flex flex-col">
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[12px] font-semibold text-foreground/90 shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-2 rounded-sm border border-foreground/70" />
          <span className="inline-block w-1 h-2 rounded-sm bg-foreground/70" />
          <span className="inline-block w-5 h-2.5 rounded-[3px] border border-foreground/70 relative">
            <span className="absolute inset-[2px] right-[8px] bg-foreground/80 rounded-[1px]" />
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

export function BottomNav({ active = "home" as "home" | "search" | "library" }) {
  return null; // handled inline per screen for spacing accuracy
}