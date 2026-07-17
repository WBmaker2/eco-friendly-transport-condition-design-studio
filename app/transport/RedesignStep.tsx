"use client";

import { components, byId } from "./components";
import { isSingleComponentChange } from "./evaluator";
import { PrototypePreview } from "./PrototypePreview";
import { studentGroupHelp, studentGroupLabels } from "./student-copy";
import type { ComponentGroup, TransportDesign } from "./types";

const groups = Object.keys(studentGroupLabels) as ComponentGroup[];

export function RedesignStep({
  selection,
  first,
  missionId,
  changeGroup,
  onChangeGroup,
  onSelect,
  onSubmit,
}: {
  selection: Partial<Record<ComponentGroup, string>>;
  first: TransportDesign;
  missionId: string;
  changeGroup: ComponentGroup | "";
  onChangeGroup: (group: ComponentGroup) => void;
  onSelect: (group: ComponentGroup, id: string) => void;
  onSubmit: () => void;
}) {
  const candidate = {
    id: "second",
    missionId,
    componentIds: selection as Record<ComponentGroup, string>,
  };
  const canSubmit = Boolean(changeGroup) && isSingleComponentChange(first, candidate);

  return (
    <section className="redesign-layout" aria-labelledby="redesign-title">
      <div className="build-copy">
        <p className="leaf">다시 만들기</p>
        <h1 id="redesign-title">부품 하나만 바꿔요</h1>
        <p className="lead">먼저 바꿀 곳을 고르고, 새 부품 하나를 선택하세요.</p>
      </div>

      <fieldset className="change-group">
        <legend>어느 부품을 바꿀까요?</legend>
        {groups.map((group) => (
          <label className={changeGroup === group ? "selected" : ""} key={group}>
            <input
              type="radio"
              name="change-group"
              checked={changeGroup === group}
              onChange={() => onChangeGroup(group)}
            />
            <span><b>{studentGroupLabels[group]}</b><small>{studentGroupHelp[group]}</small></span>
          </label>
        ))}
      </fieldset>

      {changeGroup ? (
        <div className="redesign-choice">
          <fieldset>
            <legend>새 {studentGroupLabels[changeGroup]} 고르기</legend>
            <div className="option-stack">
              {components.filter((item) => item.group === changeGroup).map((item) => (
                <label className={selection[changeGroup] === item.id ? "option selected" : "option"} key={item.id}>
                  <input
                    type="radio"
                    name={`redesign-${changeGroup}`}
                    checked={selection[changeGroup] === item.id}
                    onChange={() => onSelect(changeGroup, item.id)}
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
      ) : <p className="redesign-prompt">위에서 바꿀 부품을 하나 골라 보세요.</p>}

      <div className="guided-preview"><PrototypePreview selected={selection} /></div>

      <aside className="unchanged-parts" aria-label="그대로 두는 부품">
        <b>그대로 두는 부품</b>
        <ul>
          {groups.filter((group) => group !== changeGroup).map((group) => (
            <li key={group}><span>{studentGroupLabels[group]}</span>{byId(first.componentIds[group])?.name}</li>
          ))}
        </ul>
      </aside>

      <div className="guided-actions redesign-actions">
        <span />
        <button className="primary" disabled={!canSubmit} onClick={onSubmit}>바꾼 수레 시험하기</button>
      </div>
      {!canSubmit ? <p className="guided-hint">처음과 다른 부품 하나를 골라야 해요.</p> : null}
    </section>
  );
}
