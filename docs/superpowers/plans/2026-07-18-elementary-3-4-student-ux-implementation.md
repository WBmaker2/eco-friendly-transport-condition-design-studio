# 초등 3~4학년 사용자 경험 개선 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 초등 3~4학년 학생이 쉬운 말과 4단계 부품 선택으로 수레를 만들고, 조사 오류 없는 짧은 결과 문장으로 첫 설계와 다시 만든 설계를 비교하게 한다.

**Architecture:** 학생용 표현과 단계 규칙을 순수 TypeScript 모듈로 분리하고, 첫 설계·다시 만들기·결과 화면을 각각 React 컴포넌트로 분리한다. 기존 평가 수치와 `Phase` 흐름은 유지하며, `TransportApp`은 상태 연결과 화면 전환만 담당한다.

**Tech Stack:** React 19, TypeScript 5.9, vinext/Vite, CSS, Vitest, Sites

## Global Constraints

- 대상 사용자는 초등 3~4학년이며 학생 화면은 승인된 쉬운 말 계약을 따른다.
- 총점, 정답 수레, 순위, 배지, 제한 시간을 추가하지 않는다.
- 첫 설계에서 정확히 한 부품군만 바꾸는 기존 평가 규칙을 유지한다.
- 새 의존성을 설치하지 않는다.
- 모든 코드 파일은 500줄 미만으로 유지한다.
- 모든 주요 버튼은 최소 44px이고 320px 화면에서 가로 넘침이 없어야 한다.
- 업데이트 내역 최신 항목은 `2026-07-18 · v0.3.0`이다.

---

### Task 1: 학생용 쉬운 말과 부품 단계 규칙

**Files:**
- Create: `app/transport/student-copy.ts`
- Create: `app/transport/build-steps.ts`
- Create: `tests/student-copy.test.ts`
- Create: `tests/build-steps.test.ts`
- Modify: `app/transport/components.ts`
- Modify: `app/transport/missions.ts`

**Interfaces:**
- Produces: `studentGroupLabels`, `studentGroupHelp`, `progressLabels`, `statusText`, `cleanSentenceEnding`, `makeComparisonCopy`
- Produces: `buildSteps`, `nextBuildStep`, `previousBuildStep`, `canAdvanceBuildStep`, `allPartsSelected`

- [ ] **Step 1: Write failing copy tests**

```ts
expect(statusText.partial).toContain("조금 아쉬워요");
expect(Object.values(studentGroupLabels)).toEqual(["짐받이", "바퀴", "움직이는 힘", "방향·멈춤"]);
expect(makeComparisonCopy("바퀴", "거친 길용 넓은 바퀴", ["길의 상태"], "평평한 길에서는 힘이 더 들 수 있어요.")).not.toMatch(/\.을|\.를|\(을\)|\(를\)|\(과\)|\(와\)/);
```

- [ ] **Step 2: Write failing build-step tests**

```ts
expect(buildSteps).toEqual(["structure", "movement", "energy", "control"]);
expect(canAdvanceBuildStep({}, "structure")).toBe(false);
expect(canAdvanceBuildStep({ structure: "low-wide-platform" }, "structure")).toBe(true);
expect(nextBuildStep("control")).toBe("control");
```

- [ ] **Step 3: Run tests and confirm RED**

Run: `npm test -- tests/student-copy.test.ts tests/build-steps.test.ts`

Expected: FAIL because the new modules do not exist.

- [ ] **Step 4: Implement the pure helpers and simplify catalog copy**

```ts
export const buildSteps: ComponentGroup[] = ["structure", "movement", "energy", "control"];
export const canAdvanceBuildStep = (selection: Partial<Record<ComponentGroup, string>>, group: ComponentGroup) => Boolean(selection[group]);
export const allPartsSelected = (selection: Partial<Record<ComponentGroup, string>>) => buildSteps.every((group) => Boolean(selection[group]));
```

Replace student-facing component and mission wording such as `접지`, `평탄 경로`, `정밀 조향`, `이중 제동`, `관측`, `긴급 재설계` with the approved concrete alternatives without changing IDs or capability values.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `npm test -- tests/student-copy.test.ts tests/build-steps.test.ts`

Expected: 2 test files pass.

- [ ] **Step 6: Commit Task 1**

```bash
git add app/transport/student-copy.ts app/transport/build-steps.ts app/transport/components.ts app/transport/missions.ts tests/student-copy.test.ts tests/build-steps.test.ts
git commit -m "feat: add grade 3-4 student copy rules"
```

### Task 2: 4단계 첫 설계 부품 선택

**Files:**
- Create: `app/transport/BuildStep.tsx`
- Modify: `app/transport/PrototypePreview.tsx`
- Modify: `app/TransportApp.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `buildSteps`, `studentGroupLabels`, `studentGroupHelp`, `ComponentGroup`, `components`, `PrototypePreview`
- Produces: `BuildStep({ selection, onSelect, onSubmit })`

- [ ] **Step 1: Implement `BuildStep` using the tested step rules**

```tsx
export function BuildStep({ selection, onSelect, onSubmit }: BuildStepProps) {
  const [activeGroup, setActiveGroup] = useState<ComponentGroup>("structure");
  const index = buildSteps.indexOf(activeGroup);
  const isLast = index === buildSteps.length - 1;
  return <section className="guided-build">{/* step rail, one fieldset, navigation, preview */}</section>;
}
```

Render only the three options for `activeGroup`. Show `다음 부품` only when the current choice exists. Show `첫 설계 시험하기` only on the fourth step after `control` is selected.

- [ ] **Step 2: Update the preview with student labels**

Use `시험용 수레 작업대`, `고른 부품이 수레 그림에 나타나요`, and the four easy group labels.

- [ ] **Step 3: Integrate `BuildStep` into `TransportApp`**

Replace the existing `phase === "build"` all-groups shelf with `<BuildStep />`. Keep `createFirst`, selection state, and the existing `Phase` transition.

- [ ] **Step 4: Add responsive guided-build styles**

Desktop: choice panel and preview use two columns. Mobile: current choices appear first, preview second, navigation third. The submit button must never precede unselected choices.

- [ ] **Step 5: Verify focused tests and typecheck**

Run: `npm test -- tests/build-steps.test.ts && npm run typecheck`

Expected: tests and TypeScript pass.

- [ ] **Step 6: Commit Task 2**

```bash
git add app/transport/BuildStep.tsx app/transport/PrototypePreview.tsx app/TransportApp.tsx app/globals.css
git commit -m "feat: guide students through four part choices"
```

### Task 3: 쉬운 다시 만들기와 결과 문장

**Files:**
- Create: `app/transport/RedesignStep.tsx`
- Create: `app/transport/ResultBoard.tsx`
- Modify: `app/transport/evaluator.ts`
- Modify: `app/TransportApp.tsx`
- Modify: `app/globals.css`
- Test: `tests/student-copy.test.ts`
- Test: `tests/design-evaluator.test.ts`

**Interfaces:**
- Produces: `RedesignStep({ selection, first, missionId, changeGroup, onChangeGroup, onSelect, onSubmit })`
- Produces: `ResultBoard({ evaluation })`
- Consumes: `makeComparisonCopy`, `studentGroupLabels`, `statusText`

- [ ] **Step 1: Extend the failing copy test for evaluator and comparison text**

```ts
const result = evaluateDesign(missions[2], design, components);
expect(result.conditionResults.map((item) => item.explanation).join(" ")).not.toMatch(/\(을\)|\(를\)|\(과\)|\(와\)/);
expect(makeComparisonCopy("바퀴", "거친 길용 넓은 바퀴", ["길의 상태"], "평평한 길에서는 힘이 더 들 수 있어요.")).toContain("하지만 평평한 길에서는 힘이 더 들 수 있어요.");
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- tests/student-copy.test.ts`

Expected: FAIL because the existing evaluator contains bracketed particles.

- [ ] **Step 3: Implement grammar-neutral evaluator explanations and `ResultBoard`**

Use evidence labels without particles and render each card as `왜 그런가요?` plus `생각할 점`. Rename the environment section to `에너지와 환경 생각` with `움직일 때`, `에너지를 마련할 때`, `만들고 버릴 때`.

- [ ] **Step 4: Implement `RedesignStep`**

First show four easy group labels. After a group is chosen, show only its three options and summarize the other three as `그대로 두는 부품`.

- [ ] **Step 5: Integrate the new components and short comparison copy**

Replace the inline result and redesign markup. Replace the long automatic report sentence with the two-sentence result returned by `makeComparisonCopy`.

- [ ] **Step 6: Run tests and confirm GREEN**

Run: `npm test -- tests/student-copy.test.ts tests/design-evaluator.test.ts`

Expected: both test files pass.

- [ ] **Step 7: Commit Task 3**

```bash
git add app/transport/RedesignStep.tsx app/transport/ResultBoard.tsx app/transport/evaluator.ts app/TransportApp.tsx app/globals.css tests/student-copy.test.ts
git commit -m "feat: simplify redesign and result explanations"
```

### Task 4: 전체 학생 문구와 업데이트 내역

**Files:**
- Modify: `app/TransportApp.tsx`
- Modify: `app/transport/Dialogs.tsx`
- Modify: `app/globals.css`
- Modify: `docs/2026-07-17-design-and-function-improvement-report.md`
- Create: `docs/2026-07-18-elementary-3-4-student-ux-implementation-report.md`

**Interfaces:**
- Consumes: `progressLabels`, `statusText`, easy group labels

- [ ] **Step 1: Replace visible flow copy**

Apply the six easy progress labels, `먼저 연습하기`, `바로 시작하기`, `조건 카드 5개를 눌러 보세요`, `더 좋게 만들 것 1개`, `그대로 지킬 좋은 점 1개`, `새로 생긴 어려움`, and `결과 비교`.

- [ ] **Step 2: Correct condition-card feedback**

Checked cards show `확인했어요`. The helper reads `${remaining}개 더 눌러 보세요`; when zero remain it is removed.

- [ ] **Step 3: Add v0.3.0 update history**

Add the latest entry: `2026-07-18 · v0.3.0` with easy wording, four-step parts, and corrected result sentences.

- [ ] **Step 4: Write the implementation report**

Record findings, changed files, red-green tests, viewport checks, browser flow, and deployment proof in the dated Markdown report.

- [ ] **Step 5: Commit Task 4**

```bash
git add app/TransportApp.tsx app/transport/Dialogs.tsx app/globals.css docs/2026-07-17-design-and-function-improvement-report.md docs/2026-07-18-elementary-3-4-student-ux-implementation-report.md
git commit -m "docs: record grade 3-4 UX improvement"
```

### Task 5: 자동·브라우저·배포 검증

**Files:**
- Verify only unless a failing check requires a focused fix

- [ ] **Step 1: Run the complete automated gate**

Run: `npm test -- --run`

Run: `npm run typecheck`

Run: `npm run lint`

Run: `npm run build`

Expected: all commands exit 0 with no test failures or lint errors.

- [ ] **Step 2: Run browser checks**

Verify 320×720, 375×812, 768×1024, and 1280×800. Complete mission 1 and mission 3. Confirm only one part group is visible, the test button appears only at step 4, there is no horizontal overflow, and the console has no relevant errors.

- [ ] **Step 3: Compare baseline and implementation screenshots**

Use the 2026-07-18 baseline screenshots and new after screenshots. Inspect copy, choice density, current-step clarity, button order, result grammar, responsive behavior, and typography.

- [ ] **Step 4: Publish through Sites**

Push the exact validated HEAD, package the built output, save a new Sites version, deploy it with the existing public access policy, and poll until success.

- [ ] **Step 5: Verify the public URL**

Confirm the production URL responds without authentication and the update dialog shows `v0.3.0`.

