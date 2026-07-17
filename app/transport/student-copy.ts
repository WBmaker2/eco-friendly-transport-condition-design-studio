import type { ComponentGroup, ConditionStatus } from "./types";

export const studentGroupLabels: Record<ComponentGroup, string> = {
  structure: "짐받이",
  movement: "바퀴",
  energy: "움직이는 힘",
  control: "방향·멈춤",
};

export const studentGroupHelp: Record<ComponentGroup, string> = {
  structure: "짐을 담고 받쳐요.",
  movement: "길 위에서 굴러가요.",
  energy: "수레가 움직일 힘을 만들어요.",
  control: "방향을 바꾸고 멈춰요.",
};

export const progressLabels = ["할 일", "조건 보기", "수레 만들기", "첫 시험", "다시 만들기", "결과 비교"];

export const statusText: Record<ConditionStatus, string> = {
  fits: "✓ 잘 맞아요",
  partial: "◐ 조금 아쉬워요",
  redesign: "↻ 다시 골라 봐요",
};

export const cleanSentenceEnding = (text: string) => text.trim().replace(/[.!?]+$/u, "");

const withSubjectParticle = (text: string) => {
  const last = text.codePointAt(text.length - 1) ?? 0;
  const hasFinalConsonant = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0;
  return `${text}${hasFinalConsonant ? "이" : "가"}`;
};

export function makeComparisonCopy(group: string, component: string, improved: string[], burden: string) {
  const improvedSentence = improved.length === 0
    ? "더 좋아진 조건은 아직 없어요."
    : improved.length === 1
      ? `${withSubjectParticle(improved[0])} 더 좋아졌어요.`
      : `${improved.join(" · ")} 항목이 더 좋아졌어요.`;
  return `바꾼 부품: ${group} · ${component}. ${improvedSentence} 하지만 ${cleanSentenceEnding(burden)}.`;
}
