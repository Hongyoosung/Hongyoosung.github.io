---
title: "GOBT: Goal-Oriented Behavior Tree"
description: "A hybrid decision-making framework combining the intuitiveness of Behavior Trees with the dynamic flexibility of GOAP and Utility Theory."
weight: 2
translationKey: "project-gobt"
---

{{< project-links 
    github="https://github.com/Hongyoosung/GOBT" 
    paper="https://doi.org/10.33851/JMIS.2023.10.4.321" 
>}}

---

## Overview

This project aims to develop a hierarchical AI framework using the Unity engine that merges the structural clarity of **Behavior Trees (BT)** with the adaptability of **Goal-Oriented Action Planning (GOAP)**. By integrating custom algorithm nodes inspired by GOAP and Utility Theory into a standard BT, I addressed the limitations of static decision-making in NPC AI. The system employs a hierarchical design where high-level flow is managed by the BT, while complex situational reasoning is delegated to custom nodes, achieving both computational efficiency and developer convenience.



{{< img src="/images/project2/main.png" 
        alt="Main Architecture" 
        class="max-w-2xl" 
        caption="Figure 1. 3-Layer Framework Structure" >}}

---

## Tech Stack

* **Game Engine**: Unity 3D 
* **AI Architecture**: Behavior Tree, GOAP (Goal-Oriented Action Planning), Utility System
* **Tools/Assets**: Behavior Designer 
* **Language**: C#

---

## Key Features

### 1. Data-Driven State Transitions via Planner Nodes

* **Pre/Post-condition Based Action Search**: The system dynamically transitions states by analyzing the agent's current variables and final goals. By adopting a **Data-driven** structure—where only **Pre-conditions** and **After-effects** are specified for each action—the system automatically constructs the optimal graph to reach the goal.
* **Utility-Based Forward Real-time Action Chaining**: To overcome the real-time responsiveness limitations of traditional GOAP (which uses backward planning), I implemented a **Forward Optimization** approach. This allows the system to recalculate weights in real-time based on environmental changes, enabling flexible goal adjustments and action execution.

{{< img-grid 
    src1="/images/project2/statenode.png" cap1="Figure 2. State Node Structure"
    class1="w-3/4" 
    src2="/images/project2/stategraph.png" cap2="Figure 3. State Space Graph"
    class="max-w-full" 
>}}

### 2. Utility-Based Real-time Decision Optimization

* **Multi-variable State Normalization & Abstraction**: Battlefield data with different units (HP, Level, Distance, etc.) are **normalized to values between 0.0 and 1.0** to ensure consistency. This transforms non-linear environmental changes into calculable metrics and objectifies the influence of each state on decision-making.
* **Optimal Action Selection Mechanism**: Instead of following fixed priorities, the system evaluates utility functions attached to each action node in real-time. Using a weighted ($w$) utility formula, the agent autonomously selects the optimal action with the lowest opportunity cost and highest expected value.
* **Context-Aware Responsiveness**: Moving beyond the constraints of fixed FSMs (Finite State Machines), the utility curves react to subtle environmental changes, resulting in organic movements where the agent appears to truly "understand" and judge the situation.

$$U_{final} = \max(w_1 \cdot U_1, w_2 \cdot U_2, \dots, w_n \cdot U_n)$$

{{< img src="/images/project2/graph.png" 
        alt="Utility Graph" 
        class="max-w-3xl" 
        caption="Figure 4. Normalization and Environment Response Curves" >}}

### 3. Modular Data-Driven Design & Authoring Tool

* **Decoupling State Space Expansion from Evaluation Logic**: While the dynamic state nodes searched by the planner are vast, the number of essential actions (Action Templates) remains limited. I utilized this by connecting evaluation modules to finite Action Templates rather than writing individual logic for every possible state.
* **ScriptableObject-Based Composition**: Common utility functions like "HP Evaluation" or "Distance Evaluation" were modularized into **ScriptableObject** assets (**AgentConsideration**). Designers can simply plug these evaluation assets into action nodes like LEGO blocks within the Inspector.
* **Minimizing Authoring Cost**: This structure allows the system to automatically calculate utilities at runtime by feeding current variables into the assembled assets. Consequently, it drastically reduces **Authoring Cost** and maintenance overhead without artificially limiting the complexity of the state graph.

{{< img-grid-3
    src1="/images/project2/unity1.png" cap1="Figure 5. Custom Planner Node in Behavior Designer" class1="w-full"
    src2="/images/project2/unity2.png" cap2="Figure 6. Inspector for Action Classes with Pre/Post-conditions" class2="w-3/4"
    src3="/images/project2/unity3.png" cap3="Figure 7. Inspector for setting Goal States and Evaluation Variables" class3="w-1/2"
    class="max-w-full" 
>}}

---

## Problem Solving & Optimization

### 1. Asynchronous Graph Construction using Coroutines

* **Problem**: In multi-agent environments, a significant frame drop (spike) occurred when all agents attempted to build their state-space graphs via GPlanner simultaneously at the start.
* **Solution**: I transitioned from a synchronous approach (processing all nodes in a single frame) to a **Time-slicing** approach based on **Coroutines**. If calculations exceed the allocated time per frame, the process yields to the next frame.
* **Result**: Improved frame drops during agent initialization by over **80%**, maintaining stable performance even in densely populated environments.


{{< img-grid 
    src1="/images/project2/before.png" cap1="Figure 8. Basic method (blocking occurs)"
    src2="/images/project2/after.png" cap2="Figure 9. Coroutine time-sharing method"

    class="max-w-full" 
>}}

### 2. Resolving Graph Deadlocks (Oscillation)

* **Problem**: Agents would occasionally fall into loops (oscillation) between specific actions or fail to reach goals due to cycling through identical states in dynamic environments.
* **Solution**: Introduced a **Visited List** and **Max Depth** limit to the search algorithm. Furthermore, I implemented a "**Stickiness**" concept that applies a weight penalty to repeated actions, forcing the agent to explore alternative nodes.
* **Result**: Ensured decision-making stability; agents now successfully navigate alternative routes or return to high-level goals even during exceptional environmental changes.

### 3. Utility Computation Optimization (Weight Caching)

* **Problem**: Real-time recalculation of utility weights for all child nodes during every state transition increased CPU load proportionally to the number of agents.
* **Solution**: Implemented a **Caching Mechanism** that reuses previous values if core variables (HP, distance, etc.) have not changed beyond a certain threshold. Additionally, I utilized a **Tick System** to stagger update cycles across different agents.
* **Result**: By efficiently regulating computation frequency, I optimized processing costs and gained the performance overhead necessary to support a larger number of on-screen agents.

---

## Results

* **Publication**: Published as the Lead Author in the **Journal of Multimedia Information System (JMIS)**, Vol. 10, No. 4, October 2023: ["GOBT: A Synergistic Approach to Game AI Using Goal-Oriented and Utility-Based Planning in Behavior Trees"](https://doi.org/10.33851/JMIS.2023.10.4.321).
* **Role**: Lead Programmer, Lead Author