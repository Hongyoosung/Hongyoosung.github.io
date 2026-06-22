* * *

### Overview

This project is a **VR FPS shooting game** developed using Unreal Engine 5. Rather than simply implementing features, the focus was on adhering to Object-Oriented Programming (OOP) principles to reduce the coupling of complex combat systems. By actively utilizing **Observer, Facade, and Component patterns**, I established a stable damage system and AI decision-making structure capable of handling environments where dozens of allies and enemies coexist.

<div class="gif-grid-container" style="grid-template-columns:57% 43%;margin-top:0;padding-top:0"><div class="gif-item" style="line-height:0"><img src="/gifs/project3/V1.gif" alt="Project Demo" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project3/V2.gif" alt="Project Demo" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div></div>

* * *

### Tech Stack

| Category | Technologies |
| --- | --- |
| **Game Engine** | Unreal Engine 5 (UE5) |
| **AI Architecture** | Behavior Tree, AI Controller |
| **Design Patterns** | Observer, Facade, Component Pattern |
| **Platform** | Windows (VR Support) |
| **Language** | Blueprint |

* * *

### Key Features

#### 1\. Pattern-Based Flexible Entity Management

-   **Event-Driven Design via Observer Pattern**: Handled health changes and death states without hard-coded references. When damage occurs, events are broadcasted to allow UI updates, animations, and sound effects to react independently.
-   **Interface Integration via Facade Pattern**: Encapsulated complex internal logics such as attacking, health checks, and team identification into a single interface. This allows external systems to access data easily without knowing the detailed implementation of the entities.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project3/damage_archi.png" alt="image 1" class="max-w-full rounded-lg shadow-md mb-2 modal-trigger
cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Figure 1. Damage System UML</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project3/damage_flow.png" alt="image 2" class="max-w-full rounded-lg shadow-md mb-2 modal-trigger
cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Figure 2. Damage System Flow</figcaption></figure></div>

#### 2\. Modular Component-Based Damage System

-   **Plug-and-Play Structure**: Decoupled damage processing logic into independent components. This allows the damage system to be easily ported to any object—such as players, NPCs, or destructible structures—simply by attaching the component.
-   **Projectile-Based Collision Detection**: Bound projectile collision events to calculate accurate hit points and called the `TakeDamage` function to perform reliable physical calculations.

#### 3\. Hierarchical Behavior Tree AI

-   **Tactical Decision Making**: Implemented decision-making logic for both allied and enemy AI using Behavior Trees (BT). Managed states hierarchically from target detection to range-based transitions.
-   **Dynamic Distance Control**: Designed organic tactical behavior where AI approaches while firing if the target is beyond `IdleRange`, and performs aiming and stationary fire once within range.

<figure class="flex flex-col items-center my-8"><img src="/images/project3/bt.png" alt="Behavior Tree Graph" class="max-w-2xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans">Fig 3. Common Base Behavior Tree Structure</figcaption></figure>

* * *

### Technical Challenges & Solutions

#### 1\. Resolving Tight Coupling Between Objects

-   **Issue**: Observed a phenomenon where modifying one unit’s code caused cascading errors due to strong dependencies.
-   **Solution**: Introduced the **Facade pattern** to abstract core unit functions and utilized the **Component pattern** to build features modularly, removing direct dependencies between classes.
-   **Result**: Secured high scalability, allowing the addition of new units or special features without modifying existing code.

#### 2\. Optimizing Large-Scale AI in VR

-   **Issue**: Needed to prevent performance degradation caused by multiple NPCs executing Behavior Trees simultaneously.
-   **Solution**: Optimized AI by adjusting the update cycles of sensing logic and managing AI Controller operations asynchronously. Implemented a distance-based tick system to differentiate update frequencies based on proximity to the player.

* * *

### Results

-   Exhibited and demonstrated at the **2024 Busan-Gyeongnam Game Exhibition (Build 051)**.
-   Exhibited and demonstrated at the **2023 G-STAR** competition.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project3/picture1.jpg" alt="image 1" class="max-w-full aspect-video object-cover rounded-lg shadow-md mb-2 modal-trigger
cursor-pointer"></figure><figure class="flex flex-col items-center"><img src="/images/project3/picture2.jpg" alt="image 2" class="max-w-full aspect-video object-cover rounded-lg shadow-md mb-2 modal-trigger
cursor-pointer"></figure></div>
