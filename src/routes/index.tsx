import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/aura/PhoneFrame";
import {
  HomeScreen, InputScreen, GeneratingScreen, PlayerScreen, AdaptScreen, SummaryScreen,
} from "@/components/aura/screens";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — Adaptive listening prototype" },
      { name: "description", content: "A mobile prototype of an AI-powered adaptive emotional listening layer integrated into a music app." },
      { property: "og:title", content: "Aura — Adaptive listening prototype" },
      { property: "og:description", content: "Adaptive emotional audio sessions, natively integrated into a familiar mobile music UI." },
    ],
  }),
  component: Index,
});

const SCREENS = ["Home", "Input", "Generating", "Player", "Adapt", "Summary"];

function Index() {
  const [s, setS] = useState(1);
  const go = (n: number) => setS(Math.min(6, Math.max(1, n)));
  return (
    <div className="min-h-[100dvh] w-full bg-black text-foreground flex flex-col md:flex-row md:items-center md:justify-center md:gap-10 md:py-10">
      <PhoneFrame>
        {s === 1 && <HomeScreen go={go} />}
        {s === 2 && <InputScreen go={go} />}
        {s === 3 && <GeneratingScreen go={go} />}
        {s === 4 && <PlayerScreen go={go} />}
        {s === 5 && <AdaptScreen go={go} />}
        {s === 6 && <SummaryScreen go={go} />}
      </PhoneFrame>

      {/* prototype switcher */}
      <div className="fixed bottom-2 inset-x-2 md:static md:bottom-auto md:inset-x-auto md:max-w-xs z-50">
        <div className="rounded-full bg-white/[0.06] backdrop-blur border border-white/10 px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar text-[11px]">
          {SCREENS.map((name, i) => {
            const idx = i + 1;
            const active = idx === s;
            return (
              <button
                key={name}
                onClick={() => setS(idx)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-semibold transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {idx}. {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
