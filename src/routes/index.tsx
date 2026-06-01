import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/aura/PhoneFrame";
import {
  HomeScreen, InputScreen, GeneratingScreen, PlayerScreen, AdaptScreen, SummaryScreen,
} from "@/components/aura/screens";
import {
  buildMiniPlayerPlayback,
  DEFAULT_SESSION,
  getSessionFromInput,
  PHASE_KEYS,
  type MiniPlayerPlayback,
} from "@/components/aura/session";

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
  const [session, setSession] = useState(DEFAULT_SESSION);
  const [inputText, setInputText] = useState("");
  const [playerPhaseIndex, setPlayerPhaseIndex] = useState(0);
  const [miniPlayer, setMiniPlayer] = useState<MiniPlayerPlayback | null>(null);

  const go = (n: number) => {
    const next = Math.min(6, Math.max(1, n));
    if (next === 6) {
      setMiniPlayer(buildMiniPlayerPlayback(session, "release"));
    }
    setS(next);
  };

  const beginInput = (text?: string) => {
    const next = text ?? inputText;
    setInputText(next);
    setSession(getSessionFromInput(next));
    go(2);
  };

  const beginComposing = () => {
    const text = inputText.trim() || "focus";
    setSession(getSessionFromInput(text));
    setPlayerPhaseIndex(0);
    go(3);
  };

  const resumePlayback = () => {
    if (!miniPlayer) return;
    setSession(miniPlayer.session);
    setPlayerPhaseIndex(PHASE_KEYS.indexOf(miniPlayer.phaseKey));
    go(4);
  };

  const flow = {
    go,
    session,
    inputText,
    setInputText,
    beginInput,
    beginComposing,
    playerPhaseIndex,
    setPlayerPhaseIndex,
    miniPlayer,
    resumePlayback,
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black text-foreground flex items-center justify-center">
      <PhoneFrame>
        {s === 1 && <HomeScreen {...flow} />}
        {s === 2 && <InputScreen {...flow} />}
        {s === 3 && <GeneratingScreen {...flow} />}
        {s === 4 && <PlayerScreen {...flow} />}
        {s === 5 && <AdaptScreen {...flow} />}
        {s === 6 && <SummaryScreen {...flow} />}
      </PhoneFrame>
    </div>
  );
}
