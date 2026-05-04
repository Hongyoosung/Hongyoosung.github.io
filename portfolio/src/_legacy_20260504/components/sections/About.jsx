import { Phone, Code2, Mail, Cake } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { useInView } from '../../hooks/useInView'

function About() {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    const highlights = [
        {
            icon: <Code2 size={17} />,
            label: '주요 스택',
            value: 'Spring · Node.js',
        },
        {
            icon: <Cake size={17} />,
            label: '생년월일',
            value: '2001년 9월 13일',
        },
        {
            icon: <Mail size={17} />,
            label: '이메일',
            value: personalInfo.email,
        },
        {
            icon: <Phone size={17} />,
            label: '전화번호',
            value: '+82 10-4884-5299',
        },
    ]

    return (
        <section
            ref={ref}
            id="about"
            aria-label="소개"
            className="section-padding"
            style={{ backgroundColor: 'var(--color-bg-alt)' }}
        >
            <div className="container-max">
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '56px 80px',
                        alignItems: 'start',
                    }}
                >
                    {/* Left — bio */}
                    <div style={fx(0)}>
                        <p
                            style={{
                                fontFamily: 'var(--font-body)', fontSize: '13px',
                                fontWeight: 500, letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--color-fg-muted)', margin: '0 0 20px 0',
                            }}
                        >
                            About
                        </p>

                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: 700, lineHeight: 1.15,
                                letterSpacing: '-0.025em',
                                color: 'var(--color-fg)', margin: '0 0 28px 0',
                            }}
                        >
                            안녕하세요,<br />저는 홍유성입니다.
                        </h2>

                        <p
                            style={{
                                fontFamily: 'var(--font-body)', fontSize: '16px',
                                fontWeight: 400, lineHeight: 1.85, letterSpacing: '0.16px',
                                color: 'var(--color-fg-secondary)', margin: '0 0 20px 0',
                            }}
                        >
                            백엔드 개발을 중심으로 프론트엔드까지 학습하고 적용하는 개발자입니다.
                            Spring과 Node.js로 견고한 서버를 설계하기 위해 노력하고 있습니다.
                        </p>

                        <p
                            style={{
                                fontFamily: 'var(--font-body)', fontSize: '16px',
                                fontWeight: 400, lineHeight: 1.85, letterSpacing: '0.16px',
                                color: 'var(--color-fg-secondary)', margin: 0,
                            }}
                        >
                            빠르게 변화하고 발전하는 트렌드속에서 새로운 기술을 거리낌없이 학습하고 적용시키는 과정을 즐깁니다.
                            코드 품질과 쿼리 최적화에 관심이 많으며, 더 나은 해결책을 찾기 위해
                            끊임없이 학습합니다.
                        </p>
                    </div>

                    {/* Right — info cards */}
                    <div
                        style={{
                            display: 'flex', flexDirection: 'column', gap: '10px',
                            ...fx(100),
                        }}
                    >
                        {highlights.map(({ icon, label, value }) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    backgroundColor: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px', padding: '16px 20px',
                                    boxShadow: 'var(--shadow-card)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        backgroundColor: 'var(--color-bg-alt)',
                                        border: '1px solid var(--color-border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--color-fg-muted)', flexShrink: 0,
                                    }}
                                >
                                    {icon}
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-body)', fontSize: '11px',
                                            fontWeight: 600, color: 'var(--color-fg-muted)',
                                            textTransform: 'uppercase', letterSpacing: '0.08em',
                                            margin: '0 0 3px 0',
                                        }}
                                    >
                                        {label}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-body)', fontSize: '14px',
                                            fontWeight: 500, color: 'var(--color-fg)',
                                            margin: 0,
                                        }}
                                    >
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
