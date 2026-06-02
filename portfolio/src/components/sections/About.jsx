import { useInView } from '../../hooks/useInView'

function About({ lang }) {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    const copy = {
        eyebrow: 'About',
        title: {
            ko: '게임을 위한 AI를 설계합니다.',
            en: 'Designing AI for games.',
        },
        paragraphs: {
            ko: [
                '저는 게임 플레이 경험을 향상시킬 수 있는 AI 시스템을 연구하고 개발하는 엔지니어입니다.',
                '게임에서 AI가 어떻게 작동하는지, 그리고 그 구조를 게임에 어떻게 활용하는지에 대한 관심을 바탕으로 강화학습, LLM과 같은 차세대 AI를 게임 도메인에 최적화한 AI 시스템을 개발하고 있습니다.',
                '최신 논문 탐색, 관련 지식을 꾸준히 공부하고 있으며 최근에는 생성형 AI를 활용한 게임 콘텐츠 생성 파이프라인 개발에 관심이 있습니다.',
            ],
            en: [
                'I build and research game AI systems, simulation logic, and NPC decision architecture. I care about why a system behaves the way it does, and whether its structure can be reused, verified, and extended.',
                'I am constantly exploring the latest research papers and studying related knowledge, and recently I have been interested in developing game content generation pipelines using generative AI.',
            ],
        },
    }

    return (
        <section ref={ref} id="about" aria-label="About" className="section-padding section-tone-gray">
            <div className="container-max">
                <div style={fx(0)}>
                    <p className="section-eyebrow">{copy.eyebrow}</p>
                    <h2 className="section-title">{copy.title[lang]}</h2>
                    {copy.paragraphs[lang].map((paragraph) => (
                        <p key={paragraph} className="section-copy">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
