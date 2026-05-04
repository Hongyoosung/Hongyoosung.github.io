import { useEffect, useState } from 'react'
import { Github, BookOpen, ArrowDown, Linkedin } from 'lucide-react'
import { personalInfo } from '../../data/personal'

const profileAssets = import.meta.glob('../../assets/profile.png', {
    eager: true,
    import: 'default',
    query: '?url',
})
const profileUrl = Object.values(profileAssets)[0] ?? '/profile.png'

function Hero({ lang }) {
    const scrollTo = (id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

    const [typed, setTyped] = useState('')
    const [cursor, setCursor] = useState(true)
    const titles = personalInfo.titles[lang]

    useEffect(() => {
        let timer
        let currentTitleIndex = 0
        let currentCharIndex = 0
        let isDeleting = false

        const typeNextTitle = () => {
            const currentTitle = titles[currentTitleIndex]
            if (!isDeleting && currentCharIndex < currentTitle.length) {
                currentCharIndex += 1
                setTyped(currentTitle.slice(0, currentCharIndex))
                timer = setTimeout(typeNextTitle, 45)
            } else if (!isDeleting) {
                isDeleting = true
                timer = setTimeout(typeNextTitle, 2400)
            } else if (currentCharIndex > 0) {
                currentCharIndex -= 1
                setTyped(currentTitle.slice(0, currentCharIndex))
                timer = setTimeout(typeNextTitle, 28)
            } else {
                isDeleting = false
                currentTitleIndex = (currentTitleIndex + 1) % titles.length
                timer = setTimeout(typeNextTitle, 260)
            }
        }

        timer = setTimeout(typeNextTitle, 500)
        return () => clearTimeout(timer)
    }, [titles])

    useEffect(() => {
        const blink = setInterval(() => setCursor(v => !v), 500)
        return () => clearInterval(blink)
    }, [])

    const copy = {
        portfolio: 'Portfolio',
    }

    return (
        <section
            id="hero"
            aria-label="Intro"
            className="hero-section"
            style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '56px 24px 32px',
                textAlign: 'center',
                overflow: 'hidden',
            }}
        >
            <div
                aria-hidden="true"
                className="hero-overlay"
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', width: '100%' }}>
                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--hero-text-muted)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        margin: '0 0 24px',
                        animation: 'fadeInUp 0.6s ease both',
                    }}
                >
                    {copy.portfolio}
                </p>

                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(54px, 9vw, 96px)',
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        color: 'var(--hero-text)',
                        margin: '0 0 16px',
                        animation: 'fadeInUp 0.6s ease 80ms both',
                    }}
                >
                    {personalInfo.name[lang]}
                </h1>

                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(15px, 2.2vw, 22px)',
                        fontWeight: 400,
                        lineHeight: 1.4,
                        color: 'var(--hero-text-secondary)',
                        margin: '0 0 32px',
                        minHeight: '1.4em',
                        animation: 'fadeInUp 0.6s ease 160ms both',
                    }}
                >
                    {typed}
                    <span
                        style={{
                            display: 'inline-block',
                            width: '2px',
                            height: '1em',
                            backgroundColor: 'var(--hero-text-secondary)',
                            verticalAlign: 'text-bottom',
                            marginLeft: '2px',
                            opacity: cursor ? 1 : 0,
                        }}
                    />
                </p>

                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 1.75,
                        color: 'var(--hero-text-secondary)',
                        margin: '0 auto 48px',
                        maxWidth: '560px',
                        animation: 'fadeInUp 0.6s ease 240ms both',
                    }}
                >
                    {personalInfo.description[lang]}
                </p>

                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '76px',
                        animation: 'fadeInUp 0.6s ease 320ms both',
                    }}
                >
                    {[
                        { href: personalInfo.github, icon: <Github size={16} />, label: 'GitHub' },
                        { href: personalInfo.linkedin, icon: <Linkedin size={16} />, label: 'LinkedIn' },
                        { href: personalInfo.blog, icon: <BookOpen size={16} />, label: 'Blog' },
                    ].map(({ href, icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '44px',
                                height: '44px',
                                borderRadius: '9999px',
                                border: '1px solid var(--hero-icon-border)',
                                color: 'var(--hero-text-secondary)',
                                textDecoration: 'none',
                            }}
                        >
                            {icon}
                        </a>
                    ))}
                </div>

                <button
                    onClick={() => scrollTo('about')}
                    aria-label="Scroll to about"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--hero-text-muted)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: 0,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        animation: 'nudge 2.4s ease-in-out 1.5s infinite',
                    }}
                >
                    <ArrowDown size={16} strokeWidth={1.5} />
                    scroll
                </button>
            </div>

            <style>{`
                .hero-section {
                    --hero-text: var(--color-fg);
                    --hero-text-secondary: var(--color-fg-secondary);
                    --hero-text-muted: var(--color-fg-muted);
                    --hero-icon-border: var(--color-border);
                    height: 100vh;
                    min-height: 720px;
                    background-image: url('${profileUrl}');
                    background-repeat: no-repeat;
                    background-position: 22% top;
                    background-size: 34%;
                    background-color: var(--color-bg);
                }
                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background:
                        linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.46) 50%, var(--color-bg) 100%);
                }
                .dark .hero-section {
                    --hero-text: #fff;
                    --hero-text-secondary: rgba(255,255,255,0.75);
                    --hero-text-muted: rgba(255,255,255,0.56);
                    --hero-icon-border: rgba(255,255,255,0.35);
                    background-color: #0f1115;
                }
                .dark .hero-overlay {
                    background:
                        linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.36) 45%, rgba(0,0,0,0.74) 100%);
                }
                @keyframes nudge {
                    0%, 100% { transform: translateY(0); opacity: 0.62; }
                    50% { transform: translateY(7px); opacity: 0.28; }
                }
                @media (max-width: 640px) {
                    .hero-section {
                        height: 100svh;
                        min-height: 680px;
                        background-position: center top;
                        background-size: 72%;
                    }
                }
            `}</style>
        </section>
    )
}

export default Hero
