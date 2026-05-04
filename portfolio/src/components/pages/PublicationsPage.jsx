import { ArrowLeft, ExternalLink } from 'lucide-react'
import { publications } from '../../data/publications'

function PublicationsPage({ lang, navigate }) {
    return (
        <main className="page-offset">
            <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="container-max">
                    <button className="back-button" onClick={() => navigate(lang === 'ko' ? '/ko' : '/')}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? '홈으로 돌아가기' : 'Back Home'}
                    </button>

                    <p className="section-eyebrow">Publications</p>
                    <h1 className="page-title">{lang === 'ko' ? '연구 활동' : 'Publications & Research'}</h1>
                    <p className="page-copy">
                        {lang === 'ko'
                            ? '게임 AI 시스템, 시뮬레이션, 인터랙티브 플랫폼에 관한 연구 논문입니다.'
                            : 'Research papers about game AI systems, simulation, and interactive platforms.'}
                    </p>

                    <div className="publication-list">
                        {publications.map((paper) => (
                            <article key={paper.id} className="publication-card">
                                <img src={paper.image} alt="" />
                                <div>
                                    <p className="date-text">{paper.date}</p>
                                    <h2>{paper.title}</h2>
                                    <p className="publication-authors">{paper.authors}</p>
                                    <p className="publication-venue">{paper.venue}</p>
                                    <p className="card-copy">{paper.description[lang]}</p>
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="mini-link">
                                        <ExternalLink size={13} />
                                        {lang === 'ko' ? '논문 보기' : 'Open Paper'}
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default PublicationsPage
