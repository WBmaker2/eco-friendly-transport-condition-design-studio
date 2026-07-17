import { describe, expect, it } from "vitest";
import { components } from "../app/transport/components";
import { evaluateDesign } from "../app/transport/evaluator";
import { missions } from "../app/transport/missions";
import { makeComparisonCopy, statusText, studentGroupLabels } from "../app/transport/student-copy";
import type { TransportDesign } from "../app/transport/types";

describe("초등 3~4학년 학생용 문구", () => {
  it("uses easy labels for statuses and part groups", () => {
    expect(statusText).toEqual({
      fits: "✓ 잘 맞아요",
      partial: "◐ 조금 아쉬워요",
      redesign: "↻ 다시 골라 봐요",
    });
    expect(Object.values(studentGroupLabels)).toEqual(["짐받이", "바퀴", "움직이는 힘", "방향·멈춤"]);
  });

  it("joins comparison sentences without broken particles", () => {
    const copy = makeComparisonCopy("바퀴", "거친 길용 넓은 바퀴", ["길의 상태"], "평평한 길에서는 힘이 더 들 수 있어요.");
    expect(copy).toContain("길의 상태가 더 좋아졌어요.");
    expect(copy).toContain("하지만 평평한 길에서는 힘이 더 들 수 있어요.");
    expect(copy).not.toMatch(/\.을|\.를|\(을\)|\(를\)|\(과\)|\(와\)/);
  });

  it("keeps catalog copy free of the hardest student-facing terms", () => {
    const componentCopy = components.flatMap((item) => [item.name, item.short, item.strength, item.burden]).join(" ");
    const missionCopy = missions.flatMap((item) => [item.title, item.cargo, item.purpose, item.control, ...item.notes]).join(" ");
    expect(`${componentCopy} ${missionCopy}`).not.toMatch(/접지|평탄 경로|정밀 조향|이중 제동|긴급 재설계|관측|적재함|자체 무게|제어에는 제한/);
  });

  it("keeps result explanations free of bracketed particles", () => {
    const mission = missions.find((item) => item.id === "garden-seedlings")!;
    const design: TransportDesign = {
      id: "copy-check",
      missionId: mission.id,
      componentIds: {
        structure: "low-wide-platform",
        movement: "large-road-wheel",
        energy: "rechargeable-assist",
        control: "precision-steering",
      },
    };
    const copy = evaluateDesign(mission, design, components).conditionResults.map((item) => item.explanation).join(" ");
    expect(copy).not.toMatch(/\(을\)|\(를\)|\(과\)|\(와\)/);
  });
});
