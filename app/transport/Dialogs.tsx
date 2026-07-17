"use client";
import { useEffect, useRef } from "react";

export function HelpDialog({ open, onClose, type }: { open: boolean; onClose: () => void; type: "updates" | "teacher" | "principles" }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", closeOnEscape); opener?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  const title = type === "updates" ? "업데이트 내역" : type === "teacher" ? "교사용 안내" : "설계 원칙 다시 보기";
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-top"><h2 id="dialog-title">{title}</h2><button ref={closeRef} className="icon-button" onClick={onClose} aria-label="안내 닫기">×</button></div>
      {type === "updates" ? <div className="update-list"><article><b>2026-07-18 · v0.3.0</b><p>초등 3~4학년이 쉽게 읽도록 말을 고치고, 부품을 네 단계로 하나씩 고르게 바꿨습니다. 결과의 까닭과 생각할 점도 더 또렷하게 보여 줍니다.</p></article><article><b>2026-07-17 · v0.2.0</b><p>모바일 화면과 글자 크기, 할 일 선택 화면을 다듬고 이전 단계 버튼을 추가했습니다.</p></article><article><b>2026-07-17 · v0.1.0</b><p>친환경 수송 조건 설계소의 첫 버전을 만들었습니다.</p></article></div> : null}
      {type === "teacher" ? <div><p>학생이 조건을 먼저 찾고, 네 구성 요소의 역할과 절충을 말하도록 도와주세요.</p><ul><li>앱의 결과는 실제 성능·안전을 보증하지 않는 교육용 비교입니다.</li><li>실물 활동은 학교 승인 저전압 교구와 교사 안전 지도 아래에서만 별도로 진행합니다.</li><li>배터리를 분해·가열·개조하거나 다른 충전기를 쓰지 않습니다.</li></ul></div> : null}
      {type === "principles" ? <div><p>모든 조건에 늘 가장 좋은 부품은 없어요.</p><p>전기로 움직일 때도 전기를 만드는 방법과 배터리 재료를 생각해요.</p><p>좋아진 점과 새로 생각할 점을 함께 살펴봐요.</p></div> : null}
    </section>
  </div>;
}
