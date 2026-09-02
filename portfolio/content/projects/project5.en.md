* * *

### Overview

**Virtual Factory Simulation using AI agents** is a **simulation control platform** for validating industrial operating strategies in an Unreal Engine 5 digital twin. Users enter natural-language requests such as "How many AGVs should we deploy?" or "Find the optimal number of AGVs with a bottleneck rate below 5%." The system automates the entire workflow—from LangGraph-based agent routing, local LLM tool calling, a validation layer, and a UE5 command proxy to actual simulation execution and KPI reporting. It also combines multilingual Vector RAG with a typed graph to connect operating procedures, real-time equipment status, and historical run KPIs in traceable, source-backed answers.

The primary goal is to let users control and observe process status through **Pixel Streaming 2 and a web dashboard** without requiring a heavy UE5 runtime on their own PCs. At the same time, the project optimizes an on-premise LLM for the operating environment and improves tool-routing stability through prompt-distilled SFT.

* * *

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Simulation Engine** | Unreal Engine 5.7, C++, UE5 StateTree, Pixel Streaming 2 |
| **Agent Orchestration** | LangGraph, Tool Calling, Tool Routing, State Management |
| **Backend** | FastAPI, SSE, WebSocket, UE5 Command Proxy |
| **Frontend** | React, Web Dashboard, Simulation Studio |
| **Knowledge / RAG** | Qdrant, bge-m3 (1024-dim), Multilingual Vector RAG, Hybrid GraphRAG, Vector/Lexical Reranking |
| **Data / Infra** | Firebase RTDB, PostgreSQL, Qdrant Managed Cloud (GCP), Docker, Perforce |
| **Local AI** | Qwen3.5-2B, llama.cpp, Ollama, QLoRA, GGUF(q4\_k\_m), OpenAI-compatible Embeddings API |

* * *

## Key Features

### 1\. LangGraph-Based Simulation Control Agent

**“A two-stage agent pipeline from chat input to UE5 process control”**

-   **Stage 1 — Route Classification**: User requests are classified into six routes: `robot_command`, `process_status`, `station_action_query`, `compare_runs`, `optimize_agv_count`, and `general_chat / retrieve`. Combining an LLM classifier with keyword fallback makes structured requests more reliable.
-   **Stage 2 — Tool Planning**: In the `robot_command` route, the agent selects one of nine typed tools. Commands for starting, stopping, pausing, changing simulation speed, executing a specific station task, and canceling commands are passed to the UE5 Command Client.
-   **Progress Streaming**: Intermediate plans such as "analyze - confirm settings - deploy AGVs" are exposed to the user, while the ReportAgent converts UE5 telemetry and completion events into KPI summaries.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/agent_layer1.png" alt="Agent routing graph" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 1. LangGraph-based route classification and control flow</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/agent_layer2.png" alt="Tool planning graph" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 2. Two-stage Tool Planning for the robot_command route</figcaption></figure></div>

<br/>

* * *

### 2\. KPI-Based Process Evaluation and Simulation Studio

Simulation results are structured as metrics for operational decisions rather than simple logs. The system calculates throughput, average wait time, collision count, uptime, bottleneck rate, and active AGV count. When the user provides acceptance criteria, it derives PASS/FAIL results and an overall verdict.

| KPI | Definition |
| --- | --- |
| **throughput** | Number of completed Load-to-Unload transport cycles per hour |
| **avg\_wait\_time** | Average time an AGV waits at an intersection or station |
| **collision\_risk / count** | Accumulated AGV proximity or collision events during a run |
| **uptime** | Ratio of total time during which AGVs are actually working |
| **bottleneck\_rate** | Ratio of hot cells with peak density of 60% or higher in the congestion heatmap |
| **active\_agvs** | Number of AGVs currently operating |

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulation_studio.png" alt="Simulation Studio" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 3. Simulation Studio for scenario lists, run history, and KPI results</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/congestion_heatmap.png" alt="Congestion heatmap" class="max-w-md rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 4. Congestion heatmap based on AGV position sampling</figcaption></figure></div>

<br/>

* * *

### 3\. Basic Simulation Execution

A single imperative request such as "Run a simulation with 3 AGVs at 2x speed" is converted into an immediately executable Tool Call in the `robot_command` route. The agent structures the AGV count and speed multiplier, the Validation Layer checks the allowed range, and the UE5 Command Proxy receives the simulation start command.

-   **Command Parsing**: Extracts `agv_count=3` and `speed_multiplier=2` from natural language.
-   **Execution Validation**: Checks the current process state and deployable AGV range before forwarding only safe commands.
-   **Execution Feedback**: Displays the start result and initial telemetry in the web dashboard, allowing users to confirm simulation progress immediately.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/simulation_optionA.png" alt="Run simulation with 3 AGVs at 2x speed" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 5. Example A: running a simulation with 3 AGVs at 2x speed</figcaption></figure>

<div class="gif-grid-container" style="grid-template-columns:50% 50%;margin-top:0;padding-top:0"><figure class="gif-item"><img src="/gifs/project5/simulation-optionA-start-ezgif.com-video-to-gif-converter.gif" alt="Start simulation with 3 AGVs at 2x speed" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Starting a basic simulation after specifying the AGV count and execution speed</figcaption></figure><figure class="gif-item"><img src="/gifs/project5/simulation-optionA-agv-ezgif.com-video-to-gif-converter.gif" alt="AGV driving scene during the 3-AGV simulation" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Live view of three AGVs moving along the configured process routes</figcaption></figure></div>

<br/>

* * *

### 4\. Agentic Loop-Based AGV Count Optimization

A goal-seeking request such as "Find the optimal number of AGVs with a bottleneck rate below 5%" does not end with a single Tool Call. The system first identifies the optimization request, parses its target metric, queries the feasible AGV upper bound from the UE5 state, and then runs an **observe - judge - decide - re-run** closed loop.

-   **Goal Parsing**: Structures "bottleneck rate ≤ 5%" into a metric, comparator, and threshold.
-   **Candidate Runs**: Calculates KPIs and bottleneck rates for each candidate AGV count, then stores the run history.
-   **Result Selection**: Selects the AGV count with the greatest processing margin among candidates that satisfy the target, and returns the full attempt history as an English-language report.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulation_optionB.png" alt="Goal-seeking simulation" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 6. Example B: searching for an AGV count based on bottleneck rate</figcaption></figure><div class="gif-grid-container" style="grid-template-columns:100%;margin:0;padding:0"><figure class="gif-item"><img src="/gifs/project5/simulation-optionB-start-ezgif.com-video-to-gif-converter.gif" alt="Start goal-seeking simulation" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Starting the search for an optimal AGV count from a target bottleneck rate</figcaption></figure><figure class="gif-item"><img src="/gifs/project5/simulation-optionB-loop-ezgif.com-video-to-gif-converter.gif" alt="Repeated goal-seeking simulation runs" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Repeating simulations while adjusting the AGV count until the target is met</figcaption></figure><figure class="gif-item"><img src="/gifs/project5/simulation-optionB-success-ezgif.com-video-to-gif-converter.gif" alt="Successful goal-seeking result" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Final result after finding an AGV count that satisfies the target rate</figcaption></figure></div></div>

<br/>

* * *

### 5\. Simulation Status, Termination, and Result Reporting

The platform continues to handle follow-up requests in the same conversational flow after a simulation begins. "Tell me the current status" maps to a real-time telemetry summary, "Stop the simulation" maps to a termination command and state check, and "Report the result" maps to a KPI-based natural-language report.

-   **Status Reporting**: Summarizes AGV positions, uptime, throughput, and wait states collected through Firebase RTDB and SSE.
-   **Simulation Termination**: Safely stops the active UE5 run and confirms its terminal state for the user.
-   **Result Reporting**: Generates an English-language report with KPIs, acceptance judgment, bottleneck sections, and improvement suggestions for the completed run.

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/process_status_terminate.png" alt="Simulation status and termination screen" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 7. Processing simulation status reports and termination commands</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/simulation_optionA_result-1.png" alt="Simulation result report summary" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 8. Summary of a basic simulation result report</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/simulation_optionA_result-2.png" alt="Detailed simulation result KPIs" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 9. Detailed result view with KPIs and improvement points</figcaption></figure></div>

<div class="gif-grid-container" style="grid-template-columns:100%;margin-top:0;padding-top:0"><figure class="gif-item"><img src="/gifs/project5/simulation-status-ezgif.com-video-to-gif-converter.gif" alt="Simulation status report" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Checking the real-time progress and key metrics of a running simulation</figcaption></figure><figure class="gif-item"><img src="/gifs/project5/simulation-termination-ezgif.com-video-to-gif-converter.gif" alt="Simulation termination flow" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Validating a natural-language stop command and safely terminating the active simulation</figcaption></figure><figure class="gif-item"><img src="/gifs/project5/simulation-optionA-result-ezgif.com-video-to-gif-converter.gif" alt="Simulation result report" loading="lazy" style="display:block;margin:0 auto" class="modal-trigger cursor-pointer"><figcaption class="gif-caption">Reviewing a result report that summarizes the completed simulation's KPIs and improvement points</figcaption></figure></div>

<br/>

* * *

### 6\. UE5 StateTree-Based AGV Behavior Design

I determined that StateTree was a better fit for AGV behavior than Behavior Tree. Each AGV moves along a predefined spline, and states such as `pick_up` and `drop_off` have clear transition conditions. Instead of complex navigation calculations, Pawn-based Transition Update logic is defined as StateTree Tasks, making simulation requirements easier to express directly.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/statetree1.png" alt="Full AGV StateTree structure" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 10. UE5 StateTree structure representing AGV behavior</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/statetree2.png" alt="Detailed AGV StateTree" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 11. Station arrival and work-state transition logic</figcaption></figure></div>

<br/>

* * *

### 7\. Hybrid Graph RAG for Complex Operational Queries

Complex questions such as "Which stations are currently operational, and what is the latest bottleneck rate for each?" require joining entity relationships with the latest KPIs. Flat similarity search in conventional vector RAG produced poor retrieval quality for these queries. However, forcing every query through Graph RAG also reduced speed and degraded SOP search quality.
I therefore adopted Hybrid Graph RAG, which selects a retrieval path based on the nature of the query. If LangGraph's classify node identifies a relational query, it routes the request to the graph; all other free-text requests follow the existing vector path. Both paths pass their results to the retrieve node.

-   **Typed Multi-Hop Projection**: The ontology graph connects `Cell -> Zone -> Station -> Capability` (operational capability) and `Cell -> Run -> Kpi` (latest run metrics). A single traversal can therefore extract operational stations by zone, their readiness/accessibility, and the `bottleneck_rate` from the latest stored run.
-   **Per-Zone KPI Attribution by Station**: Instead of reporting a single cell-global bottleneck rate as evidence, the system attaches the per-zone bottleneck rate (`latest_zone_metric`) calculated from each run's `zone_heatmap` to each station line. Stations in different zones receive their own bottleneck rates, while the cell-global value remains available as a labeled fallback.
-   **Hybrid Routing and the Knowledge Boundary**: `is_relational_query` distinguishes query types. Relational questions follow the graph path, while free-text SOP and specification questions follow the vector path (`bge-m3`, 1024 dimensions + Qdrant cosine). Routing is handled inside the `HybridGraphKnowledgeGateway` adapter behind the domain's `KnowledgeGateway` port, so LangGraph exposes only a single `retrieve` node.
-   **Memoized Graph Projection**: Rather than rebuilding the typed graph for every relational query, the system memoizes it using a content fingerprint of `(stations, runs)`. The graph is rebuilt only when state changes, and multiple queries against the same state share the cached graph.


<figure class="flex flex-col items-center my-8"><img src="/images/project5/graphrag-sequence.png" alt="Hybrid conditional routing in GraphRAG" class="max-w-md rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 12. Hybrid conditional routing in GraphRAG</figcaption></figure>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/graphrag-chat1.png" alt="Complex operational query input" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 13. Complex query entered through chat</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/graphrag-chat2.png" alt="GraphRAG response" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 14. Result returned through GraphRAG</figcaption></figure></div>

<br/>

* * *

### 8\. Google Cloud VM-Based Remote Service Deployment

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/cloud.png" alt="Streaming service architecture through a Cloud VM" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 15. Streaming service architecture through a Cloud VM</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/domain.png" alt="Domain deployment" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 16. Domain deployment</figcaption></figure></div>

Only Pixel Streaming's Signalling/Player and TURN relay layers were deployed on the Google Cloud VM; UE5, which performs GPU rendering, and the web/LLM backend ran on a local workstation. The production web service was exposed on a domain through Cloudflare Tunnel, while UE5 streamed video to the cloud Signalling Server over an outbound WebSocket connection.




* * *

## Problem Solving

### 1\. LLM Output Instability and the Validation Layer

#### Problem

Small local LLMs can generate incorrect tool names, JSON structures, required arguments, or range values. Passing LLM responses directly to UE5 could execute unsafe or invalid process commands.

#### Solution

I built a Validation Layer that includes JSON extraction, schema validation, range validation, limited repair retries, safe decline handling, and rule-based fallback. Only executable commands are forwarded to the UE5 Command Client, while ambiguous or risky requests are clarified or rejected.

#### Result

The system separates LLM output failures from execution failures, and its benchmark can measure the validation layer's actual contribution and side effects through ablation.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/tool_success.png" alt="Tool routing success rate" class="max-w-md rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 15. Tool selection schema and end-to-end state validation</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/ablation_matrix.png" alt="Validation ablation matrix" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 16. Ablation results by provider and Validation Layer combination</figcaption></figure></div>

<br/>

* * *

### 2\. On-Premise LLM Serving Engine Selection

#### Problem

In an environment without external APIs, natural-language commands had to be converted into structured outputs that match nine real tool contracts. The evaluation needed to cover not only latency, but also JSON stability, argument accuracy, Korean and English request handling, and interaction with the validation layer.

#### Solution

I compared Ollama and a llama.cpp CUDA build under the same benchmark. The evaluation used 133 labeled cases, 12 categories, 4 experiment groups, and 5 repetitions per case, for a total of 2,660 scored runs with Wilson 95% confidence intervals.

#### Result

With reasoning disabled and the CUDA-based llama.cpp path, inference latency decreased from about 11.7 seconds to about 2.4 seconds, helping identify the serving path better suited to the operational domain.

<br/>

* * *

### 3\. Prompt-Distilled SFT Router

#### Problem

The initial production setup relied on long, carefully written system prompts to compensate for weak disambiguation performance. Every tool addition required prompt edits, and the growing context increased inference cost.

#### Solution

I trained a QLoRA SFT model based on Qwen3.5-2B to distill prompt-based tool-routing rules into model weights. The dataset was split into Train 300 / Val 50 / Test 100, and every label was verified through the live `ToolRouter.validate` path.

#### Result

When the long production prompt was removed, the base model's tool-routing success rate dropped from 49% to 12%. The SFT model reached 96% with only a four-line minimal prompt. Detailed metrics also improved: disambiguation from 30% to 95%, KPI acceptance from 50% to 100%, and invalid/missing parameter decline from 0% to 100%.

<figure class="flex flex-col items-center my-8"><img src="/images/project5/sft_heldout.png" alt="Prompt-distilled SFT held-out evaluation" class="max-w-3xl rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans">Fig 17. Held-out evaluation results for Base + Minimal, Base + Full, and SFT + Minimal conditions</figcaption></figure>

<br/>

* * *

### 4\. Adapter Toggle-Based Single-Endpoint Deployment

#### Problem

Separating a routing-only SFT model from a base model for general chat and reporting exceeded the 8GB VRAM budget. Using only the SFT model for general reporting and chat also caused repetitive output and language leakage issues.

#### Solution

I used llama.cpp's LoRA adapter on/off capability to keep a single base model resident. The adapter scale is set to 1.0 only for routing requests and 0.0 for chat, report, and planning requests, preserving role separation without loading two full models.

#### Result

The resident model structure was reduced to `one base model + a small LoRA adapter`. The routing path reached 99.4%, the chat/report path had 0 observed defects, and 32 backend unit tests passed.

<br/>

* * *

### 5\. Preventing Unsupported Hallucinations and RAG Quality Regressions

#### Problem

The initial Qdrant integration remained a seed scaffold that generated placeholder hash vectors, and the application retrieval path was not connected. If the model generated procedures from internal memory alone, it could provide unsupported operating guidance. Even after retrieval worked once, corpus, reranker, or routing changes could silently regress ranking and citation quality.

#### Solution

I connected a `classify -> retrieve -> rerank -> score filter -> sanitize -> cite/abstain` path to LangGraph. Retrieved documents are treated as untrusted input: instruction-like phrases are neutralized, while email addresses, phone numbers, resident registration numbers, and secret patterns are redacted. A small deterministic regression set—six vector cases, two graph cases, and three answer cases—gates retrieval, citation, faithfulness, grounding, and abstention contracts.

#### Result

The checked-in baseline achieved vector retrieval recall@5 of 1.00 / nDCG@5 of 0.88 and graph retrieval recall@3 of 1.00 / nDCG@3 of 1.00. Citation, faithfulness, grounding, and abstention each remained at 1.00 across the three answer cases. Every turn records a redacted trace containing the route, node path, retrieval hits, latency, estimated tokens, `low_grounding`, and `possible_misroute`, making failures reproducible.

<br/>

* * *

### 6\. Eliminating In-Process GraphRAG Rebuild Cost with a Memoized Graph

#### Problem

The typed graph was **rebuilt from scratch for every relational query**. Every `OntologyNode`, `OntologyEdge`, and adjacency map was reallocated even when nothing had changed, and the graph was not persisted anywhere.

#### Solution

I separated `build` into a memoization entry point based on a fingerprint (`hashlib.sha1` over each station's `model_dump` plus the run ID/status/timestamp/`kpis_json`) and moved actual construction into `_build`. When the fingerprint is unchanged, the cached graph is returned from a small LRU (`cache_size=8`, `OrderedDict`); the graph is rebuilt only when state actually changes. Retrievers share the cached graph as read-only data.

#### Result

Rebuilding shifted from once per query to once per state change, so N queries against the same state construct the graph only once (`builds==1`). I added regression tests for cache reuse, fingerprint invalidation, and one-time construction across multiple queries; all 127 backend tests passed. This provides an in-process persistent store that survives until state changes without a separate graph service, while a cross-process external graph store such as Neo4j or RDF remains future work for the CSP.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/graphrag-before.png" alt="GraphRAG before caching" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 18. Before caching</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/graphrag-after.png" alt="GraphRAG after caching" class="w-full rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 19. After caching</figcaption></figure></div>


* * *


## Results

-   **Automated UE5 Digital Twin Control**: Connected chat input, command routing, UE5 simulation execution, real-time telemetry, a web dashboard, and pass/fail reporting.
-   **Optimized Local LLM Operation**: Performed on-premise tool planning without external hosted LLM APIs, reducing latency through a llama.cpp CUDA build and reasoning-off configuration.
-   **Improved Tool-Routing Performance**: Achieved a 96% tool-routing success rate under a four-line minimal prompt condition through prompt-distilled QLoRA SFT.
-   **Real-Time Process Observation**: Visualized AGV uptime, throughput, collision risk, and congestion heatmaps in the web UI through Firebase RTDB and SSE.
-   **Expanded Evidence-Based Operational Knowledge**: Connected 16 Qdrant points and a typed graph to LangGraph, integrating multilingual SOP retrieval, source citation, explicit abstention, and queries that combine the latest run KPIs into a single operational conversation flow.
-   **Quantified RAG Regression Quality**: Established baselines of vector recall@5 1.00, graph recall@3 1.00, and citation, faithfulness, grounding, and abstention scores of 1.00 on a small regression set.

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 items-start"><figure class="flex flex-col items-center"><img src="/images/project5/simulationresult_success.png" alt="Successful simulation result" class="max-w-sm rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 19. Successful result that satisfies the acceptance criteria</figcaption></figure><figure class="flex flex-col items-center"><img src="/images/project5/simulationresult_fail.png" alt="Failed simulation result" class="max-w-sm rounded-lg shadow-md mb-2 modal-trigger cursor-pointer"><figcaption class="text-sm text-gray-500 italic font-sans text-center">Fig 20. Failure judgment caused by unmet criteria or collision risk</figcaption></figure></div>

* * *

## Limitations and Areas for Improvement

-   **Limited Scope of the Routing-Only SFT Model**: The SFT model is strong at tool routing but not well suited for general conversation or report generation, so roles are separated through adapter toggling.
-   **Need for Multi-User Validation**: Adapter toggling worked well in a single-user environment, but concurrent multi-user request handling still requires additional validation.
-   **Dependency on a Fixed Tool Set**: The current SFT model is optimized for the tool schema used during training, so tool additions or schema changes require retraining or a more general routing-rule learning strategy.
-   **Incomplete MLOps Automation**: Model version management, automated evaluation, and deployment tracking need to be systematized further.
