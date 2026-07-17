import type { ComponentGroup } from "./types";

export const buildSteps: ComponentGroup[] = ["structure", "movement", "energy", "control"];

export const nextBuildStep = (group: ComponentGroup) => buildSteps[Math.min(buildSteps.indexOf(group) + 1, buildSteps.length - 1)];

export const previousBuildStep = (group: ComponentGroup) => buildSteps[Math.max(buildSteps.indexOf(group) - 1, 0)];

export const canAdvanceBuildStep = (selection: Partial<Record<ComponentGroup, string>>, group: ComponentGroup) => Boolean(selection[group]);

export const allPartsSelected = (selection: Partial<Record<ComponentGroup, string>>) => buildSteps.every((group) => Boolean(selection[group]));
