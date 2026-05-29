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

function Index() {
  const [s, setS] = useState(1);
  const go = (n: number) => setS(Math.min(6, Math.max(1, n)));
  return (
    <div className="min-h-[100dvh] w-full bg-black text-foreground flex items-center justify-center">
      <PhoneFrame>
        {s === 1 && <HomeScreen go={go} />}
        {s === 2 && <InputScreen go={go} />}
        {s === 3 && <GeneratingScreen go={go} />}
        {s === 4 && <PlayerScreen go={go} />}
        {s === 5 && <AdaptScreen go={go} />}
        {s === 6 && <SummaryScreen go={go} />}
      </PhoneFrame>
    </div>
  );
}
