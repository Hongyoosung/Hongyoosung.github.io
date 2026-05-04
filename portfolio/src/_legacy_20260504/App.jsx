import { useTheme } from './hooks/useTheme'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Education from './components/sections/Education'
import Contact from './components/sections/Contact'

function App() {
    const { isDark, toggle } = useTheme()

    return (
        <div className="min-h-screen bg-transition" style={{ backgroundColor: 'var(--color-bg)' }}>
            <Header isDark={isDark} onToggleTheme={toggle} />

            <main>
                <Hero />
                <About />
                <Projects />
                <Skills />
                <Experience />
                <Education />
                <Contact />
            </main>

            <Footer />
        </div>
    )
}

export default App
