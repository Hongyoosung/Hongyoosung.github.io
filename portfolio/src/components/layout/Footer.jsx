import { Github, Mail, Linkedin } from 'lucide-react'
import { personalInfo } from '../../data/personal'

function Footer({ lang }) {
    const year = new Date().getFullYear()

    return (
        <footer
            className="section-padding py-10"
            style={{
                borderTop: '1px solid var(--color-border-subtle)',
                color: 'var(--color-fg-muted)',
            }}
            role="contentinfo"
        >
            <div className="container-max flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-caption">
                    {year} {personalInfo.nameEn}. {lang === 'ko' ? '읽어주셔서 감사합니다.' : 'Thanks for reading.'}
                </p>

                <div className="flex items-center gap-4">
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60" aria-label="GitHub profile">
                        <Github size={18} />
                    </a>
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60" aria-label="LinkedIn profile">
                        <Linkedin size={18} />
                    </a>
                    <a href={`mailto:${personalInfo.email}`} className="transition-opacity hover:opacity-60" aria-label="Send email">
                        <Mail size={18} />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
