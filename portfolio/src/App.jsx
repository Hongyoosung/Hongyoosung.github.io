import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from './hooks/useTheme'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Activation from './components/sections/Activation'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import News from './components/sections/News'
import ProjectDetail from './components/pages/ProjectDetail'
import PublicationsPage from './components/pages/PublicationsPage'
import NewsPage from './components/pages/NewsPage'
import { getProjectBySlug } from './data/projects'
import { getPublicationById } from './data/publications'
import { getJournalBySlug } from './data/journals'

const normalizePath = () => window.location.pathname.replace(/\/+$/, '') || '/'

function App() {
    const { isDark, toggle } = useTheme()
    const [path, setPath] = useState(normalizePath)
    const [lang, setLang] = useState(() => normalizePath().startsWith('/ko') ? 'ko' : 'en')
    const [showTopButton, setShowTopButton] = useState(false)

    const currentPathRef = useRef(path)

    useEffect(() => {
        currentPathRef.current = path
    }, [path])

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }
        const onPopState = (e) => {
            const nextPath = normalizePath()
            const prevPath = currentPathRef.current
            setPath(nextPath)
            setLang(nextPath.startsWith('/ko') ? 'ko' : 'en')
            if (nextPath !== prevPath) {
                window.scrollTo({ top: 0, behavior: 'instant' })
            }
        }
        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    useEffect(() => {
        const updateTopButton = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement
            setShowTopButton(scrollTop + clientHeight >= scrollHeight - 24)
        }

        updateTopButton()
        window.addEventListener('scroll', updateTopButton, { passive: true })
        window.addEventListener('resize', updateTopButton)
        return () => {
            window.removeEventListener('scroll', updateTopButton)
            window.removeEventListener('resize', updateTopButton)
        }
    }, [path])

    const navigate = (to) => {
        const target = new URL(to, window.location.origin)
        const targetPath = target.pathname.replace(/\/+$/, '') || '/'
        const nextPath = targetPath === '/' && lang === 'ko' ? '/ko' : targetPath
        const nextUrl = `${nextPath}${target.hash}`

        window.history.pushState({}, '', nextUrl)
        setPath(nextPath)
        setLang(nextPath.startsWith('/ko') ? 'ko' : 'en')

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                if (target.hash) {
                    document.getElementById(decodeURIComponent(target.hash.slice(1)))
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    return
                }

                window.scrollTo({ top: 0, behavior: 'smooth' })
            })
        })
    }

    const toggleLanguage = () => {
        const nextLang = lang === 'ko' ? 'en' : 'ko'
        setLang(nextLang)

        const withoutKo = path.replace(/^\/ko(?=\/|$)/, '') || '/'
        const nextPath = nextLang === 'ko'
            ? withoutKo === '/' ? '/ko' : `/ko${withoutKo}`
            : withoutKo

        window.history.pushState({}, '', nextPath)
        setPath(normalizePath())
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const route = useMemo(() => {
        const clean = path.replace(/^\/ko(?=\/|$)/, '') || '/'
        if (clean === '/publications') return { type: 'publications' }
        if (clean === '/news') return { type: 'news' }
        if (clean.startsWith('/news/')) {
            return { type: 'journal', slug: clean.split('/')[2] }
        }
        if (clean.startsWith('/publications/')) {
            return { type: 'publication', id: clean.split('/')[2] }
        }
        if (clean.startsWith('/projects/')) {
            return { type: 'project', slug: clean.split('/')[2] }
        }
        return { type: 'home' }
    }, [path])

    const renderMain = () => {
        if (route.type === 'publications') {
            return <PublicationsPage lang={lang} navigate={navigate} />
        }

        if (route.type === 'publication') {
            return (
                <PublicationsPage
                    lang={lang}
                    navigate={navigate}
                    selectedPaper={getPublicationById(route.id)}
                />
            )
        }

        if (route.type === 'news') {
            return <NewsPage lang={lang} navigate={navigate} />
        }

        if (route.type === 'journal') {
            return (
                <NewsPage
                    lang={lang}
                    navigate={navigate}
                    selectedEntry={getJournalBySlug(lang, route.slug)}
                />
            )
        }

        if (route.type === 'project') {
            return (
                <ProjectDetail
                    lang={lang}
                    project={getProjectBySlug(route.slug)}
                    navigate={navigate}
                />
            )
        }

        return (
            <main>
                <Hero lang={lang} />
                <About lang={lang} />
                <Projects lang={lang} navigate={navigate} />
                <News lang={lang} navigate={navigate} />
                <Skills lang={lang} />
                <Activation lang={lang} />
                <Experience lang={lang} />
                <Contact lang={lang} />
            </main>
        )
    }

    return (
        <div className="min-h-screen bg-transition" style={{ backgroundColor: 'var(--color-bg)' }}>
            <Header
                isDark={isDark}
                lang={lang}
                onToggleTheme={toggle}
                onToggleLanguage={toggleLanguage}
                navigate={navigate}
            />
            {renderMain()}
            <Footer lang={lang} />
            {showTopButton && (
                <button
                    type="button"
                    className="top-button"
                    onClick={scrollToTop}
                    aria-label={lang === 'ko' ? '페이지 최상단으로 이동' : 'Back to top'}
                >
                    Top
                </button>
            )}
        </div>
    )
}

export default App
