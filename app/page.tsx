import type { Metadata } from "next";
import TransportApp from "./TransportApp";

export const metadata: Metadata = {
  title: "친환경 수송 조건 설계소",
  description: "거리·짐·길·에너지 조건에 맞는 교육용 수송 시제품 설계 활동",
};

export default function Home() {
  return <TransportApp />;
}
