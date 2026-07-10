import { experience } from '../../data/experience'
import { useInView } from '../../hooks/useInView'

function Experience({ lang }) {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section ref={ref} id="experience" aria-label="Experience" className="section-padding section-tone-gray">
            <div className="container-max">
                <p className="section-eyebrow" style={fx(0)}>Experience</p>
                <h2 className="section-title" style={fx(60)}>{lang === 'ko' ? '이력' : 'Experience'}</h2>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {experience.map(({ id, company, role, type, period, description, tasks, tech }, i) => {
                        const status = type?.[lang]

                        return (
                            <div
                                key={id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '0 24px',
                                    padding: '32px 0',
                                    borderBottom: i < experience.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                                    alignItems: 'start',
                                    ...fx(120 + i * 80),
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>{company[lang]}</h3>
                                        {status && <span className="status-badge">{status}</span>}
                                    </div>

                                    <p className="card-copy" style={{ fontWeight: 500, marginBottom: '12px' }}>{role[lang]}</p>
                                    <p className="card-copy">{description[lang]}</p>

                                    <ul className="clean-list">
                                        {tasks[lang].map((task) => (
                                            <li key={task}>{task}</li>
                                        ))}
                                    </ul>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {tech.map((t) => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                </div>

                                <span className="date-text">{period}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Experience
