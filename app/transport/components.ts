import type { ComponentOption } from "./types";

const c = (id: string, group: ComponentOption["group"], name: string, short: string, strength: string, burden: string, capability: ComponentOption["capability"], burdenType: ComponentOption["burdenType"]): ComponentOption => ({ id, group, name, short, strength, burden, capability, burdenType });

export const components: ComponentOption[] = [
  c("light-frame", "structure", "가벼운 작은 적재함", "가까운 가벼운 짐", "필요한 힘과 재료가 적어요.", "무거운 짐에는 약해요.", { load: 1, distance: 2, rough: 1, uphill: 1, stability: 1, control: 1 }, "material"),
  c("reinforced-bed", "structure", "튼튼한 적재함", "무거운 책 상자", "무거운 짐을 받치기 쉬워요.", "자체 무게와 재료가 늘어요.", { load: 3, distance: 1, rough: 2, uphill: 2, stability: 2, control: 1 }, "weight"),
  c("low-wide-platform", "structure", "낮고 넓은 적재판", "넘어지기 쉬운 짐", "무게 중심이 낮아 안정적이에요.", "좁은 길 회전과 보관이 부담돼요.", { load: 2, distance: 1, rough: 2, uphill: 1, stability: 3, control: 1 }, "weight"),
  c("large-road-wheel", "movement", "잘 포장된 길용 큰 바퀴", "긴 평탄 경로", "평평한 길에서 멀리 굴러가기 쉬워요.", "거친 길 접지는 약해요.", { load: 2, distance: 3, rough: 1, uphill: 2, stability: 1, control: 1 }, "weight"),
  c("wide-tread-wheel", "movement", "거친 길용 넓은 바퀴", "흙길과 자갈길", "거친 길에서 접지와 안정성에 도움 돼요.", "평탄 길에서는 더 많은 힘이 들 수 있어요.", { load: 2, distance: 1, rough: 3, uphill: 2, stability: 3, control: 1 }, "weight"),
  c("small-turning-wheel", "movement", "회전이 쉬운 작은 바퀴", "가까운 좁은 공간", "방향 전환이 쉬워요.", "먼 거리와 거친 길에는 불리해요.", { load: 1, distance: 1, rough: 0, uphill: 0, stability: 1, control: 3 }, "weight"),
  c("human-power", "energy", "사람의 힘 장치", "가까운 가벼운 임무", "운행 중 별도 충전이 필요 없어요.", "무거운 짐·오르막에서는 노력이 커져요.", { load: 1, distance: 1, rough: 1, uphill: 0, stability: 1, control: 1 }, "effort"),
  c("rechargeable-assist", "energy", "충전식 전동 보조", "충전 가능한 중·장거리", "무거운 짐과 오르막 이동을 보조해요.", "충전 전력과 배터리 재료를 살펴야 해요.", { load: 3, distance: 3, rough: 2, uphill: 3, stability: 1, control: 1 }, "charging"),
  c("solar-charge-assist", "energy", "태양광 충전 보조", "낮 시간 보조 충전", "밝은 시간에 저장 에너지를 보충할 수 있어요.", "날씨·시간·패널 면적에 따라 달라져요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 1 }, "weather"),
  c("basic-control", "control", "기본 방향·멈춤 장치", "평평하고 넓은 길", "단순하고 가벼워요.", "좁은 길과 경사길 제어에는 제한이 있어요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 1 }, "complexity"),
  c("precision-steering", "control", "좁은 길 정밀 조향", "장애물과 좁은 통로", "방향을 세밀하게 바꿀 수 있어요.", "구조가 조금 복잡해져요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 3 }, "complexity"),
  c("double-brake-control", "control", "경사길 이중 제동", "경사와 무거운 짐", "정지와 속도 제어를 보조해요.", "무게와 재료, 구조 복잡성이 늘어요.", { load: 2, distance: 1, rough: 2, uphill: 2, stability: 3, control: 2 }, "complexity"),
];

export const byId = (id: string) => components.find((item) => item.id === id);
