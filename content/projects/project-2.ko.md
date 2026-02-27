---
title: "GOBT: Goal-Oriented Behavior Tree"
description: "Behavior Tree의 직관성과 GOAP, Utility Theory의 동적 유연성을 결합한 복합적 의사결정 프레임워크"
weight: 2
translationKey: "project-gobt"
---


{{< project-links 
    github="https://github.com/Hongyoosung/GOBT" 
    paper="https://doi.org/10.33851/JMIS.2023.10.4.321" 
>}}

---

## 개요

본 프로젝트는 Unity 엔진을 활용해 BT의 직관성과 GOAP의 유연성을 결합한 계층적 AI 프레임워크를 목표로 합니다. 기존 BT 내에 GOAP와 Utility Theory에서 영감을 얻은 커스텀 알고리즘 노드를 통합하여 NPC AI의 정적 구조 한계를 해결했습니다. 상위 흐름은 BT로 제어하고 복잡한 상황 판단은 커스텀 노드에 위임하는 계층적 설계를 통해, 시스템 연산 효율성과 개발 편의성을 동시에 확보한 AI 시스템을 구현했습니다.

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

### 1. Planner Node를 활용한 데이터 주도적 상태 전환

* **사전/사후 조건 기반 행동 탐색**: 에이전트의 현재 상태 변수와 최종 목표를 분석하여 동적으로 상태를 전환합니다. 각 행동에 **사전조건(Pre-conditions)** 과  **사후효과(After-effects)** 만을 명시하면, 시스템이 이를 기반으로 목표 달성을 위한 최적의 그래프를 자동 구축하는 데이터 주도(Data-driven) 구조를 채택했습니다.

* **Utility 기반 순방향 실시간 액션 체이닝**: 역방향 계획 수립(Backward Planning) 방식을 사용하는 기존 GOAP의 실시간 대응 한계를 극복하기 위해, 현재 상태에서 목표를 향해 나아가는 순방향 최적화 방식을 적용했습니다. 환경 변화에 따라 가중치를 실시간으로 재계산하여 유연한 목표 수정 및 액션 수행이 가능합니다.


{{< img-grid 
    src1="/images/project2/statenode.png" cap1="그림 2. State Node 구조"
    class1="w-3/4" 
    
    src2="/images/project2/stategraph.png" cap2="그림 3. State Space Graph"
    
    
    class="max-w-full" 
>}}


### 2. Utility-Based 실시간 의사결정 최적화

* **다변수 상태 정규화 및 추상화**: 체력(HP), 레벨, 타겟과의 거리 등 서로 다른 단위를 가진 전장 데이터를 **0.0~1.0 사이의 값으로 정규화(Normalization)**하여 판단의 일관성을 확보했습니다. 이를 통해 비선형적인 환경 변화를 계산 가능한 수치로 변환하고, 각 상태가 의사결정에 미치는 영향력을 객관화했습니다.

* **최적 행동 선택 메커니즘**: 단순히 고정된 우선순위를 따르는 대신, 각 행동 노드에 연결된 유틸리티 함수들을 실시간으로 평가합니다.
아래 수식과 같이 가중치($w$)가 적용된 유틸리티 산출식을 통해, 에이전트가 현재 상황에서 가장 기회비용이 낮고 기대 가치가 높은 최적의 행동을 자율적으로 선택하도록 구현했습니다.
* **상황 인지형 반응성**: 고정된 FSM(상태 기계)의 한계를 넘어, 미세한 환경 변화에도 유틸리티 곡선이 반응하게 함으로써 에이전트가 마치 상황을 '이해'하고 판단하는 듯한 유기적인 움직임을 보여줍니다.

$$U_{final} = \max(w_1 \cdot U_1, w_2 \cdot U_2, \dots, w_n \cdot U_n)$$


{{< img src="/images/project2/graph.png" 
        alt="유틸리티 그래프" 
        class="max-w-3xl" 
        caption="그림 4. 정규화와 미세 환경 변화 반응 그래프" >}}

<br>



### 3. 모듈화된 데이터 주도 설계 및 Authoring Tool
* **상태 공간 확장과 평가 로직의 분리**: 플래너가 런타임에 탐색하는 동적 상태 노드(State Node)는 방대하지만, 에이전트가 수행 가능한 본질적인 행동(Action 템플릿)의 수는 제한적입니다. 이를 활용해, 무한히 확장되는 상태 공간마다 평가 로직을 개별 작성하는 대신 유한한 행동(Action) 템플릿에 평가 모듈을 연결하는 구조를 채택했습니다.

* **ScriptableObject 기반 모듈 조합(Composition)**: '체력 평가 곡선', '거리 평가 곡선' 등 자주 쓰이는 유틸리티 함수(AgentConsideration)를 ScriptableObject 에셋으로 독립시켰습니다. 기획자는 시각적 에디터(Inspector)에서 각 행동 노드에 필요한 평가 에셋들을 레고 블록처럼 끼워 넣기만 하면 됩니다.

* **작업 비용 최소화**: 이 구조를 통해 아무리 복잡한 상태 그래프가 동적으로 생성되더라도, 시스템은 런타임에 현재 상태 변수를 각 행동 노드에 조립된 평가 에셋에 대입하여 유틸리티를 자동 산출합니다. 결과적으로 상태의 종류를 억지로 제한하지 않으면서도 개발 및 유지보수 비용(Authoring Cost)을 획기적으로 낮췄습니다.


{{< img-grid-3
    src1="/images/project2/unity1.png" cap1="그림 5. Behavior Designer 내에 배치된 커스텀 플래너 노드" class1="w-full"
    src2="/images/project2/unity2.png" cap2="그림 6. 사전조건/사후효과가 정의된 액션 클래스의 인스펙터 창" class2="w-3/4"
    src3="/images/project2/unity3.png" cap3="그림 7. 커스텀 플래너 노드에서 목표 상태와 평가 상태변수를 설정하는 인스펙터 창" class3="w-1/2"
    class="max-w-full" 
>}}

---

## 주요 문제 해결 과정

### 1. 코루틴(Coroutine)을 활용한 비동기 그래프 구축

* **Problem**: 다중 에이전트 환경에서 게임 시작 시 모든 에이전트가 동시에 GPlanner를 통해 상태공간 그래프를 구축하며 심각한 프레임 드랍(Spike) 현상이 발생했습니다.
* **Solution**: 단일 프레임 내에서 모든 노드 연산을 처리하던 동기 방식을 코루틴 기반의 시분할 처리(Time-slicing) 방식으로 전환했습니다. 한 프레임당 허용된 연산 시간을 초과할 경우 yield return을 통해 다음 프레임으로 작업을 분산했습니다.
* **Result**: 에이전트 생성 및 초기화 시 발생하는 프레임 저하를 80% 이상 개선하여 다수 에이전트가 존재하는 환경에서도 안정적인 프레임 유지를 달성했습니다.

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