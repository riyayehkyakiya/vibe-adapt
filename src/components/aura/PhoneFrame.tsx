import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[100dvh] bg-background overflow-hidden flex flex-col">
      {/* status bar */}
      <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[13px] font-semibold text-foreground shrink-0 tracking-tight">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          {/* signal */}
          <span className="flex items-end gap-[2px] h-2.5">
            {[3, 5, 7, 9].map(h => (
              <span key={h} className="w-[2.5px] rounded-[1px] bg-foreground" style={{ height: `${h}px` }} />
            ))}
          </span>
          {/* wifi */}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="text-foreground">
            <path d="M1 3.5 C4 1, 10 1, 13 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M3 5.5 C5 4, 9 4, 11 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="7" cy="8" r="1" fill="currentColor"/>
          </svg>
          {/* battery */}
          <span className="inline-flex items-center">
            <span className="w-[22px] h-[10px] rounded-[3px] border border-foreground/80 relative p-[1.5px]">
              <span className="block h-full w-[80%] rounded-[1.5px] bg-foreground" />
            </span>
            <span className="inline-block w-[1.5px] h-[5px] bg-foreground/80 rounded-r-sm ml-[1px]" />
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}