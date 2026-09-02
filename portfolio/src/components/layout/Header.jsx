import { useEffect, useState } from 'react'
import { Menu, X, Sun, Moon, Download } from 'lucide-react'
import { navLinks, resumeFiles, resumeLabel } from '../../data/navigation'
import { personalInfo } from '../../data/personal'

function Header({ isDark, lang, onToggleTheme, onToggleLanguage, navigate }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const goHome = () => {
        navigate(lang === 'ko' ? '/ko' : '/')
        setMobileOpen(false)
    }

    const handleNavClick = (link) => {
        if (link.type === 'page') {
            navigate(lang === 'ko' ? `/ko${link.path}` : link.path)
        } else {
            const currentPath = window.location.pathname.replace(/^\/ko(?=\/|$)/, '') || '/'
            if (currentPath !== '/') {
                navigate(lang === 'ko' ? '/ko' : '/')
                window.setTimeout(() => {
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                }, 80)
            } else {
                document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
            }
        }
        setMobileOpen(false)
    }

    const bg = isDark
        ? scrolled ? 'rgba(17, 17, 17, 0.94)' : 'rgba(17, 17, 17, 0)'
        : scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0)'
    const borderColor = scrolled
        ? isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
        : 'transparent'
    const fgColor = scrolled ? 'var(--color-fg)' : isDark ? '#ffffff' : 'var(--color-fg)'
    const fgMuted = scrolled
        ? 'var(--color-fg-muted)'
        : isDark ? 'rgba(255,255,255,0.7)' : 'var(--color-fg-secondary)'
    const borderTone = scrolled
        ? isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
        : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.16)'
    const languageLabel = lang === 'ko' ? 'Ko' : 'En'
    const sectionLinks = navLinks.filter((link) => link.type === 'section')
    const pageLinks = navLinks.filter((link) => link.type === 'page')

    const iconButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: `1px solid ${borderTone}`,
        color: fgMuted,
        background: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 700,
        transition: 'color 0.15s ease, border-color 0.15s ease',
    }

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50"
            style={{
                backgroundColor: bg,
                backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: `1px solid ${borderColor}`,
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
            role="banner"
        >
            <nav className="container-max flex items-center justify-between px-6 h-14" aria-label="Main navigation">
                <button
                    onClick={goHome}
                    style={{
                        color: fgColor,
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.3s ease',
                    }}
                    aria-label="Go home"
                >
                    {personalInfo.nameEn}
                </button>

                <div className="hidden md:flex items-center gap-7">
                    {sectionLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavClick(link)}
                            style={{
                                color: fgMuted,
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = fgColor}
                            onMouseLeave={e => e.currentTarget.style.color = fgMuted}
                        >
                            {link.label[lang]}
                        </button>
                    ))}

                    <span
                        aria-hidden="true"
                        style={{
                            width: '1px',
                            height: '18px',
                            backgroundColor: borderTone,
                            marginLeft: '-8px',
                            marginRight: '-8px',
                        }}
                    />

                    <div className="nav-page-group">
                        {pageLinks.map((link) => (
                            <button
                                key={link.id}
                                className="nav-page-link"
                                onClick={() => handleNavClick(link)}
                                style={{
                                    color: fgMuted,
                                    borderColor: borderTone,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = fgColor
                                    e.currentTarget.style.borderColor = fgColor
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = fgMuted
                                    e.currentTarget.style.borderColor = borderTone
                                }}
                            >
                                {link.label[lang]}
                            </button>
                        ))}

                        <a
                            className="nav-page-link nav-resume-link"
                            href={resumeFiles[lang]}
                            download
                            style={{
                                color: fgMuted,
                                borderColor: borderTone,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = fgColor
                                e.currentTarget.style.borderColor = fgColor
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = fgMuted
                                e.currentTarget.style.borderColor = borderTone
                            }}
                            aria-label={lang === 'ko' ? '이력서 PDF 내려받기' : 'Download resume PDF'}
                        >
                            <Download size={13} />
                            {resumeLabel[lang]}
                        </a>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={onToggleLanguage}
                            style={iconButtonStyle}
                            title={lang === 'ko' ? 'Switch to English' : 'Switch to Korean'}
                            aria-label={lang === 'ko' ? 'Current language Korean. Switch to English' : 'Current language English. Switch to Korean'}
                        >
                            {languageLabel}
                        </button>

                        <button
                            onClick={onToggleTheme}
                            style={iconButtonStyle}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        </button>
                    </div>
                </div>

                <div className="flex md:hidden items-center gap-1">
                    <button onClick={onToggleLanguage} style={{ ...iconButtonStyle, border: 'none' }} aria-label="Toggle language">
                        {languageLabel}
                    </button>
                    <button onClick={onToggleTheme} style={{ ...iconButtonStyle, border: 'none' }} aria-label="Toggle theme">
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        style={{ ...iconButtonStyle, border: 'none', color: fgColor }}
                        aria-label="Open navigation menu"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div
                    className="md:hidden px-6 pb-5 flex flex-col gap-1"
                    style={{
                        borderTop: `1px solid ${borderColor || 'var(--color-border)'}`,
                        backgroundColor: isDark ? 'rgba(17,17,17,0.97)' : 'rgba(255,255,255,0.97)',
                    }}
                    role="menu"
                >
                    {[...sectionLinks, ...pageLinks].map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavClick(link)}
                            style={{
                                textAlign: 'left',
                                padding: '12px 0',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: 'var(--color-fg-secondary)',
                                background: 'none',
                                border: 'none',
                                borderBottom: '1px solid var(--color-border-subtle)',
                                cursor: 'pointer',
                            }}
                            role="menuitem"
                        >
                            {link.label[lang]}
                        </button>
                    ))}

                    <a
                        href={resumeFiles[lang]}
                        download
                        onClick={() => setMobileOpen(false)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 0',
                            fontFamily: 'var(--font-body)',
                            fontSize: '15px',
                            fontWeight: 500,
                            color: 'var(--color-fg-secondary)',
                            textDecoration: 'none',
                            borderBottom: '1px solid var(--color-border-subtle)',
                        }}
                        role="menuitem"
                    >
                        <Download size={15} />
                        {resumeLabel[lang]}
                    </a>
                </div>
            )}
        </header>
    )
}

export default Header
