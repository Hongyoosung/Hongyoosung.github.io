import project3KoContent from '../../../content/projects/project3.ko.html?raw'
import project3EnContent from '../../../content/projects/project3.en.html?raw'

const project3 = {
    "id": 3,
    "slug": "v-vr-fps",
    "title": {
        "ko": "V: VR FPS Shooting Game",
        "en": "V: VR FPS Shooting Game"
    },
    "description": {
        "ko": "디자인 패턴과 컴포넌트 기반 설계를 통해 확장성과 유지보수성을 확보한 UE5 VR FPS",
        "en": "A scalable VR FPS framework built with UE5, leveraging design patterns and component-based architecture for enhanced maintainability."
    },
    "image": "/images/project3/damage_archi.png",
    "gif": "/gifs/project3/V1.gif",
    "detailImage": "/gifs/project3/V2.gif",
    "period": "2023.09 - 2024.05",
    "team": {
        "ko": "3 people",
        "en": "3 people"
    },
    "role": {
        "ko": "AI 시스템 프로그래머",
        "en": "AI system programmer"
    },
    "tags": [
        "Unreal Engine 5",
        "VR FPS",
        "AI Architecture",
        "Combat System",
        "Design Patterns"
    ],
    "github": "https://github.com/V-2024/ProjectOmega",
    "youtube": "https://www.youtube.com/watch?v=Dl0W6wjeUj0",
    "highlights": {
        "ko": [
            "Observer, Facade, Component 패턴을 활용한 전투 및 데미지 시스템 설계",
            "다수의 아군과 적군이 섞이는 전장 환경에서 안정적인 AI 의사결정 구조 구현",
            "VR 환경의 입력과 전투 피드백을 고려한 시스템 분리 및 유지보수성 개선"
        ],
        "en": [
            "Designed combat and damage systems with Observer, Facade, and Component patterns",
            "Implemented reliable AI decision structure for crowded ally/enemy battle scenarios",
            "Improved maintainability by separating VR input, combat feedback, and AI behavior"
        ]
    }
}

project3.content = {
    ko: project3KoContent,
    en: project3EnContent
}

export default project3
