"use client";

import { useState } from "react";
import { buildSteps, canAdvanceBuildStep, nextBuildStep, previousBuildStep } from "./build-steps";
import { components } from "./components";
import { PrototypePreview } from "./PrototypePreview";
import { studentGroupHelp, studentGroupLabels } from "./student-copy";
import type { ComponentGroup } from "./types";

type Selection = Partial<Record<ComponentGroup, string>>;

export function BuildStep({
  selection,
  onSelect,
  onSubmit,
}: {
  selection: Selection;
  onSelect: (group: ComponentGroup, id: string) => void;
  onSubmit: () => void;
}) {
  const [activeGroup, setActiveGroup] = useState<ComponentGroup>(() =>
    buildSteps.find((group) => !selection[group]) ?? "control",
  );
  const stepIndex = buildSteps.indexOf(activeGroup);
  const isLastStep = stepIndex === buildSteps.length - 1;
  const canMoveNext = canAdvanceBuildStep(selection, activeGroup);
  const choices = components.filter((item) => item.group === activeGroup);

  return (
    <section className="guided-build" aria-labelledby="build-title">
      <div className="build-copy">
        <p className="leaf">수레 부품 고르기</p>
        <h1 id="build-title">부품을 하나씩 골라요</h1>
        <p className="lead">네 가지 부품을 차례로 고르면 첫 시험을 할 수 있어요.</p>
      </div>

      <ol className="part-step-rail" aria-label="부품 고르기 순서">
        {buildSteps.map((group, index) => (
          <li
            key={group}
            className={group === activeGroup ? "current" : selection[group] ? "done" : ""}
            aria-current={group === activeGroup ? "step" : undefined}
          >
            <span>{index + 1}</span>
            {studentGroupLabels[group]}
          </li>
        ))}
      </ol>

      <div className="guided-choice">
        <fieldset>
          <legend>
            {stepIndex + 1}. {studentGroupLabels[activeGroup]}
            <small>{studentGroupHelp[activeGroup]}</small>
          </legend>
          <div className="option-stack">
            {choices.map((item) => (
              <label className={selection[activeGroup] === item.id ? "option selected" : "option"} key={item.id}>
                <input
                  type="radio"
                  name={`build-${activeGroup}`}
                  checked={selection[activeGroup] === item.id}
                  onChange={() => onSelect(activeGroup, item.id)}
                />
                <span>
                  <b>{item.name}</b>
                  <small>{item.short}</small>
                  <em>좋은 점: {item.strength}</em>
                  <em>생각할 점: {item.burden}</em>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="guided-preview">
        <PrototypePreview selected={selection} />
      </div>

      <div className="guided-actions">
        {stepIndex > 0 ? (
          <button onClick={() => setActiveGroup(previousBuildStep(activeGroup))}>이전 부품</button>
        ) : <span />}
        {isLastStep ? (
          <button className="primary" disabled={!canMoveNext} onClick={onSubmit}>첫 수레 시험하기</button>
        ) : (
          <button className="primary" disabled={!canMoveNext} onClick={() => setActiveGroup(nextBuildStep(activeGroup))}>
            다음 부품
          </button>
        )}
      </div>
      {!canMoveNext ? <p className="guided-hint">먼저 {studentGroupLabels[activeGroup]} 하나를 골라 보세요.</p> : null}
    </section>
  );
}
