import { Github, Mail } from 'lucide-react'
import { personalInfo } from '../../data/personal'

function Footer() {
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
                    {year} {personalInfo.nameEn}. 읽어주셔서 감사합니다.
                </p>

                <div className="flex items-center gap-4">
                    <a
                        href={personalInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:opacity-60"
                        aria-label="GitHub 프로필"
                    >
                        <Github size={18} />
                    </a>
                    <a
                        href={`mailto:${personalInfo.email}`}
                        className="transition-opacity hover:opacity-60"
                        aria-label="이메일 보내기"
                    >
                        <Mail size={18} />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer