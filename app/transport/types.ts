export type Level = 0 | 1 | 2 | 3;
export type ComponentGroup = "structure" | "movement" | "energy" | "control";
export type ConditionId = "load" | "distance" | "path" | "stability-control" | "energy";
export type ConditionStatus = "fits" | "partial" | "redesign";

export interface LearningVisual {
  src: string;
  alt: string;
  caption: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  cargo: string;
  purpose: string;
  load: "light" | "medium" | "heavy";
  distance: "near" | "medium" | "far";
  path: "flat" | "rough" | "uphill";
  energy: string[];
  energyAvailability: Array<"human-power-ok" | "charging-available" | "limited-charging" | "daylight-supplement" | "cloudy">;
  control: string;
  minimumStability: Level;
  minimumControl: Level;
  notes: string[];
  visual: LearningVisual;
  conditionChange?: {
    before: string[];
    after: string[];
    initialRequirements: Pick<Mission, "cargo" | "load" | "distance" | "path" | "energy" | "energyAvailability" | "control" | "minimumStability" | "minimumControl">;
  };
}

export interface ComponentOption {
  id: string;
  group: ComponentGroup;
  name: string;
  short: string;
  strength: string;
  burden: string;
  capability: Record<"load" | "distance" | "rough" | "uphill" | "stability" | "control", Level>;
  burdenType: "weight" | "material" | "charging" | "weather" | "effort" | "complexity";
}

export interface TransportDesign {
  id: string;
  missionId: string;
  componentIds: Record<ComponentGroup, string>;
}

export interface ConditionResult {
  conditionId: ConditionId;
  label: string;
  status: ConditionStatus;
  explanation: string;
  evidenceComponentIds: string[];
  tradeoffNotes: string[];
}

export interface Evaluation {
  missionId: string;
  designId: string;
  conditionResults: ConditionResult[];
  environmentalProfile: {
    usePhaseEnergy: string;
    chargingOrWeatherCondition: string;
    materialAndBatteryNote: string;
  };
  strengths: string[];
  limitations: string[];
}

export interface TradeoffComparison {
  improved: string[];
  unchanged: string[];
  regressed: string[];
  newBurdens: string[];
}

export const groupLabels: Record<ComponentGroup, string> = {
  structure: "구조·적재부", movement: "이동부", energy: "동력·에너지부", control: "조향·제동부",
};
