import { useState } from 'react'
import { Github, ExternalLink, Lock } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { projects } from '../../data/projects'
import ProjectModal from '../ui/ProjectModal'
import { useInView } from '../../hooks/useInView'

const PLACEHOLDER_GRADIENTS = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a2e 100%)',
    'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
]

function ProjectCard({ project, index, onClick, animStyle }) {
    const [hovered, setHovered] = useState(false)

    return (
        <article
            style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: hovered
                    ? 'rgba(0,0,0,0.12) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 8px 24px'
                    : 'var(--shadow-card)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                ...animStyle,
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image area */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg-alt)',
                }}
            >
                {project.image ? (
                    <img
                        src={project.image}
                        alt={project.title}
                        style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transform: hovered ? 'scale(1.04)' : 'scale(1)',
                            transition: 'transform 0.4s ease',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%', height: '100%',
                            background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '48px', fontWeight: 700,
                                color: 'rgba(255,255,255,0.06)',
                                letterSpacing: '-0.04em',
                                userSelect: 'none',
                            }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                )}

                {/* Number badge */}
                <span
                    style={{
                        position: 'absolute', top: '14px', left: '14px',
                        fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                        color: 'rgba(255,255,255,0.7)',
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '5px', padding: '3px 8px',
                        letterSpacing: '0.06em',
                    }}
                >
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Link icons overlay */}
                <div
                    style={{
                        position: 'absolute', top: '12px', right: '12px',
                        display: 'flex', gap: '6px',
                    }}
                >
                    {project.github && (
                        project.github === 'private' ? (
                            <div
                                title="비공개 저장소"
                                onClick={e => e.stopPropagation()}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '30px', height: '30px', borderRadius: '6px',
                                    backgroundColor: 'rgba(0,0,0,0.35)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'default',
                                }}
                            >
                                <Lock size={12} />
                            </div>
                        ) : (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub 저장소"
                                onClick={e => e.stopPropagation()}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '30px', height: '30px', borderRadius: '6px',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'rgba(255,255,255,0.8)',
                                    textDecoration: 'none',
                                    transition: 'background-color 0.15s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'}
                            >
                                <Github size={13} />
                            </a>
                        )
                    )}
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="데모 보기"
                            onClick={e => e.stopPropagation()}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '30px', height: '30px', borderRadius: '6px',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(8px)',
                                color: 'rgba(255,255,255,0.8)',
                                textDecoration: 'none',
                                transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'}
                        >
                            <ExternalLink size={13} />
                        </a>
                    )}
                </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '20px 22px 22px' }}>
                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px', fontWeight: 600,
                        lineHeight: 1.25, letterSpacing: '-0.01em',
                        color: 'var(--color-fg)', margin: '0 0 8px 0',
                    }}
                >
                    {project.title}
                </h3>

                <p
                    style={{
                        fontFamily: 'var(--font-body)', fontSize: '14px',
                        fontWeight: 400, lineHeight: 1.7,
                        color: 'var(--color-fg-secondary)',
                        margin: '0 0 16px 0',
                    }}
                >
                    {project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                fontFamily: 'var(--font-body)', fontSize: '12px',
                                fontWeight: 500, color: 'var(--color-fg-muted)',
                                backgroundColor: 'var(--color-bg-alt)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px', padding: '3px 8px',
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    )
}

function Projects() {
    const [selected, setSelected] = useState(null)
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section
            ref={ref}
            id="projects"
            aria-label="프로젝트"
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
                    Projects
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
                    주요 프로젝트
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={i}
                            onClick={() => setSelected(project)}
                            animStyle={fx(120 + i * 80)}
                        />
                    ))}
                </div>

                {/* GitHub CTA */}
                <div
                    style={{
                        marginTop: '48px', textAlign: 'center',
                        ...fx(120 + projects.length * 80),
                    }}
                >
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                            color: 'var(--color-fg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '9999px', padding: '9px 22px',
                            textDecoration: 'none',
                            transition: 'color 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--color-fg)'
                            e.currentTarget.style.borderColor = 'var(--color-fg)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--color-fg-secondary)'
                            e.currentTarget.style.borderColor = 'var(--color-border)'
                        }}
                    >
                        <Github size={15} />
                        GitHub에서 더 보기
                    </a>
                </div>
            </div>

            {selected && (
                <ProjectModal
                    project={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    )
}

export default Projects
