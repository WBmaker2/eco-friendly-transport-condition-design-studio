import type { LearningVisual as LearningVisualData } from "./types";

export function LearningVisual({ visual, className = "" }: { visual: LearningVisualData; className?: string }) {
  return <figure className={`learning-visual ${className}`.trim()}>
    <img src={visual.src} alt={visual.alt} loading="lazy" decoding="async" />
    <figcaption>{visual.caption}</figcaption>
  </figure>;
}
