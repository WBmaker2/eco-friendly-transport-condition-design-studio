import type { Metadata } from "next";
import TransportApp from "./TransportApp";

export const metadata: Metadata = {
  title: "친환경 수송 조건 설계소",
  description: "짐·거리·길 조건을 보고 시험용 수레를 만드는 초등학생 학습 활동",
};

export default function Home() {
  return <TransportApp />;
}
