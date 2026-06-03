import project4KoContent from '../../../content/projects/project4.ko.html?raw'
import project4EnContent from '../../../content/projects/project4.en.html?raw'

const project4 = {
    "id": 4,
    "slug": "metaverse-iot",
    "title": {
        "ko": "블록체인 기반 메타버스 IoT 통신 플랫폼",
        "en": "Blockchain-Enabled Metaverse IoT Communication Platform"
    },
    "description": {
        "ko": "가상환경-IoT 디바이스 간 데이터 무결성 보장 및 실시간 최적화",
        "en": "Ensuring Data Integrity and Real-time Synchronization between Virtual Environments and Physical IoT Devices"
    },
    "image": "/images/project4/overview.png",
    "gif": "/images/project4/case1.png",
    "detailImage": "/images/project4/case2.png",
    "period": "2022.10 - 2023.12",
    "team": {
        "ko": "1 people",
        "en": "1 people"
    },
    "role": {
        "ko": "메인 프로그래머, 논문 작성",
        "en": "Main programmer, paper writer"
    },
    "tags": [
        "Blockchain",
        "Metaverse",
        "IoT",
        "MQTT",
        "Data Integrity"
    ],
    "github": "https://github.com/yoosunghong/Metaverse_for_IoT/tree/main/Decentralized_MQTT",
    "paper": "https://kism.or.kr/file/memoir/13_4_8.pdf",
    "highlights": {
        "ko": [
            "DID 기반 신원 검증과 MQTT 실시간 데이터 전송 구조 결합",
            "Hyperledger Indy 기반 DID 원장으로 참여 주체 식별 및 검증 가능한 자격 증명 관리",
            "가상환경과 실제 IoT 장치 간의 낮은 지연 시간 상호작용 구현"
        ],
        "en": [
            "Combined DID-based identity verification with real-time MQTT data transfer",
            "Managed trusted identities and verifiable credentials with a Hyperledger Indy DID ledger",
            "Implemented low-latency interaction between virtual environments and physical IoT devices"
        ]
    }
}

project4.content = {
    ko: project4KoContent,
    en: project4EnContent
}

export default project4
