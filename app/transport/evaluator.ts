import { byId } from "./components";
import type { ComponentOption, ConditionResult, Evaluation, Mission, TradeoffComparison, TransportDesign } from "./types";

const needed = { light: 1, medium: 2, heavy: 3, near: 1, far: 3 } as const;
const status = (actual: number, required: number): "fits" | "partial" | "redesign" => actual >= required ? "fits" : actual === required - 1 ? "partial" : "redesign";
const name = (id: string) => byId(id)?.name ?? "선택 부품";
const statusRank = { redesign: 0, partial: 1, fits: 2 } as const;
const worseStatus = (first: ConditionResult["status"], second: ConditionResult["status"]) => statusRank[first] <= statusRank[second] ? first : second;

export function evaluateDesign(mission: Mission, design: TransportDesign, all: ComponentOption[]): Evaluation {
  const get = (id: string) => all.find((item) => item.id === id)!;
  const structure = get(design.componentIds.structure); const movement = get(design.componentIds.movement);
  const energy = get(design.componentIds.energy); const control = get(design.componentIds.control);
  // A powerful energy unit cannot replace a structure that can safely hold the cargo.
  const loadActual = structure.capability.load;
  const distanceActual = Math.max(movement.capability.distance, energy.capability.distance);
  const pathActual = mission.path === "rough" ? Math.max(movement.capability.rough, structure.capability.rough) : mission.path === "uphill" ? Math.max(energy.capability.uphill, movement.capability.uphill) : movement.capability.distance;
  const stabilityActual = Math.max(structure.capability.stability, movement.capability.stability, control.capability.stability);
  const controlActual = Math.max(control.capability.control, movement.capability.control);
  const energyRequired = mission.path === "uphill" || mission.distance === "far" ? 3 : mission.load !== "light" || mission.distance === "medium" ? 2 : 1;
  const has = (condition: Mission["energyAvailability"][number]) => mission.energyAvailability.includes(condition);
  const energyActual = energy.id === "solar-charge-assist"
    ? has("cloudy") ? 0 : has("daylight-supplement") ? 1 : 0
    : energy.id === "rechargeable-assist"
      ? has("charging-available") ? energy.capability.distance : has("limited-charging") ? Math.max(0, energyRequired - 1) : 0
      : has("human-power-ok") ? energy.capability.distance : Math.min(energy.capability.distance, 1);
  const stabilityControlStatus = worseStatus(status(stabilityActual, mission.minimumStability), status(controlActual, mission.minimumControl));
  const results: ConditionResult[] = [
    { conditionId: "load", label: "짐의 무게", status: status(loadActual, needed[mission.load]), explanation: `${name(structure.id)}과 ${name(energy.id)}을(를) 함께 살펴본 결과예요.`, evidenceComponentIds: [structure.id, energy.id], tradeoffNotes: [structure.burden] },
    { conditionId: "distance", label: "이동 거리", status: status(distanceActual, needed[mission.distance]), explanation: `${name(movement.id)}과 ${name(energy.id)}이(가) 이 거리 조건에 주는 도움을 봐요.`, evidenceComponentIds: [movement.id, energy.id], tradeoffNotes: [movement.burden] },
    { conditionId: "path", label: "길의 상태", status: status(pathActual, mission.path === "flat" ? 1 : mission.path === "rough" ? 3 : 2), explanation: mission.path === "rough" ? `${name(movement.id)}의 접지와 ${name(structure.id)}의 안정성을 확인해요.` : `${name(movement.id)}과 ${name(energy.id)}이(가) 길 조건에 맞는지 봐요.`, evidenceComponentIds: [movement.id, energy.id], tradeoffNotes: [movement.burden] },
    { conditionId: "stability-control", label: "안정성·조향·제동", status: stabilityControlStatus, explanation: `${name(control.id)}과(와) 적재부가 임무의 방향·멈춤 요구에 주는 도움을 봐요.`, evidenceComponentIds: [control.id, structure.id], tradeoffNotes: [control.burden] },
    { conditionId: "energy", label: "에너지 조건", status: status(energyActual, energyRequired), explanation: energy.id === "solar-charge-assist" ? "태양광은 날씨와 저장 조건에 따른 보조예요. 단독 동력을 보장하지 않아요." : `${name(energy.id)}의 도움과 이용 조건을 함께 봐요.`, evidenceComponentIds: [energy.id], tradeoffNotes: [energy.burden] },
  ];
  const profile = energy.id === "human-power" ? { usePhaseEnergy: "운행 중 별도 충전 없이 사람의 힘을 사용해요.", chargingOrWeatherCondition: "무거운 짐·먼 거리·오르막에서는 사람의 노력을 살펴요.", materialAndBatteryNote: "배터리는 없지만 다른 부품의 재료 사용은 남아요." } : energy.id === "rechargeable-assist" ? { usePhaseEnergy: "운행 중 전동 보조가 힘을 보태요.", chargingOrWeatherCondition: "충전 장소와 전기를 마련하는 과정을 함께 생각해요.", materialAndBatteryNote: "배터리의 재료·무게·재활용과 폐기를 살펴요." } : { usePhaseEnergy: "밝은 시간에 저장 에너지를 보조할 수 있어요.", chargingOrWeatherCondition: "날씨·시간·패널 면적과 저장 조건에 따라 달라져요.", materialAndBatteryNote: "패널과 저장 장치 재료도 함께 살펴요." };
  return { missionId: mission.id, designId: design.id, conditionResults: results, environmentalProfile: profile, strengths: results.filter((r) => r.status === "fits").map((r) => r.label), limitations: results.filter((r) => r.status !== "fits").map((r) => r.label) };
}

export function getRedesignChoices(evaluation: Evaluation) {
  const targets = evaluation.conditionResults.filter((result) => result.status !== "fits");
  const strengths = evaluation.conditionResults.filter((result) => result.status === "fits");
  return {
    targets: targets.length > 0 ? targets : evaluation.conditionResults,
    strengths: strengths.length > 0 ? strengths : evaluation.conditionResults.filter((result) => result.status === "partial"),
  };
}

export function compareEvaluations(first: Evaluation, second: Evaluation, changedComponentBurden: string): TradeoffComparison {
  const comparison: TradeoffComparison = { improved: [], unchanged: [], regressed: [], newBurdens: [changedComponentBurden] };
  first.conditionResults.forEach((before) => {
    const after = second.conditionResults.find((result) => result.conditionId === before.conditionId);
    if (!after) return;
    if (statusRank[after.status] > statusRank[before.status]) comparison.improved.push(before.label);
    else if (statusRank[after.status] < statusRank[before.status]) comparison.regressed.push(before.label);
    else comparison.unchanged.push(before.label);
  });
  return comparison;
}

export const isSingleComponentChange = (first: TransportDesign, second: TransportDesign) => Object.keys(first.componentIds).filter((group) => first.componentIds[group as keyof typeof first.componentIds] !== second.componentIds[group as keyof typeof second.componentIds]).length === 1;
