import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Github, ExternalLink, FileText } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { projects } from '../../data/projects'
import { useInView } from '../../hooks/useInView'

function ProjectBanner({ project, hovered, lang }) {
    const [posterSrc, setPosterSrc] = useState(project.gif || project.image)
    const bannerSrc = hovered && project.gif ? project.gif : posterSrc

    useEffect(() => {
        if (!project.gif) {
            return
        }

        let active = true
        const image = new Image()
        image.src = project.gif

        image.onload = () => {
            if (!active || !image.naturalWidth || !image.naturalHeight) return

            const canvas = document.createElement('canvas')
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            const context = canvas.getContext('2d')
            context.drawImage(image, 0, 0)
            setPosterSrc(canvas.toDataURL('image/png'))
        }

        image.onerror = () => {
            if (active) setPosterSrc(project.image)
        }

        return () => {
            active = false
        }
    }, [project.gif, project.image])

    return (
        <img
            key={hovered ? project.gif : posterSrc}
            src={bannerSrc}
            alt={project.title[lang]}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.4s ease',
            }}
        />
    )
}

function ProjectCard({ project, index, lang, onOpen, animStyle }) {
    const [hovered, setHovered] = useState(false)

    return (
        <article
            className="project-card"
            style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: hovered
                    ? 'rgba(0,0,0,0.12) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 8px 24px'
                    : 'var(--shadow-card)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                ...animStyle,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button
                onClick={onOpen}
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg-alt)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'block',
                }}
                aria-label={`${project.title[lang]} detail`}
            >
                <ProjectBanner project={project} hovered={hovered} lang={lang} />
                <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="project-hover-label">{lang === 'ko' ? '자세히 보기' : 'Open Detail'}</span>
            </button>

            <div className="project-card-body">
                <h3 className="card-title">{project.title[lang]}</h3>
                <p className="card-copy">{project.description[lang]}</p>

                <div className="project-card-tags">
                    {project.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>

                <div className="project-card-links">
                    {project.github && (
                        <a className="mini-link" href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github size={13} />
                            GitHub
                        </a>
                    )}
                    {project.paper && (
                        <a className="mini-link" href={project.paper} target="_blank" rel="noopener noreferrer">
                            <FileText size={13} />
                            Paper
                        </a>
                    )}
                    {project.youtube && (
                        <a className="mini-link" href={project.youtube} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={13} />
                            Video
                        </a>
                    )}
                </div>
            </div>
        </article>
    )
}

function Projects({ lang, navigate }) {
    const [startIndex, setStartIndex] = useState(0)
    const [cardsPerView, setCardsPerView] = useState(3)
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth <= 640) {
                setCardsPerView(1)
            } else if (window.innerWidth <= 960) {
                setCardsPerView(2)
            } else {
                setCardsPerView(3)
            }
        }

        updateCardsPerView()
        window.addEventListener('resize', updateCardsPerView)
        return () => window.removeEventListener('resize', updateCardsPerView)
    }, [])

    const maxStartIndex = Math.max(0, projects.length - cardsPerView)
    const currentStartIndex = Math.min(startIndex, maxStartIndex)
    const canGoPrev = currentStartIndex > 0
    const canGoNext = currentStartIndex < maxStartIndex
    const carouselMetrics = cardsPerView === 1
        ? { visible: 1.04, gap: 14, gapCount: 1 }
        : cardsPerView === 2
            ? { visible: 1.92, gap: 20, gapCount: 2 }
            : { visible: 2.85, gap: 20, gapCount: 3 }
    const offsetPercent = currentStartIndex * (100 / carouselMetrics.visible)
    const offsetPixels = currentStartIndex * (
        carouselMetrics.gap - ((carouselMetrics.gap * carouselMetrics.gapCount) / carouselMetrics.visible)
    )

    const openProject = (slug) => {
        navigate(lang === 'ko' ? `/ko/projects/${slug}` : `/projects/${slug}`)
    }

    return (
        <section ref={ref} id="projects" aria-label="Projects" className="section-padding section-tone-black">
            <div className="container-max">
                <p className="section-eyebrow" style={fx(0)}>Projects</p>
                <h2 className="section-title" style={fx(60)}>
                    {lang === 'ko' ? '주요 프로젝트' : 'Selected Projects'}
                </h2>

                <div
                    className="project-carousel"
                    style={{
                        '--carousel-index': currentStartIndex,
                        '--carousel-offset': `calc(-${offsetPercent}% - ${offsetPixels}px)`,
                        ...fx(120),
                    }}
                >
                    <div className="project-carousel-viewport">
                        <div className="project-carousel-track">
                            {projects.map((project, i) => (
                                <div className="project-carousel-card" key={project.id}>
                                    <ProjectCard
                                        project={project}
                                        index={i}
                                        lang={lang}
                                        onOpen={() => openProject(project.slug)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {projects.length > cardsPerView && (
                        <>
                            {canGoPrev && (
                                <button
                                    className="carousel-arrow carousel-arrow-prev"
                                    type="button"
                                    onClick={() => setStartIndex((value) => Math.max(0, value - 1))}
                                    aria-label={lang === 'ko' ? '이전 프로젝트' : 'Previous projects'}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                            )}
                            <button
                                className="carousel-arrow carousel-arrow-next"
                                type="button"
                                onClick={() => setStartIndex((value) => Math.min(maxStartIndex, value + 1))}
                                disabled={!canGoNext}
                                aria-label={lang === 'ko' ? '다음 프로젝트' : 'Next projects'}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </>
                    )}
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center', ...fx(120 + projects.length * 80) }}>
                    <a className="pill-link" href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                        <Github size={15} />
                        {lang === 'ko' ? 'GitHub에서 더 보기' : 'More on GitHub'}
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Projects
