---
title: "Designing Scalable AI Systems in Unreal Engine"
date: 2026-02-24T11:00:00+09:00
draft: false
description: "Sharing insights on designing a flexible AI architecture that operates seamlessly in complex game environments using Behavior Trees and the Environment Query System (EQS)."
tags: ["Unreal Engine", "Game AI", "Architecture"]
categories: ["Tech"]
---

In game development, AI is one of the core elements that define the player experience. In this post, I’d like to share my experience in designing a scalable AI system architecture using Unreal Engine that remains stable even in large-scale environments.

### 1. Limitations of Existing Systems and a New Approach

In previous projects, I implemented AI based on State Machines. However, as the number of states increased, the transition conditions became exponentially complex, leading to unavoidable "spaghetti code." To solve this, for this project, I completely overhauled the decision-making model to be based on Behavior Trees (BT).


### 2. Combining Behavior Trees with EQS

A standalone Behavior Tree is often insufficient for creating AI that reacts sensitively to environmental changes. To address this, we actively integrated the Environment Query System (EQS).

Dynamic Cover Searching: Using EQS, we designed the AI to calculate the player's Line of Sight (LoS) and score the safest cover nodes, allowing for real-time path adjustments.

Cost-Based Targeting: When an enemy (AI) switches targets, we use a custom EQS Generator that calculates weights based not just on simple distance, but also on the "danger level along the path."

---

This modular architecture provides a significant maintenance advantage: when adding new types of enemies or NPCs, we can simply expand the node tree without compromising existing logic.

In the next post, I will cover a detailed code-level tutorial on writing custom BT Task Nodes in C++.
