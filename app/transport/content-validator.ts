import type { ComponentOption, ComponentGroup, Mission, TransportDesign } from "./types";

const groups: ComponentGroup[] = ["structure", "movement", "energy", "control"];

export function buildAllDesigns(missionId: string, components: ComponentOption[]): TransportDesign[] {
  const options = Object.fromEntries(groups.map((group) => [group, components.filter((item) => item.group === group)])) as Record<ComponentGroup, ComponentOption[]>;
  return options.structure.flatMap((structure) => options.movement.flatMap((movement) => options.energy.flatMap((energy) => options.control.map((control, index) => ({
    id: `${missionId}-${structure.id}-${movement.id}-${energy.id}-${control.id}-${index}`,
    missionId,
    componentIds: { structure: structure.id, movement: movement.id, energy: energy.id, control: control.id },
  })))));
}

export function validateContent(missions: Mission[], components: ComponentOption[]): string[] {
  const errors: string[] = [];
  const unique = (values: string[]) => new Set(values).size === values.length;
  if (!unique(missions.map((mission) => mission.id))) errors.push("임무 ID가 중복되었습니다.");
  if (!unique(components.map((component) => component.id))) errors.push("부품 ID가 중복되었습니다.");
  groups.forEach((group) => {
    if (components.filter((component) => component.group === group).length !== 3) errors.push(`${group} 부품은 정확히 3개여야 합니다.`);
  });
  missions.forEach((mission) => {
    if (!mission.energyAvailability.length || !mission.control || !mission.minimumControl || !mission.minimumStability) errors.push(`${mission.id} 임무 조건이 비어 있습니다.`);
  });
  components.forEach((component) => {
    if (!component.strength || !component.burden) errors.push(`${component.id}의 장점 또는 부담이 비어 있습니다.`);
  });
  return errors;
}
