import { useEffect, useMemo, useState } from 'react'
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
import ProjectDetail from './components/pages/ProjectDetail'
import PublicationsPage from './components/pages/PublicationsPage'
import { getProjectBySlug } from './data/projects'

const normalizePath = () => window.location.pathname.replace(/\/+$/, '') || '/'

function App() {
    const { isDark, toggle } = useTheme()
    const [path, setPath] = useState(normalizePath)
    const [lang, setLang] = useState(() => normalizePath().startsWith('/ko') ? 'ko' : 'en')
    const [showTopButton, setShowTopButton] = useState(false)

    useEffect(() => {
        const onPopState = () => {
            const nextPath = normalizePath()
            setPath(nextPath)
            setLang(nextPath.startsWith('/ko') ? 'ko' : 'en')
            window.scrollTo({ top: 0, behavior: 'instant' })
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
        const nextPath = to === '/' && lang === 'ko' ? '/ko' : to
        window.history.pushState({}, '', nextPath)
        setPath(normalizePath())
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
        if (clean.startsWith('/projects/')) {
            return { type: 'project', slug: clean.split('/')[2] }
        }
        return { type: 'home' }
    }, [path])

    const renderMain = () => {
        if (route.type === 'publications') {
            return <PublicationsPage lang={lang} navigate={navigate} />
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
