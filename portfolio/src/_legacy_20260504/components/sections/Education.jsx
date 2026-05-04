import { education } from '../../data/education'
import { useInView } from '../../hooks/useInView'

function Education() {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section
            ref={ref}
            id="education"
            aria-label="학력"
            className="section-padding"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div className="container-max">
                <p
                    style={{
                        fontFamily: 'var(--font-body)', fontSize: '13px',
                        fontWeight: 500, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-fg-muted)', margin: '0 0 20px 0',
                        ...fx(0),
                    }}
                >
                    Education
                </p>

                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(28px, 4vw, 42px)',
                        fontWeight: 700, lineHeight: 1.1,
                        letterSpacing: '-0.025em',
                        color: 'var(--color-fg)', margin: '0 0 52px 0',
                        ...fx(60),
                    }}
                >
                    학력
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {education.map(({ id, school, major, status, gpa, period }, i) => (
                        <div
                            key={id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto',
                                gap: '8px 24px',
                                padding: '32px 0',
                                borderBottom: i < education.length - 1
                                    ? '1px solid var(--color-border-subtle)'
                                    : 'none',
                                alignItems: 'start',
                                ...fx(120 + i * 80),
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '20px', fontWeight: 700,
                                        lineHeight: 1.2, letterSpacing: '-0.01em',
                                        color: 'var(--color-fg)', margin: '0 0 6px 0',
                                    }}
                                >
                                    {school}
                                </h3>

                                <p
                                    style={{
                                        fontFamily: 'var(--font-body)', fontSize: '15px',
                                        fontWeight: 400, color: 'var(--color-fg-secondary)',
                                        margin: '0 0 16px 0',
                                    }}
                                >
                                    {major}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {[status, `학점 ${gpa}`].map((text) => (
                                        <span
                                            key={text}
                                            style={{
                                                fontFamily: 'var(--font-body)', fontSize: '12px',
                                                fontWeight: 500, color: 'var(--color-fg-muted)',
                                                backgroundColor: 'var(--color-bg-alt)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '5px', padding: '4px 10px',
                                            }}
                                        >
                                            {text}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <span
                                style={{
                                    fontFamily: 'var(--font-body)', fontSize: '13px',
                                    fontWeight: 400, color: 'var(--color-fg-muted)',
                                    whiteSpace: 'nowrap', paddingTop: '4px',
                                }}
                            >
                                {period}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Education
