import type { CSSProperties } from "react";

export type IconName = "grid" | "arrow" | "search" | "building" | "truck" | "tool" | "heart" | "food" | "home" | "leaf" | "briefcase" | "inbox" | "medical" | "file" | "check" | "chevron" | "clock" | "image" | "plus";
const paths: Record<IconName, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  arrow: "M4 12h15M13 6l6 6-6 6",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  building: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01",
  truck: "M2 5h12v12H2zM14 9h4l4 5v3h-8M5 17a2 2 0 1 0 .01 0M17 17a2 2 0 1 0 .01 0",
  tool: "M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4z",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
  food: "M4 3v7a3 3 0 0 0 6 0V3M7 3v18M20 21V3c-4 2-5 7-5 10h5",
  home: "M3 10l9-7 9 7M5 9v12h14V9M9 21v-7h6v7",
  leaf: "M20 3C9 2 3 6 3 12a7 7 0 0 0 12 5c4-4 5-8 5-14zM4 21L15 10",
  briefcase: "M3 7h18v14H3zM8 7V3h8v4M3 12c6 4 12 4 18 0M10 13h4",
  inbox: "M5 3h14l3 11v7H2v-7zM2 14h6l2 3h4l2-3h6",
  medical: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  file: "M5 3h9l5 5v13H5zM14 3v5h5M8 12h8M8 16h6",
  check: "M5 12l4 4L19 6",
  chevron: "M9 5l7 7-7 7",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2",
  image: "M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5M8 7h.01",
  plus: "M12 5v14M5 12h14",
};
export function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]} /></svg>;
}
