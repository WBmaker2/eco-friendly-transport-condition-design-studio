"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BuildStep } from "./transport/BuildStep";
import { byId, components } from "./transport/components";
import { HelpDialog } from "./transport/Dialogs";
import { LearningVisual } from "./transport/LearningVisual";
import { compareEvaluations, evaluateDesign, getRedesignChoices, isSingleComponentChange } from "./transport/evaluator";
import { getFirstDesignMission, missions } from "./transport/missions";
import { getPreviousPhase, type Phase } from "./transport/navigation";
import { RedesignStep } from "./transport/RedesignStep";
import { ResultBoard } from "./transport/ResultBoard";
import { resetPageScroll } from "./transport/scroll";
import { makeComparisonCopy, progressLabels, statusText, studentGroupLabels } from "./transport/student-copy";
import type { ComponentGroup, ConditionId, TransportDesign } from "./transport/types";

const groups = Object.keys(studentGroupLabels) as ComponentGroup[];
const conditionCards = (mission: (typeof missions)[number]) => [
  ["짐", mission.cargo],
  ["거리", mission.distance === "near" ? "가까운 거리" : mission.distance === "medium" ? "중간 거리" : "먼 거리"],
  ["길", mission.path === "flat" ? "평평한 길" : mission.path === "rough" ? "울퉁불퉁한 길" : "완만한 오르막"],
  ["움직이는 힘", mission.energy.join(" · ")],
  ["방향·멈춤", mission.control],
];
const emptySelection = (): Partial<Record<ComponentGroup, string>> => ({});

export default function TransportApp() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [missionId, setMissionId] = useState(missions[0].id);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [selection, setSelection] = useState(emptySelection);
  const [first, setFirst] = useState<TransportDesign | null>(null);
  const [second, setSecond] = useState<TransportDesign | null>(null);
  const [target, setTarget] = useState<ConditionId | "">("");
  const [strength, setStrength] = useState<ConditionId | "">("");
  const [changeGroup, setChangeGroup] = useState<ComponentGroup | "">("");
  const [dialog, setDialog] = useState<"updates" | "teacher" | "principles" | null>(null);
  const [reports, setReports] = useState<string[]>([]);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const mission = missions.find((item) => item.id === missionId)!;
  const firstDesignMission = useMemo(() => getFirstDesignMission(mission), [mission]);
  const firstEvaluation = useMemo(
    () => first ? evaluateDesign(firstDesignMission, first, components) : null,
    [firstDesignMission, first],
  );
  const redesignBaseEvaluation = useMemo(
    () => first ? evaluateDesign(mission, first, components) : null,
    [mission, first],
  );
  const secondEvaluation = useMemo(
    () => second ? evaluateDesign(mission, second, components) : null,
    [mission, second],
  );
  const redesignChoices = redesignBaseEvaluation
    ? getRedesignChoices(redesignBaseEvaluation)
    : { targets: [], strengths: [] };
  const changedGroup = first && second
    ? groups.find((group) => first.componentIds[group] !== second.componentIds[group])
    : undefined;
  const changedComponent = changedGroup && second ? byId(second.componentIds[changedGroup]) : undefined;
  const tradeoff = redesignBaseEvaluation && secondEvaluation && changedComponent
    ? compareEvaluations(redesignBaseEvaluation, secondEvaluation, changedComponent.burden)
    : null;

  useEffect(() => {
    resetPageScroll();
    if (phase === "first-test" || phase === "second-test") {
      resultHeadingRef.current?.focus({ preventScroll: true });
      return;
    }
    if (typeof document !== "undefined") {
      const stageHeading = document.querySelector<HTMLElement>("#main h1");
      if (stageHeading) {
        stageHeading.tabIndex = -1;
        stageHeading.focus({ preventScroll: true });
      }
    }
  }, [phase]);

  const setPart = (group: ComponentGroup, id: string) => {
    setSelection((old) => ({ ...old, [group]: id }));
  };
  const createFirst = () => {
    setFirst({ id: "first", missionId, componentIds: selection as Record<ComponentGroup, string> });
    setPhase("first-test");
  };
  const startRedesign = () => {
    setSelection(first?.componentIds ?? {});
    setChangeGroup("");
    setPhase("redesign");
  };
  const chooseChangeGroup = (group: ComponentGroup) => {
    if (!first) return;
    setSelection(first.componentIds);
    setChangeGroup(group);
  };
  const createSecond = () => {
    const design = { id: "second", missionId, componentIds: selection as Record<ComponentGroup, string> };
    if (first && isSingleComponentChange(first, design)) {
      setSecond(design);
      setPhase("second-test");
    }
  };
  const chooseMission = (id: string) => {
    setMissionId(id);
    setReviewed([]);
    setSelection(emptySelection());
    setFirst(null);
    setSecond(null);
    setTarget("");
    setStrength("");
    setChangeGroup("");
    setPhase("brief");
  };

  const phaseIndex = phase === "welcome" || phase === "tutorial" || phase === "missions" || phase === "brief"
    ? 0
    : phase === "conditions"
      ? 1
      : phase === "build"
        ? 2
        : phase === "first-test"
          ? 3
          : phase === "goal" || phase === "redesign" || phase === "second-test"
            ? 4
            : 5;
  const previous = getPreviousPhase(phase);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#main">친환경 수송 <span>조건 설계소</span></a>
        <div className="utility">
          <button onClick={() => setDialog("principles")}>설계 원칙</button>
          <button onClick={() => setDialog("teacher")}>교사용 안내</button>
          <button onClick={() => setDialog("updates")}>업데이트 내역</button>
        </div>
      </header>
      <div className="progress" aria-label={`현재 단계: ${progressLabels[phaseIndex]}`}>
        {progressLabels.map((item, index) => (
          <span
            key={item}
            className={index === phaseIndex ? "current" : index < phaseIndex ? "done" : ""}
            aria-current={index === phaseIndex ? "step" : undefined}
          >
            {index + 1}. {item}
          </span>
        ))}
      </div>

      <div id="main" className="app-shell">
        {previous ? (
          <nav className="stage-toolbar" aria-label="학습 단계 이동">
            <button onClick={() => setPhase(previous)}>이전 단계</button>
            <span>{progressLabels[phaseIndex]} 단계</span>
          </nav>
        ) : null}

        {phase === "welcome" ? (
          <section className="welcome">
            <p className="leaf">수송은 사람이나 물건을 다른 곳으로 옮기는 일이에요.</p>
            <h1>조건을 보고<br />시험용 수레를 만들어요</h1>
            <p>옮길 물건, 거리, 길을 살펴보고 알맞은 수레 부품을 골라 보세요. 점수를 겨루는 활동은 아니에요.</p>
            <div className="welcome-actions">
              <button className="primary" onClick={() => setPhase("tutorial")}>먼저 연습하기</button>
              <button onClick={() => setPhase("missions")}>바로 시작하기</button>
            </div>
            <p className="safety"><strong>꼭 기억해요</strong><span>화면 속 시험은 실제 수레의 안전을 보장하지 않아요.</span></p>
          </section>
        ) : null}

        {phase === "tutorial" ? (
          <section className="panel tutorial">
            <p className="leaf">짧은 연습</p>
            <h1>할 일이 바뀌면 수레도 달라져요</h1>
            <LearningVisual visual={{ src: "learning/transport-learning-overview.webp", alt: "교실에서 상자를 실은 초록 수레와 평평한 길, 울퉁불퉁한 길, 오르막길을 살펴보는 장면", caption: "짐과 길이 달라지면 고를 부품도 달라질 수 있어요." }} />
            <div className="tutorial-grid">
              <article><b>가벼운 상자</b><p>평평한 가까운 길에서는 가볍고 간단한 부품이 잘 맞을 수 있어요.</p></article>
              <article><b>무거운 상자</b><p>울퉁불퉁한 먼 길에서는 튼튼한 부품과 더 큰 힘이 필요할 수 있어요.</p></article>
            </div>
            <p>모든 조건에 늘 가장 좋은 부품은 없어요. 좋은 점과 생각할 점을 함께 살펴봐요.</p>
            <button className="primary" onClick={() => setPhase("missions")}>옮기기 할 일 고르기</button>
          </section>
        ) : null}

        {phase === "missions" ? (
          <section>
            <h1>옮기기 할 일을 골라요</h1>
            <p className="lead">무엇을, 어디까지, 어떤 길로 옮길지 살펴보세요.</p>
            <div className="mission-grid">
              {missions.map((item) => (
                <button key={item.id} className="mission-card" onClick={() => chooseMission(item.id)}>
                  <img src={item.visual.src} alt="" loading="lazy" decoding="async" />
                  <span>할 일 {item.number}</span><b>{item.title}</b><small>{item.cargo}</small>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {phase === "brief" ? (
          <section className="panel brief">
            <p className="leaf">할 일 {mission.number}</p>
            <h1>{mission.title}</h1>
            <LearningVisual visual={mission.visual} />
            <p>{mission.purpose}</p>
            <p><b>옮길 물건:</b> {mission.cargo}</p>
            {mission.conditionChange ? (
              <div className="condition-change">
                <div><b>처음 조건</b><p>{mission.conditionChange.before.join(" · ")}</p></div>
                <div><b>바뀐 조건</b><p>{mission.conditionChange.after.join(" · ")}</p></div>
                <p>조건이 바뀌면 영향을 많이 받은 부품 하나를 바꿔 봐요.</p>
              </div>
            ) : null}
            <button className="primary" onClick={() => setPhase("conditions")}>조건 보기</button>
            <button onClick={() => setPhase("missions")}>다른 할 일 고르기</button>
          </section>
        ) : null}

        {phase === "conditions" ? (
          <section>
            <h1>{mission.conditionChange ? "먼저 처음 조건을 살펴봐요" : "조건을 하나씩 눌러 봐요"}</h1>
            <p className="lead">카드 5개를 모두 누르면 부품을 고를 수 있어요.</p>
            <LearningVisual visual={mission.visual} className="conditions-visual" />
            <div className="conditions">
              {conditionCards(firstDesignMission).map(([title, detail]) => (
                <button
                  key={title}
                  className={reviewed.includes(title) ? "condition checked" : "condition"}
                  onClick={() => setReviewed((old) => old.includes(title) ? old : [...old, title])}
                >
                  <b>{title}</b><span>{detail}</span>{reviewed.includes(title) ? <small>✓ 확인했어요</small> : <small>눌러서 확인하기</small>}
                </button>
              ))}
            </div>
            <button className="primary" disabled={reviewed.length < 5} aria-describedby="review-help" onClick={() => setPhase("build")}>부품 고르기</button>
            {reviewed.length < 5 ? <p id="review-help" className="hint">{5 - reviewed.length}개 더 눌러 보세요.</p> : null}
          </section>
        ) : null}

        {phase === "build" ? <BuildStep selection={selection} onSelect={setPart} onSubmit={createFirst} /> : null}

        {phase === "first-test" && firstEvaluation ? (
          <section>
            <h1 ref={resultHeadingRef} tabIndex={-1}>첫 수레 결과를 살펴봐요</h1>
            <ResultBoard evaluation={firstEvaluation} />
            <button className="primary" onClick={() => setPhase("goal")}>{mission.conditionChange ? "바뀐 조건 보기" : "다시 만들 목표 고르기"}</button>
          </section>
        ) : null}

        {phase === "goal" && redesignBaseEvaluation ? (
          <section className="goal">
            <h1>{mission.conditionChange ? "조건이 바뀌었어요" : "어디를 더 좋게 만들까요?"}</h1>
            {mission.conditionChange ? (
              <>
                <div className="condition-change">
                  <div><b>바뀐 조건</b><p>{mission.conditionChange.after.join(" · ")}</p></div>
                  <p>새 조건에 맞게 부품 하나만 바꿔 보세요.</p>
                </div>
                <LearningVisual visual={mission.visual} />
                <ResultBoard evaluation={redesignBaseEvaluation} />
              </>
            ) : null}
            <p className="lead">더 좋게 만들 조건 하나와 그대로 지킬 좋은 점 하나를 골라요.</p>
            <fieldset>
              <legend>더 좋게 만들 조건</legend>
              {redesignChoices.targets.map((item) => (
                <label key={item.conditionId}>
                  <input
                    type="radio"
                    name="target"
                    checked={target === item.conditionId}
                    onChange={() => { setTarget(item.conditionId); if (strength === item.conditionId) setStrength(""); }}
                  />
                  {item.label} · {statusText[item.status]}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>그대로 지킬 좋은 점</legend>
              {redesignChoices.strengths.filter((item) => item.conditionId !== target).map((item) => (
                <label key={item.conditionId}>
                  <input type="radio" name="strength" checked={strength === item.conditionId} onChange={() => setStrength(item.conditionId)} />
                  그대로 지킬 조건: {item.label}
                </label>
              ))}
            </fieldset>
            <button className="primary" disabled={!target || !strength || target === strength} onClick={startRedesign}>부품 하나 바꾸기</button>
          </section>
        ) : null}

        {phase === "redesign" && first ? (
          <RedesignStep
            selection={selection}
            first={first}
            missionId={missionId}
            changeGroup={changeGroup}
            onChangeGroup={chooseChangeGroup}
            onSelect={setPart}
            onSubmit={createSecond}
          />
        ) : null}

        {phase === "second-test" && secondEvaluation ? (
          <section>
            <h1 ref={resultHeadingRef} tabIndex={-1}>바꾼 수레를 같은 조건으로 시험해요</h1>
            <ResultBoard evaluation={secondEvaluation} />
            <button className="primary" onClick={() => setPhase("compare")}>두 수레 비교하기</button>
          </section>
        ) : null}

        {phase === "compare" && first && second && redesignBaseEvaluation && secondEvaluation && changedGroup && changedComponent && tradeoff ? (
          <section>
            <h1>좋아진 점과 새 어려움을 비교해요</h1>
            <p className="lead">바꾼 부품: <b>{studentGroupLabels[changedGroup]}</b> · {changedComponent.name}</p>
            <div className="comparison">
              {[redesignBaseEvaluation, secondEvaluation].map((evaluation, index) => (
                <article key={evaluation.designId}>
                  <h2>{index === 0 ? mission.conditionChange ? "새 조건 속 첫 수레" : "첫 수레" : "바꾼 수레"}</h2>
                  {evaluation.conditionResults.map((result) => <p key={result.conditionId}><b>{result.label}</b><br />{statusText[result.status]}</p>)}
                </article>
              ))}
            </div>
            <section className="tradeoff-grid" aria-label="실제 결과 변화">
              <div><b>더 좋아진 조건</b><p>{tradeoff.improved.length ? tradeoff.improved.join(" · ") : "아직 없어요."}</p></div>
              <div><b>그대로인 조건</b><p>{tradeoff.unchanged.length ? tradeoff.unchanged.join(" · ") : "없어요."}</p></div>
              <div><b>새로 생각할 점</b><p>{[...tradeoff.regressed, ...tradeoff.newBurdens].join(" · ")}</p></div>
            </section>
            <section className="report-sentence">
              <h2>나의 수레 비교</h2>
              <p>{makeComparisonCopy(studentGroupLabels[changedGroup], changedComponent.name, tradeoff.improved, changedComponent.burden)}</p>
              <p className="safety"><strong>꼭 기억해요</strong><span>이 결과는 생각 연습용이며 실제 수레의 안전을 보장하지 않아요.</span></p>
            </section>
            <button className="primary" onClick={() => { setReports((old) => [...old, mission.title]); setPhase("report"); }}>비교 마치기</button>
          </section>
        ) : null}

        {phase === "report" ? (
          <section className="panel report">
            <h1>수레 비교를 완성했어요</h1>
            <p>조건을 살펴보고, 수레를 만든 뒤, 부품 하나를 바꾸어 결과를 비교했어요.</p>
            <ul>{reports.map((item, index) => <li key={`${item}-${index}`}>{item} 비교 완료</li>)}</ul>
            <button className="primary" onClick={() => setPhase("missions")}>다른 할 일 해 보기</button>
            <button onClick={() => setPhase("welcome")}>처음으로</button>
          </section>
        ) : null}
      </div>

      <HelpDialog open={Boolean(dialog)} onClose={() => setDialog(null)} type={dialog ?? "updates"} />
    </main>
  );
}
