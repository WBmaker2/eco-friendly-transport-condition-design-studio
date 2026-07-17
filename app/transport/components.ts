import type { ComponentOption } from "./types";

const c = (id: string, group: ComponentOption["group"], name: string, short: string, strength: string, burden: string, capability: ComponentOption["capability"], burdenType: ComponentOption["burdenType"]): ComponentOption => ({ id, group, name, short, strength, burden, capability, burdenType });

export const components: ComponentOption[] = [
  c("light-frame", "structure", "가벼운 작은 짐받이", "가까운 곳의 가벼운 짐", "필요한 힘과 재료가 적어요.", "무거운 짐은 잘 받치기 어려워요.", { load: 1, distance: 2, rough: 1, uphill: 1, stability: 1, control: 1 }, "material"),
  c("reinforced-bed", "structure", "튼튼한 적재함", "무거운 책 상자", "무거운 짐을 받치기 쉬워요.", "자체 무게와 재료가 늘어요.", { load: 3, distance: 1, rough: 2, uphill: 2, stability: 2, control: 1 }, "weight"),
  c("low-wide-platform", "structure", "낮고 넓은 짐받이", "쉽게 넘어지는 짐", "무게 중심이 낮아 안정적이에요.", "좁은 길에서는 돌기 어렵고 보관할 곳도 많이 필요해요.", { load: 2, distance: 1, rough: 2, uphill: 1, stability: 3, control: 1 }, "weight"),
  c("large-road-wheel", "movement", "잘 포장된 길용 큰 바퀴", "길고 평평한 길", "평평한 길에서 멀리 굴러가기 쉬워요.", "울퉁불퉁한 길에서는 미끄러질 수 있어요.", { load: 2, distance: 3, rough: 1, uphill: 2, stability: 1, control: 1 }, "weight"),
  c("wide-tread-wheel", "movement", "울퉁불퉁한 길용 넓은 바퀴", "흙길과 자갈길", "울퉁불퉁한 길에서 덜 미끄러지고 안정적이에요.", "평평한 길에서는 힘이 더 들 수 있어요.", { load: 2, distance: 1, rough: 3, uphill: 2, stability: 3, control: 1 }, "weight"),
  c("small-turning-wheel", "movement", "돌기 쉬운 작은 바퀴", "가까운 좁은 공간", "방향을 바꾸기 쉬워요.", "먼 거리와 울퉁불퉁한 길에는 잘 맞지 않아요.", { load: 1, distance: 1, rough: 0, uphill: 0, stability: 1, control: 3 }, "weight"),
  c("human-power", "energy", "사람의 힘", "가까운 곳의 가벼운 짐", "움직일 때 따로 충전하지 않아도 돼요.", "무거운 짐이나 오르막에서는 힘이 많이 들어요.", { load: 1, distance: 1, rough: 1, uphill: 0, stability: 1, control: 1 }, "effort"),
  c("rechargeable-assist", "energy", "충전해서 쓰는 힘 보조", "충전할 수 있는 중간·먼 거리", "무거운 짐과 오르막에서 힘을 보태요.", "충전에 쓰는 전기와 배터리 재료를 생각해야 해요.", { load: 3, distance: 3, rough: 2, uphill: 3, stability: 1, control: 1 }, "charging"),
  c("solar-charge-assist", "energy", "햇빛 충전 보조", "밝은 낮의 보조 충전", "밝을 때 저장할 힘을 조금 보탤 수 있어요.", "날씨와 시간, 햇빛판 크기에 따라 달라져요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 1 }, "weather"),
  c("basic-control", "control", "기본 방향·멈춤 장치", "평평하고 넓은 길", "단순하고 가벼워요.", "좁은 길과 경사길 제어에는 제한이 있어요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 1 }, "complexity"),
  c("precision-steering", "control", "좁은 길 방향 장치", "장애물과 좁은 통로", "방향을 조금씩 바꿀 수 있어요.", "만드는 방법이 조금 복잡해져요.", { load: 1, distance: 1, rough: 1, uphill: 1, stability: 1, control: 3 }, "complexity"),
  c("double-brake-control", "control", "경사길 튼튼한 멈춤 장치", "경사와 무거운 짐", "경사에서 천천히 멈추도록 도와줘요.", "무게와 재료가 늘고 만들기 어려워져요.", { load: 2, distance: 1, rough: 2, uphill: 2, stability: 3, control: 2 }, "complexity"),
];

export const byId = (id: string) => components.find((item) => item.id === id);
