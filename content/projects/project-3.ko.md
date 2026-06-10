---
title: "V: VR FPS Shooting Game"
description: "디자인 패턴과 컴포넌트 기반 설계를 통해 확장성과 유지보수성을 확보한 UE5 VR FPS"
weight: 3
translationKey: "project-v"
keywords: ["Unreal Engine 5", "VR FPS", "AI Architecture", "Combat System", "Design Patterns"]

duration: "2023.09 ~ 2024.05"
team_size: "3 people"
role: "AI 시스템 프로그래머"
github: "https://github.com/V-2024/ProjectOmega"
youtube: "https://www.youtube.com/watch?v=Dl0W6wjeUj0"
math: true
---


---

## 개요 (Overview)

본 프로젝트는 Unreal Engine 5를 기반으로 개발된 **VR FPS 슈팅 게임**입니다. 단순히 기능을 구현하는 것을 넘어, 객체 지향 설계 원칙을 준수하여 복잡한 전투 시스템의 결합도를 낮추는 데 집중했습니다. **Observer, Facade, Component 패턴**을 적극 활용하여 수십 명의 아군과 적군이 뒤섞이는 전장 환경에서도 안정적으로 동작하는 대미지 시스템과 AI 의사결정 구조를 구축했습니다.


{{< gif-grid urls="/gifs/project3/V1.gif, /gifs/project3/V2.gif" widths="57%, 43%" >}}

---

## 기술 스택 (Tech Stack)

| Category | Technologies |
|---|---|
| **Game Engine** | Unreal Engine 5 (UE5) |
| **AI Architecture** | Behavior Tree, AI Controller |
| **Design Patterns** | Observer, Facade, Component Pattern |
| **Platform** | Windows (VR Support) |
| **Language** | Blueprint |

---

## 주요 기능 (Key Features)

### 1. 패턴 기반의 유연한 엔티티 관리
* **Observer 패턴을 활용한 이벤트 드리븐 설계**: 각 개체의 체력 변화나 사망 상태를 하드 코딩된 참조 없이 처리합니다. 데미지 발생 시 이벤트를 브로드캐스팅하여 UI 업데이트, 애니메이션 전환, 사운드 재생 등이 독립적으로 반응하도록 설계했습니다.
* **Facade 패턴을 통한 인터페이스 통합**: 공격, 체력 확인, 팀 식별 등 복잡한 내부 로직을 단일 인터페이스로 캡슐화했습니다. 외부 시스템은 개체의 상세 구현을 몰라도 상위 레이어에서 간편하게 데이터에 접근할 수 있습니다.

{{< img-grid 
    src1="/images/project3/damage_archi.png" cap1="Fig 1. Unit 구조 UML"
    class1="w-3xl"

    src2="/images/project3/damage_flow.png" cap2="Fig 2. 데미지 인터페이스 흐름도"
    class1="w-2xl"

    class="max-w-full" 
    nocrop="true"
>}}



### 2. 모듈형 컴포넌트 기반 데미지 시스템
* **Plug-and-Play 구조**: 데미지 처리 로직을 독립적인 컴포넌트로 분리했습니다. 이를 통해 플레이어, NPC뿐만 아니라 파괴 가능한 구조물 등 어떤 오브젝트에도 해당 컴포넌트를 부착하는 것만으로 손쉽게 데미지 시스템을 이식할 수 있습니다.
* **Projectile 기반 충돌 판정**: 발사체(Projectile)의 충돌 이벤트를 바인딩하여 정확한 피격 지점을 계산하고, `TakeDamage` 함수를 호출하여 신뢰도 높은 물리 연산을 수행합니다.

### 3. 계층적 행동 트리(Behavior Tree) AI
* **전술적 의사결정**: 아군과 적군 AI의 판단 로직을 BT로 구현했습니다. 타겟 감지부터 사거리 기반의 상태 전환까지 계층적으로 관리합니다.
* **동적 거리 제어**: 적과의 거리가 `IdleRange`보다 멀 경우 공격하며 접근하고, 사거리 내에 들어오면 조준 및 고정 사격을 수행하는 유기적인 전술 행동을 보여줍니다.

{{< img src="/images/project3/bt.png" 
        alt="Behavior Tree Graph" 
        class="max-w-2xl" 
        caption="Fig 3. 아군/적군 공용 베이스 행동 트리 구조" >}}

---

## 기술적 난제 및 해결 전략 (Problem Solving)

### 1. 상속의 강한 결합도
* **Issue**: 초기에는 유닛 간의 공통 특성을 부모 클래스로 정의하고, 자식 클래스로 구체화된 유닛을 구현하는 형태. 
그러나 이는 부모 클래스에 강한 결합도가 형성되어 새로운 기능 추가에 병목이 발생.
* **Solution**: Facade 패턴을 도입하여 유닛의 핵심 기능을 추상화 및 Component 패턴을 통해 기능을 조립식으로 
구성, **상속 대신 Has-A 패턴으로 변경**.
* **Result**: 신규 유닛이나 특수 기능 추가 시 부모 클래스의 형태에 구애받지 않는 높은 확장성을 확보.

### 2. 높은 AI 연산 비용
* **Issue**: 스탠드얼론 환경에서 다수의 NPC가 동시에 AI 연산을 수행할 때 메모리가 부족해지는 성능 문제가 발생.
* **Solution**: 감지 로직의 업데이트 주기를 조절, 충분히 멀리 있는 유닛의 경우, 실제 AI 연산 대신 추상화된 휴리스틱으로 대체
* **Result**:  전투 환경에서의 프레임 드랍 현상 해결. 초당 60 프레임 유지 성공.

---

## 결과 (Results)

* **2023 G-STAR** 전시 참여 및 시연 완료.
* **2024 부산경남지역 게임전시회 Build 051** 전시 참여 및 시연 완료.

{{< img-grid 
    src1="/images/project3/picture1.jpg" 


    src2="/images/project3/picture2.jpg" 


>}}

<br>
