import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import { personalInfo } from '../../data/personal'

function Header({ isDark, onToggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNavClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setMobileOpen(false)
    }

    const bg = isDark
        ? scrolled ? 'rgba(17, 17, 17, 0.94)' : 'rgba(17, 17, 17, 0)'
        : scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0)'
    const borderColor = scrolled
        ? isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
        : 'transparent'

    // 스크롤 전: 사진 배경 위이므로 흰색 고정 / 스크롤 후: 테마 색상
    const fgColor     = scrolled ? 'var(--color-fg)'       : '#ffffff'
    const fgMuted     = scrolled ? 'var(--color-fg-muted)' : 'rgba(255,255,255,0.65)'
    const borderTone  = scrolled
        ? isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
        : 'rgba(255,255,255,0.3)'

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
            <nav
                className="container-max flex items-center justify-between px-6 h-14"
                aria-label="메인 네비게이션"
            >
                {/* Logo */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        color: fgColor,
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px', fontWeight: 700,
                        letterSpacing: '0.04em',
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.3s ease',
                    }}
                    aria-label="최상단으로 이동"
                >
                    {personalInfo.nameEn}
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => handleNavClick(id)}
                            style={{
                                color: fgMuted,
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px', fontWeight: 500,
                                letterSpacing: '0.01em',
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: 0,
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = fgColor}
                            onMouseLeave={e => e.currentTarget.style.color = fgMuted}
                        >
                            {label}
                        </button>
                    ))}

                    {/* Theme toggle */}
                    <button
                        onClick={onToggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: `1px solid ${borderTone}`,
                            color: fgMuted,
                            background: 'none', cursor: 'pointer',
                            transition: 'color 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = fgColor
                            e.currentTarget.style.borderColor = fgMuted
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = fgMuted
                            e.currentTarget.style.borderColor = borderTone
                        }}
                        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                    >
                        {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    </button>
                </div>

                {/* Mobile controls */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={onToggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px',
                            color: fgMuted,
                            background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'color 0.3s ease',
                        }}
                        aria-label={isDark ? '라이트 모드' : '다크 모드'}
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px',
                            color: fgColor,
                            background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'color 0.3s ease',
                        }}
                        aria-label="메뉴 열기/닫기"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div
                    className="md:hidden px-6 pb-5 flex flex-col gap-1"
                    style={{
                        borderTop: `1px solid ${borderColor || 'var(--color-border)'}`,
                        backgroundColor: isDark ? 'rgba(17,17,17,0.97)' : 'rgba(255,255,255,0.97)',
                    }}
                    role="menu"
                >
                    {navLinks.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => handleNavClick(id)}
                            style={{
                                textAlign: 'left', padding: '12px 0',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px', fontWeight: 500,
                                color: 'var(--color-fg-secondary)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                borderBottom: '1px solid var(--color-border-subtle)',
                                transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-fg)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-fg-secondary)'}
                            role="menuitem"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    )
}

export default Header
