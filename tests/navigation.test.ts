import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getPreviousPhase } from "../app/transport/navigation";
import { resetPageScroll } from "../app/transport/scroll";

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
  it("브라우저가 없는 환경에서도 단계 스크롤 함수를 안전하게 호출한다", () => {
    expect(() => resetPageScroll()).not.toThrow();
  });

  it("앱은 단계 전환 때 페이지 스크롤을 초기화하고 결과 제목 포커스가 다시 스크롤하지 않게 한다", () => {
    const source = readFileSync("app/TransportApp.tsx", "utf8");
    expect(source).toContain("resetPageScroll();");
    expect(source).toContain("focus({ preventScroll: true })");
  });
});
