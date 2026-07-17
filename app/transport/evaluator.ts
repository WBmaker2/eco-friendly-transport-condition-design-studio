import type { ComponentOption, ConditionResult, Evaluation, Mission, TradeoffComparison, TransportDesign } from "./types";

const needed = { light: 1, medium: 2, heavy: 3, near: 1, far: 3 } as const;
const status = (actual: number, required: number): "fits" | "partial" | "redesign" => actual >= required ? "fits" : actual === required - 1 ? "partial" : "redesign";
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
    { conditionId: "load", label: "짐의 무게", status: status(loadActual, needed[mission.load]), explanation: "짐받이와 움직이는 힘이 짐의 무게와 맞는지 봤어요.", evidenceComponentIds: [structure.id, energy.id], tradeoffNotes: [structure.burden] },
    { conditionId: "distance", label: "이동 거리", status: status(distanceActual, needed[mission.distance]), explanation: "바퀴와 움직이는 힘이 이 거리에 맞는지 봤어요.", evidenceComponentIds: [movement.id, energy.id], tradeoffNotes: [movement.burden] },
    { conditionId: "path", label: "길의 상태", status: status(pathActual, mission.path === "flat" ? 1 : mission.path === "rough" ? 3 : 2), explanation: mission.path === "rough" ? "바퀴가 울퉁불퉁한 길에서 잘 구르는지 봤어요." : "바퀴와 움직이는 힘이 이 길과 맞는지 봤어요.", evidenceComponentIds: [movement.id, energy.id], tradeoffNotes: [movement.burden] },
    { conditionId: "stability-control", label: "안정성·방향·멈춤", status: stabilityControlStatus, explanation: "방향을 바꾸고 멈추기 쉬운지 봤어요.", evidenceComponentIds: [control.id, structure.id], tradeoffNotes: [control.burden] },
    { conditionId: "energy", label: "움직이는 힘", status: status(energyActual, energyRequired), explanation: energy.id === "solar-charge-assist" ? "햇빛 충전은 날씨와 저장할 곳에 따라 달라져요." : "움직이는 데 필요한 힘을 마련할 수 있는지 봤어요.", evidenceComponentIds: [energy.id], tradeoffNotes: [energy.burden] },
  ];
  const profile = energy.id === "human-power" ? { usePhaseEnergy: "움직일 때 따로 충전하지 않고 사람의 힘을 써요.", chargingOrWeatherCondition: "무거운 짐, 먼 거리, 오르막에서는 힘이 많이 들어요.", materialAndBatteryNote: "배터리는 없지만 다른 부품을 만드는 재료는 필요해요." } : energy.id === "rechargeable-assist" ? { usePhaseEnergy: "움직일 때 충전한 힘이 수레를 도와줘요.", chargingOrWeatherCondition: "어디에서 어떤 전기로 충전하는지도 생각해요.", materialAndBatteryNote: "배터리를 만들고 다시 쓰거나 버리는 과정도 살펴봐요." } : { usePhaseEnergy: "밝을 때 저장할 힘을 조금 보탤 수 있어요.", chargingOrWeatherCondition: "날씨와 시간, 햇빛판 크기에 따라 달라져요.", materialAndBatteryNote: "햇빛판과 저장 장치를 만드는 재료도 필요해요." };
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
