import { useState } from 'react'
import { Mail, Github, BookOpen, ArrowUpRight, Copy, Check, Linkedin } from 'lucide-react'
import { personalInfo } from '../../data/personal'
import { useInView } from '../../hooks/useInView'

function Contact({ lang }) {
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
        { label: lang === 'ko' ? '이메일' : 'Email', value: personalInfo.email, isEmail: true },
        { label: 'GitHub', value: 'github.com/yoosunghong', href: personalInfo.github, icon: <Github size={16} /> },
        { label: 'LinkedIn', value: 'linkedin.com/in/yoosunghong', href: personalInfo.linkedin, icon: <Linkedin size={16} /> },
        { label: 'Blog', value: 'yoosunghong.notion.site', href: personalInfo.blog, icon: <BookOpen size={16} /> },
    ]

    return (
        <section ref={ref} id="contact" aria-label="Contact" className="section-padding section-tone-black">
            <div className="container-max">
                <p className="section-eyebrow" style={fx(0)}>Contact</p>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '56px 80px',
                        alignItems: 'start',
                    }}
                >
                    <div style={fx(60)}>
                        <h2 className="section-title">{lang === 'ko' ? '함께 이야기해요.' : 'Let us talk.'}</h2>
                        <p className="section-copy">
                            {lang === 'ko'
                                ? '프로젝트 제안, 연구 협업, 기술 대화 모두 환영합니다. 메일을 보내주시면 확인 후 답장드리겠습니다.'
                                : 'Project ideas, research collaboration, and engineering conversations are all welcome. Send me a note and I will get back to you.'}
                        </p>
                    </div>

                    <div style={fx(140)}>
                        {links.map(({ label, value, href, icon, isEmail }) => {
                            const inner = (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ color: 'var(--color-fg-muted)' }}>
                                            {isEmail ? <Mail size={16} /> : icon}
                                        </span>
                                        <span className="contact-label">{label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="contact-value">{value}</span>
                                        {isEmail
                                            ? copied ? <Check size={13} style={{ color: 'var(--color-accent)' }} /> : <Copy size={13} />
                                            : <ArrowUpRight size={13} />}
                                    </div>
                                </>
                            )

                            if (isEmail) {
                                return (
                                    <button key={label} onClick={handleCopyEmail} className="contact-row">
                                        {inner}
                                    </button>
                                )
                            }

                            return (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact-row">
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
