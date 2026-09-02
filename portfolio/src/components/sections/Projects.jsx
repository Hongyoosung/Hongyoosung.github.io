import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Github, FileText, Youtube } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { projects } from '../../data/projects'
import { useInView } from '../../hooks/useInView'

function ProjectBanner({ project, playing, lang }) {
    const [posterSrc, setPosterSrc] = useState(project.gif || project.image)
    const bannerSrc = playing && project.gif ? project.gif : posterSrc

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
            key={playing ? project.gif : posterSrc}
            src={bannerSrc}
            alt={project.title[lang]}
            loading="lazy"
        />
    )
}

function ProjectEntry({ project, index, lang, onOpen, animStyle }) {
    const [open, setOpen] = useState(false)

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpen(false)
        }
    }

    return (
        <article
            className={`project-entry${open ? ' is-open' : ''}`}
            style={animStyle}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
        >
            <button
                type="button"
                className="project-entry-hit"
                onClick={onOpen}
                aria-label={`${project.title[lang]} ${lang === 'ko' ? '자세히 보기' : 'detail'}`}
            />

            <div className="project-entry-media">
                <ProjectBanner project={project} playing={open} lang={lang} />
            </div>

            <div className="project-entry-inner">
                <div className="project-entry-text">
                    <span className="project-entry-index">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="project-entry-title">{project.title[lang]}</h3>
                    <p className="project-entry-copy">{project.description[lang]}</p>

                    <div className="project-entry-reveal">
                        <div>
                            <div className="project-entry-tags">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>

                            <div className="project-entry-links">
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
                                        <Youtube size={13} />
                                        YouTube
                                    </a>
                                )}

                                <span className="project-entry-cta">
                                    {lang === 'ko' ? '자세히 보기' : 'Open Detail'}
                                    <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

const initialCount = 3

function Projects({ lang, navigate }) {
    const [showAll, setShowAll] = useState(false)
    const [ref, visible] = useInView()
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    const visibleProjects = showAll ? projects : projects.slice(0, initialCount)
    const hiddenCount = projects.length - initialCount

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

                <div className="project-entry-list">
                    {visibleProjects.map((project, i) => (
                        <ProjectEntry
                            key={project.id}
                            project={project}
                            index={i}
                            lang={lang}
                            onOpen={() => openProject(project.slug)}
                            animStyle={fx(120 + Math.min(i, initialCount) * 70)}
                        />
                    ))}
                </div>

                {!showAll && hiddenCount > 0 && (
                    <div className="project-show-more-row" style={fx(120 + initialCount * 70)}>
                        <button
                            type="button"
                            className="project-show-more"
                            onClick={() => setShowAll(true)}
                        >
                            {lang === 'ko' ? '더 보기' : 'Show More'}
                            <span className="project-show-more-count">{hiddenCount}</span>
                            <ChevronDown size={15} />
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '40px', textAlign: 'center', ...fx(120 + (initialCount + 1) * 70) }}>
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
