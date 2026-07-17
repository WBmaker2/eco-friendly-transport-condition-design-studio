import { describe, expect, it } from "vitest";
import { components } from "../app/transport/components";
import { compareEvaluations, evaluateDesign, getRedesignChoices, isSingleComponentChange } from "../app/transport/evaluator";
import { getFirstDesignMission, missions } from "../app/transport/missions";
import type { TransportDesign } from "../app/transport/types";

const mission = missions.find((item) => item.id === "library-books")!;
const base: TransportDesign = {
  id: "base",
  missionId: mission.id,
  componentIds: {
    structure: "reinforced-bed",
    movement: "large-road-wheel",
    energy: "rechargeable-assist",
    control: "basic-control",
  },
};

describe("TransportDesignEvaluator", () => {
  it("returns five named condition results without a total score", () => {
    const evaluation = evaluateDesign(mission, base, components);
    expect(evaluation.conditionResults).toHaveLength(5);
    expect(evaluation).not.toHaveProperty("score");
    expect(evaluation.environmentalProfile).toHaveProperty("usePhaseEnergy");
  });

  it("does not let an energy choice cancel a weak load structure", () => {
    const weakLoad = {
      ...base,
      componentIds: { ...base.componentIds, structure: "light-frame" },
    };
    const result = evaluateDesign(mission, weakLoad, components);
    expect(result.conditionResults.find((item) => item.conditionId === "load")?.status).toBe("redesign");
  });

  it("keeps solar assistance conditional instead of enough for a far uphill mission", () => {
    const uphill = missions.find((item) => item.id === "hill-observation")!;
    const solar = { ...base, missionId: uphill.id, componentIds: { ...base.componentIds, energy: "solar-charge-assist" } };
    const result = evaluateDesign(uphill, solar, components);
    expect(result.conditionResults.find((item) => item.conditionId === "energy")?.status).not.toBe("fits");
  });

  it("uses cloudy and limited-charging mission conditions in the energy result", () => {
    const changed = missions.find((item) => item.id === "changed-conditions")!;
    const solar = { ...base, missionId: changed.id, componentIds: { ...base.componentIds, energy: "solar-charge-assist" } };
    const electric = { ...base, missionId: changed.id, componentIds: { ...base.componentIds, energy: "rechargeable-assist" } };

    expect(evaluateDesign(changed, solar, components).conditionResults.find((item) => item.conditionId === "energy")?.status).toBe("redesign");
    expect(evaluateDesign(changed, electric, components).conditionResults.find((item) => item.conditionId === "energy")?.status).toBe("partial");
  });

  it("evaluates mission five's first design before applying the changed conditions", () => {
    const changed = missions.find((item) => item.id === "changed-conditions")!;
    const firstMission = getFirstDesignMission(changed);

    expect(firstMission.load).toBe("light");
    expect(firstMission.path).toBe("flat");
    expect(firstMission.energyAvailability).toContain("daylight-supplement");
    expect(changed.load).toBe("medium");
    expect(changed.path).toBe("rough");
    expect(changed.energyAvailability).toContain("cloudy");
  });

  it("uses each mission's explicit stability and control requirements", () => {
    const indoor = missions.find((item) => item.id === "classroom-supplies")!;
    const basic = { ...base, missionId: indoor.id, componentIds: { ...base.componentIds, structure: "light-frame", movement: "large-road-wheel", energy: "human-power" } };
    const precise = { ...basic, componentIds: { ...basic.componentIds, control: "precision-steering" } };

    const basicResult = evaluateDesign(indoor, basic, components).conditionResults.find((item) => item.conditionId === "stability-control");
    const preciseResult = evaluateDesign(indoor, precise, components).conditionResults.find((item) => item.conditionId === "stability-control");
    expect(basicResult?.status).not.toBe("fits");
    expect(preciseResult?.status).toBe("fits");
  });

  it("offers evidence-based redesign choices and compares actual result changes", () => {
    const first = evaluateDesign(mission, { ...base, componentIds: { ...base.componentIds, structure: "light-frame" } }, components);
    const second = evaluateDesign(mission, base, components);
    const choices = getRedesignChoices(first);
    const comparison = compareEvaluations(first, second, "튼튼한 구조는 재료와 자체 무게가 늘어요.");

    expect(choices.targets.every((item) => item.status !== "fits")).toBe(true);
    expect(choices.strengths.every((item) => item.status === "fits")).toBe(true);
    expect(comparison.improved).toContain("짐의 무게");
    expect(comparison.newBurdens).toEqual(["튼튼한 구조는 재료와 자체 무게가 늘어요."]);
  });

  it("allows comparison only when exactly one component group changes", () => {
    const oneChange = { ...base, componentIds: { ...base.componentIds, control: "double-brake-control" } };
    const twoChanges = { ...oneChange, componentIds: { ...oneChange.componentIds, energy: "human-power" } };
    expect(isSingleComponentChange(base, oneChange)).toBe(true);
    expect(isSingleComponentChange(base, twoChanges)).toBe(false);
  });
});
