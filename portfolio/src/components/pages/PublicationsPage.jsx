import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { publications } from '../../data/publications'

function PublicationDetail({ lang, navigate, paper }) {
    const homePath = lang === 'ko' ? '/ko/publications' : '/publications'
    const fallbackPath = lang === 'ko' ? '/ko' : '/'

    if (!paper) {
        return (
            <main className="page-offset">
                <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <div className="container-max">
                        <button className="back-button" onClick={() => navigate(fallbackPath)}>
                            <ArrowLeft size={16} />
                            {lang === 'ko' ? '홈으로 돌아가기' : 'Back Home'}
                        </button>
                        <h1 className="page-title">{lang === 'ko' ? '논문을 찾을 수 없습니다' : 'Publication Not Found'}</h1>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="page-offset">
            <section className="section-padding publication-detail-section">
                <div className="container-max">
                    <button className="back-button" onClick={() => navigate(homePath)}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? 'Research로 돌아가기' : 'Back to Research'}
                    </button>

                    <div className="publication-detail-hero">
                        <p className="section-eyebrow">Publication Detail</p>
                        <h1>{paper.title}</h1>
                    </div>

                    <dl className="publication-meta-grid">
                        <div>
                            <dt>{lang === 'ko' ? '저자' : 'Authors'}</dt>
                            <dd>{paper.authors}</dd>
                        </div>
                        <div>
                            <dt>{lang === 'ko' ? '키워드' : 'Keywords'}</dt>
                            <dd>{paper.keywords.join(', ')}</dd>
                        </div>
                        <div>
                            <dt>{lang === 'ko' ? '제출 학회' : 'Venue'}</dt>
                            <dd>{paper.venue}</dd>
                        </div>
                    </dl>

                    <div className="publication-actions">
                        <a href={paper.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={15} />
                            {lang === 'ko' ? '논문 열기' : 'Open Paper'}
                        </a>
                        <a href={paper.pdfUrl} download>
                            <Download size={15} />
                            PDF
                        </a>
                    </div>

                    <section className="publication-abstract">
                        <p className="section-eyebrow">{lang === 'ko' ? '초록' : 'Abstract'}</p>
                        <p>{paper.abstract[lang]}</p>
                    </section>
                </div>
            </section>
        </main>
    )
}

function PublicationsPage({ lang, navigate, selectedPaper }) {
    if (selectedPaper !== undefined) {
        return <PublicationDetail lang={lang} navigate={navigate} paper={selectedPaper} />
    }

    const publicationPath = (id) => lang === 'ko' ? `/ko/publications/${id}` : `/publications/${id}`

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
                            <button
                                key={paper.id}
                                type="button"
                                className="publication-card"
                                onClick={() => navigate(publicationPath(paper.id))}
                            >
                                <img src={paper.image} alt="" />
                                <div>
                                    <p className="date-text">{paper.date}</p>
                                    <h2>{paper.title}</h2>
                                    <p className="publication-authors">{paper.authors}</p>
                                    <p className="publication-venue">{paper.venue}</p>
                                    <p className="card-copy">{paper.description[lang]}</p>
                                    <span className="mini-link">
                                        <ExternalLink size={13} />
                                        {lang === 'ko' ? '상세 보기' : 'View Details'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default PublicationsPage
