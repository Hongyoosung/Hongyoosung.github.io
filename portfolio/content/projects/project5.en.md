* * *

### Overview

**V-CORE** is an **AI agent-based simulation control platform** for validating industrial operation strategies inside an Unreal Engine 5 digital twin. Users can enter natural-language requests such as "How many AGVs should we deploy?" or "Find the optimal AGV count with a bottleneck rate below 5%." The system then automates the full flow through LangGraph-based agent routing, local LLM tool calling, a validation layer, and a UE5 command proxy, all the way to simulation execution and KPI reporting.

The core goal is to control and observe process status through **Pixel Streaming 2 and a web dashboard**, without requiring every user machine to run a heavy UE5 environment locally. At the same time, the project optimizes an on-premise LLM for the target operating environment and improves tool-routing stability through prompt-distilled SFT.

* * *

### Technical Stack

| Category | Technologies |
| --- | --- |
| **Simulation Engine** | Unreal Engine 5.7, C++, UE5 StateTree, Pixel Streaming 2 |
| **Agent Orchestration** | LangGraph, Tool Calling, Tool Routing, State Management |
| **Backend** | FastAPI, SSE, WebSocket, UE5 Command Proxy |
| **Frontend** | React, Web Dashboard, Simulation Studio |
| **Data / Infra** | Firebase RTDB, PostgreSQL, Docker, Perforce |
| **Local LLM** | Qwen3.5-2B, llama.cpp, Ollama, QLoRA, GGUF(q4\_k\_m) |

* * *

### Key Features

#### 1\. LangGraph-Based Simulation Control Agent

**“A two-stage agent pipeline from chat input to UE5 process control”**

-   **Stage 1 Route Classification**: User requests are classified into six routes: `robot_command`, `process_status`, `station_action_query`, `compare_runs`, `optimize_agv_count`, and `general_chat`. The LLM classifier is combined with keyword fallback logic so structured requests can be handled more reliably.
-   **Stage 2 Tool Planning**: In the `robot_command` route, the agent selects one of nine typed tools. Commands such as starting, stopping, pausing, changing simulation speed, executing a specific station task, and canceling commands are passed to the UE5 Command Client.
-   **Progress Streaming**: Intermediate plans such as "analyze - confirm settings - deploy AGVs" are exposed to the user, while UE5 telemetry and completion events are converted into KPI summaries by the ReportAgent.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/agent_layer1.png" alt="Agent routing graph" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 2. LangGraph-based route classification and control flow</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/agent_layer2.png" alt="Tool planning graph" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 3. Two-stage Tool Planning for the robot_command route</figcaption></figure></div>

* * *

#### 2\. KPI-Based Process Evaluation and Simulation Studio

Simulation results are structured as operational decision metrics rather than simple logs. The system calculates throughput, average wait time, collision count, uptime, bottleneck rate, and active AGV count. When the user provides acceptance criteria, it derives PASS/FAIL results and an overall verdict.

| KPI | Definition |
| --- | --- |
| **throughput** | Number of completed Load-to-Unload transport cycles per hour |
| **avg\_wait\_time** | Average time an AGV waits at an intersection or station |
| **collision\_risk / count** | Accumulated AGV proximity or collision events during a run |
| **uptime** | Ratio of total time during which AGVs are actually working |
| **bottleneck\_rate** | Ratio of hot cells with peak density above 60% in the congestion heatmap |
| **active\_agvs** | Number of AGVs currently operating |

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulation_studio.png" alt="Simulation Studio" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 4. Simulation Studio for scenario lists, run history, and KPI results</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/congestion_heatmap.png" alt="Congestion heatmap" class="max-w-md rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 5. Congestion heatmap based on AGV position sampling</figcaption></figure></div>

* * *

#### 3\. Basic Simulation Execution

A single imperative request such as "Run a simulation with 3 AGVs at 2x speed" is converted into an immediately executable Tool Call in the `robot_command` route. The agent structures the AGV count and speed multiplier, the Validation Layer checks the allowed range, and the UE5 Command Proxy receives the simulation start command.

-   **Command Parsing**: Extracts `agv_count=3` and `speed_multiplier=2` from natural language.
-   **Execution Validation**: Checks the current process state and the deployable AGV range before forwarding only safe commands.
-   **Execution Feedback**: Displays the start result and initial telemetry in the web dashboard, allowing the user to immediately confirm simulation progress.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/simulation_optionA.png" alt="Run simulation with 3 AGVs at 2x speed" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 6. Example A: running a simulation with 3 AGVs at 2x speed</figcaption></figure>

<div class="gif-grid-container" style="grid-template-columns:50% 50%;margin-top:0;padding-top:0"><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionA-start-ezgif.com-video-to-gif-converter.gif" alt="Start simulation with 3 AGVs at 2x speed" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionA-agv-ezgif.com-video-to-gif-converter.gif" alt="AGV driving scene during the 3-AGV simulation" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div></div>

* * *

#### 4\. Agentic Loop-Based AGV Count Optimization

A goal-seeking request such as "Find the optimal AGV count with a bottleneck rate below 5%" does not end with a single Tool Call. V-CORE first identifies the request as an optimization task, parses the target metric, queries the feasible AGV upper bound from the UE5 state, and then runs an **observe - judge - decide - re-run** closed loop.

-   **Goal Parsing**: Structures "bottleneck rate ≤ 5%" into a metric, comparator, and threshold.
-   **Candidate Runs**: Calculates KPI values and bottleneck rates for each candidate AGV count, then stores the run history.
-   **Result Selection**: Selects the AGV count with the strongest processing margin among candidates that satisfy the target, and returns the full attempt history as a natural-language report.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/simulation_optionB.png" alt="Goal-seeking simulation" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 7. Example B: searching for an AGV count based on bottleneck rate</figcaption></figure>

<div class="gif-grid-container" style="grid-template-columns:50% 50%;margin-top:0;padding-top:0"><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionB-start-ezgif.com-video-to-gif-converter.gif" alt="Start goal-seeking simulation" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionB-loop-ezgif.com-video-to-gif-converter.gif" alt="Repeated goal-seeking simulation runs" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionB-success-ezgif.com-video-to-gif-converter.gif" alt="Successful goal-seeking result" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div></div>

* * *

#### 5\. Simulation Status, Termination, and Result Reporting

V-CORE continues to handle follow-up requests in the same conversational flow after a simulation begins. "Tell me the current status" maps to a real-time telemetry summary, "Stop the simulation" maps to a termination command and state check, and "Report the result" maps to a KPI-based natural-language report.

-   **Status Reporting**: Summarizes AGV positions, uptime, throughput, and wait states collected through Firebase RTDB and SSE.
-   **Simulation Termination**: Safely stops the active UE5 run and confirms the terminal state for the user.
-   **Result Reporting**: Generates a natural-language report with KPIs, acceptance judgment, bottleneck sections, and improvement suggestions for the completed run.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/process_status_terminate.png" alt="Simulation status and termination screen" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 8. Processing simulation status reports and termination commands</figcaption></figure>

<div class="gif-grid-container" style="grid-template-columns:50% 50%;margin-top:0;padding-top:0"><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-status-ezgif.com-video-to-gif-converter.gif" alt="Simulation status report" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-termination-ezgif.com-video-to-gif-converter.gif" alt="Simulation termination flow" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div><div class="gif-item" style="line-height:0"><img src="/gifs/project5/simulation-optionA-result-ezgif.com-video-to-gif-converter.gif" alt="Simulation result report" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"></div></div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulation_optionA_result-1.png" alt="Simulation result report summary" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 9. Summary of a basic simulation result report</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/simulation_optionA_result-2.png" alt="Detailed simulation result KPIs" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 10. Detailed result view with KPIs and improvement points</figcaption></figure></div>

* * *

#### 6\. UE5 StateTree-Based AGV Behavior Design

I chose StateTree over Behavior Tree for AGV behavior because it better matches this domain. Each AGV moves along predefined splines, and states such as `pick_up` and `drop_off` have clear transition conditions. Instead of complex navigation calculations, Pawn-based Transition Update logic is defined as StateTree Tasks, making simulation requirements easier to express directly.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/statetree1.png" alt="Full AGV StateTree structure" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 11. UE5 StateTree structure representing AGV behavior</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/statetree2.png" alt="Detailed AGV StateTree" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 12. Station arrival and work-state transition logic</figcaption></figure></div>

* * *

### Technical Problem Solving

#### 1\. LLM Output Instability and the Validation Layer

-   **Problem**: Small local LLMs can generate incorrect tool names, JSON structures, required arguments, or range values. Passing LLM responses directly to UE5 could execute unsafe or invalid process commands.
-   **Solution**: I built a Validation Layer that includes JSON extraction, schema validation, range validation, limited repair retries, safe decline handling, and rule-based fallback. Only executable commands are forwarded to the UE5 Command Client, while ambiguous or risky requests are clarified or rejected.
-   **Result**: The system separates LLM output failures from execution failures, and the benchmark structure can measure the validation layer's actual contribution and side effects through ablation.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/tool_success.png" alt="Tool routing success rate" class="max-w-md rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 13. Tool selection schema and terminal-state validation</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/ablation_matrix.png" alt="Validation ablation matrix" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 14. Ablation results by provider and Validation Layer combination</figcaption></figure></div>

#### 2\. On-Premise LLM Serving Engine Selection

-   **Problem**: In an environment without external APIs, natural-language commands had to be converted into structured outputs that match nine real tool contracts. The evaluation needed to cover not only latency, but also JSON stability, argument accuracy, Korean and English request handling, and interaction with the validation layer.
-   **Solution**: I compared Ollama and a llama.cpp CUDA build under the same benchmark. The evaluation used 133 labeled cases, 12 categories, 4 experiment groups, and 5 repetitions per case, for a total of 2,660 scored runs with Wilson 95% confidence intervals.
-   **Result**: With reasoning disabled and the CUDA-based llama.cpp path, inference latency decreased from about 11.7 seconds to about 2.4 seconds, helping identify the serving path better suited to the operational domain.

#### 3\. Prompt-Distilled SFT Router

-   **Problem**: The initial production setup relied on long, carefully written system prompts to compensate for weak disambiguation performance. Every tool addition required prompt edits, and the growing context increased inference cost.
-   **Solution**: I trained a QLoRA SFT model based on Qwen3.5-2B to distill prompt-based tool-routing rules into model weights. The dataset was split into Train 300 / Val 50 / Test 100, and every label was verified through the live `ToolRouter.validate` path.
-   **Result**: When the long production prompt was removed, the base model's tool-routing success rate dropped from 49% to 12%. The SFT model reached 96% with only a four-line minimal prompt. Detailed metrics also improved: disambiguation from 30% to 95%, KPI acceptance from 50% to 100%, and invalid/missing parameter decline from 0% to 100%.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/sft_heldout.png" alt="Prompt-distilled SFT held-out evaluation" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans">Fig 15. Held-out evaluation results for Base + Minimal, Base + Full, and SFT + Minimal conditions</figcaption></figure>

#### 4\. Adapter Toggle-Based Single Endpoint Deployment

-   **Problem**: Separating a routing-only SFT model from a base model for general chat and reporting exceeded the 8GB VRAM budget. Using only the SFT model for general reporting and chat also caused repetitive output and language leakage issues.
-   **Solution**: I used llama.cpp's LoRA adapter on/off capability to keep a single base model resident. The adapter scale is set to 1.0 only for routing requests and 0.0 for chat, report, and planning requests, preserving role separation without loading two full models.
-   **Result**: The resident model structure was reduced to `one base model + a small LoRA adapter`. The routing path reached 99.4%, the chat/report path had 0 observed defects, and 32 backend unit tests passed.

* * *

### Results

-   **Automated UE5 Digital Twin Control**: Connected chat input, command routing, UE5 simulation execution, real-time telemetry, a web dashboard, and pass/fail reporting.
-   **Optimized Local LLM Operation**: Performed on-premise tool planning without external hosted LLM APIs, reducing latency through a llama.cpp CUDA build and reasoning-off configuration.
-   **Improved Tool-Routing Performance**: Achieved a 96% tool-routing success rate under a four-line minimal prompt condition through prompt-distilled QLoRA SFT.
-   **Real-Time Process Observation**: Visualized AGV uptime, throughput, collision risk, and congestion heatmaps in the web UI through Firebase RTDB and SSE.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulationresult_success.png" alt="Successful simulation result" class="max-w-sm rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 16. Successful result that satisfies acceptance criteria</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/simulationresult_fail.png" alt="Failed simulation result" class="max-w-sm rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 17. Failure judgment caused by unmet criteria or collision risk</figcaption></figure></div>

* * *

### Limitations

-   **Limited Scope of the Routing-Only SFT Model**: The SFT model is strong at tool routing, but not well suited for general conversation or report generation, so roles are separated through adapter toggling.
-   **Need for Multi-User Validation**: Adapter toggling worked well in a single-user environment, but concurrent multi-user request handling still requires additional validation.
-   **Dependency on a Fixed Tool Set**: The current SFT model is optimized for the tool schema used during training, so tool additions or schema changes require retraining or a more general routing-rule learning strategy.
-   **Incomplete MLOps Automation**: Model version management, automated evaluation, and deployment tracking need to be systematized further.
