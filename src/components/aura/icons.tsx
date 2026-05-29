import type { SVGProps } from "react";

const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const HomeIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>);
export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>);
export const LibraryIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M4 4v16"/><path d="M9 4v16"/><path d="m14 5 6 14"/></svg>);
export const SparkIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.6 5.6 2.8 2.8"/><path d="m15.6 15.6 2.8 2.8"/><path d="m5.6 18.4 2.8-2.8"/><path d="m15.6 8.4 2.8-2.8"/></svg>);
export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z"/></svg>);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>);
export const ShuffleIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>);
export const RepeatIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>);
export const PrevIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M6 5v14M20 5 9 12l11 7z"/></svg>);
export const NextIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M18 5v14M4 5l11 7L4 19z"/></svg>);
export const HeartIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>);
export const BellIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>);
export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="m6 9 6 6 6-6"/></svg>);
export const Dots = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>);
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14"/></svg>);
export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="m9 6 6 6-6 6"/></svg>);