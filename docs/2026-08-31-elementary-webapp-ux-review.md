# 초등 3~4학년용 교육 웹앱 점검·개선 보고서

- 점검일: 2026-08-31
- 대상: 친환경 수송 조건 설계소
- 점검 모드: elementary-webapp-ux-orchestrator full
- 주 사용자: 초등 3~4학년 학생, 교사의 짧은 안내 후 혼자 진행
- VoiceOver: 요청 범위와 운영 기준에 따라 제외
- 커밋·푸시·배포: 이번 요청 범위가 아니므로 실행하지 않음

## 1. Stage 0 및 UI/UX 경로

Stage 0 결과는 `ready`입니다. Node, npm, 브라우저, 프로젝트 의존성이 모두 준비되어 있었습니다.

```text
route=design-system
observed-statuses=ui-ux-pro-max:filesystem-only, design-system:runtime-available, impeccable:runtime-available, product-design:audit:runtime-available, design-review:runtime-available, qa:runtime-available
action=continue
fallback-reason=앞선 ui-ux-pro-max는 현재 턴에 호출 가능한 런타임이 아니어서 첫 runtime-available 후보인 design-system을 선택했습니다.
```

자세한 부트스트랩 결과는 [Stage 0 보고서](../work/elementary-webapp-ux-bootstrap.md), 실행 전 계획은 [개선 계획](../work/elementary-webapp-ux-plan-2026-08-31.md)에 남겼습니다.

## 2. 기준선에서 찾은 문제

| ID | 심각도 | 관찰 | 학생 영향 | 상태 |
| --- | --- | --- | --- | --- |
| UX-01 | P1 | 320×800에서 조건·수레 만들기·결과 비교로 넘어가도 이전 세로 스크롤 위치가 남아 제목과 현재 단계를 놓칠 수 있음 | 새 단계에서 무엇을 해야 하는지 다시 찾아야 함 | fixed |
| UX-02 | P2 | 할 일 카드의 정사각형 그림이 16:9 상자에 들어가 그림이 작고 양옆 빈 띠가 큼 | 짐·길을 살펴보는 시각 단서가 약함 | fixed |
| UX-03 | P2 관찰 | 모바일 수레 만들기 화면은 선택지와 미리보기가 길게 이어짐 | 화면 위치에 따라 다음 행동을 찾는 시간이 늘어남 | UX-01로 완화, 구조는 유지 |
| UX-04 | P3 관찰 | 자동 문구 수집 2,923개 중 대부분은 코드·빌드 산출물·반복 문자열 | 실제 학생 문구의 난이도 문제로 바로 볼 수 없음 | 핵심 학생 문구는 유지 |

기준선은 공개 페이지에서 `바로 시작하기 → 할 일 → 조건 5개 → 부품 4개 → 첫 시험 → 다시 만들기 → 결과 비교`를 완주하며 확인했습니다. 학습 규칙(필수 선택 전 다음 버튼 비활성화, 한 부품만 변경)은 기준선에서도 정상 작동했습니다.

## 3. 구현한 개선

### 단계 전환 위치와 포커스

- `app/transport/scroll.ts`에 브라우저가 없는 환경에서도 안전한 `resetPageScroll()`을 분리했습니다.
- `app/TransportApp.tsx`에서 `phase`가 바뀔 때 `window.scrollTo({ top: 0, left: 0, behavior: "auto" })`를 실행합니다.
- 첫 시험·두 번째 시험의 결과 제목 포커스는 유지하되 `preventScroll: true`로 다시 스크롤되지 않게 했습니다.
- 그 밖의 단계도 새 `h1`을 보이는 포커스 대상으로 삼아 제목과 다음 행동을 바로 읽을 수 있게 했습니다.

### 할 일 그림 프레임

- `app/globals.css`의 `.mission-card img`를 16:9에서 4:3으로 바꿨습니다.
- `object-fit: contain`과 중앙 정렬은 유지하여 이미지를 자르지 않습니다.
- `max-width: none`, `flex-shrink: 0`을 함께 적용해 카드 안에서 실제 그림 영역이 프레임 전체를 사용하도록 했습니다.

### 변경 내역

- `app/transport/Dialogs.tsx`에 `2026-08-31 · v0.4.3` 기록을 추가했습니다.
- `tests/navigation.test.ts`에 스크롤 리셋의 SSR 안전성·소스 계약 검사를 추가했습니다.
- `tests/content-validator.test.ts`에 미션 카드의 4:3·contain·비축소 규칙 검사를 추가했습니다.

## 4. 문장 난이도 감사

[학생 문구 감사](../work/elementary-webapp-ux-language-audit-2026-08-31.md)와 [자동 수집 후보](../work/elementary-webapp-ux-language-candidates.md)를 바탕으로 실제 렌더링 화면의 제목·지시문·버튼·선택지·힌트·결과·안전 문구를 수동 검토했습니다.

- 핵심 학생 문장은 짧고 3~4학년 수준에 맞아 이번에는 문구를 바꾸지 않았습니다.
- `짐받이`, `바퀴`, `움직이는 힘`, `방향·멈춤`은 화면 전체에서 같은 이름을 사용합니다.
- `절충`처럼 어려울 수 있는 말은 교사용 안내에만 남아 학생 흐름에 노출되지 않습니다.
- 실제 어린이 1:1 인터뷰와 자기 말 재진술 probe는 이번 실행에서 하지 않았습니다(`not run`). 따라서 아래 수용 판정은 브라우저 기반 학생 관점 검증에 한정합니다.

## 5. 시뮬레이션·이미지 결정

시뮬레이션 결정은 `not-needed`입니다. 이 앱은 시간에 따라 변하는 주행 물리를 재현하지 않고, 조건을 읽고 부품을 골라 결정적 평가 결과를 비교하는 설명형 상호작용입니다. 기존 81개 조합 평가와 실제 안전을 보장하지 않는다는 안내는 유지했습니다.

이번 문제는 새 그림의 내용이 아니라 CSS 프레임 비율이었습니다. 따라서 새 이미지 생성이나 기존 7개 생성 학습 자산 교체는 하지 않았고, 모든 학습 이미지는 `contain`으로 전체가 보이도록 유지했습니다. 이미지가 수치·정답·안전 판단을 대신하지도 않습니다.

## 6. 브라우저 검증

검증 서버는 최신 `dist-pages`를 복사한 로컬 정적 서버이며, 공개 배포 결과를 의미하지 않습니다.

| 화면/검사 | 결과 |
| --- | --- |
| 320×800 시작 | `scrollY=0`, 제목 포커스 활성, `scrollWidth=305 ≤ 320` |
| 320×800 미션 | 카드 281×284, 그림 279×209(4:3), `object-fit: contain`, 제목 표시 |
| 375×812 미션 | 카드 336px, 그림 334×251, `scrollWidth=360 ≤ 375` |
| 1280×900 미션 | 카드 214px, 그림 212×159, 5개 카드 모두 프레임을 채움, 가로 넘침 없음 |
| 단계 전환 | 미션·브리프·조건·수레 만들기·첫 시험·다시 만들기·두 번째 시험·결과 비교 진입 때 `scrollY=0` |
| 같은 시나리오 회귀 | 조건 5개 → 부품 4개 → 첫 시험 → 목표 선택 → 부품 교체 → 두 번째 시험 → 결과 비교 완주 |
| 마지막 결과 비교 | `scrollY=0`, `h1` “좋아진 점과 새 어려움을 비교해요”가 보이고 활성 포커스 |
| 키보드 | 320px에서 Tab으로 CTA에 도달하고 Enter로 미션 단계 진입, 전환 후 새 제목에 포커스 |
| 콘솔 | 현재 로컬 빌드에서 오류 0개 |
| 정적 자산 | HTML·JS·CSS·학습 이미지 요청 모두 200 |
| 업데이트 내역 | v0.4.3 날짜와 변경 설명이 모달에 표시되고 닫기 버튼 포커스 확인 |

기준선 비교용 자료는 [공개 미션 스냅샷](../.playwright-mcp/page-2026-08-31T12-10-12-064Z.yml), [기준선 결과 비교 스냅샷](../.playwright-mcp/page-2026-08-31T12-09-50-150Z.yml), [개선 후 미션 캡처](../ux-after-missions-1280-fullbleed.png)로 남겼습니다.

## 7. 자동 검사

```text
npm run test        ✅ 5 files / 24 tests passed
npm run typecheck   ✅ passed
npm run lint        ✅ errors 0, existing <img> warnings 3
npm run build       ✅ completed
npm run build:pages ✅ completed
git diff --check    ✅ passed
```

## 8. 수용 판정 및 후속

보조 점수는 기준선 82/100에서 개선 후 92/100으로 올랐습니다. P0는 없고 UX-01 P1은 해결되었습니다. 다만 실제 초등학생의 자기 말 재진술·교사 동반 수업 관찰은 실행하지 않았으므로 오케스트레이터 판정은 `conditional`로 기록합니다. 이는 구현 실패가 아니라 사람 대상 comprehension probe가 남아 있다는 뜻입니다.

- 학습 takeaway: 결과 비교 화면에서 좋아진 조건, 그대로인 조건, 새로 생각할 점을 함께 읽습니다.
- 다음 권장 행동: 실제 초등 3~4학년 1명 이상에게 10분 사용성 probe를 진행하고, “지금 무엇을 골라야 하나요?”, “부품 하나를 바꾸면 무엇이 달라지나요?”를 자기 말로 설명하는지 확인합니다.
- 공개 배포·CI·HVC 등록은 이번 요청에 포함하지 않았으므로 별도 release gate로 남겨 둡니다.
