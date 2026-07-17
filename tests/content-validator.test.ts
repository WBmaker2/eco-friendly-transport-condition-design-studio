import { describe, expect, it } from "vitest";
import { components } from "../app/transport/components";
import { buildAllDesigns, validateContent } from "../app/transport/content-validator";
import { evaluateDesign } from "../app/transport/evaluator";
import { missions } from "../app/transport/missions";

describe("transport content", () => {
  it("keeps mission and component references valid", () => {
    expect(validateContent(missions, components)).toEqual([]);
    expect(components).toHaveLength(12);
    expect(missions).toHaveLength(5);
  });

  it("evaluates all 81 combinations for every mission", () => {
    missions.forEach((mission) => {
      const designs = buildAllDesigns(mission.id, components);
      expect(designs).toHaveLength(81);
      designs.forEach((design) => expect(evaluateDesign(mission, design, components).conditionResults).toHaveLength(5));
    });
  });

  it("keeps at least two fitting and two tradeoff paths per mission", () => {
    missions.forEach((mission) => {
      const evaluations = buildAllDesigns(mission.id, components).map((design) => evaluateDesign(mission, design, components));
      const fitting = evaluations.filter((evaluation) => evaluation.conditionResults.every((result) => result.status !== "redesign"));
      const tradeoffs = evaluations.filter((evaluation) => evaluation.conditionResults.some((result) => result.status === "fits") && evaluation.conditionResults.some((result) => result.status !== "fits"));
      expect(fitting.length, mission.title).toBeGreaterThanOrEqual(2);
      expect(tradeoffs.length, mission.title).toBeGreaterThanOrEqual(2);
    });
  });
});
