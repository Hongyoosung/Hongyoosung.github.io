---
title: "GOBT: Goal-Oriented Behavior Tree"
description: "Behavior Tree의 구조적 직관성과 GOAP·Utility Theory의 동적 유연성을 결합한 하이브리드 AI 프레임워크"
weight: 2
translationKey: "project-gobt"

duration: "2023.05 ~ 2024.02"
team_size: "2명"
role: "메인 프로그래머, 논문 작성"
github: "https://github.com/Hongyoosung/GOBT"
paper: "https://doi.org/10.33851/JMIS.2023.10.4.321"
math: true
---

---

## 개요

본 프로젝트는 Unity 엔진 기반의 **계층적 AI 의사결정 시스템**입니다. 기존 Behavior Tree(BT)의 정적인 한계를 극복하기 위해, 상위 전략은 BT로 제어하고 하위의 구체적 실행 계획은 **GOAP(Goal-Oriented Action Planning)** 와 **Utility Theory**를 결합한 커스텀 플래너에 위임하는 하이브리드 설계를 채택했습니다. 이를 통해 복잡한 NPC AI의 연산 효율성을 확보함과 동시에, 기획자가 직관적으로 AI의 성향을 조절할 수 있는 확장 가능한 구조를 구현했습니다.

{{< img src="/images/project2/main.png" 
        alt="메인 아키텍처" 
        class="max-w-2xl" 
        caption="그림 1. 3계층 프레임워크 구조" >}}

---

## 기술 스택

* **Game Engine**: Unity 3D 
* **AI Architecture**: Behavior Tree, GOAP (Goal-Oriented Action Planning), Utility System
* **Tools/Assets**: Behavior Designer 
* **Language**: C#

---

## 주요 기능

### 1. 하이브리드 플래너: 데이터 주도형 상태 전환
* **자율적 액션 체이닝**: 에이전트의 현재 상태와 최종 목표 사이의 간극을 분석하여 최적의 행동 시퀀스를 자동 생성합니다. 각 행동에 **사전조건(Pre-conditions)** 과 **사후효과(After-effects)** 를 정의함으로써, 복잡한 if-else 분기 없이도 데이터에 기반한 동적 상태 전환이 가능합니다.

* **Forward Planning 최적화**: 기존 GOAP의 역방향 탐색(Backward Planning)이 가진 실시간성 한계를 극복하기 위해, 현재 상태에서 가용 가능한 액션을 즉시 평가하는 **순방향 최적화 방식**을 적용하여 환경 변화에 대한 반응 속도를 극대화했습니다.


{{< img-grid 
    src1="/images/project2/statenode.png" cap1="그림 2. 행동 선택 과정. 에이전트는 선택된 행동의 After-effect를 Current State로 갖는다."
    class1="w-3/4" 
    
    src2="/images/project2/stategraph.png" cap2="그림 3. State Space Graph"
    
    
    class="max-w-full" 
>}}


### 2. Utility-Based 실시간 판단 엔진
* **다변수 데이터 정규화**: 체력, 거리, 레벨 등 서로 다른 단위의 환경 변수를 **0.0~1.0 범위로 정규화**하여 판단의 객관성을 확보했습니다. 이를 통해 비선형적인 전장 상황을 수치화된 가치로 변환합니다.

* **최적 기대 가치 산출**: 단순히 고정된 우선순위를 따르지 않고, 가중치($w$)가 적용된 유틸리티 함수를 실시간 평가하여 기회비용이 가장 낮고 기대 가치가 높은 행동을 선택합니다.

$$U_{final} = \max(w_1 \cdot U_1, w_2 \cdot U_2, \dots, w_n \cdot U_n)$$


{{< img src="/images/project2/graph.png" 
        alt="유틸리티 그래프" 
        class="max-w-3xl" 
        caption="그림 4. 정규화와 미세 환경 변화 반응 그래프" >}}

<br>

### 3. 모듈화된 Authoring Tool 및 확장성
* **Decoupled Architecture**: 런타임 탐색 로직(Planner)과 개별 행동 로직(Action)을 완전히 분리했습니다. 새로운 행동 추가 시 기존 코드를 수정할 필요 없이 독립적인 액션 노드만 추가하면 되는 **Open-Closed Principle**을 준수합니다.

* **ScriptableObject 기반 모듈 조합**: '체력 검사', '거리 산출' 등의 평가 로직을 에셋화하여 기획자가 인스펙터 상에서 레고 블록처럼 조합할 수 있는 워크플로우를 구축, **AI 저작 비용(Authoring Cost)을 획기적으로 절감**했습니다.



{{< img-grid-3
    src1="/images/project2/unity1.png" cap1="그림 5. Behavior Designer 내에 배치된 커스텀 플래너 노드" class1="w-full"
    src2="/images/project2/unity2.png" cap2="그림 6. 사전조건/사후효과가 정의된 액션 클래스의 인스펙터 창" class2="w-3/4"
    src3="/images/project2/unity3.png" cap3="그림 7. 커스텀 플래너 노드에서 목표 상태와 평가 상태변수를 설정하는 인스펙터 창" class3="w-1/2"
    class="max-w-full" 
>}}

---

## 주요 기술적 난제 및 해결 전략

### 1. 다중 에이전트 연산 병목 해결 (Time-slicing)
* **Issue**: 수십 명의 에이전트가 동시에 그래프를 구축할 때 발생하는 CPU Spike 현상 확인.
* **Solution**: 단일 프레임의 과도한 연산을 방지하기 위해 **코루틴 기반 시분할 처리(Time-slicing)** 기법을 도입. 프레임당 가용 연산 시간을 초과할 경우 작업을 다음 프레임으로 이월.
* **Result**: 초기화 시 발생하는 프레임 저하를 **80% 이상 개선**, 대규모 유닛 환경에서도 안정적인 프레임 유지.


{{< img-grid 
    src1="/images/project2/before.png" cap1="그림 8. 기본 방식(블로킹 발생)"
    src2="/images/project2/after.png" cap2="그림 9. 코루틴 시분할 방식"

    class="max-w-full" 
>}}



<br>

### 2. 그래프 내 갇힘 문제
* **Problem**: 동적 환경 변화로 인해 에이전트가 특정 액션들 사이에서 목표에 도달하지 못하고 무한히 반복(Oscillation)하거나, 동일한 상태를 순환하며 목표 달성에 실패하는 현상이 확인되었습니다.
* **Solution**: 탐색 알고리즘에 **방문 노드 리스트(Visited List)** 와 최대 탐색 깊이(Max Depth) 제한을 도입했습니다. 또한, 동일 행동 반복 시 가중치에 페널티를 부여하는 '스티키니스(Stickiness)' 개념을 적용하여 강제로 다른 대안 노드를 탐색하도록 유도했습니다.
* **Result**: 예외적인 환경 변화 상황에서도 에이전트가 교착 상태에 빠지지 않고 대안 루트를 탐색하거나 상위 목표로 복귀하는 등 의사결정의 안정성을 확보했습니다.

<br>

### 3. 유틸리티 계산 비용 최적화 (Weight Caching)
* **Problem**: 상태 전환 시마다 모든 하위 노드의 유틸리티 가중치를 실시간으로 전수 계산하는 방식은 에이전트 수에 비례하여 CPU 연산 부하를 가중시켰습니다.
* **Solution**: 유틸리티 값에 영향을 주는 핵심 변수(체력, 거리 등)가 일정 임계값 이상 변하지 않았을 경우, 이전 계산값을 재사용하는 캐싱 매커니즘을 도입했습니다. 또한, 업데이트 주기를 에이전트별로 엇갈리게 배치하는 틱(Tick) 시스템을 병행했습니다.
* **Result**: 유틸리티 계산 빈도를 효율적으로 조절함으로써, 연산 비용을 최적화하고 더 많은 수의 에이전트를 한 화면에 배치할 수 있는 성능적 여유를 확보했습니다.


<br>

---

## 결과

* [**Journal of Multimedia Information System (JMIS)** 2023년 10월호 4권 'GOBT: A Synergistic Approach to Game AI Using Goal-Oriented and Utility-Based Planning in Behavior Trees'](https://doi.org/10.33851/JMIS.2023.10.4.321) 제 1저자 투고 및 출판 완료.
* **역할**: 메인 프로그래머, 논문 작성


<br>