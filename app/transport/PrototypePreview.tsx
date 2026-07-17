import { byId } from "./components";
import { groupLabels, type ComponentGroup } from "./types";

export function PrototypePreview({ selected }: { selected: Partial<Record<ComponentGroup, string>> }) {
  const labels = (Object.keys(groupLabels) as ComponentGroup[]).map((group) => ({ group, name: selected[group] ? byId(selected[group]!)?.name : "아직 고르지 않음" }));
  const wheel = selected.movement === "wide-tread-wheel" ? 19 : selected.movement === "small-turning-wheel" ? 12 : 16;
  return <section className="prototype" aria-labelledby="prototype-title">
    <div className="section-heading"><span>시제품 작업대</span><h2 id="prototype-title">선택한 부품이 수레 도식에 나타나요</h2></div>
    <svg viewBox="0 0 360 210" role="img" aria-labelledby="prototype-svg-title prototype-svg-desc">
      <title id="prototype-svg-title">선택한 구성 요소로 만든 교육용 수송 시제품 도식</title>
      <desc id="prototype-svg-desc">아래 목록에 선택한 구조, 이동, 동력, 조향 제동 부품 이름이 있습니다.</desc>
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
    <ol className="sr-only">{labels.map(({ group, name }) => <li key={group}>{groupLabels[group]}: {name}</li>)}</ol>
    <ul className="selection-list">{labels.map(({ group, name }) => <li key={group}><b>{groupLabels[group]}</b><span>{name}</span></li>)}</ul>
  </section>;
}
