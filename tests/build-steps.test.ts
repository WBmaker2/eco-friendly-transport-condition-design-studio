import { describe, expect, it } from "vitest";
import { allPartsSelected, buildSteps, canAdvanceBuildStep, nextBuildStep, previousBuildStep } from "../app/transport/build-steps";

describe("첫 설계 부품 단계", () => {
  it("moves through the four part groups in order", () => {
    expect(buildSteps).toEqual(["structure", "movement", "energy", "control"]);
    expect(nextBuildStep("structure")).toBe("movement");
    expect(nextBuildStep("control")).toBe("control");
    expect(previousBuildStep("control")).toBe("energy");
    expect(previousBuildStep("structure")).toBe("structure");
  });

  it("advances only after the current part is selected", () => {
    expect(canAdvanceBuildStep({}, "structure")).toBe(false);
    expect(canAdvanceBuildStep({ structure: "low-wide-platform" }, "structure")).toBe(true);
  });

  it("recognizes a complete four-part design", () => {
    expect(allPartsSelected({ structure: "a", movement: "b", energy: "c" })).toBe(false);
    expect(allPartsSelected({ structure: "a", movement: "b", energy: "c", control: "d" })).toBe(true);
  });
});
