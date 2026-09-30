import type { Industry } from "../data/catalog.ts";

export function IndustryPill({ industry }: { industry: Industry }) {
  return (
    <span className="pill" data-industry={industry}>
      {industry}
    </span>
  );
}
