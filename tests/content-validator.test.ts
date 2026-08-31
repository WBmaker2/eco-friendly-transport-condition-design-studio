import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
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

  it("gives every mission a generated learning visual", () => {
    missions.forEach((mission) => {
      expect(mission.visual.src).toMatch(/^learning\/mission-[a-z-]+\.webp$/);
      expect(existsSync(`public/${mission.visual.src}`)).toBe(true);
      expect(mission.visual.alt.length).toBeGreaterThan(10);
      expect(mission.visual.caption.length).toBeGreaterThan(10);
    });
  });

  it("keeps generated learning images whole inside responsive frames", () => {
    const styles = readFileSync("app/globals.css", "utf8");
    expect(styles).toMatch(/\.learning-visual img \{[^}]*object-fit:contain/);
    expect(styles).toMatch(/\.mission-card img \{[^}]*object-fit:contain/);
    expect(styles).toMatch(/\.mission-card img \{[^}]*aspect-ratio:4 \/ 3/);
    expect(styles).toMatch(/\.mission-card img \{[^}]*max-width:none/);
    expect(styles).toMatch(/\.prototype-image \{[^}]*object-fit:contain/);
    expect(styles).not.toMatch(/\.learning-visual img \{[^}]*object-fit:cover/);
    expect(styles).not.toMatch(/\.mission-card img \{[^}]*object-fit:cover/);
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
