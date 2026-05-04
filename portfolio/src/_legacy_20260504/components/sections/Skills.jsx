import { skills } from '../../data/skills'
import { useInView } from '../../hooks/useInView'

function Skills() {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section
            ref={ref}
            id="skills"
            aria-label="기술 스택"
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
                    Skills
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
                    기술 스택
                </h2>

                <div>
                    {skills.map(({ category, items }, i) => (
                        <div
                            key={category}
                            className="skills-row"
                            style={fx(120 + i * 60)}
                        >
                            <p
                                style={{
                                    fontFamily: 'var(--font-body)', fontSize: '12px',
                                    fontWeight: 600, letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-fg-muted)', margin: 0,
                                    paddingTop: '5px',
                                }}
                            >
                                {category}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {items.map(({ name }) => (
                                    <span
                                        key={name}
                                        style={{
                                            fontFamily: 'var(--font-body)', fontSize: '14px',
                                            fontWeight: 500, color: 'var(--color-fg)',
                                            backgroundColor: 'var(--color-bg-alt)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '6px', padding: '6px 14px',
                                            transition: 'border-color 0.15s ease, color 0.15s ease',
                                            cursor: 'default',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-fg-muted)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-border)'
                                        }}
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
