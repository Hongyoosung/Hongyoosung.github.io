import project1KoContent from '../../../content/projects/project1.ko.md?raw'
import project1EnContent from '../../../content/projects/project1.en.md?raw'

const project1 = {
    "id": 1,
    "slug": "dynamic-eqs",
    "title": {
        "ko": "Dynamic EQS: RL 모델을 통한 EQS 가중치 동적 최적화 시스템",
        "en": "Dynamic EQS: Dynamic Optimization System for EQS Weights via RL Models"
    },
    "description": {
        "ko": "Schola와 Ray RLlib을 활용한 AWS 클라우드 기반 멀티 에이전트 병렬 강화학습 파이프라인 구축",
        "en": "Building an AWS Cloud-based Multi-Agent Parallel Reinforcement Learning Pipeline using Schola and Ray RLlib"
    },
    "image": "/images/project1/archi.png",
    "gif": "/gifs/project1/project1_battle.gif",
    "detailImage": "/gifs/project1/project1_title.gif",
    "period": "2025.08 - 2026.03",
    "team": {
        "ko": "1명",
        "en": "1 person"
    },
    "role": {
        "ko": "메인 프로그래머",
        "en": "Main Programmer"
    },
    "tags": [
        "Unreal Engine 5",
        "Reinforcement Learning",
        "EQS",
        "Ray RLlib",
        "AWS"
    ],
    "github": "https://github.com/yoosunghong/Dynamic-EQS",
    "highlights": {
        "ko": [
            "UE5 EQS 후보 위치 평가를 강화학습 정책의 7차원 연속 액션으로 제어",
            "MAPPO, centralized critic, self/cross attention을 사용한 팀 기반 협동 전략 학습",
            "Schola gRPC와 RLlib 사이에 재사용 가능한 RL-EQS 미들 레이어 구현",
            "AWS EC2 기반 병렬 학습 환경과 live evaluation 파이프라인 구축"
        ],
        "en": [
            "Controlled UE5 EQS candidate scoring with a 7-dimensional continuous RL action space",
            "Trained team cooperation with MAPPO, centralized critics, and self/cross attention",
            "Built a reusable RL-EQS middleware layer between Schola gRPC and RLlib",
            "Set up AWS EC2 parallel training and live evaluation pipelines"
        ]
    },
    "content": {
        "ko": project1KoContent,
        "en": project1EnContent,
    }
}

export default project1
