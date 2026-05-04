import { experience } from '../../data/experience'
import { useInView } from '../../hooks/useInView'

const TYPE_STYLE = {
    '인턴':      { color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)'  },
    '정규직':    { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
    '계약직':    { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
    '아르바이트': { color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' },
    '프리랜서':  { color: '#ec4899', bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.2)'  },
}

function Experience() {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section
            ref={ref}
            id="experience"
            aria-label="경험"
            className="section-padding"
            style={{ backgroundColor: 'var(--color-bg-alt)' }}
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
                    Experience
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
                    경험
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {experience.map(({ id, company, role, type, period, description, tasks, tech }, i) => {
                        const badge = TYPE_STYLE[type] ?? TYPE_STYLE['인턴']
                        return (
                            <div
                                key={id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '0 24px',
                                    padding: '32px 0',
                                    borderBottom: i < experience.length - 1
                                        ? '1px solid var(--color-border-subtle)'
                                        : 'none',
                                    alignItems: 'start',
                                    ...fx(120 + i * 80),
                                }}
                            >
                                {/* Left — content */}
                                <div>
                                    {/* Company + badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <h3
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '20px', fontWeight: 700,
                                                lineHeight: 1.2, letterSpacing: '-0.01em',
                                                color: 'var(--color-fg)', margin: 0,
                                            }}
                                        >
                                            {company}
                                        </h3>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-body)', fontSize: '11px',
                                                fontWeight: 600, letterSpacing: '0.04em',
                                                color: badge.color,
                                                backgroundColor: badge.bg,
                                                border: `1px solid ${badge.border}`,
                                                borderRadius: '5px', padding: '2px 8px',
                                            }}
                                        >
                                            {type}
                                        </span>
                                    </div>

                                    {/* Role */}
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-body)', fontSize: '15px',
                                            fontWeight: 500, color: 'var(--color-fg-secondary)',
                                            margin: '0 0 12px 0',
                                        }}
                                    >
                                        {role}
                                    </p>

                                    {/* Description */}
                                    <p
                                        style={{
                                            fontFamily: 'var(--font-body)', fontSize: '14px',
                                            fontWeight: 400, lineHeight: 1.7,
                                            color: 'var(--color-fg-secondary)',
                                            margin: '0 0 16px 0',
                                        }}
                                    >
                                        {description}
                                    </p>

                                    {/* Tasks */}
                                    {tasks?.length > 0 && (
                                        <ul
                                            style={{
                                                margin: '0 0 16px 0', padding: 0,
                                                listStyle: 'none',
                                                display: 'flex', flexDirection: 'column', gap: '6px',
                                            }}
                                        >
                                            {tasks.map((task, j) => (
                                                <li
                                                    key={j}
                                                    style={{
                                                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                                                        fontFamily: 'var(--font-body)', fontSize: '14px',
                                                        lineHeight: 1.6, color: 'var(--color-fg-secondary)',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: '4px', height: '4px', borderRadius: '50%',
                                                            backgroundColor: 'var(--color-fg-muted)',
                                                            flexShrink: 0, marginTop: '8px',
                                                        }}
                                                    />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Tech tags */}
                                    {tech?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {tech.map((t) => (
                                                <span
                                                    key={t}
                                                    style={{
                                                        fontFamily: 'var(--font-body)', fontSize: '12px',
                                                        fontWeight: 500, color: 'var(--color-fg-muted)',
                                                        backgroundColor: 'var(--color-bg)',
                                                        border: '1px solid var(--color-border)',
                                                        borderRadius: '4px', padding: '3px 8px',
                                                    }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right — period */}
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
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Experience
