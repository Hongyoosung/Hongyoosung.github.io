import project5KoContent from '../../../content/projects/project5.ko.md?raw'
import project5EnContent from '../../../content/projects/project5.en.md?raw'

const project5 = {
    "id": 5,
    "slug": "v-core",
    "title": {
        "ko": "AI 에이전트를 활용한 가상 공장 시뮬레이션",
        "en": "Virtual Factory Simulation using AI agents"
    },
    "description": {
        "ko": "LangGraph, 로컬 LLM, Validation Layer, Pixel Streaming을 결합한 산업 공정 시뮬레이션 제어 플랫폼",
        "en": "An industrial process simulation control platform combining LangGraph, local LLMs, validation layers, and Pixel Streaming."
    },
    "image": "/images/project5/overviewimage.png",
    "gif": "/gifs/project5/overview.gif",
    "detailImage": "/images/project5/overviewimage.png",
    "period": "2026.02 -",
    "team": {
        "ko": "1명",
        "en": "1 person"
    },
    "role": {
        "ko": "시스템 설계, UE5 시뮬레이션, 에이전트/LLM 파이프라인 구현",
        "en": "System design, UE5 simulation, agent/LLM pipeline implementation"
    },
    "tags": [
        "Unreal Engine 5",
        "LLM",
        "AI Agent",
        "LangGraph",
        "Digital Twin"
    ],
    "github": "https://github.com/yoosunghong/V-CORE",
    "youtube": "https://www.youtube.com/watch?v=Q0mszYUpqFU",
    "highlights": {
        "ko": [
            "자연어 입력에서 UE5 시뮬레이션 실행, 실시간 텔레메트리, KPI 리포트까지 연결",
            "LangGraph 기반 2단계 라우팅과 Validation Layer로 안전한 Tool Calling 구조 구현",
            "QLoRA 기반 Prompt-Distilled SFT Router로 4줄 최소 프롬프트 조건 Tool-routing 성공률 96% 달성"
        ],
        "en": [
            "Connected natural-language requests to UE5 simulation execution, live telemetry, and KPI reports",
            "Built safe Tool Calling with two-stage LangGraph routing and a validation layer",
            "Achieved 96% tool-routing success with a QLoRA prompt-distilled SFT router under a minimal 4-line prompt"
        ]
    }
}

project5.content = {
    ko: project5KoContent,
    en: project5EnContent
}

export default project5
