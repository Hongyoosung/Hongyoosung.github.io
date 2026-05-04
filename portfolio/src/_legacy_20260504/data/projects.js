  import mediXImg from '../assets/projects/Medi-X-Main.png'                                                                                                         
  import specMateImg from '../assets/projects/specmate-Main.png'
  import renalyzeImg from '../assets/projects/Renalyze-Main.png' 

export const projects = [
    {
        id: 1,
        title: 'Medi-X - 가상환자 기반 한의대 임상 역량 평가 플랫폼',
        description: '한의대 학생들의 임상 역량을 평가하기 위한 연구 목적의 플랫폼입니다.',
        image: mediXImg,
        detail: {
            summary:
                'Node.js(Express)와 PostgreSQL 기반의 한의대 임상 역량 평가 플랫폼입니다. ' +
                '동의대학교 한의대 교수님과의 협업으로 진행한 연구실 프로젝트로, ' +
                'JWT 인증을 통한 회원 관리, 가상환자 데이터 관리, 실시간 대화 기반 진단 평가 기능을 제공합니다. ' +
                '6인 팀 프로젝트에서 아키텍처 설계와 백엔드 API 전체를 담당했으며, ' +
                'Nginx 리버스 프록시 적용으로 평균 응답시간을 6000ms에서 1200ms로 80% 단축했습니다.',
            role: '아키텍처 설계 및 백엔드 개발 — API 설계·구현, DB 스키마 설계, Nginx 성능 최적화',
            period: '2025.02 ~ 2025.10 (8개월)',
            team: 'PM 1인, FE 1인, AI 2인, BE 2인 (6인 프로젝트)',
            features: [
                '수업 생성 및 수강 신청 관리',
                '가상환자 생성 및 대화',
                '대화 기반 환자 진단 수행',
                '진단 내용 평가',
                '교수, 학생, 강의, 과제, 대화, 평가 등 엔티티 구현',
            ],
            contributions: [
                '아키텍처 설계 및 백엔드 API 전체 구현',
                '컨트롤러 코드 내 공통 로직 모듈화 및 리팩토링',
                'AWS EC2 인스턴스에 Node.js 서버 배포',
                'Nginx 리버스 프록시 적용으로 API 부하 분산 및 성능 개선',
            ],
            trouble: [
                'Node.js 서버가 클라이언트 요청을 직접 처리하면서 정적 파일 서빙, SSL 처리, 포트 관리를 모두 담당했습니다. ' +
                '트래픽이 몰릴수록 응답 지연이 발생하고 서버가 자주 멈추는 현상이 발생했습니다. ' +
                'Nginx를 리버스 프록시로 두고 정적 파일 처리와 로드밸런싱을 분리하자 ' +
                'Node.js는 API 처리에만 집중할 수 있게 되어, 평균 응답시간이 6000ms에서 1200ms로 80% 단축되었습니다.',
            ],
        },
        tags: ['Node.js', 'Express.js', 'PostgreSQL', 'JWT', 'Nginx', 'AWS EC2', 'AWS RDS'],
        github: 'private',
        demo: 'https://medi-x.co.kr',
        featured: true,
    },
    {
        id: 2,
        title: '스펙메이트 - AI 기반 맞춤형 PC 견적 추천 서비스',
        description: '사용자 요구사항을 분석하여 최적의 PC 견적을 구성해주는 AI 기반 서비스입니다.',
        image: specMateImg,
        detail: {
            summary:
                'Spring Boot와 PostgreSQL 기반의 AI 맞춤형 PC 견적 추천 서비스입니다. ' +
                '캡스톤디자인 경진대회 출품작으로, 기존 견적 추천 서비스가 가격순·인기순 필터에만 의존하는 한계를 극복하기 위해 기획했습니다. ' +
                '사용자가 직접 요구사항을 입력하면 AI가 분석하여 최적의 견적을 구성하고 설명해줍니다. ' +
                'JWT Access/Refresh 인증 구현과 Redis 캐싱 적용으로 부품 조회 API 응답속도를 90% 이상 개선했습니다.',
            role: '프로젝트 기획 및 백엔드 개발 — 시스템 설계, API 구현, 인증 시스템 구현, 성능 최적화',
            period: '2025.09 ~ 2025.12 (3개월)',
            team: 'FE 1인, AI 1인, BE 2인 (4인 프로젝트)',
            features: [
                '주요 부품 별 정보 및 판매 링크 제공',
                'DB 내 부품 데이터 활용 맞춤형 견적 생성 및 대화',
                '생성된 견적 수정 및 삭제, PDF 파일 제공',
                'JWT 활용 액세스 권한 부여',
            ],
            contributions: [
                '시스템 흐름 구성 및 API 설계 (회원가입/인증, 부품 조회, 견적 생성)',
                'JWT Access/Refresh 인증 기능 구현',
                'Redis 기반 Refresh Token 관리 및 Access Token 블랙리스트 구현',
                'Redis 캐싱을 적용하여 반복 호출되는 부품 조회 API 성능 개선',
            ],
            trouble: [
                '부품 조회 API는 카테고리, 제조사, 키워드, 정렬, 페이지 번호/크기 등 6가지 파라미터 조합에 따라 ' +
                '매 요청마다 DB 전체 스캔 쿼리가 실행되었습니다. ' +
                '특히 키워드 검색의 LIKE \'%keyword%\' 조건은 인덱스를 활용하지 못해 응답 지연이 심각했습니다. ' +
                '6가지 조회 파라미터를 조합한 복합 캐시 키를 생성해 필터 조합마다 독립적으로 Redis에 캐시하고, ' +
                'TTL을 10분으로 설정하여 DB 조회 없이 즉시 응답하도록 구현했습니다. ' +
                '결과적으로 응답속도를 1000ms에서 100ms 이하로 90% 이상 개선했습니다.',
            ],
        },
        tags: ['Spring Boot', 'PostgreSQL', 'Redis', 'JWT', 'Docker', 'AWS EC2'],
        github: 'https://github.com/spec-mate/backend',
        demo: null,
        featured: true,
    },
    {
        id: 3,
        title: 'Renalyze - AI 기반 전/월세 계약서 분석 플랫폼',
        description: '전/월세 계약서를 업로드하면 AI가 위험요소와 누락 항목을 분석하고 조언해주는 서비스입니다.',
        image: renalyzeImg,
        detail: {
            summary:
                'Nest.js와 Next.js 기반의 AI 전/월세 계약서 분석 플랫폼입니다. ' +
                '캡스톤디자인 프로젝트로, 사회초년생이 계약서의 법률 용어와 누락 항목을 인지하지 못해 피해를 입는 문제를 해결하기 위해 기획했습니다. ' +
                'OCR 파이프라인으로 계약서를 텍스트로 추출하고, OpenAI API로 위험요소와 누락 항목을 분석합니다. ' +
                '2인 프로젝트에서 풀스택 개발 전체를 담당했습니다.',
            role: '프로젝트 기획(디자인) 및 풀스택 개발 — OCR 파이프라인, AI 분석 로직, 챗봇, 프론트엔드 구현',
            period: '2025.03 ~ 2025.6 (3개월)',
            team: 'WEB(BE, FE) 1인, AI 1인 (2인 프로젝트)',
            features: [
                '계약서 이미지/PDF OCR 분석',
                'AI 계약서 항목 검토 (8개 카테고리, 19개 항목)',
                '계약서 분석 내용 기반 부동산 AI 챗봇',
                '회원 인증 및 관리',
            ],
            contributions: [
                'OCR 파이프라인 구현 (sharp 기반 이미지 전처리 → CLOVA OCR → MongoDB 저장)',
                'OpenAI API 기반 계약서 분석 프롬프트 구성 및 로직 구현',
                'OpenAI Assistants API(Thread 기반) 챗봇 연동',
                'Frontend 계약서 업로드 및 분석 결과 페이지 구현',
            ],
            trouble: [
                '스캔 품질이 낮거나 기울어진 계약서에서 OCR 정확도가 낮아지는 문제가 있었습니다. ' +
                'sharp 기반 전처리 레이어를 설계하여 회전 보정, 리사이즈, 대비/밝기 최적화를 적용해 OCR 인식률을 개선했습니다. ' +
                'GPT 응답에서는 없는 내용을 임의로 생성하거나 자연어가 섞이는 문제가 발생했습니다. ' +
                'temperature를 0.3으로 낮추고, JSON 외 자연어 출력 금지 및 OCR 원문 그대로 반환하도록 프롬프트를 설계했습니다. ' +
                '또한 GPT가 응답을 코드블록으로 감싸는 케이스를 정규표현식으로 제거하고 파싱 실패 시 예외를 전파하여 안정성을 확보했습니다.',
            ],
        },
        tags: ['Nest.js', 'Next.js', 'MongoDB', 'Docker', 'OpenAI API', 'OCR'],
        github: 'https://github.com/jeonginh0/Renalyze',
        demo: null,
        featured: true,
    },
]
