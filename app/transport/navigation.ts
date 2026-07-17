export type Phase = "welcome" | "tutorial" | "missions" | "brief" | "conditions" | "build" | "first-test" | "goal" | "redesign" | "second-test" | "compare" | "report";

const previousPhase: Partial<Record<Phase, Phase>> = {
  conditions: "brief",
  build: "conditions",
  "first-test": "build",
  goal: "first-test",
  redesign: "goal",
  "second-test": "redesign",
  compare: "second-test",
  report: "compare",
};

export function getPreviousPhase(phase: Phase): Phase | null {
  return previousPhase[phase] ?? null;
}
