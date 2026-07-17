import { describe, expect, it } from "vitest";
import { getPreviousPhase } from "../app/transport/navigation";

describe("학습 단계 뒤로 가기", () => {
  it("조건 확인부터 결과 완성까지 바로 앞 학습 단계로 돌아간다", () => {
    expect(getPreviousPhase("conditions")).toBe("brief");
    expect(getPreviousPhase("first-test")).toBe("build");
    expect(getPreviousPhase("redesign")).toBe("goal");
    expect(getPreviousPhase("report")).toBe("compare");
  });

  it("첫 화면과 임무 선택 흐름에는 중복 뒤로 가기를 만들지 않는다", () => {
    expect(getPreviousPhase("welcome")).toBeNull();
    expect(getPreviousPhase("missions")).toBeNull();
    expect(getPreviousPhase("brief")).toBeNull();
  });
});
