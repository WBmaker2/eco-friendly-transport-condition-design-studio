import { byId } from "./components";
import { studentGroupLabels } from "./student-copy";
import type { ComponentGroup } from "./types";

export function PrototypePreview({ selected }: { selected: Partial<Record<ComponentGroup, string>> }) {
  const labels = (Object.keys(studentGroupLabels) as ComponentGroup[]).map((group) => ({ group, name: selected[group] ? byId(selected[group]!)?.name : "아직 안 골랐어요" }));
  const wheel = selected.movement === "wide-tread-wheel" ? 19 : selected.movement === "small-turning-wheel" ? 12 : 16;
  return <section className="prototype" aria-labelledby="prototype-title">
    <div className="section-heading"><span>내 수레 모습</span><h2 id="prototype-title">고른 부품을 확인해요</h2></div>
    <svg viewBox="0 0 360 210" role="img" aria-labelledby="prototype-svg-title prototype-svg-desc">
      <title id="prototype-svg-title">고른 부품으로 만든 수레 그림</title>
      <desc id="prototype-svg-desc">아래 목록에서 짐받이, 바퀴, 움직이는 힘, 방향과 멈춤 부품을 확인할 수 있습니다.</desc>
      <path d="M40 164h270" className="ground" />
      <rect x="76" y={selected.structure === "low-wide-platform" ? 80 : 65} width={selected.structure === "low-wide-platform" ? 188 : 154} height={selected.structure === "reinforced-bed" ? 72 : 54} rx="8" className={`layer structure ${selected.structure ?? ""}`} />
      <path d="M87 120h136l24 28H68z" className="frame" />
      <circle cx="104" cy="158" r={wheel} className="wheel" /><circle cx="219" cy="158" r={wheel} className="wheel" />
      <circle cx="104" cy="158" r="5" className="hub" /><circle cx="219" cy="158" r="5" className="hub" />
      <rect x="145" y="98" width="50" height="25" rx="6" className={`energy ${selected.energy ?? ""}`} />
      {selected.energy === "solar-charge-assist" ? <><path d="M131 91h78l-8-22h-62z" className="solar" /><path d="M157 69v22m22-22v22m-48-11h78" className="solar-line" /></> : null}
      <path d="M245 120l42-23m-27 7 20 20" className="handle" />
      {selected.control === "double-brake-control" ? <path d="M92 142l-12 11m146-11 12 11" className="brake" /> : null}
    </svg>
    <ol className="sr-only">{labels.map(({ group, name }) => <li key={group}>{studentGroupLabels[group]}: {name}</li>)}</ol>
    <ul className="selection-list">{labels.map(({ group, name }) => <li key={group}><b>{studentGroupLabels[group]}</b><span>{name}</span></li>)}</ul>
  </section>;
}
