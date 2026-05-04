import { skills } from '../../data/skills'
import { useInView } from '../../hooks/useInView'

function Skills({ lang }) {
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section ref={ref} id="skills" aria-label="Skills" className="section-padding section-tone-gray">
            <div className="container-max">
                <p className="section-eyebrow" style={fx(0)}>Skills</p>
                <h2 className="section-title" style={fx(60)}>{lang === 'ko' ? '기술 스택' : 'Technical Stack'}</h2>

                <div>
                    {skills.map(({ category, items }, i) => (
                        <div key={category} className="skills-row" style={fx(120 + i * 60)}>
                            <p className="skills-category">{category}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {items.map(({ name }) => (
                                    <span key={name} className="skill-chip">{name}</span>
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
