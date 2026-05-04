import { useState } from 'react'
import { Mail, Github, BookOpen, MapPin, ArrowUpRight, Copy, Check } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { useInView } from '../../hooks/useInView'

function Contact() {
    const [ref, visible] = useInView()
    const [copied, setCopied] = useState(false)

    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    const handleCopyEmail = (e) => {
        e.preventDefault()
        navigator.clipboard.writeText(personalInfo.email).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    const links = [
        {
            label: '이메일',
            value: personalInfo.email,
            isEmail: true,
        },
        {
            label: 'GitHub',
            value: 'github.com/jeonginh0',
            href: personalInfo.github,
            icon: <Github size={16} />,
        },
        {
            label: '블로그',
            value: 'backendinho.tistory.com',
            href: personalInfo.blog,
            icon: <BookOpen size={16} />,
        },
    ]

    return (
        <section
            ref={ref}
            id="contact"
            aria-label="연락처"
            className="section-padding"
            style={{ backgroundColor: 'var(--color-bg-alt)' }}
        >
            <div className="container-max">
                <p
                    style={{
                        fontFamily: 'var(--font-body)', fontSize: '13px',
                        fontWeight: 500, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-fg-muted)', margin: '0 0 20px 0',
                        ...fx(0),
                    }}
                >
                    Contact
                </p>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '56px 80px',
                        alignItems: 'start',
                    }}
                >
                    {/* Left */}
                    <div style={fx(60)}>
                        <h2
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(28px, 4vw, 42px)',
                                fontWeight: 700, lineHeight: 1.15,
                                letterSpacing: '-0.025em',
                                color: 'var(--color-fg)', margin: '0 0 20px 0',
                            }}
                        >
                            소통
                        </h2>

                        <p
                            style={{
                                fontFamily: 'var(--font-body)', fontSize: '16px',
                                fontWeight: 400, lineHeight: 1.8, letterSpacing: '0.16px',
                                color: 'var(--color-fg-secondary)', margin: '0 0 28px 0',
                            }}
                        >
                            새로운 기회나 프로젝트 제안은 언제나 환영합니다.<br />
                            메일을 보내주시면 빠르게 답장드리겠습니다.
                        </p>
                    </div>

                    {/* Right */}
                    <div style={{ ...fx(140) }}>
                        {links.map(({ label, value, href, icon, isEmail }) => {
                            const rowStyle = {
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 0',
                                borderBottom: '1px solid var(--color-border-subtle)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'opacity 0.15s ease',
                            }

                            const inner = (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ color: 'var(--color-fg-muted)' }}>
                                            {isEmail ? <Mail size={16} /> : icon}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-body)', fontSize: '14px',
                                                fontWeight: 500, color: 'var(--color-fg-muted)',
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-body)', fontSize: '14px',
                                                color: 'var(--color-fg-secondary)',
                                            }}
                                        >
                                            {value}
                                        </span>
                                        {isEmail ? (
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                {copied
                                                    ? <Check size={13} style={{ color: '#f5d094ff' }} />
                                                    : <Copy size={13} style={{ color: 'var(--color-fg-muted)' }} />
                                                }
                                                {copied && (
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 'calc(100% + 8px)',
                                                            right: '0%',
                                                            transform: 'translateX(-50%)',
                                                            whiteSpace: 'nowrap',
                                                            fontFamily: 'var(--font-body)', fontSize: '11px',
                                                            fontWeight: 500, color: '#f5d094ff',
                                                            // backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                            // border: '1px solid rgba(245, 245, 245, 0.2)',
                                                            borderRadius: '5px', padding: '2px 7px',
                                                            animation: 'fadeInUp 0.2s ease both',
                                                            pointerEvents: 'none',
                                                        }}
                                                    >
                                                        복사 완료!
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <ArrowUpRight size={13} style={{ color: 'var(--color-fg-muted)' }} />
                                        )}
                                    </div>
                                </>
                            )

                            if (isEmail) {
                                return (
                                    <button
                                        key={label}
                                        onClick={handleCopyEmail}
                                        style={{
                                            ...rowStyle,
                                            width: '100%',
                                            background: 'none',
                                            borderTop: 'none',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        {inner}
                                    </button>
                                )
                            }

                            return (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={rowStyle}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {inner}
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact
