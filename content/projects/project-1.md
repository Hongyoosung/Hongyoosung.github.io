---
title: "Dynamic EQS: <br> RL-Based Strategic Positioning Optimization for UE5"
description:  "Dynamic optimization of EQS weights via RL models and construction of an AWS cloud-based parallel reinforcement learning pipeline using Schola and Ray RLlib."
weight: 1
translationKey: "project-1"
duration: "2025.08 ~ 2026.03"
team_size: "1명"
role: "메인 프로그래머"
github: "https://github.com/yoosunghong/GOBTv2.0"
math: true
---

---

## Overview

This project aims to optimize strategic positioning for 5 vs 5 team-based point capture matches within the Unreal Engine 5 environment.

Each agent utilizes a strategy-specific Reinforcement Learning (RL) policy network combined with an Integrated EQS (Environment Query System) to infer optimal spatial movement parameters synchronized with real-time conditions.

Notably, I built a large-scale parallel training environment on AWS Cloud using Ray RLlib, utilizing the Schola plugin as a bridge. This implementation features a high-performance training pipeline capable of simultaneously collecting data from dozens of Unreal Engine instances to update policies.

---

## System Architecture
{{< img src="/images/project1/archi.png"
alt="System Architecture"
class="max-w-full"
caption="Fig 1. System Architecture and Hierarchical Positioning Workflow" >}}

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Game Engine** | Unreal Engine 5.6 (C++17) |
| **RL Framework** | Ray RLlib 2.7, PyTorch |
| **UE5-Python Bridge** | Schola Plugin (gRPC-based) |
| **Neural Network Inference** | ONNX Runtime via UE5 NNE (Neural Network Engine) |
| **Cloud & Infra** | AWS (EC2, EKS), Docker (Linux) |
| **Communication** | gRPC (Schola protocol) |
| **Monitoring** | TensorBoard |

---

## Key Features

### 1. RL & EQS Integration Logic (Actuator Transformation)

Instead of the RL model moving the agent directly, it outputs **weights**. UE5’s Environment Query System (EQS) then interprets the physical space based on these weights.

The RL policy's output space is $Box([-1, 1]^6)$, which is mapped to six spatial meanings via the `TacticalParameterActuator`.

| Parameter | Description |
| --- | --- |
| **EnemyObjectiveProximity** | Preference for approaching enemy objectives |
| **AllyObjectiveProximity** | Preference for staying near allied objectives |
| **CoverDensity** | Preference for environmental cover |
| **EnemyVisibility** | Preference for enemy visibility (combat vs. evasion) |
| **AllyProximity** | Preference for maintaining formation with allies |
| **CombatRange** | Preference for maintaining optimal weapon range |

**RL Policy Output -> UE5 Actuator Conversion Logic**

```c++
// Schola Actuator decodes Python Action Tensors into UE5 EQS parameters
void UTacticalParameterActuator::TakeAction(const FBoxPoint& Action)
{
    // Action.Values: 6D Float array [-1.0, 1.0] derived from RLlib
    FEQSWeightParameters Weights;
    Weights.EnemyObjectiveProximity = Action.Values[0];
    Weights.AllyObjectiveProximity = Action.Values[1];
    Weights.CoverDensity = Action.Values[2];
    Weights.EnemyVisibility = Action.Values[3];
    Weights.AllyProximity = Action.Values[4];
    Weights.CombatRange = Action.Values[5];

    // Weight validation and clamping
    if (!ValidateEQSWeights(Weights)) {
        Weights.Clamp();
    }

    // Update Agent's Blackboard and trigger navigation path recalculation
    if (MocAgent) {
        MocAgent->UpdateTacticalWeights(Weights); 
        MocAgent->PerformTacticalAction(); 
    }
}

```

Through this architecture, the RL can focus on high-level decision-making ("Which tactic is advantageous?"), drastically reducing the cost of physical collision handling and pathfinding in complex 3D environments.

---

### 2. Observation Space & Strategy-Conditioned Reward Shaping

**Observation Space**

| Category | Details | Description & Processing | Dim |
| --- | --- | --- | --- |
| **Self** | Pos, HP, Velocity | Normalized map position and agent state | 7 |
| **Allies** | Pos, HP | Max 4 allies. Distance/Visibility normalized | 16 |
| **Enemies** | Pos, LoS Flag | Coordinates provided only for enemies in Line of Sight | 20 |
| **Map** | 5 Capture Points | Flags: Allied(+1), Neutral(0), Enemy(-1) | 5 |
| **Strategy** | Assigned Role | Assault / Defend / Support (One-hot encoded) | 3 |
| **Total** |  |  | **51** |

**Reward Structure Overview**

Training three roles with a single reward function causes **Gradient Interference**, where updates beneficial for one role damage the policy of another. To solve this, I designed independent policy networks for each role and a combination of **Dense + Sparse** reward functions specialized for tactical objectives.

A baseline reward applies to all strategies, while role-specific dense rewards are calculated every step. Discrete events like kills or captures are accumulated as sparse rewards and drained at the end of the step.

```cpp
// DERewardSubsystem.cpp — Strategy-based scaling structure
float UDERewardSubsystem::GetStrategyScale(
    EDEStrategyType Strategy,
    float AssaultScale, float DefendScale, float SupportScale) const
{
    switch (Strategy)
    {
    case EDEStrategyType::Assault: return AssaultScale;
    case EDEStrategyType::Defend:  return DefendScale;
    case EDEStrategyType::Support: return SupportScale;
    }
}

```

---

> **Assault: Capturing Objectives**

The goal is to approach and capture enemy points. Agents receive a dense reward proportional to the distance closed to enemy points and a bonus for staying within the radius. Upon capture, a momentum bonus is activated for `PostCaptureMomentumDuration` steps, encouraging the agent to push forward to the next objective rather than idling.

---

> **Defend: Maintaining Objectives**

The goal is to hold allied points and repel enemies. A base presence reward is given for staying within the allied radius. If an agent takes damage inside the zone, a `ZoneDurabilityBonus` is awarded, reinforcing the behavior of holding the line despite being attacked.

---

> **Support: Sustaining Allies**

The goal is to track low-HP allies, heal them, and maintain a rear-guard position. To prevent "flickering" behavior (frequent target switching), a **5-step cache** is applied. Agents receive a rear-guard bonus for staying further from enemies than their allies. Attempting kills while an ally is injured results in a "Role Break Penalty."

---

**Independent Policy Networks & Strategy-Balanced Replay Buffer**

To prevent the Support head from collapsing in a shared encoder structure, I shifted to completely independent single-head policies. To ensure data variety, I implemented a `StrategyBalancedReplayBuffer` that forces a 33/33/33% sampling distribution across roles.

---

### 3. Containerization & Environment Management for AWS Parallel Learning

To ensure stable large-scale training, the Python environment was packaged into **Linux Docker containers** to connect with multiple UE5 instances on AWS EC2.

* **Containerization Strategy**: By switching to Linux containers, I resolved OS-level conflicts regarding Ray’s process spawning (spawn/fork) found in Windows.
* **Dynamic Port Routing**: Implemented a worker-index-based port assignment (`base_port + worker_index`) so each RLlib env-runner connects to a unique UE5 instance.
* **Orchestration**: Training scale and hyperparameters are controlled via Docker Compose environment variables, allowing for rapid **Hyperparameter Sweeps** without code changes.

---

### 4. Dual-Mode Architecture

The system supports both **Training** and **Inference** modes within a single UE5 binary. Trained ONNX models can be executed immediately for validation without separate builds.

* **Training Mode**: Uses Python RLlib (gRPC) and executes EQS synchronously in C++.
* **Inference Mode**: Uses local ONNX models (UE5 NNE) and delegates EQS execution to Behavior Trees via the Blackboard.

---

## Problem Solving

### Problem 1: Need for a Communication Standard between UE5 and RLlib

UE5’s native "Learning Agents" is restricted to local execution, making it difficult to utilize Ray RLlib’s distributed advantages.

* **Solution**: Adopted the **Schola Plugin** (AMD Open Source). It provides gRPC-based serialization, wrapping UE5 data into `gym.Env` formats for low-latency communication with RLlib.

### Problem 2: Instability in Parallel Training

Ray Learner actors would hang during weight synchronization on Windows, and single UE5 instances became bottlenecks.

* **Solution**: Migrated to a **Dockerized Linux environment** and implemented the dynamic port routing mentioned above. This allowed horizontal scaling of both UE5 instances and Python workers independently.

### Problem 3: Freezing at Multi-Agent Episode Boundaries

Systems would hang when an episode ended; live agents stopped receiving updates while dead agents entered an infinite "Death -> Auto-Respawn -> Immediate Death" loop.

* **Root Cause**: Conflict between Schola’s `SAME_STEP` reset policy and RLlib’s signal suppression. Dead agents consumed the entire "step budget" in a loop, blocking live agents at the step barrier.
* **Solution**:
1. Modified `ComputeStatus()` to return `Running` even if an agent dies (preventing Schola’s auto-reset).
2. Ensured dead agents still participate in the **Step Barrier** by consuming "ghost actions" in `Tick()`, allowing the episode to reach `MaxEpisodeSteps` for all agents simultaneously.



---

## Results

*(Note: Result data/graphs would typically follow here in the original project documentation)*

Would you like me to translate the "Results" section if you provide the content, or perhaps dive deeper into the technical specifics of the gRPC implementation?