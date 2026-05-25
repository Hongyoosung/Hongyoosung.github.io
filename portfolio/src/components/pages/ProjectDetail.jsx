import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import ImageLightbox from '../ui/ImageLightbox'

const createHeadingId = (text, index) => {
    const slug = text
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')

    return slug ? `project-section-${slug}-${index + 1}` : `project-section-${index + 1}`
}

const normalizeHeading = (text) => text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')

const shouldHideProject1Heading = (heading, allHeadings, project) => {
    if (project?.slug !== 'dynamic-eqs') return false

    const text = normalizeHeading(heading.textContent || '')
    const tagName = heading.tagName.toLowerCase()
    const previousHeadings = allHeadings.slice(0, allHeadings.indexOf(heading))
    const currentSection = [...previousHeadings]
        .reverse()
        .find((item) => ['h2', 'h3'].includes(item.tagName.toLowerCase()))
    const currentSectionText = normalizeHeading(currentSection?.textContent || '')

    const hiddenExact = new Set([
        'strike',
        'vanguard',
        'support',
        '팀보상믹싱teamrewardmixingmappocooperativesignal',
        'teamrewardmixingmappocooperativesignal',
        'ue5python보상파이프라인rewardpipeline',
        'ue5pythonrewardpipeline',
        '실험설계',
        'experimentaldesign',
        '종합',
        'summary',
    ])

    if (hiddenExact.has(text)) return true
    if (text.startsWith('1단계') || text.startsWith('step1')) return true
    if (text.startsWith('2단계') || text.startsWith('step2')) return true

    const isSubheading = tagName === 'h4'
    const isKeyFeatures = currentSectionText.includes('주요기능') || currentSectionText.includes('keyfeatures')
    const isProblemSolving = currentSectionText.includes('기술적난제') || currentSectionText.includes('problemsolving')

    if (isSubheading && isKeyFeatures) {
        return !text.startsWith('1dynamiceqs')
            && !text.startsWith('2mappo')
            && !text.startsWith('3aws')
    }

    if (isSubheading && isProblemSolving) {
        return !text.startsWith('problem1')
            && !text.startsWith('problem2')
            && !text.startsWith('problem3')
    }

    return false
}

const getTocHeadings = (root, project) => {
    const allHeadings = Array.from(root?.querySelectorAll('h2, h3, h4') || [])
        .filter((heading) => heading.textContent.trim().length > 0)

    return allHeadings.filter((heading) => !shouldHideProject1Heading(heading, allHeadings, project))
}

const removeMathDelimiters = (element) => {
    const previous = element.previousSibling
    const next = element.nextSibling

    if (previous?.nodeType === Node.TEXT_NODE) {
        previous.textContent = previous.textContent.replace(/\$\s*$/, '')
    }

    if (next?.nodeType === Node.TEXT_NODE) {
        next.textContent = next.textContent.replace(/^\s*\$/, '')
    }
}

const renderProjectMath = (root) => {
    root?.querySelectorAll('.project-math, .project-inline-math').forEach((element) => {
        const tex = element.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
        if (!tex) return

        removeMathDelimiters(element)
        katex.render(tex, element, {
            displayMode: element.classList.contains('project-math'),
            throwOnError: false,
        })
    })
}

function ProjectDetail({ project, lang, navigate }) {
    const contentRef = useRef(null)
    const detailSectionRef = useRef(null)
    const tocRef = useRef(null)
    const [tocItems, setTocItems] = useState([])
    const [activeId, setActiveId] = useState('')
    const [lightboxImage, setLightboxImage] = useState(null)

    useEffect(() => {
        const root = contentRef.current
        if (!project || !root) return

        const usedIds = new Set()
        const headings = getTocHeadings(root, project)

        const nextItems = headings.map((heading, index) => {
            let id = heading.id || createHeadingId(heading.textContent, index)
            let suffix = 2

            while (usedIds.has(id)) {
                id = `${id}-${suffix}`
                suffix += 1
            }

            heading.id = id
            heading.dataset.tocId = id
            usedIds.add(id)

            const headingLevel = Number(heading.tagName.replace('H', ''))

            return {
                id,
                index,
                text: heading.textContent.trim(),
                level: headingLevel >= 4 ? 2 : 1,
            }
        })

        setTocItems(nextItems)
        setActiveId(nextItems[0]?.id || '')

        if (nextItems.length === 0) return

        const updateActiveHeading = () => {
            const currentHeadings = getTocHeadings(root, project)
            const current = nextItems.reduce((active, item) => {
                const heading = currentHeadings[item.index]
                if (!heading) return active
                return heading.getBoundingClientRect().top <= 150 ? item.id : active
            }, nextItems[0].id)

            setActiveId(current)
        }

        updateActiveHeading()
        window.addEventListener('scroll', updateActiveHeading, { passive: true })
        window.addEventListener('resize', updateActiveHeading)

        return () => {
            window.removeEventListener('scroll', updateActiveHeading)
            window.removeEventListener('resize', updateActiveHeading)
        }
    }, [project, lang])

    useEffect(() => {
        const root = contentRef.current
        if (!project || !root) return undefined

        const frameId = window.requestAnimationFrame(() => renderProjectMath(root))
        return () => window.cancelAnimationFrame(frameId)
    }, [project, lang, tocItems.length])

    useEffect(() => {
        const section = detailSectionRef.current
        const toc = tocRef.current
        if (!section || !toc || tocItems.length === 0) return

        let currentY = section.offsetTop + 96
        let frameId = 0

        const animateToc = () => {
            const sectionTop = section.offsetTop
            const sectionBottom = sectionTop + section.offsetHeight
            const tocHeight = toc.offsetHeight
            const viewportTarget = window.scrollY + window.innerHeight * 0.2
            const minY = sectionTop + 96
            const maxY = Math.max(minY, sectionBottom - tocHeight - 96)
            const targetY = Math.min(Math.max(viewportTarget, minY), maxY)

            currentY += (targetY - currentY) * 0.14
            toc.style.transform = `translate3d(0, ${currentY}px, 0)`
            frameId = window.requestAnimationFrame(animateToc)
        }

        toc.style.transform = `translate3d(0, ${currentY}px, 0)`
        frameId = window.requestAnimationFrame(animateToc)

        return () => window.cancelAnimationFrame(frameId)
    }, [tocItems.length, project, lang])

    const scrollToHeading = (event, id) => {
        event.preventDefault()
        const item = tocItems.find((tocItem) => tocItem.id === id)
        const heading = item ? getTocHeadings(contentRef.current, project)[item.index] : null
        if (!heading) return

        const targetTop = heading.getBoundingClientRect().top + window.scrollY - 128
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
        window.history.replaceState({}, '', `${window.location.pathname}#${id}`)
        setActiveId(id)
    }

    const openProjectImage = (event) => {
        const image = event.target.closest?.('img')
        if (!image || !event.currentTarget.contains(image)) return

        setLightboxImage({
            src: image.currentSrc || image.src,
            alt: image.alt || project.title[lang],
        })
    }

    if (!project) {
        return (
            <main className="section-padding page-offset">
                <div className="container-max">
                    <button className="back-button" onClick={() => navigate(lang === 'ko' ? '/ko' : '/')}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? '홈으로 돌아가기' : 'Back Home'}
                    </button>
                    <h1 className="page-title">{lang === 'ko' ? '프로젝트를 찾을 수 없습니다.' : 'Project not found.'}</h1>
                </div>
            </main>
        )
    }

    return (
        <main className="project-detail-page page-offset">
            <section
                className="project-detail-hero"
                style={{ backgroundImage: `linear-gradient(rgba(8,10,14,0.62), rgba(8,10,14,0.82)), url(${project.gif || project.image})` }}
            >
                <div className="container-max">
                    <button className="back-button light" onClick={() => navigate(lang === 'ko' ? '/ko#projects' : '/#projects')}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? '프로젝트 목록' : 'Projects'}
                    </button>

                    <p className="page-eyebrow">Project Detail</p>
                    <h1 className="project-detail-title">{project.title[lang]}</h1>
                    <p className="project-detail-copy">{project.description[lang]}</p>

                    <div className="project-meta-grid">
                        <div>
                            <span>{lang === 'ko' ? '기간' : 'Period'}</span>
                            <strong>{project.period}</strong>
                        </div>
                        <div>
                            <span>{lang === 'ko' ? '팀' : 'Team'}</span>
                            <strong>{project.team[lang]}</strong>
                        </div>
                        <div>
                            <span>{lang === 'ko' ? '역할' : 'Role'}</span>
                            <strong>{project.role[lang]}</strong>
                        </div>
                    </div>

                    <div className="project-keyword-row" aria-label="Project keywords">
                        {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding" ref={detailSectionRef}>
                <div className="container-max project-detail-layout" ref={contentRef}>
                    <div className="project-detail-main" onClick={openProjectImage}>
                        <div className="detail-media">
                            <img src={project.detailImage || project.gif || project.image} alt={project.title[lang]} />
                        </div>

                        <h2 className="section-title small">{lang === 'ko' ? '핵심 작업' : 'Key Work'}</h2>
                        <ul className="feature-list">
                            {project.highlights[lang].map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        {project.content?.[lang] && (
                            <article
                                className="project-content"
                                dangerouslySetInnerHTML={{ __html: project.content[lang] }}
                            />
                        )}
                    </div>
                </div>
            </section>

            {tocItems.length > 0 && (
                <aside ref={tocRef} className="project-toc-sidebar" aria-label={lang === 'ko' ? '목차' : 'Table of contents'}>
                    <nav className="project-toc-wrapper">
                        <ul className="project-toc-list">
                            {tocItems.map((item) => (
                                <li key={item.id} className="project-toc-item">
                                    <a
                                        href={`#${item.id}`}
                                        className={`project-toc-link project-toc-level-${Math.min(item.level, 5)}${activeId === item.id ? ' active' : ''}`}
                                        onClick={(event) => scrollToHeading(event, item.id)}
                                    >
                                        <span className="project-toc-indicator" />
                                        <span className="project-toc-text">{item.text}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            )}
            <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        </main>
    )
}

export default ProjectDetail
