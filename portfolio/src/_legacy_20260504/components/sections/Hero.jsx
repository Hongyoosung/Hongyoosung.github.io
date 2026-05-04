import { useState, useEffect } from 'react'
import { Github, Mail, BookOpen, ArrowDown } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import profile from '../../assets/profile.png'

function Hero() {
    const scrollTo = (id) =>
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

    const [typed, setTyped] = useState('')
    const [cursor, setCursor] = useState(true)
    const titles = personalInfo.titles?.length > 1
        ? personalInfo.titles
        : [personalInfo.title]

    useEffect(() => {
        let timeout
        let interval
        let currentTitleIndex = 0
        let currentCharIndex = 0
        let isDeleting = false

        const typeNextTitle = () => {
            const currentTitle = titles[currentTitleIndex]
            if (!isDeleting && currentCharIndex < currentTitle.length) {
                currentCharIndex++
                setTyped(currentTitle.slice(0, currentCharIndex))
                interval = setTimeout(typeNextTitle, 55)
            } else if (!isDeleting && currentCharIndex === currentTitle.length) {
                isDeleting = true
                interval = setTimeout(typeNextTitle, 3000)
            } else if (isDeleting && currentCharIndex > 0) {
                currentCharIndex--
                setTyped(titles[currentTitleIndex].slice(0, currentCharIndex))
                interval = setTimeout(typeNextTitle, 40)
            } else {
                isDeleting = false
                currentTitleIndex = (currentTitleIndex + 1) % titles.length
                interval = setTimeout(typeNextTitle, 300)
            }
        }

        timeout = setTimeout(typeNextTitle, 700)
        return () => { clearTimeout(timeout); clearTimeout(interval) }
    }, [titles])

    useEffect(() => {
        const blink = setInterval(() => setCursor(v => !v), 500)
        return () => clearInterval(blink)
    }, [])

    return (
        <section
            id="hero"
            aria-label="소개"
            className="hero-section"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 24px',
                paddingTop: '80px',
                textAlign: 'center',
                overflow: 'hidden',
            }}
        >

            {/* Gradient overlay */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.72) 100%)',
                }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', width: '100%' }}>

                {/* PORTFOLIO label */}
                <p
                    style={{
                        fontFamily: 'var(--font-body)', fontSize: '12px',
                        fontWeight: 700, color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.22em', textTransform: 'uppercase',
                        margin: '0 0 24px 0',
                        animation: 'fadeInUp 0.6s ease both',
                    }}
                >
                    Portfolio
                </p>

                {/* Name */}
                <h1
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(54px, 9vw, 96px)',
                        fontWeight: 700, lineHeight: 1.0,
                        letterSpacing: '-0.04em',
                        color: '#ffffff',
                        margin: '0 0 16px 0',
                        animation: 'fadeInUp 0.6s ease 80ms both',
                    }}
                >
                    {personalInfo.name}
                </h1>

                {/* Title — typewriter */}
                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(15px, 2.2vw, 22px)',
                        fontWeight: 400, lineHeight: 1.4,
                        color: 'rgba(255,255,255,0.7)',
                        margin: '0 0 32px 0',
                        animation: 'fadeInUp 0.6s ease 160ms both',
                        minHeight: '1.4em',
                    }}
                >
                    {typed}
                    <span
                        style={{
                            display: 'inline-block',
                            width: '2px', height: '1em',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            verticalAlign: 'text-bottom',
                            marginLeft: '2px',
                            opacity: cursor ? 1 : 0,
                            transition: 'opacity 0.1s ease',
                        }}
                    />
                </p>

                {/* Description */}
                <p
                    style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px', fontWeight: 400,
                        lineHeight: 1.75, letterSpacing: '0.15px',
                        color: 'rgba(255,255,255,0.6)',
                        margin: '0 auto 48px',
                        maxWidth: '480px',
                        animation: 'fadeInUp 0.6s ease 240ms both',
                    }}
                >
                    {personalInfo.description}
                </p>

                {/* CTA Buttons */}
                <div
                    style={{
                        display: 'flex', flexWrap: 'wrap',
                        alignItems: 'center', justifyContent: 'center', gap: '10px',
                        marginBottom: '80px',
                        animation: 'fadeInUp 0.6s ease 320ms both',
                    }}
                >
                    <button
                        onClick={() => scrollTo('projects')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600,
                            color: '#111', backgroundColor: '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '9999px', padding: '11px 26px',
                            cursor: 'pointer',
                            transition: 'opacity 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        프로젝트 보기
                    </button>

                    <a
                        href={`mailto:${personalInfo.email}`}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500,
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.35)',
                            borderRadius: '9999px', padding: '11px 22px',
                            textDecoration: 'none',
                            transition: 'border-color 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'}
                    >
                        <Mail size={15} />
                        연락하기
                    </a>

                    {[
                        { href: personalInfo.github, icon: <Github size={16} />, label: 'GitHub' },
                        { href: personalInfo.blog,   icon: <BookOpen size={16} />, label: '블로그' },
                    ].map(({ href, icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '44px', height: '44px', borderRadius: '9999px',
                                border: '1px solid rgba(255,255,255,0.35)',
                                color: 'rgba(255,255,255,0.7)',
                                textDecoration: 'none',
                                transition: 'color 0.15s ease, border-color 0.15s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#ffffff'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                            }}
                        >
                            {icon}
                        </a>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div style={{ animation: 'fadeInUp 0.6s ease 480ms both' }}>
                    <button
                        onClick={() => scrollTo('about')}
                        aria-label="About 섹션으로 이동"
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'inline-flex', flexDirection: 'column',
                            alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.45)',
                            fontFamily: 'var(--font-body)', fontSize: '11px',
                            fontWeight: 500, padding: 0,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            animation: 'nudge 2.4s ease-in-out 1.5s infinite',
                        }}
                    >
                        <ArrowDown size={16} strokeWidth={1.5} />
                        scroll
                    </button>
                </div>
            </div>

            <style>{`
                .hero-section {
                    background-image: url(${profile});
                    background-repeat: no-repeat;
                    background-position: 25% top;
                    background-size: 48%;
                }
                @keyframes nudge {
                    0%, 100% { transform: translateY(0); opacity: 0.6; }
                    50% { transform: translateY(7px); opacity: 0.25; }
                }
                @media (max-width: 640px) {
                    .hero-section {
                        background-image: none;
                    }
                }
            `}</style>
        </section>
    )
}

export default Hero
