* * *

### Overview

This project involved designing and implementing a Dynamic EQS plugin that automatically optimizes the EQS (Environment Query System) weights of UE5 agents through reinforcement learning, validated in a 5v5 team-based capture point environment using MAPPO. The result is a hybrid AI system in which the EQS handles agent spatial navigation and movement, while the reinforcement learning model is responsible for determining optimal positioning.

To address unstable cooperation signals, the policy architecture was changed so that agents could read entity relationships before producing EQS weights. The final claim is intentionally narrow: role-specific policies and rewards shaped the roles, while Self-Attention and Cross-Attention improved how each role interpreted allies, enemies, and objectives.

The entire system was built around a RL-EQS integration middleware layer on top of Schola (gRPC), abstracted as a plugin for reusability across other UE5 projects. The full pipeline — from system design through to AWS-based parallel training infrastructure — was implemented end-to-end by a single developer.

* * *

### Key Results

#### Schola-based RL Environment

Environment

Measured Result

Implemented a reusable RL-EQS middleware layer between Ray RLlib and Schola (a gRPC-based RL plugin for Unreal Engine 5), and had a bug-fixing PR merged into Schola's main branch / v2.1.1.

What I Learned

Learned that connecting Unreal environments to an RL training loop requires explicit management of not only actions, observations, and rewards, but also agent-specific termination states as part of the step contract.

#### Attention-based Relation Recognition

Empirical Analysis

Measured Result

Improved the observation encoder so agents could read spatial relationships among allies, enemies, and objectives instead of treating each entity as isolated information. In a controlled A/B ablation with the same 66-iteration setup, adding Self-Attention raised objective coverage from **0.318 to 0.454 (+43%)**, reduced the whole-team-on-one-objective failure mode from **46.5% to 16.0%**, and improved the win rate against scripted AI from **0.125 to 0.292 (2.3x)**.

What I Learned

Attention is not a mechanism that automatically completes cooperation; it is an encoder design that helps the policy interpret team formation and spatial context before choosing an action.

#### Curriculum Learning

Training Method

Measured Result

Structured Scripted AI into a 3-tier difficulty system (Basic, Standard, Aggressive) with a promotion mechanism based on 25% and 40% win-rate thresholds. Successfully raised the win rate against Scripted AI from 0% to approximately 70% after 2.5M timesteps of training.

What I Learned

Confirmed that introducing difficult opponents or self-play too early destabilizes training signals; a curriculum that gradually increases difficulty is essential for learning game rules and stabilizing policies.

#### MAPPO Multi-Agent Training

Algorithm

Measured Result

Configured a MAPPO training environment utilizing independent actors for each role (Strike, Vanguard, Support) alongside a shared centralized critic, and implemented a checkpoint win-rate comparison script.

What I Learned

Learned that in multi-agent environments, cooperation cannot be easily explained by a single reward scalar; tracking training quality requires co-designing role-specific policies, a centralized critic, and checkpoint evaluation loops.

#### GAS-based Combat Environment

System Integration

Measured Result

Configured Strike's ranged combat, Vanguard's melee engagement, and Support's healing behaviors based on the UE5 Gameplay Ability System (GAS), implementing a combat-RL reward pipeline that calculates approach, capture, and combat rewards at each step.

What I Learned

Learned that RL rewards should be connected to the damage, healing, position, and role constraints of the actual combat system rather than being designed through abstract formulas alone to align agent behaviors with gameplay intent.

#### AWS Cloud Distributed Training

Infrastructure

Measured Result

Established a cloud parallel training pipeline by packaging the UE5 Linux build to S3 and running Docker-based training scripts on EC2 instances.

What I Learned

Learned that since Unreal-based RL lacks sufficient iteration speed on a single local instance, an infrastructure design covering build deployment, checkpoint synchronization, and remote evaluation is crucial.

* * *

### System Architecture

<figure class="project-media"><img src="/images/project1/archi.png" alt="System Architecture" loading="lazy"><figcaption>Fig 1. System Architecture and Hierarchical Positioning Workflow</figcaption></figure>

### Tech Stack

| Category | Technologies |
| --- | --- |
| **Game Engine** | Unreal Engine 5.6 (C++17) |
| **RL Framework** | Ray RLlib 2.7, PyTorch |
| **UE5-Python Bridge** | Schola Plugin (gRPC-based) |
| **Neural Network Inference** | ONNX Runtime via UE5 NNE (Neural Network Engine) |
| **Ability System** | UE5 Gameplay Ability System (GAS) — GameplayAbility, GameplayEffect, GameplayTag |
| **Cloud & Infra** | AWS (EC2, EKS), Docker (Linux) |
| **Communication** | gRPC (Schola protocol) |
| **Monitoring** | TensorBoard |

* * *

### Training Environment

The environment is a **5v5 team-based Capture the Point** mode featuring 5 capture points across the map. The team that captures and holds more points to reach the target score first wins the match.

#### Class Role Design

Each agent is assigned a specific class—**Strike, Vanguard, or Support**—at the start of every episode. Since each class requires a fundamentally different positioning strategy, I assigned **independent policy networks** to each class and applied role-specific reward functions.

<div class="project-media-grid"><figure class="project-media"><img src="/gifs/project1/project1_strike.gif" alt="" loading="lazy"></figure><figure class="project-media"><img src="/gifs/project1/project1_vanguard.gif" alt="" loading="lazy"></figure><figure class="project-media"><img src="/gifs/project1/project1_support.gif" alt="" loading="lazy"></figure></div>

| Class | Role | Core Positioning Objective |
| --- | --- | --- |
| **Strike** | Ranged DPS | Approach enemy points + Maintain optimal firing range |
| **Vanguard** | Melee Tank | Maintain front-line presence + Close-quarters engagement |
| **Support** | Backline Healer | Track injured allies + Maintain safe rear positioning |

#### Training Against Scripted AI

The Blue Team (RL) trains against the **Red Team (Scripted AI)**, which operates using hardcoded EQS weights and State Machines.

Due to the complex mix of the three agent classes, which makes Self-Play less effective in the early stages, Scripted AI was chosen to provide a consistent difficulty baseline. This allowed the RL agents to learn foundational strategies reliably.

#### Curriculum Tier System

The Scripted AI is divided into **three difficulty tiers**: 1 (Basic), 2 (Standard), and 3 (Aggressive). When the RL team's win rate exceeds a specific promotion threshold over a set period, the system automatically transitions to the next tier.

| Tier Transition | Promotion Threshold |
| --- | --- |
| Tier 1 → 2 | 25% or higher |
| Tier 2 → 3 | 40% or higher |

This system was implemented to prevent overfitting to lower difficulties and to gradually expose the agents to stronger opponents. Tier information is stored in `scripted_ai_config.json`, and UE5’s `LoadTierFromConfig()` applies the update automatically during the next episode reset.

* * *

#### Observation Space

A **218-dimensional Entity-Centric vector** generated by `FDEObservationV2::ToFlatArray()`. It encodes allies, enemies, and strategic bases into fixed-size slot tokens. A separate padding mask is provided to ensure the Python-based **MultiheadAttention** mechanism processes only valid entities.

**Agent Input State Configuration**

| Index | Dim | Token Content | Normalization & Details |
| --- | --- | --- | --- |
| **\[0 : 7\]** | 7 | Self Token | Pos/7500(3) + Vel/600(3) + Health(1) |
| **\[7 : 71\]** | 64 | Ally Tokens (8×8) | Rel\\\_Pos/8000(3) + HP(1) + Alive(1) + Class One-hot(3) |
| **\[71 : 135\]** | 64 | Enemy Tokens (8×8) | Rel\\\_Pos/8000(3) + HP(1) + Visibility(1) + Class One-hot(3) |
| **\[135 : 191\]** | 56 | Base Tokens (8×7) | Rel\\\_Pos/15000(2) + Height/1000(1) + Occupancy(1) + Progress(1) + Assigned(1) + Strat\\\_Value(1) |
| **\[191 : 199\]** | 8 | Ally Mask | 0 = Valid, 1 = Padding |
| **\[199 : 207\]** | 8 | Enemy Mask | 0 = Valid, 1 = Padding |
| **\[207 : 215\]** | 8 | Base Mask | 0 = Valid, 1 = Padding |
| **\[215 : 218\]** | 3 | Class One-hot | \[strike, vanguard, support\] |
| **TOTAL** | **218** |  |  |

> **Mask Handling:** The `_safe_mask()` function in the Python policy prevents **NaN** errors in MultiheadAttention by forcibly unmasking Slot 0 when all slots are padded. The mask threshold is set to `> 0.5` (float comparison), preserving the `0.0=Valid / 1.0=Padding` semantics.

* * *

#### Action Space

The policy network output is a **7-dimensional Continuous Box Action**. Each dimension corresponds to a weight parameter for an individual test within the **EQS (Environment Query System)** query. These weights dynamically adjust the contribution of each test when the EQS evaluates 48 candidate positions.

| Index | Parameter Name | Range | Description |
| --- | --- | --- | --- |
| **\[0\]** | `EnemyObjectiveProximity` | \[-1, 1\] | Drive to move toward enemy objectives (Positive: approach, Negative: evade). |
| **\[1\]** | `AllyObjectiveProximity` | \[-1, 1\] | Drive to defend allied objectives (Positive: return, Negative: advance). |
| **\[2\]** | `CoverDensity` | \[-1, 1\] | Preference for areas with high cover (Positive: prioritize cover, Negative: prefer open terrain). |
| **\[3\]** | `EnemyVisibility` | \[-1, 1\] | Drive to maintain line-of-sight with enemies (Positive: maintain vision, Negative: conceal). |
| **\[4\]** | `AllyProximity` | \[-1, 1\] | Drive to maintain proximity to allies (Positive: cluster, Negative: disperse). |
| **\[5\]** | **`CombatRange`** | \[-1, 1\] | Adjustment of preferred engagement distance (Positive: maintain distance, Negative: close in). |
| **\[6\]** | `AssignedBaseProximity` | \[-1, 1\] | Attraction toward the assigned objective (Positive: approach, Negative: depart). |
| **TOTAL** | **7-dim** | **\[-1, 1\]** | `FDEEQSWeightParameters` |

The output layer of the policy network utilizes a `tanh` activation function to naturally constrain each weight within the **\[-1, 1\]** range. These seven weights are injected into the EQS query parameters via `UDynamicEQSExecutor::ApplyWeightsToRequest()`. Based on these inputs, the EQS calculates a comprehensive score for **48 candidate positions** to determine the optimal movement target.

* * *

#### Reward Structure

#### S T R I K E

The objective is to capture bases while maintaining high damage output from a distance. An **approach reward** is granted per step proportional to the distance closed toward the target base, with an additional **presence bonus** upon entering the capture radius. To ensure role adherence, a penalty is applied if the agent gets too close to enemies.

**Strike reward (per step)**

```cpp
reward = 0
if distance_to_target_base decreased:
    reward += approach_reward * delta_distance
if agent inside target_base radius:
    reward += zone_presence_bonus
if base just captured:
    activate momentum_bonus for PostCaptureMomentumDuration steps
    reward += capture_bonus
if momentum active:
    reward += momentum_bonus  # encourages moving to next base
if distance_to_enemy < MinCombatRange:
    reward -= too_close_enemy_penalty  # ranged: maintain combat distance
```

* * *

#### V A N G U A R D

The objective is to capture bases while engaging in frontline melee combat. The base approach and capture logic follow the same principles as the Strike class. A **melee engagement bonus** is awarded when enemies are within close range inside a base, reinforcing frontline tanking behavior.

**Vanguard reward (per step)**

```cpp
reward = 0
if distance_to_target_base decreased:
    reward += approach_reward * delta_distance
if agent inside target_base radius:
    reward += zone_presence_bonus
    if enemy within melee range:
        reward += melee_range_bonus  # frontline tank: reward close engagement
if base just captured:
    activate momentum_bonus for PostCaptureMomentumDuration steps
    reward += capture_bonus
if momentum active:
    reward += momentum_bonus
```

* * *

#### S U P P O R T

The objective is to track, heal, and maintain rear-guard positioning for wounded allies. To prevent "jittery" behavior (oscillating between targets), a **5-step target cache** is implemented. Agents receive a **rear-positioning bonus** for staying behind non-support allies.

**Support reward (per step)**

```cpp
reward = 0
if staleness_counter >= 5 or no cached_target:
    cached_target = ally with lowest health
    staleness_counter = 0
else:
    staleness_counter++

if distance_to_cached_target decreased:
    reward += approach_reward * delta_distance
if heal applied to ally:
    reward += heal_reward * heal_amount
if agent positioned behind cached_target (rear arc):
    reward += rear_positioning_bonus
if cached_target.health < threshold and agent attempted kill:
    reward -= role_deviation_penalty
```

* * *

#### Team Reward Mixing (MAPPO Cooperative Signal)

To enhance cooperation in team-based environments, we implement a **Reward Mixing** strategy that blends individual and team-average rewards.

<img src="/formula/project1/final_reward_formula.svg" class="project-math-svg" alt="Team Reward Mixing Formula">

| Parameter | Value | Design Intent |
| --- | --- | --- |
| `TeamRewardMixingRatio` (α) | **0.2** | Maintains individual role optimization as the primary signal while preventing selfish behavior through a 20% cooperative signal. |

The ratio is set to **\\alpha = 0.2** to allow agents to first converge on basic role-specific behaviors (positioning, range maintenance) before refining team-level coordination. The team average is calculated based on the `LastIndividualStepReward` of teammates (excluding the self). Mixing is automatically disabled for solo agents. This calculation occurs every step in `DERewardSubsystem.cpp` via the `CalculateStepReward()` function.

* * *

#### UE5 → Python Reward Pipeline

Rewards are calculated in **C++ (UE5)**, normalized in **Python (RLlib)**, and then utilized for PPO updates.

<figure class="project-media"><img src="/images/project1/rewardpipeline.png" alt="Fig 2. Reward Pipeline" loading="lazy"><figcaption>Fig 2. Reward Pipeline</figcaption></figure>

**Workflow:**

1.  **C++ Calculation:** `DERewardSubsystem` computes per-step rewards (approach, objective, combat), applies 80:20 team mixing, and performs initial normalization via `RewardScale` and `Clamp`.
2.  **gRPC Transmission:** The **Schola plugin** transmits reward data to the Python environment (`DEEntityCentricEnv`) via gRPC.
3.  **Python Normalization:** `process_reward()` applies a `reward_scale=0.01` and clips the value to `±5.0` to ensure PPO training stability.
4.  **Dual Critic Evaluation:** The `EntityCentricRLlibModel` value function utilizes a learnable mixing coefficient (α, initial sigmoid 0.5) to combine **V\_{local}** (226-dim Attention Critic) and **V\_{central}** (71-dim Global MLP Critic). All three role policies share the centralized critic.

* * *

### Key Features

#### 1\. Dynamic-EQS Plugin

**DynamicEQS** is a **reusable UE5-exclusive RL-EQS integration layer** built upon the Schola plugin. Game projects using DynamicEQS can inherit EQS-specific abstract classes instead of directly handling Schola's low-level gRPC/ONNX processing.

DynamicEQS consists of four primary classes responsible for **Environment**, **Agent**, **Action**, and **Observation**. It serves as a middleware layer between Schola and the game project, configuring EQS weights and mapping them to the policy network.

<figure class="project-media"><img src="/images/project1/pluginarchi.png" alt="Fig 3. Plugin Hierarchy" loading="lazy"><figcaption>Fig 3. Plugin Hierarchy</figcaption></figure>

<figure class="project-media"><img src="/images/project1/InferenceLoop.png" alt="Fig 4. Training/Inference Runtime Data Flow" loading="lazy"><figcaption>Fig 4. Training/Inference Runtime Data Flow</figcaption></figure>

* * *

#### EQS Weight Injection

The following flow describes how the policy network's output (7-dim Box action) is injected as actual EQS query parameters.

**Editor Setup**

1.  Add the `UDynamicEQSExecutor` component to the `BP_Agent` (ADECharacter).
2.  Enter the parameter names used in each EQS Query test into the `WeightParamNames` array in order (e.g., `EnemyObjectiveProximity`, `AllyObjectiveProximity`, etc.).
3.  Set the `Actuator` to `UDETacticalParameterActuator` within the `UDEScholaAgent` component.

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/eqs1.png" alt="Fig 5. DynamicEQSExecutor Component" loading="lazy"><figcaption>Fig 5. DynamicEQSExecutor Component</figcaption></figure><figure class="project-media"><img src="/images/project1/eqs2.png" alt="Fig 6. EQS Asset Configuration" loading="lazy"><figcaption>Fig 6. EQS Asset Configuration</figcaption></figure></div>

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/eqsdebug1.png" alt="Fig 7. EQS Debugging 1" loading="lazy"><figcaption>Fig 7. EQS Debugging 1</figcaption></figure><figure class="project-media"><img src="/images/project1/eqsdebug2.png" alt="Fig 8. EQS Debugging 2" loading="lazy"><figcaption>Fig 8. EQS Debugging 2</figcaption></figure></div>

**EQS Parameter Injection**

```cpp
// DynamicEQSExecutor.cpp — EQS Parameter Injection
void UDynamicEQSExecutor::ApplyWeightsToRequest(FEnvQueryRequest& Request) const
{
    for (int32 i = 0; i < Weights.Num(); ++i)
    {
        const FName ParamName = (WeightParamNames.IsValidIndex(i) && !WeightParamNames[i].IsNone())
            ? WeightParamNames[i]
            : FName(*FString::Printf(TEXT("Weight%d"), i));
        Request.SetFloatParam(ParamName, Weights[i]);
    }
}
```

* * *

#### Evaluation Mode

The **Live Evaluation** pipeline (`eval_live.py`) quantitatively validates the performance of checkpoints saved during training through matches against Scripted AI.

The `eval_live.py` pipeline is designed to quantitatively verify checkpoint performance against Scripted AI during the training process.

By concurrently connecting two sub-environments in UE5, it evaluates two checkpoints (`best`, `latest`) in parallel. Episode outcomes are categorized into `win / loss / draw / timeout`, and the win rate based on 50 episodes is saved in `eval_results_<timestamp>.json`.

The system is designed to run immediately via CPU inference by extracting only the Actor weights from `policy_state.pkl`, eliminating the need for a Ray runtime.

<figure class="project-media"><img src="/images/project1/eval.png" alt="Fig 9. model eval result" loading="lazy"><figcaption>Fig 9. model eval result</figcaption></figure>

* * *

#### Decoupling Game Logic via FInstancedStruct

To prevent the plugin from having direct members of game-specific types (such as `AssignedBaseIndex`), external parameters are stored opaquely using `FInstancedStruct`.

If a plugin has a **compile-time dependency** on the game module, it becomes impossible to reuse in other projects. Therefore, a method was needed to break dependencies between modules while preserving runtime type information. `void*` lacks type safety, and the interface pattern (`IExternalContext`) forces implementation on the game side, compromising the plugin's independence. UE5's `FInstancedStruct` met these requirements by allowing opaque storage while preserving USTRUCT metadata.

**DynamicEQSAgentComponent.h**

```cpp
UPROPERTY(BlueprintReadWrite)
FInstancedStruct ExternalParams; // Can store any USTRUCT

// DETacticalParameterActuator.cpp — Casting to game type at the point of use
const FDEAgentExternalContext* Ctx =
    AgentComponent->ExternalParams.GetPtr\<FDEAgentExternalContext\>(); 
if (Ctx)
    Weights.AssignedBaseProximity = ComputeBaseProximityWeight(Ctx->AssignedBaseIndex);
```

Thanks to this pattern, the plugin does not include any game headers and can be reused as-is in other projects.

* * *

#### 2\. MAPPO (Multi-Agent PPO)

This project adopts **MAPPO (Multi-Agent PPO)** to train three role-specific independent actors (`strike_policy`, `vanguard_policy`, `support_policy`) alongside a shared centralized critic.

**Centralized Critic** — The `CentralizedCritic` estimates the overall team value by taking a 71-dim global team state (`FDETeamWorldState`: positions/HP/strategy of 5 allies + positions/reliability of 5 enemies + map state) as input. By directly referencing team-level information that cannot be captured by individual agent observations alone (e.g., ally distribution, overall capture progress), the critic significantly reduces the variance of Advantage estimation.

* * *

**Dual Value Estimation** Each `EntityCentricRLlibModel` combines a local critic (V\_{local}, 226-dim agent observation) and a centralized critic (V\_{central}, 71-dim global state) using a learnable mixing coefficient \\alpha.

<img src="/formula/project1/agent_obs_formula.svg" class="project-math-svg" alt="Dual Value Estimation Formula">

\\alpha is initialized via `sigmoid(_value_mix_logit)` (initial value of 0.5) and automatically determines the optimal weight between local and global signals for each role through training.

#### Role of Self-Attention

Intra-Set Self-Attention is applied to each entity group (allies, enemies, bases) within the Actor's encoder (Zambaldi et al., 2018). This allows entity tokens to reference one another and learn spatial relationships within the set, such as **"Slot 3 and Slot 5 are clustering near the same base."** This contextualized representation then serves as the input for Cross-Attention.

#### Role of Cross-Attention

The Self Token (embedding of the 7-dim self-observation) acts as the **Query**, while the ally, enemy, and base tokens processed via Self-Attention serve as **Keys/Values**. Cross-Attention aggregates the importance of each entity relative to the agent's current state into a weighted sum, which is then used to determine the action (7-dim EQS weights).

**train.py**

```python
# Independent policy routing by role

STRATEGY_POLICY_NAMES = {0: "strike_policy", 1: "vanguard_policy", 2: "support_policy"}

config = config.multi_agent(
policies={
name: PolicySpec(config={"model": model_cfg})
for name in STRATEGY_POLICY_NAMES.values()
},
policy_mapping_fn=_policy_mapping_fn,  # agent_id → class → policy
count_steps_by="agent_steps",
)
```

Further details are covered in the **"Problem 2: Loss of Relationship Information Between Entities"** section.

* * *

#### 3\. AWS Parallel Training Environment

To overcome the scaling limitations of a single local UE5 instance, I developed an **AWS-based distributed training pipeline**. UE5 is packaged as a Linux binary and uploaded to S3, while training scripts are executed via Docker images on EC2 instances to enable high-throughput parallel learning.

#### Overall Infrastructure Architecture

<figure class="project-media"><img src="/images/project1/aws_archi.png" alt="Fig 10. AWS Parallel Training Infrastructure Overview" loading="lazy"><figcaption>Fig 10. AWS Parallel Training Infrastructure Overview</figcaption></figure>

#### Infrastructure Components

| Component | Role |
| --- | --- |
| **Amazon ECR** | Docker image registry for training scripts; pulls UE5 binaries from S3 |
| **EC2 Ray Cluster** | Ray Head + 4 concurrent env\\\_runners; performs PPO training via GPU |
| **Amazon S3** | Persistent storage for UE5 binaries, checkpoints, and training data; integrated with W\\&B |
| **W\\&B** | Real-time monitoring of rewards, win rates, and loss metrics per iteration |
| **Terraform** | Provisioning of VPC, IAM roles, and Security Groups |

#### Cluster Design Rationale

The **Head Node (GPU)** manages policy gradient updates, while **Worker Nodes (CPU Spot)** are dedicated to running headless UE5 instances and collecting rollouts. Since rollout collection is a stateless task that supports interruption and resumption, I utilized **Spot Instances** for workers to optimize cost efficiency.

#### Training Cycle Summary

1.  Build Docker image → Push to ECR
2.  Initialize Ray cluster (`ray up`) → Submit training script
3.  4 Workers collect UE5 rollouts in parallel → Build batch with `train_batch_size=4096`
4.  PPO gradient updates on Head GPU → Sync checkpoints to S3 every 10 iterations
5.  Automatically sync to the `best/` path upon achieving a new record win rate

Executing `ray down` terminates all instances immediately, while S3 checkpoints are preserved to ensure seamless training resumption upon restart.

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/aws_ec2.png" alt="Fig 11. AWS EC2 Instances" loading="lazy"><figcaption>Fig 11. AWS EC2 Instances</figcaption></figure><figure class="project-media"><img src="/images/project1/aws_ps.png" alt="Fig 12. 4 PIDs (UE5 Processes) verified via 'ps aux'" loading="lazy"><figcaption>Fig 12. 4 PIDs (UE5 Processes) verified via 'ps aux'</figcaption></figure></div>

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/aws_s3.png" alt="Fig 13. Amazon S3 Bucket" loading="lazy"><figcaption>Fig 13. Amazon S3 Bucket</figcaption></figure><figure class="project-media"><img src="/images/project1/aws_log.png" alt="Fig 14. CloudWatch Logs" loading="lazy"><figcaption>Fig 14. CloudWatch Logs</figcaption></figure></div>

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/wan_spec.png" alt="Fig 15. W\&amp;B Dashboard Specs" loading="lazy"><figcaption>Fig 15. W\&amp;B Dashboard Specs</figcaption></figure><figure class="project-media"><img src="/images/project1/wan_log.png" alt="Fig 16. W\&amp;B Training Logs" loading="lazy"><figcaption>Fig 16. W\&amp;B Training Logs</figcaption></figure></div>

* * *

### Problem Solving

#### Problem 1: Agent Death Handling Defects in Multi-Agent Reinforcement Learning (Schola + RLlib)

<figure class="project-media"><img src="/images/project1/Schola-ScholaArchitecture.png" alt="Fig 17a. Schola Communication Architecture" loading="lazy"><figcaption>Fig 17a. Schola Communication Architecture</figcaption></figure>

Schola connects Unreal Engine agents and the Python RLlib environment through gRPC, synchronizing actions, observations, rewards, and termination signals at every environment step.

**Episode Freeze**: A communication mismatch occurred where RLlib stopped sending actions for an agent that died early, while Unreal Engine (Schola) remained in a wait-state, expecting actions for all agents.

**Stale dead-agent data**: In `NEXT_STEP` multi-agent environments, agents that had already terminated could still leak stale observations, rewards, or state transitions back to RLlib unless their terminal state was explicitly preserved.

<figure class="project-media"><img src="/images/project1/Schola-DeadAgent(Before).png" alt="Fig 17b. Staggered agent death before the fix" loading="lazy"><figcaption>Fig 17b. Staggered agent death before the fix</figcaption></figure>

* * *

#### Cause

**Mismatch between staggered termination and step synchronization**

The defect occurred in RLlib `NEXT_STEP` multi-agent environments when agents terminated at different timesteps.

-   **RLlib**: Once an agent was marked done, RLlib stopped sending actions for that already-dead agent.
-   **Schola / Unreal**: The environment step still had to synchronize the remaining live agents while preserving the terminal/truncated state of agents that were already dead.

Without explicit dead-agent handling, stale data from already-dead agents could be returned to RLlib and terminal state could be overwritten by later Unreal step logic. This broke the step contract between RLlib and Schola, producing freezes when agents died at different times.

* * *

#### Goal

Establish a stable `NEXT_STEP` training environment that operates without interruption even during staggered agent deaths.

-   Preserve terminal/truncated state for agents that already ended before the current step.
-   Filter stale dead-agent observations, rewards, termination flags, truncation flags, and infos before returning data to RLlib.

* * *

#### Solution

**Terminal-state preservation and stale-agent filtering across Unreal and RLlib**

Unreal side:

-   **Terminal State Preservation**: Preserved terminal/truncated state for agents that were already dead before `Step()`, preventing environment step logic from overwriting their final state.
-   **Dead-Agent Action Filtering**: Removed already-dead agents from the action map before executing the environment step, so stale actions could not affect physics or game logic.
-   **Revival Prevention**: Prevented already-dead agents from being accidentally revived by downstream step/update logic.

Python / RLlib side:

-   **Shared Dead-Agent Filter**: Added `BaseRayEnv._filter_dead_agents()` to remove stale observations, rewards, terminateds, truncateds, and infos for agents that were already done before the current step.
-   **RayEnv / RayVecEnv Consistency**: Applied the same filtering in both `RayEnv.step()` and `RayVecEnv.step()`.
-   **Reset Safety**: Skipped filtering during `_reset_on_next_step`, preserving fresh initial observations from the next episode.

<figure class="project-media"><img src="/images/project1/Schola-DeadAgent(After).png" alt="Fig 17c. Stable step synchronization after filtering dead agents" loading="lazy"><figcaption>Fig 17c. Stable step synchronization after filtering dead agents</figcaption></figure>

* * *

#### Result

-   **Upstream PR Merged**: The staggered-agent-death fix was accepted and merged into Schola via [GPUOpen-LibrariesAndSDKs/Schola#2](https://github.com/GPUOpen-LibrariesAndSDKs/Schola/pull/2), rebased onto current main / Schola v2.1.1.
-   **Training Stability**: Resolved freezes in RLlib `NEXT_STEP` multi-agent environments where agents terminate at different timesteps and RLlib stops sending actions for already-dead agents.
-   **Data Integrity**: Filtered stale dead-agent data before returning observations and rewards to RLlib, preventing mixed or invalid agent data from contaminating training batches.
-   **Verification**: Added focused staggered-death tests for `RayEnv` and `RayVecEnv` behavior, plus live Unreal/RLlib integration scripts.

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/pr1.png" alt="Fig 18. Merged Schola Pull Request" loading="lazy"><figcaption>Fig 18. Merged Schola Pull Request</figcaption></figure><figure class="project-media"><img src="/images/project1/pr2.png" alt="Fig 19. Schola PR Changes and Tests" loading="lazy"><figcaption>Fig 19. Schola PR Changes and Tests</figcaption></figure></div>

* * *

#### Problem 2: Loss of Relational Information Between Entities

<figure class="project-media"><img src="/images/project1/problem2.png" alt="Fig 20. Solving Entity Relation Loss through Attention Implementation" loading="lazy"><figcaption>Fig 20. Solving Entity Relation Loss through Attention Implementation</figcaption></figure>

Initially, I attempted to induce cooperation by designing a MAPPO-based team reward structure. However, defining the synergy between three distinct roles—Strike, Support, and Vanguard—as a single scalar reward proved ambiguous. This led to frequent reward hacking without producing meaningful cooperative behavior.

Problem 2 came from the gap between individual entity selection and team-level spatial context. Cross-Attention helped the Self Token select important allies, enemies, and objectives immediately before producing the 7-dimensional EQS action, but by itself it mainly answered "which entity matters to me?" rather than "what formation are these entities forming together?"

That limitation produced duplicated objective assignments: multiple agents could independently judge the same base as useful because each entity slot was encoded before seeing the other slots. The short Unreal evaluation quantified this failure mode. Across 24 episodes and 15,715 team-steps, realized objective coverage averaged **0.454**, the team covered only **2.27 of 5** objectives on average, and the busiest objective contained **3.36 agents** on average. The binary duplicate rate was almost always true, so coverage, unique-objective distribution, and max-cluster size became the more useful metrics.

* * *

#### Cause

In the 218-dim observation vector, each entity slot is first embedded independently through a linear encoder (`nn.Linear`). When a single Self Token then queries the entity set through Cross-Attention, the attention weights represent "how useful each entity is from the Self perspective."

However, because the Key/Value entity tokens have not yet referenced one another, **relative relationships between entities** (density, flanking patterns, overlap around the same point) are difficult to reflect directly in Cross-Attention weights. Cross-Attention can selectively aggregate the entity representations it receives, but it does not create relational representations between those entities by itself.

* * *

#### Goal

Enable the policy to use spatial context such as redundant placement, density, spread, and converging threats at the observation-encoding stage, without adding another ambiguous scalar cooperation reward.

* * *

#### Solution

**Intra-Set Self-Attention (Zambaldi et al., 2018)**

I inserted a **Self-Attention layer** for each entity group (Ally / Enemy / Point) prior to Cross-Attention, allowing entities to reference one another. Entity tokens processed through Self-Attention can carry contextual information such as "this ally is already near the same point as another ally" or "these enemies are converging toward the same point."

The Self Token then aggregates these **contextualized** entity representations during Cross-Attention, so the final EQS weights can reflect not only individual entity importance but also team placement and spatial patterns.

**policy.py — Relational Self-Attention pipeline**

```python
# 1. Linear Encoding: Raw features → Hidden dimension
a_enc = self.ally_enc(allies)                  # (B, 8, 64)

# 2. Self-Attention: Mutual reference between ally tokens
#    → Learns relations like "Slot 3 and Slot 5 are near the same point"
a_rel, _ = self.ally_self_attn(a_enc, a_enc, a_enc,
                                key_padding_mask=ally_mask)

# 3. Residual + LayerNorm: Preserve original info + Stability
a_enc = self.ally_ln(a_enc + a_rel)             # (B, 8, 64)

# 4. Cross-Attention: Self Token aggregates contextualized ally info
a_ctx, _ = self.ally_attn(q, a_enc, a_enc,
                          key_padding_mask=ally_mask)  # (B, 1, 64)
```

**Padding Mask Handling**: The C++ observation layout's `0=Valid, 1=Padding` mask is applied identically to both Self-Attention and Cross-Attention. A `_safe_mask()` function forces an unmask of Slot 0 if all slots are padded to prevent NaN. This is completed within the Python policy without requiring C++ modifications.

**policy.py — safe mask**

```python
def _safe_mask(m: torch.Tensor) -> torch.Tensor:
    all_masked = m.all(dim=1, keepdim=True)   # (B, 1)
    return m & ~all_masked                     # Unmask Slot 0 if all slots are padding
```

**Design Constraints & Trade-offs**

| Item | Value |
| --- | --- |
| Parameter Increase | 168K → 268K (+60%) |
| Inference Latency | < 2ms (0.7% of the 0.3s step budget) |
| ONNX Compatibility | opset 14 — No changes required for UE5 NNE |
| C++ Modification | None (reused padding mask layout) |

The empirical results are summarized above in **"Empirical Analysis of Attention Patterns"**. A controlled A/B ablation (a second model trained identically for 66 iterations with Self-Attention disabled) confirmed the contribution directly: Self-Attention raised objective coverage **0.318 → 0.454 (+43%)**, reduced the "all five agents on one objective" failure mode from **46.5% → 16%** of steps, and more than **doubled the win rate (0.125 → 0.292)** at near-equal reward—evidence that the encoder change improves team distribution rather than just relationship reading in isolation.

* * *

#### Problem 3: Timing Mismatch Between Step Speed and Agent Movement

In the training environment, `AGymConnectorManager::Tick()` called `Connector->Step()` every frame (60Hz+), causing the next step to execute before EQS-based movement was complete. This caused new EQS goals to overwrite existing ones, canceling movement and resulting in poor-quality training data where observations were collected before reaching targets.

* * *

#### Goal

Coordinate the step cycle with the agent's EQS movement completion time to ensure observations are collected only after the agent has reached its destination.

* * *

#### Solution

**Rationale for overriding `AGymConnectorManager`**

The entry point for Schola's training loop is structured as follows:

```
AGymConnectorManager::Tick()
    └─ UAbstractGymConnector::Step()           ← Single training step
            ├─ ResolveEnvironmentStateUpdate()  ← Receive action from Python (gRPC, ~10ms blocking)
            ├─ HandleStep() / HandleReset()     ← Apply action to environment
            └─ SubmitState()                    ← Send observation/reward to Python
```

`UAbstractGymConnector::Step()` processes a full cycle atomically, with `ResolveEnvironmentStateUpdate()` blocking for gRPC responses. Therefore, the **sole point to control step frequency** is `AGymConnectorManager::Tick()`, which calls `Step()`. I determined that step speed could be controlled externally by overriding `Tick()` without modifying the internal connector implementation.

* * *

**`ADEGymConnectorManager` Implementation**

I implemented a custom class `ADEGymConnectorManager` inheriting from `AGymConnectorManager`. Instead of the default behavior, I call `AActor::Tick()` directly and control the frequency of `Connector->Step()` using a `StepInterval` variable.

**ADEGymConnectorManager.h**

```cpp
// Step interval adjustable in Editor
UPROPERTY(EditAnywhere, Category = "Schola|Throttling",
    meta = (ClampMin = "0.01", ClampMax = "10.0"))
float StepInterval = 0.3f;  // Seconds, Default 2Hz
```

The `StepInterval = 0.3s` value was determined by profiling the minimum cycle required: EQS 48-sample query time (~5ms) + NavMesh path calculation (~2ms) + Agent travel time (~1s for 600cm at 600cm/s).

**ADEGymConnectorManager.cpp — Implementation of Tick throttling**

```cpp
void ADEGymConnectorManager::Tick(float DeltaTime)
{
    // Bypass AGymConnectorManager::Tick to prevent per-frame Step calls
    AActor::Tick(DeltaTime);

    if (!Connector) return;

    // Connection Phase: Step internally executes CheckForStart() without blocking
    if (Connector->IsNotStarted())
    {
        Connector->Step();
        return;
    }

    // Running Phase: Execute Step once per StepInterval
    if (Connector->IsRunning())
    {
        // Prevent burst steps caused by DeltaTime spikes when switching to background
        const float ClampedDelta = FMath::Min(DeltaTime, StepInterval);
        StepAccumulator += ClampedDelta;
        if (StepAccumulator >= StepInterval)
        {
            StepAccumulator = 0.0f;
            Connector->Step();
        }
    }
}
```

Implementation is finalized by changing the parent class of `BP_GymConnectorManager` to `ADEGymConnectorManager` in the Editor. The `StepInterval` can be tuned in the Details panel without requiring a rebuild.

* * *

#### Result

With `StepInterval = 0.3s`, training data quality improved as observations were collected after agents fully reached their EQS targets. Burst steps caused by `DeltaTime` spikes during editor background transitions were eliminated via `FMath::Min` clamping. This architecture allows for real-time balancing of training speed and movement completion rates through a single variable.

* * *

### Empirical Analysis of Attention Patterns

#### Key Finding

Self-Attention did not simply inflate reward. Its main contribution was helping the observation encoder read spatial relationships among allies, enemies, and objectives before the policy produced EQS weights. In the controlled A/B evaluation, adding Self-Attention raised objective coverage from **0.318 to 0.454 (+43%)**, reduced the whole-team-on-one-objective failure mode from **46.5% to 16.0%**, and improved the win rate against scripted AI from **0.125 to 0.292 (2.3x)**. Because the average episode reward stayed nearly equal, the improvement is best understood as a change in **how the team distributes across objectives**, not as a reward-scale artifact.

#### Validation Design

The analysis used three complementary checks. First, synthetic Python probes tested whether the Self-Attention and Cross-Attention encoder reacts to controlled formation changes. Second, a short Unreal evaluation measured how the deployed team actually distributed itself across objectives. Third, a Cross-only model with Self-Attention disabled was trained under the same conditions and evaluated with the same protocol, isolating the contribution of the Self-Attention block.

| Validation Item | Measured Result | Interpretation |
| --- | --- | --- |
| Padding mask | Maximum attention on padded slots = **0.000** | Invalid entity slots did not leak into attention computation. |
| Formation-change sensitivity | Ally Self-Attention DeltaMax: Vanguard 0.1086, Strike 0.0945, Support 0.0582. Enemy DeltaMax: Strike 0.1165. | Vanguard reacted more strongly to ally formation changes, while Strike reacted more strongly to enemy convergence. |
| Self-to-Cross propagation | Global Self-Cross consistency = 0.639; Vanguard = 0.917. Strike ally Cross TV shift = 0.1347. | Context changes formed by Self-Attention were carried into the final pre-action Cross-Attention distribution. |
| Duplicate-avoidance proxy | Strike Self-Attention gain = **+0.0178** on the crowded-objective avoidance proxy. | The duplicate-avoidance signal was clearest in Strike and was not a universal effect shared equally by every role. |
| Unreal behavior evaluation | Objective coverage = 0.454, mean unique objectives = 2.27/5, mean max-cluster size = 3.36 agents. | Some clustering remained in deployed play, but the A/B ablation showed that Self-Attention meaningfully reduced it. |

<figure class="project-media"><img src="/images/project1/attn_probe_metric_summary.png" alt="Attention probe metric summary" loading="lazy"><figcaption>Fig 25. Attention probe metric summary</figcaption></figure>

<figure class="project-media"><img src="/images/project1/unreal_eval_behavior_metrics.png" alt="Unreal evaluation behaviour metrics" loading="lazy"><figcaption>Fig 26. Unreal behavior evaluation metrics</figcaption></figure>

<figure class="project-media"><img src="/images/project1/unreal_eval_clustering_profile.png" alt="Unreal objective clustering profile" loading="lazy"><figcaption>Fig 27. Objective coverage and clustering profile</figcaption></figure>

#### A/B Ablation: Self-Attention On vs Off

I trained a Cross-only model with Self-Attention disabled (`USE_SELF_ATTN=0`) under the same map, scripted-AI tier, MAPPO configuration, and **66 training iterations / approximately 1.36M agent-steps** as the final Self+Cross model. Both checkpoints were evaluated with the same 24-episode, 8-environment protocol. Because the only architectural difference was the Self-Attention block, the gap below can be interpreted as the relational-encoding effect of the observation encoder.

| Metric (nearest-objective basis) | Cross-only | Self + Cross | Change |
| --- | --- | --- | --- |
| Objective coverage | 0.318 | **0.454** | **+0.136 (+43%)** |
| Mean unique objectives (of 5) | 1.59 | **2.27** | **+0.68** |
| Max-cluster size (lower is better) | 4.10 | **3.36** | **\-0.74 agents** |
| Steps with all 5 agents on one objective | 46.5% | **16.0%** | **\-30.5 pp** |
| Coverage trend (early to late episode) | 0.28 to 0.32 (flat) | 0.36 to 0.52 (rising) | Improved spreading over the episode |
| Win rate vs scripted AI | 0.125 (3/24) | **0.292 (7/24)** | **+0.167 (2.3x)** |
| Mean episode reward | 152.7 | 148.9 | \-3.8 (nearly equal) |

<figure class="project-media"><img src="/images/project1/attn_ab_self_attn_effect.png" alt="Trained A/B ablation: Cross-only vs Self+Cross — Self-Attention effect" loading="lazy"><figcaption>Fig 28. Trained A/B ablation: adding Self-Attention raises objective coverage, reduces pile-up, and more than doubles win rate.</figcaption></figure>

<figure class="project-media"><img src="/images/project1/attn_ab_clustering_comparison.png" alt="A/B clustering comparison: unique-objective distribution and coverage over episode progress" loading="lazy"><figcaption>Fig 29. Unique-objective distribution and coverage progression before and after Self-Attention.</figcaption></figure>

#### Attention Weight Visual Analysis

I directly extracted attention weights from the trained checkpoint to verify whether the Self-Attention to Cross-Attention pipeline was connected as intended. Two scenarios were fed into the same policy: **Clustered**, where four allies are concentrated within one objective radius, and **Spread**, where four allies are distributed across different corners of the map. Across all roles and scenarios, padded slots 4-7 were suppressed to 0.00.

#### Self-Attention: Capturing Spatial Relationships Between Entities

Self-Attention allows entity tokens to reference one another before Cross-Attention. The important point is that the encoder does not only read each ally, enemy, or objective independently; it also reflects **relationships between entities**, such as density and formation changes, in the token representations.

| Role | Formation Sensitivity | Key Observation |
| --- | --- | --- |
| **Strike** | Medium (DeltaMax approximately 0.19) | In Clustered, it referenced the four ally slots relatively evenly; in Spread, it concentrated on Assault slot 1. |
| **Support** | Low (DeltaMax approximately 0.06) | It kept a near-even distribution across slots regardless of formation, matching the healer role's need to monitor the full team. |
| **Vanguard** | High (DeltaMax approximately 0.29) | Its focus moved from slot 3 in Clustered to slot 1 in Spread, making the frontline anchor role the most sensitive to team-position changes. |

<figure class="project-media"><img src="/images/project1/attn_comparison_strike.png" alt="Fig 30. STRIKE Self-Attention, Clustered vs Spread vs Difference" loading="lazy"><figcaption>Fig 30. STRIKE Self-Attention, Clustered vs Spread vs Difference</figcaption></figure>

<figure class="project-media"><img src="/images/project1/attn_comparison_support.png" alt="Fig 31. SUPPORT Self-Attention, Clustered vs Spread vs Difference" loading="lazy"><figcaption>Fig 31. SUPPORT Self-Attention, Clustered vs Spread vs Difference</figcaption></figure>

<figure class="project-media"><img src="/images/project1/attn_comparison_vanguard.png" alt="Fig 32. VANGUARD Self-Attention, Clustered vs Spread vs Difference" loading="lazy"><figcaption>Fig 32. VANGUARD Self-Attention, Clustered vs Spread vs Difference</figcaption></figure>

#### Cross-Attention: Final Information Aggregation Before Action

Cross-Attention uses the Self Token as the Query and looks up ally, enemy, and objective tokens. Because its output flows into the EQS weight action, it reveals which information the agent used immediately before acting. Enemy slots were treated as nearly equal threats across roles, objective slots showed role-specific priorities, and ally slots were used to test whether the Self-Attention focus remained consistent in the final aggregation stage.

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/attn_cross_strike_clustered.png" alt="Fig 33. STRIKE Cross-Attention, Clustered" loading="lazy"><figcaption>Fig 33. STRIKE Cross-Attention, Clustered</figcaption></figure><figure class="project-media"><img src="/images/project1/attn_cross_strike_spread.png" alt="Fig 34. STRIKE Cross-Attention, Spread" loading="lazy"><figcaption>Fig 34. STRIKE Cross-Attention, Spread</figcaption></figure></div>

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/attn_cross_vanguard_clustered.png" alt="Fig 35. VANGUARD Cross-Attention, Clustered" loading="lazy"><figcaption>Fig 35. VANGUARD Cross-Attention, Clustered</figcaption></figure><figure class="project-media"><img src="/images/project1/attn_cross_vanguard_spread.png" alt="Fig 36. VANGUARD Cross-Attention, Spread" loading="lazy"><figcaption>Fig 36. VANGUARD Cross-Attention, Spread</figcaption></figure></div>

<div class="project-media-grid"><figure class="project-media"><img src="/images/project1/attn_cross_support_clustered.png" alt="Fig 37. SUPPORT Cross-Attention, Clustered" loading="lazy"><figcaption>Fig 37. SUPPORT Cross-Attention, Clustered</figcaption></figure><figure class="project-media"><img src="/images/project1/attn_cross_support_spread.png" alt="Fig 38. SUPPORT Cross-Attention, Spread" loading="lazy"><figcaption>Fig 38. SUPPORT Cross-Attention, Spread</figcaption></figure></div>

The clearest case is Vanguard. In Clustered, both Self-Attention and Cross-Attention strongly referenced slot 3. In Spread, both stages shifted focus to slot 1. This shows that Cross-Attention consistently used the contextualized representations produced by Self-Attention immediately before action selection.

#### Interpretation Scope

This is encoder-level evidence that Self-Attention gives the policy measurable access to spatial relationships. The roles themselves were still shaped by role-specific policies and reward functions, so this should not be read as attention alone creating perfect cooperation or spontaneous role emergence. The current evidence is also based on one evaluation session per model, so multi-seed validation remains future work.

* * *

### Results

#### Training Results

Performed MAPPO-based training against Scripted AI over 2.5 million timesteps.

<figure class="project-media"><img src="/images/project1/result_reward.png" alt="Fig 21. Reward" loading="lazy"><figcaption>Fig 21. Reward</figcaption></figure>

<figure class="project-media"><img src="/images/project1/result_vf.png" alt="Fig 22. VF Explained" loading="lazy"><figcaption>Fig 22. VF Explained</figcaption></figure>

<figure class="project-media"><img src="/images/project1/result_entropy.png" alt="Fig 23. Entropy" loading="lazy"><figcaption>Fig 23. Entropy</figcaption></figure>

#### Key Metrics Summary

| Metric | Value | Meaning |
| --- | --- | --- |
| **episode\_mean** | 0 → 40, Converged at 14 | Successful policy improvement |
| **vf/explained\_var** | \> 0.8 | Critic explains >80% of future rewards — High state-value prediction accuracy |
| **entropy** | Initial rise then falling | Confirmed transition from exploration to exploitation |

**Termination Rationale:** Training was concluded at 2.5M steps as the learning rate scheduler reached zero and the reward hit a plateau.

* * *

#### Win Rate

The win rate against Scripted AI increased from an initial 0% to around 70%. The intermediate drop in win rate was a temporary phenomenon caused by the increase in the Scripted AI's tier; as the win rate subsequently recovered, it was confirmed that the RL agent had successfully learned the game rules.

<figure class="project-media"><img src="/images/project1/win_rate.png" alt="Fig 24. win rate" loading="lazy"><figcaption>Fig 24. win rate</figcaption></figure>

* * *

#### Miscellaneous Trials & Errors

**1\. Redefining RL Action Space: From Low-level Control to Strategic Positioning**

Initially, I attempted to directly control **low-level actions** such as movement direction, speed, and aiming via Reinforcement Learning. However, local experiments revealed that the number of samples required for convergence was unattainable within a realistic training timeframe.

To resolve this, I delegated low-level behaviors to Unreal Engine's existing **Navigation and EQS (Environment Query System)** and pivoted the RL agent’s role to focus solely on **strategic positioning**. Specifically, I defined a **7-dimensional weight vector** for EQS queries as the RL policy output. This allowed the policy to decide "where to be," while delegating the execution of movement to the UE5 system, leading to successful convergence.

**2\. Self-Play: Policy Collapse in Complex Environments**

Inspired by MuZero, I initially attempted training via **Self-Play**. However, given the high environmental complexity—characterized by heterogeneous roles (**Strike, Support, Vanguard**), fluctuating agent counts, and dynamic objective states—the rewards failed to converge. Instead, the agents suffered from repeated **policy collapse** as both sides attempted to evolve simultaneously.

I concluded that while Self-Play excels in environments with lower complexity and well-defined action spaces (e.g., Go or Chess), applying it to environments with heterogeneous agents and dynamic goals requires additional stabilization techniques, such as **Curriculum Self-Play** or **League Training**.

* * *

#### Future Plans

**Implementing Difficulty Tiers for RL Agents**

-   I plan to experiment with various methods to implement agent difficulty levels (e.g., adjusting total training time vs. applying **Temperature** scaling to the output distribution).
-   I will investigate whether to train separate models for each difficulty level or to utilize a single model conditioned on **difficulty-specific parameters**.

**Distributed Training via Multi-EC2 Instances on AWS**

-   Currently, training is conducted on a single EC2 instance running four UE5 environments simultaneously.
-   I aim to establish a **distributed training environment** utilizing multiple EC2 instances and **Ray clusters** to scale the learning process.
