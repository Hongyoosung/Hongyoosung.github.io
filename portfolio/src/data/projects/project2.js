import project2KoContent from '../../../content/projects/project2.ko.md?raw'
import project2EnContent from '../../../content/projects/project2.en.md?raw'

const project2 = {
    "id": 2,
    "slug": "gobt",
    "title": {
        "ko": "GOBT: Goal-Oriented Behavior Tree",
        "en": "GOBT: Goal-Oriented Behavior Tree"
    },
    "description": {
        "ko": "Behavior Tree의 구조적 직관성과 GOAP·Utility Theory의 동적 유연성을 결합한 하이브리드 AI 프레임워크",
        "en": "A hybrid decision-making framework combining the intuitiveness of Behavior Trees with the dynamic flexibility of GOAP and Utility Theory."
    },
    "image": "/images/project2/main.png",
    "gif": "/gifs/project2/gobt1.gif",
    "detailImage": "/gifs/project2/gobt2.gif",
    "period": "2023.05 - 2024.02",
    "team": {
        "ko": "2명",
        "en": "2 people"
    },
    "role": {
        "ko": "메인 프로그래머, 논문 작성",
        "en": "Main programmer, paper writer"
    },
    "tags": [
        "Behavior Tree",
        "GOAP",
        "Utility AI",
        "Unity",
        "NPC Decision Making"
    ],
    "github": "https://github.com/yoosunghong/GOBTv2.0",
    "paper": "https://doi.org/10.33851/JMIS.2023.10.4.321",
    "highlights": {
        "ko": [
            "표준 Behavior Tree 안에 GOAP와 Utility Theory 기반 커스텀 알고리즘 노드 통합",
            "상위 흐름 제어와 복잡한 상황 판단을 분리한 계층형 AI 구조 설계",
            "Journal of Multimedia Information System 논문으로 연구 결과 출판"
        ],
        "en": [
            "Integrated GOAP and Utility Theory custom algorithm nodes into standard Behavior Trees",
            "Designed a hierarchical AI structure separating flow control from complex situational reasoning",
            "Published the research in the Journal of Multimedia Information System"
        ]
    }
}

project2.content = {
    ko: project2KoContent,
    en: project2EnContent
}

export default project2
