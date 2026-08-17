import { byId } from "./components";
import { studentGroupLabels } from "./student-copy";
import type { ComponentGroup } from "./types";

export function PrototypePreview({ selected }: { selected: Partial<Record<ComponentGroup, string>> }) {
  const labels = (Object.keys(studentGroupLabels) as ComponentGroup[]).map((group) => ({ group, name: selected[group] ? byId(selected[group]!)?.name : "아직 안 골랐어요" }));
  return <section className="prototype" aria-labelledby="prototype-title">
    <div className="section-heading"><span>내 수레 모습</span><h2 id="prototype-title">고른 부품을 확인해요</h2></div>
    <img className="prototype-image" src="learning/cart-prototype.webp" alt="짐받이, 바퀴, 움직이는 힘, 방향과 멈춤 부품이 보이는 초록 시험용 수레" loading="lazy" decoding="async" />
    <p className="prototype-note">그림은 시험용 수레의 예시예요. 아래에서 내가 고른 부품을 다시 확인해요.</p>
    <ol className="sr-only">{labels.map(({ group, name }) => <li key={group}>{studentGroupLabels[group]}: {name}</li>)}</ol>
    <ul className="selection-list">{labels.map(({ group, name }) => <li key={group}><b>{studentGroupLabels[group]}</b><span>{name}</span></li>)}</ul>
  </section>;
}
