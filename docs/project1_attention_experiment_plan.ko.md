# Project 1 Attention 실증 실험 계획

## 목적

Project 1의 Problem 2는 "엔티티 간 관계 정보 손실"을 해결하기 위해 Cross-Attention 이전에 Intra-Set Self-Attention을 추가한 구조적 개선이다. 이 문서의 목적은 포트폴리오에 들어갈 정량적/정성적 근거를 점진적으로 확보하는 것이다.

핵심 질문은 다음과 같다.

1. Attention이 엔티티 간 관계를 실제로 인식하는가?
2. 관계 인식이 행동 결정 직전의 정보 선택에 반영되는가?
3. 그 결과 중복 배치 감소, objective coverage 증가, 승률/보상 안정화 같은 실제 행동 개선으로 이어졌는가?

실험은 두 단계로 진행한다.

| 단계 | 목적 | 실행 환경 | 산출물 |
|---|---|---|---|
| 1단계 | Attention 구조가 관계 정보를 읽는지 검증 | Python synthetic probe | Attention weight, action proxy, 정량 표, 1단계 결과 문서 |
| 2단계 | 실제 게임 환경에서 행동 지표 개선 확인 | Unreal 프로젝트 짧은 evaluation | 중복 배치율, objective coverage, 짧은 승률/보상 로그, 2단계 결과 문서 |

Unreal 프로젝트 경로:

```text
C:\Users\PC\Documents\GitHub\DE\DE.uproject
```

## 실험 원칙

Attention의 기여를 과장하지 않는다. 현재 프로젝트는 이미 역할별 정책 네트워크와 역할별 보상 함수를 사용하므로, "Attention이 역할을 만들었다"라고 주장하지 않는다.

정확한 주장 범위는 다음과 같다.

> 역할 자체는 역할별 정책과 보상 설계로 학습되었다. Attention의 기여는 각 역할 정책이 행동을 결정하기 전에 아군, 적, 거점 간 공간 관계를 읽을 수 있도록 관측 인코딩 구조를 개선한 것이다.

따라서 1단계는 "관계 인식의 구조적 증거"를 만들고, 2단계는 "그 관계 인식이 실제 행동 지표에 미친 영향"을 확인한다.

## 결과 문서 운영 규칙

계획 문서와 별도로 단계별 실험 결과 문서를 반드시 작성한다. 결과 문서는 실험이 끝난 뒤 한 번에 작성하지 않고, 각 스텝을 수행할 때마다 즉시 업데이트한다. 이렇게 해야 나중에 포트폴리오에 들어갈 수치와 해석의 출처를 추적할 수 있고, 실패한 실험도 왜 제외했는지 설명할 수 있다.

권장 결과 문서 경로:

```text
experiments/
  project1_attention_probe/
    results_step1_attention_probe.ko.md
  project1_unreal_evaluation/
    results_step2_unreal_evaluation.ko.md
```

각 결과 문서는 최소 다음 항목을 포함한다.

| 항목 | 내용 |
|---|---|
| 실행 일시 | 실험을 실행한 날짜와 시간 |
| 실행 환경 | Python/torch 버전, Unreal 실행 여부, checkpoint 경로 |
| 실험 목적 | 해당 step에서 확인하려는 질문 |
| 입력 조건 | scenario, seed, episode 수, map, opponent tier |
| 실행 명령 | 재현 가능한 command 또는 실행 절차 |
| 원본 산출물 | CSV/JSON/log/figure 경로 |
| 주요 수치 | duplicate rate, coverage, DeltaMax 등 |
| 관찰 | 수치에서 보이는 패턴 |
| 해석 | Problem 2와 attention 설계에 대한 의미 |
| 한계 | baseline 부재, episode 수 부족, seed 수 부족 등 |
| 다음 액션 | 다음 step에서 보완할 작업 |

각 스텝이 끝날 때마다 다음 작업을 수행한다.

1. 결과 문서에 실행 조건과 raw output 경로를 추가한다.
2. 주요 수치를 표로 정리한다.
3. 수치가 포트폴리오 주장에 사용 가능한지, 또는 보류해야 하는지 표시한다.
4. 실패/이상 결과도 삭제하지 않고 `Excluded/Invalid` 사유와 함께 기록한다.
5. 다음 스텝에서 확인할 질문을 갱신한다.

## 1단계: Python Synthetic Attention Probe

### 목표

Unreal을 실행하지 않고 통제된 입력을 만들어 Self-Attention -> Cross-Attention 파이프라인이 의도대로 작동하는지 검증한다.

이 단계의 핵심은 실제 승률을 주장하는 것이 아니라, 모델 내부에서 다음이 관찰되는지 확인하는 것이다.

- 패딩 슬롯이 attention에서 완전히 억제되는가
- Clustered/Spread 대형 변화에 따라 Self-Attention 분포가 달라지는가
- Self-Attention에서 생긴 초점 변화가 Cross-Attention으로 이어지는가
- Cross-Attention 결과가 7-dim EQS action 또는 objective preference proxy에 반영되는가

### 비교 대상

가능하면 다음 세 구조를 비교한다.

| 모델 | 설명 | 목적 |
|---|---|---|
| MLP baseline | entity vector를 flatten 후 MLP 처리 | attention 없는 기준선 |
| Cross-Attention only | Self Token이 raw entity token을 조회 | 개별 엔티티 선택 능력 확인 |
| Self + Cross Attention | entity set 내부 Self-Attention 후 Cross-Attention | 관계 인식 효과 확인 |

checkpoint가 Self + Cross Attention만 존재한다면, 우선 현재 checkpoint 기반 probe를 수행한다. 이후 ablation checkpoint가 준비되면 동일 스크립트로 확장한다.

### Synthetic Scenario

최소 네 가지 시나리오를 만든다.

| 시나리오 | 설명 | 검증 의도 |
|---|---|---|
| Ally Clustered | 아군 4명이 같은 거점 반경 내 밀집 | 중복 배치 상황 인식 |
| Ally Spread | 아군 4명이 맵 코너/거점 주변에 분산 | 분산 배치 인식 |
| Enemy Converged | 적 2명 이상이 같은 거점 방향으로 접근 | 위협 집결 패턴 인식 |
| Padding Stress | 유효 엔티티 수를 0~4로 바꾸고 나머지는 padding | mask 안정성 확인 |

각 시나리오는 동일한 self state, 동일한 거점 상태를 유지하고 entity position만 바꾼다. 이렇게 해야 attention 변화가 배치 변화 때문임을 설명할 수 있다.

### 측정 지표

| 지표 | 계산 방법 | 해석 |
|---|---|---|
| Padding suppression | padded slot attention 평균/최대값 | 0에 가까울수록 mask 정상 |
| Self-Attention DeltaMax | Clustered와 Spread의 slot weight 최대 차이 | 대형 변화 민감도 |
| Cross-Attention focus shift | Cross-Attention 최고 slot 변경 여부 | 행동 직전 참조 대상 변화 |
| Self-Cross consistency | Self-Attention 최고 slot과 Cross-Attention 최고 slot 일치율 | 파이프라인 정합성 |
| Objective preference shift | 거점별 action/EQS proxy 변화량 | 관계 인식이 행동 선호로 이어지는지 |
| Duplicate-risk proxy | 이미 아군이 몰린 objective에 대한 선호 감소 여부 | Problem 2 직접 대응 |

### 예상 산출 표

포트폴리오에는 다음 형태로 들어갈 수 있도록 결과를 만든다.

| 검증 항목 | 결과 예시 | 포트폴리오 해석 |
|---|---:|---|
| Padding suppression | padded slot max = 0.000 | invalid entity를 안정적으로 무시 |
| Vanguard Self-Attention DeltaMax | 0.29 | 전선 역할이 대형 변화에 민감 |
| Support Self-Attention DeltaMax | 0.06 | 회복 역할은 전체 아군을 균등 모니터링 |
| Self-Cross consistency | 90%+ | 관계 표현이 행동 직전 선택까지 전달 |
| Duplicate-risk proxy 감소 | Self+Cross > Cross-only | 중복 배치 문제와 직접 연결 |

### 구현 계획

1. 현재 policy/model 정의와 checkpoint 로딩 경로를 확인한다.
2. 관측 벡터의 layout을 문서화한다.
3. synthetic observation builder를 작성한다.
4. 모델 forward hook 또는 explicit return으로 attention weights를 추출한다.
5. scenario별 attention/action 결과를 CSV/JSON으로 저장한다.
6. matplotlib/seaborn으로 heatmap과 bar chart를 생성한다.
7. 각 실행 스텝 직후 결과 문서를 업데이트한다.

권장 파일 구조:

```text
experiments/
  project1_attention_probe/
    build_synthetic_obs.py
    run_attention_probe.py
    metrics.py
    plot_attention_probe.py
    outputs/
      attention_probe_results.csv
      attention_probe_summary.md
      results_step1_attention_probe.ko.md
      figures/
```

### 1단계 완료 기준

1단계는 다음 조건을 만족하면 완료로 본다.

- 최소 4개 synthetic scenario 실행
- 역할별 Self-Attention, Cross-Attention weight 추출
- padding slot attention이 0 또는 매우 작은 값임을 확인
- Clustered/Spread 변화에 따른 DeltaMax 산출
- Self-Cross consistency 산출
- 포트폴리오에 넣을 표 1개와 figure 2~3개 생성
- 1단계 결과 문서에 실행 조건, raw artifact 경로, 주요 수치, 해석, 한계를 기록

## 2단계: Unreal Short Evaluation

### 목표

실제 Unreal 환경에서 attention 구조가 행동 지표에 미친 영향을 짧게 확인한다.

이 단계는 긴 재학습보다 짧은 evaluation 중심으로 진행한다. 가장 중요한 지표는 승률보다 Problem 2와 직접 연결되는 중복 배치율과 objective coverage다.

### 실행 대상

Unreal 프로젝트:

```text
C:\Users\PC\Documents\GitHub\DE\DE.uproject
```

평가 대상은 가능하면 다음 순서로 준비한다.

| 우선순위 | 모델 | 이유 |
|---|---|---|
| 1 | Self + Cross Attention 현재 best checkpoint | 현재 포트폴리오의 주 모델 |
| 2 | Cross-Attention only checkpoint | Self-Attention 기여도 비교 |
| 3 | MLP/flatten baseline checkpoint | attention 전체 기여도 비교 |

baseline checkpoint가 없다면 2단계 첫 실행은 현재 모델의 행동 지표 측정으로 시작한다. 이후 baseline을 추가해 표를 확장한다.

### 측정 지표

| 지표 | 정의 | Problem 2와의 연결 |
|---|---|---|
| Duplicate objective selection rate | 같은 팀 에이전트 2명 이상이 같은 objective를 선택한 step 비율 | 중복 배치 직접 측정 |
| Objective coverage | 한 step에서 팀이 커버하는 unique objective 수 | 분산 배치/역할 분담 측정 |
| Over-cluster duration | 같은 objective 반경 내 아군이 과도하게 몰린 지속 시간 | 밀집 상태 해소 여부 |
| Role-position consistency | 역할별 기대 위치 조건을 만족한 step 비율 | 역할별 공간 추론 검증 |
| Win rate | scripted AI 상대 episode win ratio | 최종 성능 참고 지표 |
| Mean episode reward | episode reward 평균/분산 | 학습 안정성 참고 지표 |

우선순위는 다음과 같다.

1. Duplicate objective selection rate
2. Objective coverage
3. Role-position consistency
4. Win rate
5. Mean episode reward

승률은 강한 지표지만 짧은 evaluation에서는 분산이 클 수 있다. 반면 중복 배치율과 coverage는 Problem 2의 원인/해결과 직접 연결되므로 짧은 실험에서도 설명력이 높다.

### 권장 Evaluation 설정

| 항목 | 권장값 | 이유 |
|---|---:|---|
| episode 수 | 20~50 | 짧은 실험과 통계 안정성 균형 |
| random seed | 3개 이상 | 단일 seed 편향 완화 |
| opponent | Scripted AI 고정 tier | 비교 조건 고정 |
| map/objective 상태 | 동일 map, 동일 objective layout | attention 비교 외 변수 최소화 |
| logging interval | step 단위 | 중복 배치율/coverage 계산 필요 |

### Unreal 로그 수집 계획

step마다 최소 다음 정보를 기록한다.

```text
episode_id
step
team_id
agent_id
role
position
selected_objective_id
objective_distances
objective_owner_states
eqs_action_7d
alive
reward
done
```

가능하면 attention weight도 함께 저장한다.

```text
ally_self_attention
ally_cross_attention
enemy_cross_attention
base_cross_attention
```

attention weight 저장이 어렵다면 2단계에서는 행동 지표만 저장하고, attention 해석은 1단계 Python probe 결과로 연결한다.

### 분석 방법

Duplicate objective selection rate:

```text
duplicate_rate = duplicate_steps / valid_team_steps
```

한 step에서 살아 있는 팀 에이전트의 `selected_objective_id`를 모아, 동일 objective를 선택한 에이전트가 2명 이상이면 duplicate step으로 계산한다.

Objective coverage:

```text
coverage = unique(selected_objective_id) / min(num_alive_agents, num_objectives)
```

Role-position consistency 예시:

| 역할 | 조건 예시 |
|---|---|
| Strike | enemy와 너무 가깝지 않고 non-friendly objective에 접근 |
| Vanguard | contested/neutral objective 근처 유지, enemy와 전선 거리 유지 |
| Support | ally와 일정 거리 이내, 후방/중간 거리 유지 |

역할 조건은 포트폴리오의 기존 역할 보상 설명과 일치해야 한다.

### 예상 산출 표

비교 checkpoint가 있을 경우:

| 모델 | Duplicate rate ↓ | Objective coverage ↑ | Role consistency ↑ | Win rate ↑ |
|---|---:|---:|---:|---:|
| Cross-Attention only | TBD | TBD | TBD | TBD |
| Self + Cross Attention | TBD | TBD | TBD | TBD |

현재 모델만 있을 경우:

| 지표 | 값 | 해석 |
|---|---:|---|
| Duplicate rate | TBD | 같은 거점 중복 선택 빈도 |
| Objective coverage | TBD | 팀의 평균 거점 커버 범위 |
| Role consistency | TBD | 역할별 위치 전략 유지율 |
| Win rate | TBD | scripted AI 상대 참고 성능 |

### 2단계 완료 기준

2단계는 다음 조건을 만족하면 완료로 본다.

- Unreal 프로젝트에서 20 episode 이상 evaluation 실행
- step-level behavior log 확보
- duplicate rate와 objective coverage 계산
- 가능하면 역할별 consistency 계산
- 포트폴리오에 넣을 행동 지표 표 1개 생성
- 1단계 attention probe 결과와 2단계 행동 지표를 한 문단으로 연결
- 2단계 결과 문서에 실행 조건, raw artifact 경로, 주요 수치, 해석, 한계를 기록

## 포트폴리오 반영 문장 초안

실험 완료 후 다음 방향으로 문장을 정리한다.

> Self-Attention은 아군, 적, 거점 토큰이 같은 집합 내 다른 토큰을 먼저 참조하도록 만들어, 개별 엔티티 좌표뿐 아니라 밀집, 분산, 중복 배치 같은 공간 관계를 표현하게 했다. Synthetic probe에서 Clustered/Spread 대형 변화에 따라 역할별 attention sensitivity가 다르게 나타났고, Self-Attention의 초점 변화가 Cross-Attention의 행동 직전 정보 선택으로 이어짐을 확인했다. 이후 Unreal evaluation에서는 중복 objective 선택률과 objective coverage를 측정하여, 관계 인식이 실제 팀 배치 지표에 미친 영향을 검증했다.

주의할 표현:

```text
나쁜 표현: Attention만으로 역할이 자발적으로 분화되었다.
좋은 표현: 역할별 정책이 주변 공간 관계를 다르게 해석하도록 attention 기반 관측 인코딩을 설계했다.
```

## 실행 순서 요약

1. Python synthetic observation builder 작성
2. 현재 checkpoint에서 attention weight 추출
3. Clustered/Spread/Padding scenario 결과 산출
4. attention probe 표와 figure 생성
5. Unreal evaluation 로그 필드 확인
6. 20~50 episode 짧은 evaluation 실행
7. duplicate rate/objective coverage 계산
8. 포트폴리오 Problem 2와 Attention 실증 섹션에 결과에 반영할 문서 작성

각 번호를 수행한 직후 관련 결과 문서를 업데이트한다. 특히 2, 3, 6, 7번은 raw output과 해석이 쉽게 분리되므로, 실행 직후 기록하지 않으면 나중에 수치의 출처가 흐려질 수 있다.

## 리스크와 대응

| 리스크 | 대응 |
|---|---|
| baseline checkpoint가 없음 | 현재 모델 probe를 먼저 완료하고, ablation은 후속 실험으로 명시 |
| Unreal 실행/빌드 비용이 큼 | 1단계 Python 결과를 먼저 포트폴리오에 반영하고, 2단계는 행동 지표 1~2개만 짧게 측정 |
| 승률 분산이 큼 | 승률보다 duplicate rate와 objective coverage를 주 지표로 사용 |
| attention weight와 action 간 연결이 약함 | Self-Cross consistency와 objective preference shift를 함께 제시 |
| "역할 분화" 표현이 과장될 수 있음 | "역할별 공간 관계 해석의 차이"로 표현 수정 |
