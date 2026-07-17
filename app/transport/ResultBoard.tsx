import { byId } from "./components";
import { statusText } from "./student-copy";
import type { Evaluation } from "./types";

export function ResultBoard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <>
      <section className="result-board" aria-label="조건별 시험 결과" aria-live="polite">
        <h2>조건별 시험 결과</h2>
        {evaluation.conditionResults.map((result) => {
          const evidence = result.evidenceComponentIds.map((id) => byId(id)?.name).filter(Boolean).join(" · ");
          return (
            <article className={`result ${result.status}`} key={result.conditionId}>
              <h3>{statusText[result.status]} · {result.label}</h3>
              <p className="evidence">살펴본 부품: {evidence}</p>
              <p><b>왜 그런가요?</b> {result.explanation}</p>
              <p className="muted"><b>생각할 점:</b> {result.tradeoffNotes[0]}</p>
            </article>
          );
        })}
      </section>
      <section className="environment">
        <h2>힘과 환경도 살펴봐요</h2>
        <div><b>움직일 때</b><p>{evaluation.environmentalProfile.usePhaseEnergy}</p></div>
        <div><b>힘을 마련할 때</b><p>{evaluation.environmentalProfile.chargingOrWeatherCondition}</p></div>
        <div><b>만들고 버릴 때</b><p>{evaluation.environmentalProfile.materialAndBatteryNote}</p></div>
      </section>
    </>
  );
}
